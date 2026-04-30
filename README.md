# BCRS Admin Portal - Frontend Demo

This is a **frontend-only demo** of the Bhutan Civil Registration System (BCRS) Admin Portal. It uses **mock authentication** and does not require any backend services to run.

## 🎯 Demo Mode

This application runs in demo mode with:
- ✅ Mock authentication (no backend required)
- ✅ Demo user accounts with different permission levels
- ✅ Frontend UI showcase
- ❌ No real data persistence
- ❌ No API calls to backend services

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Run the Development Server

```bash
pnpm dev
```

The application will start on [http://localhost:3003](http://localhost:3003)

### 3. Login with Demo Credentials

See [DEMO_CREDENTIALS.md](./DEMO_CREDENTIALS.md) for available demo accounts.

**Quick Login:**
- **CID**: `11111111111`
- **Password**: `admin123`

## 📋 Available Demo Accounts

| Role | CID | Password | Permissions |
|------|-----|----------|-------------|
| Super Admin | `11111111111` | `admin123` | Full system access |
| Registration Officer | `22222222222` | `officer123` | Birth/Death registration |
| Approval Officer | `33333333333` | `approval123` | Approve/reject registrations |
| Read-Only User | `44444444444` | `viewer123` | View-only access |

## 🔧 Technical Details

### Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Authentication**: NextAuth.js with mock credentials
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **State Management**: React hooks

### Mock Authentication

The authentication is implemented using:
- `/src/auth.config.ts` - NextAuth configuration with mock provider
- `/src/lib/mock-users.ts` - Demo user data and authentication logic

### Environment Variables

The `.env` file is pre-configured for demo mode. Key variables:
- `AUTH_SECRET` - Required for JWT signing
- `NEXTAUTH_SECRET` - Alternative JWT secret
- `PORT` - Application port (default: 3003)

**Note:** All backend service URLs are commented out as they're not needed in demo mode.

## 📁 Project Structure

```
admin-portal-demo/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions and mock data
│   ├── auth.ts          # NextAuth setup
│   └── auth.config.ts   # Authentication configuration
├── public/              # Static assets
├── .env                 # Environment variables
├── DEMO_CREDENTIALS.md  # Login credentials
└── README.md           # This file
```

## 🎨 Features Showcased

- ✅ User authentication with role-based access
- ✅ Dashboard interface
- ✅ Permission-based UI rendering
- ✅ Form components and validation
- ✅ Table components with sorting/filtering
- ✅ Modal and dialog components
- ✅ Toast notifications
- ✅ Dark mode support
- ✅ Responsive design

## ⚠️ Limitations

Since this is a frontend-only demo:
- **No data persistence** - Data resets on page refresh
- **No backend integration** - API calls will fail gracefully
- **Mock data only** - All displayed data is hardcoded
- **No file uploads** - Image/file upload features are disabled
- **No real-time updates** - WebSocket features are disabled

## 🔐 Security Note

This demo uses hardcoded credentials for demonstration purposes only. **Never** use this authentication approach in production. In a real application:
- Passwords must be properly hashed
- Credentials must be stored securely in a database
- JWT secrets must be strong and unique
- HTTPS must be enforced in production

## 📝 Development Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Format code
pnpm format
```

## 💡 For Developers

### Adding More Demo Users

Edit `/src/lib/mock-users.ts` and add to the `DEMO_USERS` array:

```typescript
{
  id: '5',
  fullName: 'New User',
  cidNumber: '55555555555',
  password: 'newuser123',
  // ... other fields
}
```

### Modifying Permissions

Edit the `ability` array in each user object to change permissions:

```typescript
ability: [
  { action: ['create', 'read'], subject: 'birth-registration' },
  { action: 'read', subject: 'reports' }
]
```

## 🆘 Troubleshooting

### Login not working?
- Ensure you're using credentials from `DEMO_CREDENTIALS.md`
- Check browser console for error messages
- Clear browser cookies and try again

### Port already in use?
Change the port in `.env`:
```
PORT=3004
```

### Build errors?
```bash
rm -rf .next node_modules
pnpm install
pnpm dev
```

## 📄 License

See LICENSE file for details.

## 🔗 Related Projects

- **Admin Portal (Full)** - Backend-connected version with all features
- **Client Portal** - Citizen-facing application

---

**Note**: This is a demonstration project. For production use, please refer to the main admin-portal repository with full backend integration.
