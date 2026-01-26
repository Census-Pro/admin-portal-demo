# Dynamic Navigation Based on User Permissions

## Overview

The navigation system now dynamically filters menu items based on the user's **abilities** returned from the backend. Users will only see menu items they have permission to access.

## How It Works

### Backend Ability Format

When a user logs in, the backend returns abilities in this format:

```json
{
  "ability": [
    {
      "name": "Approval",
      "action": ["create", "update", "read"],
      "subject": "Birth Registration"
    },
    {
      "name": "Manage users",
      "action": ["read", "update"],
      "subject": "Admin"
    }
  ]
}
```

### Navigation Filtering Logic

1. **Super Admin**: Users with `roleType: "SUPER_ADMIN"` see **all** menu items
2. **Subject-Based**: Menu items are filtered based on the `subject` field:
   - If user has ability with subject "Birth Registration", they see the Birth Registration menu
   - If user has ability with subject "Admin", they see the User menu
3. **Organization & Roles**: Only SUPER_ADMIN can see these sections (marked with `superAdminOnly: true`)

## Navigation Structure

### For SUPER_ADMIN

```
✅ Dashboard
✅ User
✅ Organization
   ├── Agencies
   └── Office Locations
✅ Roles & Permission
   ├── Roles
   └── Permissions
✅ Birth Registration
✅ CID Issuance
✅ Move In/Move Out
✅ Relationships
✅ Naturalization/Regularization
✅ Death Registration
```

### For ADMIN (Example: Local Government)

Based on your login response:

```json
{
  "roleType": "ADMIN",
  "ability": [
    { "subject": "Birth Registration", "action": ["create", "update", "read"] },
    { "subject": "Admin", "action": ["read", "update"] }
  ]
}
```

Will see:

```
✅ Dashboard
✅ User (because subject: "Admin")
❌ Organization (superAdminOnly)
❌ Roles & Permission (superAdminOnly)
✅ Birth Registration (because subject: "Birth Registration")
❌ CID Issuance (no ability)
❌ Move In/Move Out (no ability)
❌ Relationships (no ability)
❌ Naturalization/Regularization (no ability)
❌ Death Registration (no ability)
```

## Subject Mapping

| Backend Subject      | Frontend Menu Item            | Notes                     |
| -------------------- | ----------------------------- | ------------------------- |
| `Dashboard`          | Dashboard                     | Always visible            |
| `Admin`              | User                          | User management           |
| `Birth Registration` | Birth Registration            | Birth Registration module |
| `CID Issuance`       | CID Issuance                  | CID Issuance module       |
| `Move In/Move Out`   | Move In/Move Out              | Move In/Out module        |
| `Relationships`      | Relationships                 | Relationships module      |
| `Naturalization`     | Naturalization/Regularization | Naturalization module     |
| `Death Registration` | Death Registration            | Death Registration module |

**Note:** Subject matching is **case-insensitive**. `"Birth Registration"`, `"birth registration"`, and `"BIRTH REGISTRATION"` are all treated the same.

## Technical Implementation

### Files Created/Modified

1. **`src/lib/permissions.ts`** - NEW

   - `mapAbilitiesToPermissions()` - Converts backend format to frontend format
   - `hasSubjectAccess()` - Checks if user has access to a subject
   - `isSuperAdmin()` - Checks if user is super admin
   - Subject normalization utilities

2. **`src/hooks/use-permissions.ts`** - NEW

   - `usePermissions()` - Hook to access user permissions
   - Returns: abilities, permissions, roleType, helper functions

3. **`src/hooks/use-nav.ts`** - MODIFIED

   - Updated `useFilteredNavItems()` to handle:
     - `superAdminOnly` flag
     - `subject` field for ability-based filtering
     - Enhanced logging for debugging

4. **`src/types/index.ts`** - MODIFIED

   - Added `subject?: string` to `NavItem` interface
   - Added `superAdminOnly?: boolean` to `NavItem` interface

5. **`src/config/nav-config.ts`** - MODIFIED
   - Added `subject` field to all relevant menu items
   - Added `superAdminOnly: true` to Organization and Roles & Permission sections

### How Filtering Works

```typescript
// 1. Check if super admin only
if (item.superAdminOnly && user?.roleType !== 'SUPER_ADMIN') {
  return false; // Hide from non-super-admins
}

// 2. Check subject-based access
if (item.subject && user?.roleType !== 'SUPER_ADMIN') {
  const hasAccess = user.ability.some(
    (ability) => ability.subject.toLowerCase() === item.subject.toLowerCase()
  );
  if (!hasAccess) {
    return false; // Hide if user doesn't have this subject
  }
}

// 3. Check traditional permission-based access
// (existing logic for fallback)
```

## Configuration

### Mark Item as Super Admin Only

```typescript
{
  title: 'Organization',
  superAdminOnly: true, // Only SUPER_ADMIN can see this
  items: [...]
}
```

### Add Subject for Ability-Based Filtering

```typescript
{
  title: 'Birth Registration',
  subject: 'Birth Registration', // Must match backend ability.subject
  items: []
}
```

## Examples

### Example 1: Super Admin Login

```json
{
  "roleType": "SUPER_ADMIN",
  "ability": []
}
```

**Result:** Sees all menu items (bypass all checks)

### Example 2: Admin with Birth Registration Access

```json
{
  "roleType": "ADMIN",
  "ability": [{ "subject": "Birth Registration", "action": ["create", "read"] }]
}
```

**Result:** Sees Dashboard + Birth Registration only

### Example 3: Admin with Multiple Subjects

```json
{
  "roleType": "ADMIN",
  "ability": [
    { "subject": "Birth Registration", "action": ["create", "update", "read"] },
    { "subject": "Admin", "action": ["read", "update"] },
    { "subject": "CID Issuance", "action": ["read"] }
  ]
}
```

**Result:** Sees Dashboard + User + Birth Registration + CID Issuance

### Example 4: Admin with No Matching Subjects

```json
{
  "roleType": "ADMIN",
  "ability": [{ "subject": "Some Other Module", "action": ["read"] }]
}
```

**Result:** Sees Dashboard only (fallback)

## Debugging

### Console Logs

The navigation filter includes extensive debug logging:

```
🔍 Navigation Filter Debug: Processing items
🔍 Item "Birth Registration": {
  subject: "Birth Registration",
  hasAccess: true,
  abilities: [...],
  roleType: "ADMIN"
}
🔍 Item "Organization": Restricted to SUPER_ADMIN only
🔍 Item "CID Issuance": No access to subject "CID Issuance"
```

### Check Current User Permissions

```typescript
import { usePermissions } from '@/hooks/use-permissions';

function MyComponent() {
  const { abilities, roleType, isSuperAdmin, hasSubject } = usePermissions();

  console.log('Abilities:', abilities);
  console.log('Role Type:', roleType);
  console.log('Is Super Admin:', isSuperAdmin);
  console.log('Has Birth Registration:', hasSubject('Birth Registration'));
}
```

## Migration Notes

### No Breaking Changes

- Existing permission-based checks still work
- Items without `subject` field use traditional permission checks
- Super admins continue to see everything
- Backwards compatible with existing code

### Adding New Modules

To add a new module with ability-based access:

1. Add subject to nav-config.ts:

```typescript
{
  title: 'New Module',
  url: '/dashboard/new-module',
  subject: 'New Module', // Must match backend
  access: {
    permissions: [PERMS.MANAGE_ALL, PERMS.VIEW_NEW_MODULE]
  }
}
```

2. Backend must return ability:

```json
{
  "subject": "New Module",
  "action": ["read", "create"]
}
```

3. Done! Navigation will auto-filter

## Security Notes

⚠️ **Important:** This is UI-level filtering only!

- **Frontend filtering** = User Experience (hide/show menu items)
- **Backend authorization** = Security (protect API routes)

Always protect your API routes and server actions with proper authorization:

```typescript
// server action
export async function getData() {
  const session = await auth();
  if (!hasPermission(session, 'read:data')) {
    throw new Error('Unauthorized');
  }
  // ... fetch data
}
```

## Testing

### Test Checklist

- [ ] Super Admin sees all menu items
- [ ] Admin with "Birth Registration" ability sees Birth Registration menu
- [ ] Admin with "Admin" ability sees User menu
- [ ] Admin without "Organization" ability doesn't see Organization menu
- [ ] Admin without "Roles & Permission" doesn't see Roles & Permission menu
- [ ] Console logs show correct filtering decisions
- [ ] Navigation updates immediately after login
- [ ] No flickering or loading states

### Test Users

**Super Admin:**

- Should see: All menus
- Check: Organization and Roles & Permission visible

**Local Government Admin (from your example):**

- Should see: Dashboard, User, Birth Registration
- Should NOT see: Organization, Roles & Permission, other modules

## Performance

- ✅ Client-side filtering (no server calls)
- ✅ Instant updates
- ✅ No loading states
- ✅ Memoized computations
- ✅ Single session check

## Future Enhancements

Potential improvements:

- [ ] Cache filtered navigation in localStorage
- [ ] Add permission-level granularity (not just subject)
- [ ] Support nested subject hierarchies
- [ ] Add visual indicators for limited access
- [ ] Permission tooltips on hover
- [ ] Admin panel to preview navigation for different roles
