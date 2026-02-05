# Session Management - Quick Reference

## ✅ What Changed

**Before**: Session expiration errors showed as red error boxes in tables
**After**: Session expiration shows a proper alert dialog with option to re-login

## 🚀 Implementation

### 1. Global Setup (Already Done)

Added `<SessionMonitor />` to dashboard layout - monitors all session expirations globally.

```tsx
// app/dashboard/layout.tsx
<SessionMonitor /> // ✅ Added - handles all session expiration
```

### 2. For New Table Components

When creating new table components that fetch data:

```tsx
import { useSessionExpired } from '@/hooks/use-session-expired';

export function MyTable() {
  const { checkSessionExpired, SessionExpiredDialog } = useSessionExpired();

  const fetchData = async () => {
    const result = await someAction();

    if (!result.success && result.error) {
      // Check session first - dialog will show if expired
      if (checkSessionExpired(result.error)) {
        return;
      }

      // Show non-session errors in table
      setError(result.error);
    }
  };

  return (
    <>
      <DataTable ... />
      <SessionExpiredDialog />
    </>
  );
}
```

## 📋 Migration Checklist

For existing tables showing session errors:

- [ ] Import `useSessionExpired` hook
- [ ] Add `checkSessionExpired()` before setting errors
- [ ] Add `<SessionExpiredDialog />` to component return
- [ ] Test: Expire session and verify dialog appears (not red box)

## ⏱️ Session Timings

| Setting         | Duration | Description                 |
| --------------- | -------- | --------------------------- |
| Access Token    | 6 hours  | JWT token expiry (backend)  |
| Remember Me ON  | 7 days   | Frontend session duration   |
| Remember Me OFF | 24 hours | Frontend session duration   |
| Refresh Token   | 90 days  | Long-term token for renewal |

## 🎯 Key Benefits

1. **Better UX**: Dialog instead of error box in table
2. **Consistent**: All session errors handled the same way
3. **Global**: One monitor watches all components
4. **Actionable**: Clear "Log In Again" button

## 🔍 Testing

1. **Natural expiry**: Wait for session to expire
2. **Manual expiry**: Delete session cookie in DevTools
3. **Backend 401**: Stop backend and verify dialog appears

## 📝 Example: Updated Agency Table

```tsx
export function AgenciesTable() {
  const { checkSessionExpired, SessionExpiredDialog } = useSessionExpired();

  const fetchData = async () => {
    const result = await getAgencies();

    if (!result.success) {
      // ✅ Check session expiration first
      if (result.error && checkSessionExpired(result.error)) {
        return; // Dialog handles the rest
      }

      // Show other errors normally
      setError(result.error);
    }
  };

  return (
    <>
      {error && <ErrorDisplay error={error} />}
      <DataTable ... />
      <SessionExpiredDialog /> {/* ✅ Add dialog */}
    </>
  );
}
```

## 🐛 Common Issues

**Issue**: Dialog appears multiple times
**Fix**: Use global `SessionMonitor` in layout, not in every component

**Issue**: Dialog shows on login page
**Fix**: Monitor only checks when on `/dashboard/*` routes

**Issue**: Session doesn't refresh
**Fix**: Check backend `JWT_EXPIRATION_TIME` matches frontend config
