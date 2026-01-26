# Permission System Fix - Subject-Based Navigation

## Problem

User credentials worked (`cidNo: "11502004078"`) but no menus were visible in the navigation.

## Root Cause

The backend returns abilities in this format:

```json
{
  "ability": [
    {
      "name": "Approval",
      "action": ["create", "update", "read"],
      "subject": "Birth Registration"
    },
    { "name": "Manage users", "action": ["read", "update"], "subject": "Admin" }
  ]
}
```

But the frontend navigation required BOTH:

1. **Subject match** - User has subject "Birth Registration"
2. **Permission match** - User has permission like `view:birth-registration`

The permission format mismatch caused the navigation to hide all menus.

## Solution

### 1. Transform Backend Abilities to Frontend Permissions (`auth.config.ts`)

Added transformation logic to convert backend abilities to frontend permission format:

```typescript
// Backend: {action: ["create", "update"], subject: "Birth Registration"}
// Frontend: ["create:birth-registration", "update:birth-registration"]

const transformedAbilities = ability.flatMap((abilityItem: any) => {
  if (!abilityItem.action || !abilityItem.subject) {
    return [];
  }

  // Normalize subject: "Birth Registration" -> "birth-registration"
  const normalizedSubject = abilityItem.subject
    .toLowerCase()
    .replace(/\s+/g, '-');

  // Map each action to permission format
  return abilityItem.action.map(
    (action: string) => `${action}:${normalizedSubject}`
  );
});
```

**Result:** User with abilities gets these permissions:

```javascript
[
  'create:birth-registration',
  'update:birth-registration',
  'read:birth-registration',
  'read:admin',
  'update:admin'
];
```

### 2. Subject-Based Access Priority (`use-nav.ts`)

Modified the navigation filtering logic to prioritize subject-based access:

**Before:**

```typescript
// Both checks had to pass (AND logic)
if (item.subject && !hasSubjectAccess(item.subject)) {
  return false; // Blocked
}
return checkItemAccess(item.access); // Still required permissions
```

**After:**

```typescript
// If subject matches, grant access immediately (bypass permission check)
if (item.subject) {
  const subjectAccess = hasSubjectAccess(item.subject);
  if (subjectAccess) {
    return true; // ✅ Access granted
  }
  return false; // ❌ Access denied
}

// No subject? Fall back to traditional permission check
return checkItemAccess(item.access);
```

### 3. Use Transformed Permissions (`use-nav.ts`)

Updated `hasAbility` hook to use the transformed `permissions` array instead of raw `ability`:

```typescript
const permissions = (user as any)?.permissions || [];

return (permission: string) => {
  const hasManageAll = permissions.includes('manage:all');
  if (hasManageAll) return true;

  return permissions.includes(permission);
};
```

## What Changed

### Files Modified

1. **`src/auth.config.ts`**

   - Added ability transformation logic
   - Stores both `ability` (original) and `permissions` (transformed)

2. **`src/hooks/use-nav.ts`**
   - Updated `hasAbility` to use `permissions` array
   - Modified filtering logic to prioritize subject-based access
   - Enhanced logging for debugging
   - Updated `useUserAbilities` hook

## Testing

### Test with the credentials:

```bash
curl -X 'POST' \
  'http://localhost:5001/auth/admin/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "cidNo": "11502004078",
  "password": "sonamtenzin"
}'
```

### Expected Result:

User should now see:

- ✅ **Dashboard** (always visible)
- ✅ **User** (has subject: "Admin")
- ✅ **Birth Registration** (has subject: "Birth Registration")
- ❌ **Organization** (superAdminOnly)
- ❌ **Roles & Permission** (superAdminOnly)
- ❌ Other modules (no matching subjects)

## How It Works Now

### For Subject-Based Items:

```typescript
// Dashboard
{
  title: 'Dashboard',
  subject: 'Dashboard',
  access: { permissions: [...] } // ← IGNORED if subject matches
}
```

**Flow:**

1. Check if item has `subject` field ✅
2. Check if user has ability with matching subject ✅
3. **Grant access immediately** (skip permission check)

### For Permission-Based Items:

```typescript
// Legacy item without subject
{
  title: 'Settings',
  access: { permissions: ['view:settings'] }
}
```

**Flow:**

1. Check if item has `subject` field ❌
2. Fall back to `checkItemAccess(item.access)`
3. Check if user has required permissions

### For Super Admin Only Items:

```typescript
{
  title: 'Organization',
  superAdminOnly: true,
  items: [...]
}
```

**Flow:**

1. Check if `superAdminOnly` is true ✅
2. Check if `user.roleType === 'SUPER_ADMIN'` ❌
3. **Deny access immediately**

## Benefits

1. ✅ **Backward Compatible** - Items without subjects still use permission checks
2. ✅ **Flexible** - Supports both subject-based and permission-based access
3. ✅ **Clean Separation** - Super Admin bypass, subject-based, then permission-based
4. ✅ **Transformation** - Backend abilities automatically converted to frontend format
5. ✅ **Better Logging** - Enhanced debug logs for troubleshooting

## Security Note

⚠️ **This is UI-level filtering only!**

Always protect your API routes and server actions:

```typescript
export async function getData() {
  const session = await auth();
  if (!hasPermission(session, 'read:data')) {
    throw new Error('Unauthorized');
  }
  // ...
}
```

## Debug Logs

The system now logs:

```
🔍 User permissions: ["create:birth-registration", "update:birth-registration", ...]
🔍 hasSubjectAccess: Checking subject "Birth Registration"
🔍   - Comparing "birth registration" with "birth registration"
🔍 hasSubjectAccess("Birth Registration"): true
🔍 Item "Birth Registration": Subject "Birth Registration" access = true
```

This makes it easy to debug why menus are showing or hiding.
