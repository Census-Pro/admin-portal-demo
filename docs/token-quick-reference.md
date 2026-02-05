# Token System - Quick Reference

## 🎯 Your Login Response

```json
{
  "accessToken": "...", // 6 hours - For API calls
  "refreshToken": "...", // 90 days - For getting new access tokens
  "expiresIn": 21600, // 6 hours in seconds
  "user": { "id": "...", "roleType": "SUPER_ADMIN" }
}
```

## 🔑 Two-Token System

| Token             | Lifetime | Purpose                   | When Used                 |
| ----------------- | -------- | ------------------------- | ------------------------- |
| **Access Token**  | 6 hours  | Authenticate API requests | Every API call            |
| **Refresh Token** | 90 days  | Get new access tokens     | When access token expires |

## 🔄 How Refresh Works

### Simple Timeline

```
12:00 PM - Login
├─ Access Token valid until 6:00 PM
└─ Refresh Token valid for 90 days

5:55 PM - Auto-refresh (5 min before expiry)
├─ POST /auth/refresh-token
├─ Backend validates refresh token
├─ Backend issues NEW access token
└─ User continues working

6:00 PM - Old access token expires
└─ Already using new token (seamless!)

This repeats every 6 hours for 90 days
```

### The Magic

1. **Before expiry** (5 minutes): Frontend auto-refreshes
2. **Backend checks**: Is refresh token valid?
3. **Backend issues**: New access token (6h) + new refresh token (90d)
4. **User experience**: Doesn't notice anything! 🎉

## 💻 Code Flow

### Frontend Detection

```typescript
// Check every render
const timeUntilExpiry = tokenExpiry - currentTime;

// If less than 5 minutes
if (timeUntilExpiry < 300) {
  refreshToken(); // Auto-refresh
}
```

### Refresh API Call

```typescript
POST /auth/refresh-token
Body: { refreshToken: "..." }

Response:
{
  "accessToken": "...",  // New 6h token
  "refreshToken": "..." // New 90d token
}
```

### Backend Validation

```typescript
1. Verify refresh token signature ✓
2. Check not expired (< 90 days) ✓
3. Check not blacklisted ✓
4. Check user still active ✓
5. Generate new tokens ✓
6. (Optional) Blacklist old refresh token ✓
```

## 🔐 Security Features

### Token Rotation

- Every refresh = NEW refresh token
- Old refresh token → Blacklisted
- If stolen and used → Both attacker and user logged out

### Short Access Token

- 6 hours only
- If stolen → Limited damage window
- Auto-refreshes → User doesn't notice

### Blacklist Support

```typescript
// Logout
redis.set(`blacklist:${token.jti}`, '1', 'EX', 7776000);

// Check
const isBlacklisted = await redis.get(`blacklist:${token.jti}`);
if (isBlacklisted) throw new UnauthorizedException();
```

## 📊 Token Contents

### Access Token

```json
{
  "userId": "...",
  "cidNo": "10910001327",
  "roleType": "SUPER_ADMIN",
  "type": "ACCESS_TOKEN",
  "roles": [],
  "permissions": [],
  "officeLocationId": "...",
  "iat": 1770266389, // Issued at
  "exp": 1770287989 // Expires (6h later)
}
```

### Refresh Token

```json
{
  "userId": "...",
  "userType": "ADMIN",
  "type": "REFRESH_TOKEN",
  "jti": "unique-token-id", // For blacklisting
  "iat": 1770266389, // Issued at
  "exp": 1778042389 // Expires (90d later)
}
```

## ⏱️ Session Durations

| Setting               | Duration | Config                                |
| --------------------- | -------- | ------------------------------------- |
| Access Token          | 6 hours  | `JWT_EXPIRATION_TIME=21600`           |
| Refresh Token         | 90 days  | `JWT_REFRESH_EXPIRATION_TIME=7776000` |
| Session (Remember Me) | 7 days   | `SESSION_MAX_AGE_REMEMBER`            |
| Session (No Remember) | 24 hours | `SESSION_MAX_AGE_DEFAULT`             |

## 🐛 Debug Your Tokens

### Option 1: Use Debug Component

```tsx
import { TokenDebug } from '@/components/token-debug';

// In your layout (development only)
<TokenDebug />;
```

Shows:

- Time until expiry
- User info
- Remember Me status
- Live countdown

### Option 2: Browser DevTools

1. Open DevTools
2. Application → Cookies
3. Find: `next-auth.session-token`
4. Copy value
5. Paste at: https://jwt.io/

### Option 3: Console

```javascript
// In browser console
const session = await fetch('/api/auth/session').then((r) => r.json());
console.log(session);
```

## 🎯 Common Questions

### Q: Why two tokens?

**A**: Security + UX

- Short access token = Secure (6h)
- Long refresh token = Convenient (90d)
- Best of both worlds!

### Q: What if refresh token is stolen?

**A**: Token rotation helps:

1. Attacker uses stolen refresh token
2. Gets new tokens, old one blacklisted
3. Real user tries to refresh
4. Fails (token blacklisted)
5. Both logged out → Security breach detected

### Q: Why 5 minutes before expiry?

**A**: Safety buffer

- Network delays
- Prevents race conditions
- User doesn't notice

### Q: Can I extend to 180 days?

**A**: Yes, change backend:

```properties
# .env
JWT_REFRESH_EXPIRATION_TIME=15552000  # 180 days
```

### Q: How to force logout all devices?

**A**: Blacklist user's refresh tokens:

```typescript
// Get all user's refresh tokens
const tokens = await redis.keys(`refresh:${userId}:*`);

// Blacklist all
for (const token of tokens) {
  await redis.set(`blacklist:${token}`, '1');
}
```

## ✅ Best Practices

1. ✅ **Never store tokens in localStorage** → XSS risk
2. ✅ **Use HTTP-only cookies** → JavaScript can't access
3. ✅ **Short access tokens** → Limit damage if stolen
4. ✅ **Long refresh tokens** → Better UX
5. ✅ **Auto-refresh before expiry** → Seamless experience
6. ✅ **Token rotation** → Detect stolen tokens
7. ✅ **Blacklist support** → Revoke compromised tokens

## 📖 Further Reading

- Full Guide: `docs/token-system-explained.md`
- Session Management: `docs/session-management-guide.md`
- Implementation: `docs/session-implementation-summary.md`

---

**TL;DR**: You get two tokens at login. The short one (6h) is used for API calls. When it expires, the long one (90d) gets you a new short one. This happens automatically every 6 hours for 90 days. Magic! ✨
