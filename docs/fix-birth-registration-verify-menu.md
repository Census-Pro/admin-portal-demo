# Fix: Birth Registration Verify Menu Not Showing

## Problem

User with permission `"manage:birth-registration-verify"` cannot see the Birth Registration menu because the frontend expects `"manage:birth-registration"`.

## Root Cause

The permission in the database has an **incorrect subject**:

- ❌ Wrong: `subjects = "Birth Registration Verify"`
- ✅ Correct: `subjects = "Birth Registration"`

The action (`manage`, `verify`, `approve`, etc.) should specify WHAT to do, and the subject should specify the RESOURCE (Birth Registration), not a combination of both.

## Solution

### Step 1: Run the SQL Fix Script

```bash
cd /Users/ngawangdorji/Desktop/Census/auth_service
```

Connect to your database and run:

```bash
psql -U your_username -d your_database -f fix-birth-registration-verify-permission.sql
```

Or manually run the SQL:

```sql
-- Update the permission subject
UPDATE permissions
SET subjects = 'Birth Registration',
    updated_at = CURRENT_TIMESTAMP
WHERE subjects = 'Birth Registration Verify';
```

### Step 2: User Must Logout and Login Again

After fixing the database, the user **must logout and login** to get a new JWT token with the corrected permission string.

### Step 3: Verify the Fix

After logging back in, check the user's token payload:

```json
{
  "permissions": [
    "manage:birth-registration" // ✅ Should be this now
  ]
}
```

## How Permissions Should Be Created

### ✅ Correct Format:

```json
{
  "name": "Birth Registration Verify Permission",
  "description": "Can verify birth registrations",
  "actions": "verify",
  "subjects": "Birth Registration"
}
```

Generates: `"verify:birth-registration"` ✅

### ❌ Wrong Format:

```json
{
  "name": "Birth Registration Verify Permission",
  "description": "Can verify birth registrations",
  "actions": "verify",
  "subjects": "Birth Registration Verify" // ❌ Don't include action in subject
}
```

Generates: `"verify:birth-registration-verify"` ❌

## Permission Structure Best Practices

### Actions (What to do):

- `manage` - Full control (all CRUD + workflow actions)
- `create` - Create new records
- `read`/`view` - View records
- `update`/`edit` - Edit records
- `delete` - Delete records
- `verify` - Verify workflow
- `approve` - Approve workflow
- `endorse` - Endorse workflow

### Subjects (What resource):

- `Birth Registration` (not "Birth Registration Verify")
- `Death Registration` (not "Death Registration Approve")
- `User`
- `Dashboard`
- `Agencies`
- etc.

## Testing

1. ✅ Frontend nav-config has been updated to use `Birth Registration` as subject
2. ✅ SQL fix script created to update database
3. ⏳ User needs to logout/login after SQL fix
4. ⏳ Verify menu appears in dashboard

## Files Modified

1. `/admin-portal/src/config/nav-config.ts` - Updated child menu subjects to "Birth Registration" (generic)
2. `/admin-portal/src/config/permission-subjects.ts` - Updated with Census-specific subjects
3. `/auth_service/fix-birth-registration-verify-permission.sql` - SQL script to fix database

## Expected Result

After the fix, user with role "Gewog Gup" should see:

- 📊 Dashboard ✅
- 👤 Birth Registration (parent menu) ✅
  - ✓ Verify (child menu) ✅

The user will have `manage` permission which grants full access to Birth Registration verification.
