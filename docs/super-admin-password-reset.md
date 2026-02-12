# Super Admin Password Reset Feature

## Overview

This feature allows super admins to reset passwords for other admin users without knowing their current password. This is useful for:

- Helping admins who have forgotten their passwords
- Emergency access management
- Administrative control

## Implementation Details

### Backend (auth_service)

#### 1. New DTO: `ResetPasswordDto`

**File:** `src/modules/admin/dto/reset-password.dto.ts`

```typescript
export class ResetPasswordDto {
  newPassword!: string; // Minimum 6 characters
}
```

#### 2. Service Method: `resetPassword`

**File:** `src/modules/admin/admin.service.ts`

```typescript
async resetPassword(id: Uuid, newPassword: string)
```

- Takes admin ID and new password
- Does NOT require old password verification
- Hashes the new password with bcrypt
- Updates the admin's password

#### 3. Controller Endpoint: `POST /admin/:id/reset-password`

**File:** `src/modules/admin/admin.controller.ts`

- **Restriction:** Only accessible to `SUPER_ADMIN` role
- **Endpoint:** `POST /admin/:id/reset-password`
- **Body:** `{ "newPassword": "newSecurePassword" }`

### Frontend (admin-portal)

#### 1. Server Action: `resetAdminPassword`

**File:** `src/actions/common/admin-actions.ts`

```typescript
export async function resetAdminPassword(adminId: string, newPassword: string);
```

Calls the backend API to reset the admin's password.

#### 2. Reset Password Dialog Component

**File:** `src/app/dashboard/user/[id]/_components/reset-password-dialog.tsx`

Features:

- Password input fields with confirmation
- Minimum 6 character validation
- Password match validation
- Warning message about super admin action
- Loading states

#### 3. User Details Section Integration

**File:** `src/app/dashboard/user/[id]/_components/user-details-section.tsx`

- Shows "Reset Password" button only to super admins
- Super admins cannot reset their own password (use change password instead)
- Button styled in orange to indicate it's a sensitive action

## Security Features

1. **Role-Based Access Control**

   - Only SUPER_ADMIN can access the endpoint
   - Enforced at the backend guard level

2. **Session Validation**

   - Checks current user's session
   - Prevents super admin from resetting their own password via this method

3. **Password Requirements**

   - Minimum 6 characters
   - Password confirmation required
   - Bcrypt hashing with 12 rounds

4. **Audit Trail**
   - Action is logged in the backend
   - Password change timestamp updated in database

## Usage

### For Super Admin:

1. Navigate to User Management (`/dashboard/user`)
2. Click on the "View" button for any user
3. On the user details page, click the "Reset Password" button
4. Enter and confirm the new password
5. Click "Reset Password" to confirm

### Visual Indicators:

- **Reset Password Button:** Orange color to indicate sensitive action
- **Warning Message:** Yellow alert box explaining the action
- **Only visible to:** Super admins
- **Cannot be used on:** Their own account

## API Examples

### Reset Password

```bash
POST /admin/{id}/reset-password
Authorization: Bearer {super_admin_token}
Content-Type: application/json

{
  "newPassword": "NewSecurePassword@123"
}
```

### Success Response

```json
{
  "statusCode": 200,
  "message": "Password reset successfully"
}
```

### Error Responses

```json
// Admin not found
{
  "statusCode": 404,
  "message": "Admin with ID \"xxx\" not found"
}

// Unauthorized (not super admin)
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

## Differences from Change Password

| Feature                   | Change Password                   | Reset Password                   |
| ------------------------- | --------------------------------- | -------------------------------- |
| **Requires old password** | ✅ Yes                            | ❌ No                            |
| **Who can use**           | Admin themselves                  | Super Admin only                 |
| **Endpoint**              | `POST /admin/:id/change-password` | `POST /admin/:id/reset-password` |
| **Use case**              | User changes their own password   | Admin forgot password            |

## Testing

### Test as Super Admin:

1. Login as super admin
2. Navigate to any admin user's detail page
3. Verify "Reset Password" button is visible
4. Click button and set new password
5. Logout
6. Login as the target admin with new password

### Test as Regular Admin:

1. Login as regular admin
2. Navigate to any user's detail page
3. Verify "Reset Password" button is NOT visible

### Test on Own Account:

1. Login as super admin
2. Navigate to your own user details
3. Verify "Reset Password" button is NOT visible
4. Use "Change Password" from profile instead

## Future Enhancements

- [ ] Send email notification to admin when password is reset
- [ ] Require admin to change password on next login after reset
- [ ] Add password reset history/audit log
- [ ] Add password strength meter
- [ ] Add password policy enforcement (uppercase, numbers, special chars)
