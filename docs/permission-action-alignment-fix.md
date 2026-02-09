# Frontend-Backend Permission Alignment Fix

## Issue

The frontend and backend were using different action verbs for permissions:

- **Frontend**: `view:`, `edit:`
- **Backend**: `read:`, `update:`

This caused the navigation to not show items even when the user had the correct permissions.

## Changes Made

### Updated `src/config/permissions.ts`

Changed all permission constants to match backend format:

| Old Frontend Format | New Frontend Format | Backend Format |
| ------------------- | ------------------- | -------------- |
| `view:*`            | `read:*`            | `read:*` ✅    |
| `edit:*`            | `update:*`          | `update:*` ✅  |
| `create:*`          | `create:*`          | `create:*` ✅  |
| `delete:*`          | `delete:*`          | `delete:*` ✅  |
| `manage:*`          | `manage:*`          | `manage:*` ✅  |
| `verify:*`          | `verify:*`          | `verify:*` ✅  |
| `approve:*`         | `approve:*`         | `approve:*` ✅ |

### Examples of Changes

```typescript
// Before
export const VIEW_AGENCIES = 'view:agencies' as const;
export const EDIT_AGENCIES = 'edit:agencies' as const;

// After
export const VIEW_AGENCIES = 'read:agencies' as const;
export const EDIT_AGENCIES = 'update:agencies' as const;
```

## How It Works Now

### User with `read:agencies` permission:

**Backend sends:**

```json
{
  "permissions": ["manage:dashboard", "read:agencies", "read:masters"]
}
```

**Frontend checks:**

```typescript
// Masters section checks if user has ANY of:
[
  'manage:all',
  'read:agencies', // ✅ User has this!
  'read:office-locations'
  // ... etc
][
  // Agencies item checks if user has ANY of:
  ('manage:all',
  'read:agencies', // ✅ User has this!
  'manage:agencies')
];
```

**Result:** ✅ User sees Masters section and Agencies item!

## Testing

To verify the fix works, check that users with these permissions can see the appropriate nav items:

### Test Case 1: Agencies Only

```json
"permissions": ["read:agencies", "read:masters"]
```

**Expected:** ✅ Masters section visible, ✅ Agencies visible, ❌ Other masters hidden

### Test Case 2: Multiple Masters

```json
"permissions": [
  "read:agencies",
  "read:countries",
  "read:dzongkhags",
  "read:masters"
]
```

**Expected:** ✅ Masters visible, ✅ Agencies, Countries, Dzongkhags visible, ❌ Others hidden

### Test Case 3: Dashboard Only

```json
"permissions": ["manage:dashboard"]
```

**Expected:** ✅ Dashboard visible, ❌ Masters section hidden

## Additional Notes

1. **The `read:masters` permission** seems to be a generic permission from your backend. The frontend doesn't explicitly check for it, but checks for specific item permissions like `read:agencies`, `read:countries`, etc.

2. **EDIT constants renamed to UPDATE**: All `EDIT_*` constants now use `update:` to match backend:

   ```typescript
   export const EDIT_USERS = 'update:user' as const;
   export const EDIT_AGENCIES = 'update:agencies' as const;
   ```

3. **No breaking changes to component code**: Since we only changed the constant values (not the constant names), all components using `PERMS.VIEW_AGENCIES` will continue to work without changes.

## Verification

After this fix, users with the following backend permissions should see the nav items:

| Backend Permission | Nav Item Visible |
| ------------------ | ---------------- |
| `read:agencies`    | ✅ Agencies      |
| `read:countries`   | ✅ Countries     |
| `read:user`        | ✅ User          |
| `manage:dashboard` | ✅ Dashboard     |
| `manage:all`       | ✅ Everything    |

The parent "Masters" section will automatically show if the user has access to ANY child item.
