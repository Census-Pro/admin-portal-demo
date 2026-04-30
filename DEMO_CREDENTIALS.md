# Demo Login Credentials

This is a demo frontend application with **mock authentication**. No backend service is required.

## Available Demo Accounts

### 1. Super Admin Account

- **CID**: `11111111111`
- **Password**: `admin123`
- **Role**: Super Administrator
- **Permissions**: Full system access, all CRUD operations

### 2. Registration Officer

- **CID**: `22222222222`
- **Password**: `officer123`
- **Role**: Registration Officer
- **Permissions**: Birth/Death registration, view operations

### 3. Approval Officer

- **CID**: `33333333333`
- **Password**: `approval123`
- **Role**: Approval Officer
- **Permissions**: Approve/reject registrations, view reports

### 4. Read-Only User

- **CID**: `44444444444`
- **Password**: `viewer123`
- **Role**: Viewer
- **Permissions**: Read-only access to all modules

## Quick Start

1. Navigate to the login page
2. Enter any of the CID numbers above
3. Enter the corresponding password
4. Click "Sign In"

## Notes

- This is a **frontend-only demo** - no real backend authentication occurs
- All data displayed is mock data for demonstration purposes
- Sessions last for 24 hours (or 7 days if "Remember Me" is checked)
- You can log out and switch between different user accounts to see different permission levels

## For Developers

The mock authentication is implemented in:

- `/src/auth.config.ts` - Authentication configuration
- `/src/lib/mock-users.ts` - Demo user data

To add more demo users, edit the `DEMO_USERS` array in `/src/lib/mock-users.ts`.
