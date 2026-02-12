# Scalable Permission System - Birth & Death Registration

## 🎯 How It Works

Your navigation config is **already set up for granular permissions**! Each workflow menu (Endorse, Verify, Approve) has its own permission check. Users will **only see the menus they have permission for**.

## 📋 Permission Structure

### Birth Registration Permissions

- `endorse:birth-registration` - Can endorse birth registrations
- `verify:birth-registration` - Can verify birth registrations
- `approve:birth-registration` - Can approve birth registrations
- `manage:birth-registration` - Can do ALL (endorse + verify + approve + CRUD)

### Death Registration Permissions

- `endorse:death-registration` - Can endorse death registrations
- `verify:death-registration` - Can verify death registrations
- `approve:death-registration` - Can approve death registrations
- `manage:death-registration` - Can do ALL (endorse + verify + approve + CRUD)

## 👥 User Scenarios (Examples)

### Scenario 1: Gewog Clerk (Verify Only)

**Backend Permission:**

```json
{
  "name": "Birth Verification Permission",
  "actions": "verify",
  "subjects": "Birth Registration"
}
```

**What They See:**

```
📊 Dashboard
👤 Birth Registration
   └─ ✓ Verify
```

❌ Cannot see: Endorse, Approve

---

### Scenario 2: Dzongkhag Officer (Verify + Approve)

**Backend Permissions:**

```json
[
  {
    "name": "Birth Verification",
    "actions": "verify",
    "subjects": "Birth Registration"
  },
  {
    "name": "Birth Approval",
    "actions": "approve",
    "subjects": "Birth Registration"
  }
]
```

**What They See:**

```
📊 Dashboard
👤 Birth Registration
   ├─ ✓ Verify
   └─ ✓ Approve
```

❌ Cannot see: Endorse

---

### Scenario 3: Registry Officer (Endorse Only - Both Birth & Death)

**Backend Permissions:**

```json
[
  {
    "name": "Birth Endorsement",
    "actions": "endorse",
    "subjects": "Birth Registration"
  },
  {
    "name": "Death Endorsement",
    "actions": "endorse",
    "subjects": "Death Registration"
  }
]
```

**What They See:**

```
📊 Dashboard
👤 Birth Registration
   └─ ✓ Endorse
💀 Death Registration
   └─ ✓ Endorse
```

❌ Cannot see: Verify, Approve

---

### Scenario 4: Senior Officer (All Workflows - Both Registrations)

**Backend Permission:**

```json
[
  {
    "name": "Full Birth Control",
    "actions": "manage",
    "subjects": "Birth Registration"
  },
  {
    "name": "Full Death Control",
    "actions": "manage",
    "subjects": "Death Registration"
  }
]
```

**What They See:**

```
📊 Dashboard
👤 Birth Registration
   ├─ ✓ Endorse
   ├─ ✓ Verify
   └─ ✓ Approve
💀 Death Registration
   ├─ ✓ Endorse
   ├─ ✓ Verify
   └─ ✓ Approve
```

✅ Can see: Everything

---

### Scenario 5: Mixed Permissions (Birth Verify + Death Approve)

**Backend Permissions:**

```json
[
  {
    "name": "Birth Verification",
    "actions": "verify",
    "subjects": "Birth Registration"
  },
  {
    "name": "Death Approval",
    "actions": "approve",
    "subjects": "Death Registration"
  }
]
```

**What They See:**

```
📊 Dashboard
👤 Birth Registration
   └─ ✓ Verify
💀 Death Registration
   └─ ✓ Approve
```

---

## 🔧 How to Create Roles with Specific Permissions

### Step 1: Create Permissions in Backend

```bash
# Example: Create permission for verifying birth registrations
curl -X POST http://localhost:5001/auth/permissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Birth Verification Permission",
    "description": "Can verify birth registration applications",
    "actions": "verify",
    "subjects": "Birth Registration"
  }'
```

### Step 2: Create a Role

```bash
curl -X POST http://localhost:5001/auth/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gewog Verifier",
    "description": "Can verify birth and death registrations"
  }'
```

### Step 3: Assign Permissions to Role

```bash
curl -X POST http://localhost:5001/auth/roles/{roleId}/permissions \
  -H "Content-Type: application/json" \
  -d '{
    "permissionIds": ["permission-id-1", "permission-id-2"]
  }'
```

### Step 4: Assign Role to User

```bash
curl -X POST http://localhost:5001/auth/admins/{adminId}/roles \
  -H "Content-Type: application/json" \
  -d '{
    "roleIds": ["role-id"]
  }'
```

---

## ✅ Permission Matrix

| Role                  | Birth Endorse | Birth Verify | Birth Approve | Death Endorse | Death Verify | Death Approve |
| --------------------- | ------------- | ------------ | ------------- | ------------- | ------------ | ------------- |
| **Super Admin**       | ✅            | ✅           | ✅            | ✅            | ✅           | ✅            |
| **Gewog Clerk**       | ❌            | ✅           | ❌            | ❌            | ✅           | ❌            |
| **Dzongkhag Officer** | ❌            | ✅           | ✅            | ❌            | ✅           | ✅            |
| **Registry Officer**  | ✅            | ❌           | ❌            | ✅            | ❌           | ❌            |
| **Senior Officer**    | ✅            | ✅           | ✅            | ✅            | ✅           | ✅            |

---

## 🚀 Quick Reference - Permission Actions

### Individual Actions (Granular Control)

- `endorse:birth-registration` - Only Endorse menu
- `verify:birth-registration` - Only Verify menu
- `approve:birth-registration` - Only Approve menu

### Manage Action (Full Control)

- `manage:birth-registration` - All 3 menus (Endorse + Verify + Approve)
- `manage:death-registration` - All 3 menus (Endorse + Verify + Approve)

### Super Admin

- `manage:all` - Everything in the system

---

## 📝 Important Notes

1. **The navigation automatically filters** based on user permissions
2. **Parent menus only show** if user has at least ONE child permission
3. **Each child menu independently checks** permissions
4. **Users only see what they can access**
5. **No code changes needed** - just create permissions in backend!

---

## 🎯 Database Fix Reminder

Make sure to run the SQL fix to correct permission subjects:

```sql
UPDATE permissions
SET subjects = 'Birth Registration'
WHERE subjects = 'Birth Registration Verify';

UPDATE permissions
SET subjects = 'Death Registration'
WHERE subjects = 'Death Registration Verify';
```

Then users must logout/login to get updated tokens.
