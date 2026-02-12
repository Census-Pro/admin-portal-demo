# Dashboard Permission Protection Implementation

## Overview

This document describes the implementation of page-level permission protection for the dashboard routes, ensuring that users without proper permissions cannot access restricted pages.

## Problem

Previously, users without any permissions could still access `/dashboard/overview` because:

1. **Authentication only** - The dashboard layout only checked if a user was authenticated, not if they had permissions
2. **No page-level protection** - Individual pages didn't verify user permissions
3. **UI-only filtering** - Navigation items were hidden based on permissions, but routes weren't protected

This meant a user could directly navigate to `/dashboard/overview` even without the `read:dashboard` permission.

## Solution

### 1. Page-Level Permission Checks

Added permission verification to protected pages:

```typescript
// src/app/dashboard/overview/page.tsx
import { checkPermission } from '@/lib/permission-check';

export default async function OverviewPage() {
  const session = await auth();

  // Check if user has permission to view dashboard
  const permissionCheck = checkPermission(session, [
    'read:dashboard',
    'manage:all'
  ]);

  // Redirect unauthorized users
  if (!permissionCheck.hasAccess) {
    redirect('/dashboard/unauthorized');
  }

  // Page content...
}
```

### 2. Smart Dashboard Routing

Updated `/dashboard` to redirect users to their first accessible page instead of always redirecting to overview:

```typescript
// src/app/dashboard/page.tsx
import { getFirstAccessibleRoute } from '@/lib/permission-check';

export default async function Dashboard() {
  const session = await auth();
  const firstRoute = getFirstAccessibleRoute(session);
  redirect(firstRoute);
}
```

**Logic:**

1. Super admin or `manage:all` → `/dashboard/overview`
2. Has `read:dashboard` → `/dashboard/overview`
3. Has `manage:user` or `read:user` → `/dashboard/user`
4. Has `manage:roles` → `/dashboard/roles`
5. Has birth registration permissions → First available workflow page
6. Has death registration permissions → First available workflow page
7. Has master data permissions → First available master page
8. No permissions → `/dashboard/profile` (always accessible)

### 3. Permission Check Utilities

Created reusable utility functions in `src/lib/permission-check.ts`:

#### `checkPermission(session, requiredPermissions)`

Checks if user has access to specific permission(s):

```typescript
const check = checkPermission(session, 'read:dashboard');
// OR
const check = checkPermission(session, ['read:dashboard', 'manage:all']);

if (!check.hasAccess) {
  redirect('/dashboard/unauthorized');
}
```

Returns:

```typescript
{
  hasAccess: boolean;
  isSuperAdmin: boolean;
  hasManageAll: boolean;
  userPermissions: string[];
}
```

#### `getFirstAccessibleRoute(session)`

Gets the first route a user has permission to access:

```typescript
const firstRoute = getFirstAccessibleRoute(session);
redirect(firstRoute);
```

#### `hasAnyPermission(session)`

Checks if user has at least one permission:

```typescript
if (!hasAnyPermission(session)) {
  // User has no permissions at all
}
```

### 4. Unauthorized Page

Created `/dashboard/unauthorized` page for users who try to access restricted pages:

- **Clear message** - Explains why access was denied
- **User-friendly** - Shows user's name
- **Helpful actions** - Buttons to return to dashboard or profile
- **Contact info** - Suggests contacting admin for permission requests

## Security Levels

This implementation provides **defense in depth**:

### Level 1: UI Filtering (UX)

- Navigation items hidden based on permissions
- Uses `useFilteredNavItems` hook
- **Purpose:** Better user experience

### Level 2: Page Protection (Security)

- Server-side permission checks in `page.tsx` files
- Uses `checkPermission` utility
- **Purpose:** Actual security - prevents unauthorized access

### Level 3: API Protection (Backend)

- Backend API routes require proper permissions via guards
- JWT validation and permission checks
- **Purpose:** Final security layer

## How to Protect New Pages

When creating a new protected page:

```typescript
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { checkPermission } from '@/lib/permission-check';

export default async function NewProtectedPage() {
  const session = await auth();

  // Define required permissions (OR logic - user needs ANY of these)
  const permissionCheck = checkPermission(session, [
    'read:feature-name',
    'manage:feature-name',
    'manage:all'
  ]);

  // Redirect if no access
  if (!permissionCheck.hasAccess) {
    redirect('/dashboard/unauthorized');
  }

  // Page content...
}
```

## Testing

### Test Case 1: User with No Permissions

**Setup:**

- User has no permissions in their JWT token
- User is authenticated but has empty permissions array

**Expected Behavior:**

1. Navigate to `/dashboard`
2. Should redirect to `/dashboard/profile`
3. Cannot access `/dashboard/overview` directly (redirects to unauthorized)
4. Navigation sidebar shows minimal items

### Test Case 2: User with Dashboard Permission

**Setup:**

- User has `read:dashboard` permission

**Expected Behavior:**

1. Navigate to `/dashboard`
2. Should redirect to `/dashboard/overview`
3. Can access `/dashboard/overview`
4. Dashboard nav item visible in sidebar

### Test Case 3: User with Workflow Permissions Only

**Setup:**

- User has `manage:birth-registration-verify` permission
- Does NOT have `read:dashboard` permission

**Expected Behavior:**

1. Navigate to `/dashboard`
2. Should redirect to `/dashboard/birth-registration/verify`
3. Cannot access `/dashboard/overview` (redirects to unauthorized)
4. Only Birth Registration → Verify menu item visible

### Test Case 4: Super Admin

**Setup:**

- User has `roleType: "SUPER_ADMIN"`

**Expected Behavior:**

1. Full access to all pages
2. All navigation items visible
3. No restrictions

## Migration Notes

### Existing Pages

Pages that already have the Dashboard item in navigation config but don't check permissions:

- ✅ `/dashboard/overview` - Now protected
- ⚠️ Other pages should be reviewed and protected as needed

### Breaking Changes

None. This is backward compatible:

- Users with proper permissions see no change
- Users without permissions are now properly restricted (security fix)

## Best Practices

1. **Always protect pages** - Don't rely on UI hiding alone
2. **Use utility functions** - Use `checkPermission` for consistency
3. **Meaningful redirects** - Guide users to accessible pages
4. **Clear error messages** - Help users understand why access was denied
5. **Document permissions** - Keep permission requirements documented

## Related Files

- `src/lib/permission-check.ts` - Permission check utilities
- `src/app/dashboard/page.tsx` - Smart routing logic
- `src/app/dashboard/overview/page.tsx` - Protected dashboard page
- `src/app/dashboard/unauthorized/page.tsx` - Unauthorized access page
- `src/config/permissions.ts` - Permission constants
- `src/config/nav-config.ts` - Navigation permissions

## Future Improvements

1. **Middleware enhancement** - Could add permission checks in middleware for early rejection
2. **Permission caching** - Cache permission lookups for performance
3. **Audit logging** - Log unauthorized access attempts
4. **Dynamic redirects** - Build dynamic redirect logic based on permission hierarchy
5. **Permission inheritance** - Implement permission inheritance for hierarchical permissions

## Summary

- ✅ Dashboard overview now requires `read:dashboard` permission
- ✅ Users without permissions redirected to first accessible page
- ✅ Unauthorized page created for access denied scenarios
- ✅ Reusable permission check utilities created
- ✅ Defense in depth: UI + Page + API protection
- ✅ No breaking changes for users with proper permissions
