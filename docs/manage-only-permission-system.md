# Manage-Only Permission System

## Overview

The permission system has been simplified to use **only the `manage` action**, with access control determined by **subject names**. This creates a cleaner, more intuitive permission model.

## How It Works

### Subject-Based Access Control

Instead of using different actions (`verify`, `approve`, `endorse`), we now use **unique subject names** with the `manage` action:

```typescript
// Backend creates permission:
{
  name: "Birth Registration Verify Permission",
  actions: "manage",
  subjects: "Birth Registration Verify"
}
→ Generates: "manage:birth-registration-verify"

// Frontend nav-config:
{
  title: 'Verify',
  subject: 'Birth Registration Verify',  // ← Matches the permission subject!
  access: {
    permissions: ['manage:birth-registration-verify']
  }
}
```

## Permission Examples

### Birth Registration Permissions

```typescript
// Specific workflow step permissions
MANAGE_BIRTH_REGISTRATION_ENDORSE = 'manage:birth-registration-endorse';
MANAGE_BIRTH_REGISTRATION_VERIFY = 'manage:birth-registration-verify';
MANAGE_BIRTH_REGISTRATION_APPROVE = 'manage:birth-registration-approve';

// General permission (grants all workflow steps)
MANAGE_BIRTH_REGISTRATION = 'manage:birth-registration';
```

### Death Registration Permissions

```typescript
// Specific workflow step permissions
MANAGE_DEATH_REGISTRATION_ENDORSE = 'manage:death-registration-endorse';
MANAGE_DEATH_REGISTRATION_VERIFY = 'manage:death-registration-verify';
MANAGE_DEATH_REGISTRATION_APPROVE = 'manage:death-registration-approve';

// General permission (grants all workflow steps)
MANAGE_DEATH_REGISTRATION = 'manage:death-registration';
```

## Backend Permission Creation

### Creating Workflow-Specific Permissions

```sql
-- Birth Verify Permission
INSERT INTO permissions (name, actions, subjects, description)
VALUES (
  'Birth Registration Verify',
  'manage',
  'Birth Registration Verify',
  'Can access Birth Registration Verify workflow'
);

-- Birth Approve Permission
INSERT INTO permissions (name, actions, subjects, description)
VALUES (
  'Birth Registration Approve',
  'manage',
  'Birth Registration Approve',
  'Can access Birth Registration Approve workflow'
);

-- Birth Endorse Permission
INSERT INTO permissions (name, actions, subjects, description)
VALUES (
  'Birth Registration Endorse',
  'manage',
  'Birth Registration Endorse',
  'Can access Birth Registration Endorse workflow'
);
```

### Creating General Permission

```sql
-- Birth Registration (All Workflows)
INSERT INTO permissions (name, actions, subjects, description)
VALUES (
  'Birth Registration Management',
  'manage',
  'Birth Registration',
  'Full access to all Birth Registration workflows'
);
```

## User Access Scenarios

### Scenario 1: User with Only Verify Access

**Backend Permission:**

```json
{
  "actions": "manage",
  "subjects": "Birth Registration Verify"
}
```

**Token Generated:**

```json
{
  "permissions": ["manage:birth-registration-verify"]
}
```

**Frontend Result:**

- ✅ Sees: Birth Registration → Verify
- ❌ Doesn't see: Endorse, Approve

---

### Scenario 2: User with Verify + Approve Access

**Backend Permissions:**

```json
[
  { "actions": "manage", "subjects": "Birth Registration Verify" },
  { "actions": "manage", "subjects": "Birth Registration Approve" }
]
```

**Token Generated:**

```json
{
  "permissions": [
    "manage:birth-registration-verify",
    "manage:birth-registration-approve"
  ]
}
```

**Frontend Result:**

- ✅ Sees: Birth Registration → Verify, Approve
- ❌ Doesn't see: Endorse

---

### Scenario 3: User with Full Birth Registration Access

**Backend Permission:**

```json
{
  "actions": "manage",
  "subjects": "Birth Registration"
}
```

**Token Generated:**

```json
{
  "permissions": ["manage:birth-registration"]
}
```

**Frontend Result:**

- ✅ Sees: Birth Registration → Endorse, Verify, Approve (all three!)

---

### Scenario 4: Mixed Permissions (Birth Verify + Death Approve)

**Backend Permissions:**

```json
[
  { "actions": "manage", "subjects": "Birth Registration Verify" },
  { "actions": "manage", "subjects": "Death Registration Approve" }
]
```

**Token Generated:**

```json
{
  "permissions": [
    "manage:birth-registration-verify",
    "manage:death-registration-approve"
  ]
}
```

**Frontend Result:**

- ✅ Sees: Birth Registration → Verify
- ✅ Sees: Death Registration → Approve
- ❌ Doesn't see: Other workflow steps

## Benefits of This Approach

### ✅ **1. Perfect Subject-Permission Alignment**

```typescript
// Subject name matches permission subject exactly
subject: 'Birth Registration Verify'
permission: 'manage:birth-registration-verify'
             ^^^^^^  ^^^^^^^^^^^^^^^^^^^^^^
             action  matches subject (kebab-case)
```

### ✅ **2. Simpler Permission Management**

- Only one action to remember: `manage`
- Control is via subject names (more intuitive)
- Easier to understand what permission grants what access

### ✅ **3. Scalable & Flexible**

- Add new workflow steps by adding new subjects
- No need to create multiple action-based permissions
- Clear hierarchy: specific → general

### ✅ **4. Clear Permission Hierarchy**

```
manage:all                              ← Super admin (everything)
  ├─ manage:birth-registration         ← All birth workflows
  │   ├─ manage:birth-registration-endorse
  │   ├─ manage:birth-registration-verify
  │   └─ manage:birth-registration-approve
  └─ manage:death-registration          ← All death workflows
      ├─ manage:death-registration-endorse
      ├─ manage:death-registration-verify
      └─ manage:death-registration-approve
```

## Migration Guide

### For Backend Team

1. **Create new permissions** with `actions: "manage"` and specific subjects:

   ```sql
   INSERT INTO permissions (name, actions, subjects)
   VALUES
     ('Birth Verify', 'manage', 'Birth Registration Verify'),
     ('Birth Approve', 'manage', 'Birth Registration Approve'),
     ('Birth Endorse', 'manage', 'Birth Registration Endorse');
   ```

2. **Update existing user permissions** to use new format:

   ```sql
   -- Example: Convert old verify permission to new format
   UPDATE role_permissions rp
   JOIN permissions p ON rp.permission_id = p.id
   SET rp.permission_id = (
     SELECT id FROM permissions
     WHERE actions = 'manage'
     AND subjects = 'Birth Registration Verify'
   )
   WHERE p.actions = 'verify'
   AND p.subjects = 'Birth Registration';
   ```

3. **Users must logout/login** to get new tokens with updated permissions

### For Frontend (Already Done! ✅)

- ✅ `permissions.ts` - Added new MANAGE\_\* constants
- ✅ `nav-config.ts` - Updated to use new permission constants
- ✅ `permission-subjects.ts` - Already has correct subjects

## Testing

### Test User Access

1. **Create test permission in backend:**

   ```sql
   INSERT INTO permissions (name, actions, subjects, description)
   VALUES ('Test Birth Verify', 'manage', 'Birth Registration Verify', 'Test');
   ```

2. **Assign to test role:**

   ```sql
   INSERT INTO role_permissions (role_id, permission_id)
   VALUES (
     (SELECT id FROM roles WHERE name = 'Test Role'),
     (SELECT id FROM permissions WHERE name = 'Test Birth Verify')
   );
   ```

3. **Assign role to test user and have them login**

4. **Verify token contains:**

   ```json
   {
     "permissions": ["manage:birth-registration-verify"]
   }
   ```

5. **Check frontend:**
   - User should see only Birth Registration → Verify menu
   - Other workflow menus should be hidden

## Summary

The new **manage-only** system is:

- ✅ **Simpler** - One action instead of many
- ✅ **Clearer** - Subject names match menu items
- ✅ **Scalable** - Easy to add new workflow steps
- ✅ **Intuitive** - Permission name directly indicates access

**Key Rule:**

> Permission subject (kebab-case) = Menu subject (Title Case)
> `"Birth Registration Verify"` → `"birth-registration-verify"`
