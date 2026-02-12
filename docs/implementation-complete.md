# Subject-Based Permission System - Complete Implementation

## ✅ What Was Done

Successfully simplified the permission system to use **only `manage` action** with **subject-based access control**.

## Changes Made

### 1. `permissions.ts` - Added New Permission Constants

#### Birth Registration:

```typescript
// Workflow-specific permissions
export const MANAGE_BIRTH_REGISTRATION_ENDORSE =
  'manage:birth-registration-endorse';
export const MANAGE_BIRTH_REGISTRATION_VERIFY =
  'manage:birth-registration-verify';
export const MANAGE_BIRTH_REGISTRATION_APPROVE =
  'manage:birth-registration-approve';

// General permission (grants all)
export const MANAGE_BIRTH_REGISTRATION = 'manage:birth-registration';
```

#### Death Registration:

```typescript
// Workflow-specific permissions
export const MANAGE_DEATH_REGISTRATION_ENDORSE =
  'manage:death-registration-endorse';
export const MANAGE_DEATH_REGISTRATION_VERIFY =
  'manage:death-registration-verify';
export const MANAGE_DEATH_REGISTRATION_APPROVE =
  'manage:death-registration-approve';

// General permission (grants all)
export const MANAGE_DEATH_REGISTRATION = 'manage:death-registration';
```

**Note:** Legacy permissions (VERIFY*\*, APPROVE*_, ENDORSE\__) are kept for backward compatibility.

### 2. `nav-config.ts` - Updated to Use New Permissions

```typescript
// Birth Registration Verify menu
{
  title: 'Verify',
  subject: 'Birth Registration Verify',
  access: {
    permissions: [
      PERMS.MANAGE_ALL,
      PERMS.MANAGE_BIRTH_REGISTRATION_VERIFY,  // ← New specific permission
      PERMS.MANAGE_BIRTH_REGISTRATION           // ← General permission
    ]
  }
}
```

### 3. `permission-subjects.ts` - Already Correct ✅

Subjects already match the new permission naming:

- `'Birth Registration Endorse'`
- `'Birth Registration Verify'`
- `'Birth Registration Approve'`
- etc.

## How It Works Now

### Perfect Alignment: Subject ↔ Permission

```typescript
// Frontend nav-config
subject: 'Birth Registration Verify';

// Backend permission
actions: 'manage';
subjects: 'Birth Registration Verify';

// Generated token permission
('manage:birth-registration-verify');

// Permission constant
MANAGE_BIRTH_REGISTRATION_VERIFY = 'manage:birth-registration-verify';
```

**They all match perfectly!** 🎯

## Backend Implementation Guide

### Step 1: Create Workflow-Specific Permissions

```sql
-- Birth Registration Permissions
INSERT INTO permissions (name, actions, subjects, description) VALUES
('Birth Endorse', 'manage', 'Birth Registration Endorse', 'Access to Birth Registration Endorse workflow'),
('Birth Verify', 'manage', 'Birth Registration Verify', 'Access to Birth Registration Verify workflow'),
('Birth Approve', 'manage', 'Birth Registration Approve', 'Access to Birth Registration Approve workflow');

-- Death Registration Permissions
INSERT INTO permissions (name, actions, subjects, description) VALUES
('Death Endorse', 'manage', 'Death Registration Endorse', 'Access to Death Registration Endorse workflow'),
('Death Verify', 'manage', 'Death Registration Verify', 'Access to Death Registration Verify workflow'),
('Death Approve', 'manage', 'Death Registration Approve', 'Access to Death Registration Approve workflow');

-- General Permissions (grant access to all workflow steps)
INSERT INTO permissions (name, actions, subjects, description) VALUES
('Birth Management', 'manage', 'Birth Registration', 'Full access to all Birth Registration workflows'),
('Death Management', 'manage', 'Death Registration', 'Full access to all Death Registration workflows');
```

### Step 2: Create Roles

```sql
-- Verifier Role (can only verify births)
INSERT INTO roles (name, description) VALUES
('Birth Verifier', 'Can verify birth registrations only');

-- Assign permission
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Birth Verifier'
  AND p.name = 'Birth Verify';

-- Approver Role (can approve both birth and death)
INSERT INTO roles (name, description) VALUES
('Registrar', 'Can approve birth and death registrations');

-- Assign permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Registrar'
  AND p.name IN ('Birth Approve', 'Death Approve');
```

### Step 3: Assign Roles to Users

```sql
-- Assign Birth Verifier role to a user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.email = 'verifier@example.com'
  AND r.name = 'Birth Verifier';
```

### Step 4: User Logs In

Backend generates JWT token:

```json
{
  "userId": 123,
  "roleType": "birth_verifier",
  "permissions": ["manage:birth-registration-verify"]
}
```

### Step 5: Frontend Renders Menu

```javascript
// User has: ["manage:birth-registration-verify"]

// Birth Registration → Endorse
permissions.includes('manage:birth-registration-endorse'); // ❌ false → Hidden

// Birth Registration → Verify
permissions.includes('manage:birth-registration-verify'); // ✅ true → Shown

// Birth Registration → Approve
permissions.includes('manage:birth-registration-approve'); // ❌ false → Hidden
```

## Real-World Examples

### Example 1: Gewog Staff (Endorse Only)

**Permission Created:**

```sql
INSERT INTO permissions (name, actions, subjects)
VALUES ('Birth Endorse', 'manage', 'Birth Registration Endorse');
```

**Token:**

```json
{ "permissions": ["manage:birth-registration-endorse"] }
```

**Sees:**

- ✅ Birth Registration → Endorse
- ❌ Birth Registration → Verify (hidden)
- ❌ Birth Registration → Approve (hidden)

---

### Example 2: Dzongkhag Officer (Verify + Approve)

**Permissions Created:**

```sql
-- Assign two permissions to their role
INSERT INTO role_permissions (role_id, permission_id)
SELECT role_id, id FROM permissions
WHERE name IN ('Birth Verify', 'Birth Approve');
```

**Token:**

```json
{
  "permissions": [
    "manage:birth-registration-verify",
    "manage:birth-registration-approve"
  ]
}
```

**Sees:**

- ❌ Birth Registration → Endorse (hidden)
- ✅ Birth Registration → Verify
- ✅ Birth Registration → Approve

---

### Example 3: Registry Manager (Full Access)

**Permission Created:**

```sql
INSERT INTO permissions (name, actions, subjects)
VALUES ('Birth Management', 'manage', 'Birth Registration');
```

**Token:**

```json
{ "permissions": ["manage:birth-registration"] }
```

**Sees:**

- ✅ Birth Registration → Endorse
- ✅ Birth Registration → Verify
- ✅ Birth Registration → Approve

---

### Example 4: Multi-Resource Access

**Permissions:**

```sql
-- User has permissions for Birth Verify and Death Approve
permissions: [
  'manage:birth-registration-verify',
  'manage:death-registration-approve'
]
```

**Sees:**

- Birth Registration:
  - ✅ Verify
  - ❌ Endorse (hidden)
  - ❌ Approve (hidden)
- Death Registration:
  - ❌ Endorse (hidden)
  - ❌ Verify (hidden)
  - ✅ Approve

## Benefits Summary

| Benefit         | Description                                                                           |
| --------------- | ------------------------------------------------------------------------------------- |
| **Simplicity**  | Only one action (`manage`) to remember                                                |
| **Clarity**     | Permission subject matches menu subject exactly                                       |
| **Scalability** | Add new workflows by adding new subjects                                              |
| **Flexibility** | Mix and match any combination of permissions                                          |
| **Intuitive**   | Easy to understand: "manage birth-registration-verify" = can access Birth Verify menu |

## Migration Checklist

### Backend Team:

- [ ] Create new permissions with `actions: "manage"` and specific subjects
- [ ] Create roles with appropriate permission assignments
- [ ] Assign roles to users
- [ ] Test token generation includes correct permission strings

### Frontend Team:

- [x] Update `permissions.ts` with new constants ✅
- [x] Update `nav-config.ts` to use new constants ✅
- [x] Verify `permission-subjects.ts` has correct subjects ✅
- [x] Fix TypeScript errors ✅

### Testing:

- [ ] User with only Verify permission sees only Verify menu
- [ ] User with only Approve permission sees only Approve menu
- [ ] User with general permission sees all workflow menus
- [ ] User with multiple specific permissions sees only those menus
- [ ] Super admin sees everything

## Documentation Created

1. ✅ `manage-only-permission-system.md` - Complete system explanation
2. ✅ `implementation-complete.md` - This file

## Next Steps

1. **Backend Team:** Implement permission creation SQL script
2. **Test:** Create test users with different permission combinations
3. **Validate:** Verify menus show/hide correctly based on permissions
4. **Deploy:** Roll out to production after successful testing

---

## Quick Reference

### Permission Format

```
manage:resource-workflow-step
  ^     ^        ^
  |     |        └─ Workflow step (endorse/verify/approve)
  |     └────────── Resource (birth-registration, death-registration)
  └──────────────── Action (always "manage")
```

### Subject Format

```
Resource Workflow Step
  ^        ^
  |        └─ Workflow step (Endorse/Verify/Approve)
  └────────── Resource (Birth Registration, Death Registration)
```

### The Rule

> **Subject (Title Case) → Permission (kebab-case)**
>
> `"Birth Registration Verify"` → `"manage:birth-registration-verify"`
