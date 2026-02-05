# Frontend Session Management Guide

## Overview

This document explains how session management is implemented in the Census Admin Portal and best practices for handling session expiration.

## How Sessions Work

### 1. **Session Creation (Login)**

When a user logs in:

- Backend generates JWT access token (6 hours) and refresh token (90 days)
- Frontend stores these tokens in NextAuth session
- Session duration is controlled by "Remember Me" checkbox:
  - **Checked**: 7 days
  - **Unchecked**: 24 hours

### 2. **Session Storage**

- **JWT Tokens**: Stored in HTTP-only cookies (secure)
- **Session Data**: Managed by NextAuth
- **User Info**: Stored in JWT payload (permissions, roles, etc.)

### 3. **Session Validation**

On every request:

```typescript
// auth.config.ts - JWT callback
async jwt({ token, user }) {
  const now = Math.floor(Date.now() / 1000);

  // Check if session expired
  if (token.tokenExpiry && token.tokenExpiry < now) {
    return null; // Force logout
  }

  return token;
}
```

### 4. **Session Expiration Handling**

The frontend handles session expiration at multiple levels:

#### A. **Global Level** (Recommended)

```tsx
// In your dashboard layout
import { SessionMonitor } from '@/components/session-monitor';

export default function DashboardLayout({ children }) {
  return (
    <>
      <SessionMonitor />
      {children}
    </>
  );
}
```

#### B. **Component Level**

```tsx
import { useSessionExpired } from '@/hooks/use-session-expired';

export function MyComponent() {
  const { checkSessionExpired, SessionExpiredDialog } = useSessionExpired();

  const fetchData = async () => {
    const result = await someAction();

    // Check if session expired
    if (result.error && checkSessionExpired(result.error)) {
      return; // Dialog will handle the UI
    }

    // Handle other errors
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <>
      {/* Your component UI */}
      <SessionExpiredDialog />
    </>
  );
}
```

## Best Practices

### 1. **Don't Show Session Errors in Tables**

❌ **Bad:**

```tsx
if (error) {
  return (
    <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6">
      <p className="text-destructive">{error}</p>
    </div>
  );
}
```

✅ **Good:**

```tsx
const { checkSessionExpired, SessionExpiredDialog } = useSessionExpired();

const fetchData = async () => {
  const result = await getAgencies();

  if (!result.success) {
    // Check if session expired first
    if (result.error && checkSessionExpired(result.error)) {
      return; // Dialog handles it
    }

    // Show non-session errors in table
    setError(result.error);
  }
};

return (
  <>
    {error && (
      <div className="border-destructive/50 bg-destructive/10 rounded-lg border p-6">
        <p className="text-destructive">{error}</p>
      </div>
    )}
    <DataTable columns={columns} data={data} />
    <SessionExpiredDialog />
  </>
);
```

### 2. **Use Global Session Monitor**

Instead of adding session checking to every component, use the global monitor:

```tsx
// app/dashboard/layout.tsx
import { SessionMonitor } from '@/components/session-monitor';

export default function DashboardLayout({ children }) {
  return (
    <div>
      <SessionMonitor /> {/* Add once at layout level */}
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

### 3. **Consistent Error Checking**

In server actions, always return consistent error format:

```typescript
// actions/common/agency-actions.ts
export async function getAgencies() {
  try {
    const response = await fetch(`${API_URL}/agencies`);

    if (response.status === 401) {
      return {
        success: false,
        error: 'Your session has expired. Please log in again.',
        data: []
      };
    }

    // Handle other errors...
  } catch (error) {
    return {
      success: false,
      error: 'An unexpected error occurred',
      data: []
    };
  }
}
```

### 4. **Session Duration Configuration**

Backend configuration (`.env`):

```properties
# JWT token expiration (6 hours = 21600 seconds)
JWT_EXPIRATION_TIME=21600

# Refresh token expiration (90 days = 7776000 seconds)
JWT_REFRESH_EXPIRATION_TIME=7776000
```

Frontend configuration (`auth.config.ts`):

```typescript
// Session durations
const SESSION_MAX_AGE_REMEMBER = 7 * 24 * 60 * 60; // 7 days
const SESSION_MAX_AGE_DEFAULT = 24 * 60 * 60; // 24 hours
```

## Token Refresh Strategy

The system automatically refreshes tokens before expiration:

```typescript
// auth.config.ts
async jwt({ token, user }) {
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = token.tokenExpiry - now;

  // Refresh if less than 5 minutes until expiry
  if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
    try {
      const refreshed = await refreshAccessToken(token.refreshToken);
      if (refreshed) {
        token.accessToken = refreshed.accessToken;
        token.tokenExpiry = now + 21600; // 6 hours
      }
    } catch (error) {
      return null; // Force re-login
    }
  }

  return token;
}
```

## Session Expiration Dialog

The dialog provides two options:

1. **Log In Again**: Signs out user and redirects to login
2. **Stay on Page**: Closes dialog (user can continue but will see errors)

```tsx
<AlertDialog open={open}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Session Expired</AlertDialogTitle>
      <AlertDialogDescription>
        Your session has expired for security reasons. Please log in again to
        continue.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Stay on Page</AlertDialogCancel>
      <AlertDialogAction onClick={handleLogin}>Log In Again</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Monitoring and Debugging

### Check Session Status

```tsx
import { useSession } from 'next-auth/react';

function MyComponent() {
  const { data: session, status } = useSession();

  console.log('Session status:', status); // "loading" | "authenticated" | "unauthenticated"
  console.log('Token expiry:', session?.tokenExpiry);
  console.log(
    'Time until expiry:',
    session?.tokenExpiry - Math.floor(Date.now() / 1000)
  );
}
```

### Session Events

Listen for session events:

```tsx
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      // Revalidate session when tab becomes visible
      const { data: session } = useSession();
      if (session?.tokenExpiry) {
        const now = Math.floor(Date.now() / 1000);
        if (session.tokenExpiry < now) {
          handleSessionExpired();
        }
      }
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () =>
    document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);
```

## Security Considerations

1. **Use HTTP-only cookies**: Prevents XSS attacks
2. **Secure flag in production**: HTTPS only
3. **SameSite=Lax**: CSRF protection
4. **Short access token lifetime**: 6 hours maximum
5. **Long refresh token lifetime**: 90 days, but revocable
6. **Token rotation**: New refresh token on each refresh

## Common Issues

### Issue 1: Session expires immediately

**Cause**: Backend token expiry time mismatch with frontend
**Solution**: Ensure JWT_EXPIRATION_TIME matches session duration

### Issue 2: Dialog shows on login page

**Cause**: Session monitor running on public routes
**Solution**: Add route check in SessionMonitor

### Issue 3: Multiple dialogs appear

**Cause**: Multiple components using useSessionExpired
**Solution**: Use global SessionMonitor in layout instead

## Migration Guide

If you're updating existing tables to use the new session handling:

1. Import the hook:

```tsx
import { useSessionExpired } from '@/hooks/use-session-expired';
```

2. Add the hook in your component:

```tsx
const { checkSessionExpired, SessionExpiredDialog } = useSessionExpired();
```

3. Check for session expiration before showing errors:

```tsx
if (result.error && checkSessionExpired(result.error)) {
  return; // Dialog will handle it
}
```

4. Add the dialog to your component:

```tsx
return (
  <>
    {/* Your component */}
    <SessionExpiredDialog />
  </>
);
```

## Summary

- ✅ Use global `SessionMonitor` in dashboard layout
- ✅ Check for session expiration in component error handlers
- ✅ Show session expiration in a dialog, not in the table
- ✅ Provide clear "Log In Again" action
- ✅ Automatically refresh tokens before expiration
- ✅ Use consistent error messages for 401 responses
