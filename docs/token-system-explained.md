# Token System & Refresh Token Mechanism

## 📊 Your Login Response Breakdown

```json
{
  "message": "Logged in successfully as Super Admin",
  "accessToken": "eyJhbGc...", // 6-hour token for API calls
  "refreshToken": "eyJhbGc...", // 90-day token for renewal
  "expiresIn": 21600, // 6 hours in seconds
  "user": {
    "id": "272381b5-71f7-44e5-8de7-e82f79f5687f",
    "cidNo": "10910001327",
    "roleType": "SUPER_ADMIN",
    "roles": []
  },
  "ability": []
}
```

## 🎯 Two Token System

### **Access Token** (Short-lived, 6 hours)

- **Purpose**: Authenticate API requests
- **Lifetime**: 21,600 seconds (6 hours)
- **Storage**: NextAuth session (HTTP-only cookie)
- **Usage**: Sent with EVERY API call
- **Contains**: User ID, role, permissions, office location

### **Refresh Token** (Long-lived, 90 days)

- **Purpose**: Get new access tokens without re-login
- **Lifetime**: 7,776,000 seconds (90 days)
- **Storage**: NextAuth session (HTTP-only cookie)
- **Usage**: Only for `/auth/refresh` endpoint
- **Contains**: User ID, unique token ID (jti) for revocation
- **Security**: Can be blacklisted/revoked by backend

---

## 🔄 Token Refresh Flow

### **Timeline Example**

```
Day 1, 12:00 PM - User logs in
├─ Access Token: Valid until 6:00 PM (6 hours)
└─ Refresh Token: Valid until Day 91 (90 days)

Day 1, 5:55 PM - Access token about to expire
├─ Frontend detects: "Only 5 minutes left!"
├─ Automatically calls: POST /auth/refresh-token
├─ Backend validates refresh token
├─ Backend issues: NEW access token (valid 6 hours)
└─ User continues working seamlessly

Day 1, 6:00 PM - Original access token expires
├─ User doesn't notice anything
└─ Already using new access token

This repeats every 6 hours for 90 days...

Day 91 - Refresh token expires
├─ Cannot renew access token anymore
└─ User must log in again
```

---

## 🛠️ How Refresh Works in Your Code

### **1. Detection (Before Expiry)**

```typescript
// auth.config.ts - JWT Callback
const now = Math.floor(Date.now() / 1000);
const timeUntilExpiry = token.tokenExpiry - now;

// Refresh if less than 5 minutes until expiry
const shouldRefresh = timeUntilExpiry < 300 && timeUntilExpiry > 0;
```

**Logic**:

- If less than 5 minutes (300 seconds) until expiry
- AND more than 0 seconds (not already expired)
- Then trigger refresh

### **2. Refresh API Call**

```typescript
if (shouldRefresh && token.refreshToken) {
  try {
    const response = await fetch(`${API_URL}auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refreshToken: token.refreshToken
      })
    });

    if (response.ok) {
      const data = await response.json();

      // Update tokens in session
      token.accessToken = data.token.accessToken; // New 6h token
      token.refreshToken = data.token.refreshToken; // New 90d token (optional)

      // Extend session based on "Remember Me"
      const sessionDuration = token.rememberMe
        ? SESSION_MAX_AGE_REMEMBER // 7 days
        : SESSION_MAX_AGE_DEFAULT; // 24 hours

      token.tokenExpiry = Math.floor(Date.now() / 1000) + sessionDuration;
    } else {
      // Refresh failed - force logout
      return null;
    }
  } catch (error) {
    // Network error - force logout
    return null;
  }
}
```

### **3. Backend Refresh Endpoint**

Your backend should have something like:

```typescript
// Backend: auth_service/src/auth/refresh.controller.ts
async refreshToken(refreshToken: string) {
  // 1. Decode and validate refresh token
  const decoded = this.jwtService.verify(refreshToken, {
    secret: JWT_PUBLIC_KEY
  });

  // 2. Check if token type is REFRESH_TOKEN
  if (decoded.type !== 'REFRESH_TOKEN') {
    throw new UnauthorizedException('Invalid token type');
  }

  // 3. Check if token is blacklisted (logout/security)
  const isBlacklisted = await this.redis.get(`blacklist:${decoded.jti}`);
  if (isBlacklisted) {
    throw new UnauthorizedException('Token has been revoked');
  }

  // 4. Get user from database
  const user = await this.userService.findById(decoded.userId);
  if (!user || !user.isActive) {
    throw new UnauthorizedException('User not found or inactive');
  }

  // 5. Generate NEW tokens
  const newAccessToken = this.generateAccessToken(user);   // 6h
  const newRefreshToken = this.generateRefreshToken(user); // 90d

  // 6. (Optional) Blacklist old refresh token (rotation)
  await this.redis.set(
    `blacklist:${decoded.jti}`,
    '1',
    'EX',
    7776000 // 90 days
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    expiresIn: 21600
  };
}
```

---

## 🔐 Security Features

### **1. Token Rotation**

Every time you refresh, you get a **NEW refresh token**. The old one is blacklisted.

**Why?** If a refresh token is stolen, it can only be used once. After that, both the attacker and real user will be logged out, alerting you to the breach.

### **2. JWT ID (jti)**

```json
"jti": "0122337..." // Unique identifier for this specific token
```

Used to track and revoke individual tokens without affecting other sessions.

### **3. Token Blacklisting**

```typescript
// When user logs out
await redis.set(`blacklist:${token.jti}`, '1', 'EX', 7776000);

// When checking token
const isBlacklisted = await redis.get(`blacklist:${token.jti}`);
if (isBlacklisted) {
  throw new UnauthorizedException();
}
```

### **4. Short Access Token Lifetime**

- **6 hours**: If stolen, limited damage window
- **Auto-refresh**: User doesn't notice the short lifetime
- **Revocable**: Can blacklist refresh token to kill all access

---

## 📱 Real-World Example

Let's say you're a Super Admin working all day:

```
8:00 AM - Login
├─ Access Token expires at 2:00 PM
└─ Refresh Token expires in 90 days

1:55 PM - Still working, token about to expire
├─ Frontend auto-refreshes (you don't notice)
├─ New Access Token expires at 7:55 PM
└─ New Refresh Token expires in 90 days

7:50 PM - Still working
├─ Auto-refresh again
└─ New tokens issued

You log out at 8:00 PM
├─ Refresh token is blacklisted
└─ Cannot be used anymore

Next day 8:00 AM - Login again
├─ Fresh tokens issued
└─ Start the cycle again
```

---

## 🎨 Session vs Token Expiry

There are **TWO** different expiry times:

### **1. Access Token Expiry (Backend)**

- **Duration**: 6 hours (JWT_EXPIRATION_TIME=21600)
- **Enforced by**: Backend JWT verification
- **What happens**: Backend rejects API calls with 401

### **2. Session Expiry (Frontend)**

- **Duration**: 7 days (Remember Me) or 24 hours (No Remember Me)
- **Enforced by**: NextAuth session management
- **What happens**: Frontend clears session and redirects to login

### **How They Work Together**

```
Timeline:
├─ 0h    - Login
├─ 5.9h  - Auto-refresh access token (backend allows it)
├─ 11.9h - Auto-refresh access token (backend allows it)
├─ 17.9h - Auto-refresh access token (backend allows it)
├─ 24h   - Frontend session expires (NO Remember Me)
│          OR
├─ 7d    - Frontend session expires (Remember Me)
└─────────────────────────────────────────────────
           User must log in again
```

---

## 🔄 Refresh Token Best Practices

### ✅ **What Your System Does Right**

1. **HTTP-Only Cookies**: Tokens stored securely, not accessible via JavaScript
2. **Short Access Token**: 6 hours limits damage if stolen
3. **Long Refresh Token**: 90 days for good UX
4. **Auto-Refresh**: At 5 minutes before expiry
5. **Token Rotation**: New refresh token each time (if implemented)
6. **Blacklist Support**: Can revoke tokens via `jti`

### 🚀 **Recommended Improvements**

1. **Refresh Token Rotation** (High Priority)

   ```typescript
   // After successful refresh, blacklist old token
   await redis.set(`blacklist:${oldToken.jti}`, '1', 'EX', 7776000);
   ```

2. **Device Tracking**

   ```typescript
   // Track which device/browser uses each refresh token
   const deviceId = req.headers['user-agent'];
   await redis.set(`refresh:${token.jti}`, deviceId);
   ```

3. **Concurrent Session Limits**

   ```typescript
   // Limit to 3 active sessions per user
   const userSessions = await redis.llen(`sessions:${userId}`);
   if (userSessions >= 3) {
     // Revoke oldest session
   }
   ```

4. **Refresh Token Usage Logging**
   ```typescript
   // Log every refresh attempt for security audit
   await db.auditLog.create({
     userId,
     action: 'REFRESH_TOKEN',
     ip: req.ip,
     timestamp: new Date()
   });
   ```

---

## 🐛 Common Issues & Solutions

### **Issue 1: Token refreshes but user still gets logged out**

**Cause**: Frontend session expiry (24h/7d) happens before refresh token expiry (90d)

**Solution**: Your code handles this correctly:

```typescript
const sessionDuration = token.rememberMe
  ? SESSION_MAX_AGE_REMEMBER // 7 days
  : SESSION_MAX_AGE_DEFAULT; // 24 hours
```

### **Issue 2: Multiple refresh calls at the same time**

**Cause**: Multiple tabs or API calls trigger refresh simultaneously

**Solution**: Implement refresh token locking:

```typescript
const lockKey = `refresh-lock:${userId}`;
const lock = await redis.set(lockKey, '1', 'NX', 'EX', 10);
if (!lock) {
  // Another request is already refreshing, wait
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
```

### **Issue 3: Refresh token expired, no warning to user**

**Cause**: 90 days passed, user surprised by logout

**Solution**: Add warning at 80 days:

```typescript
const refreshTokenAge = now - token.iat;
const daysUntilExpiry = (7776000 - refreshTokenAge) / 86400;

if (daysUntilExpiry < 10) {
  // Show banner: "Your session will expire in X days"
}
```

---

## 📊 Token Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         LOGIN                                │
│  • User enters CID + Password                                │
│  • Backend validates credentials                             │
│  • Backend generates tokens:                                 │
│    - Access Token (6h): For API calls                       │
│    - Refresh Token (90d): For renewal                       │
│  • Frontend stores in HTTP-only cookie                       │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                    ACTIVE SESSION                            │
│  • Every 5 minutes: Check token expiry                       │
│  • Every API call: Send access token                         │
│  • If < 5 min until expiry: Auto-refresh                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                  AUTO-REFRESH (Every 6h)                     │
│  1. Frontend detects: 5 min until access token expiry       │
│  2. POST /auth/refresh-token                                 │
│     Body: { refreshToken }                                   │
│  3. Backend validates:                                       │
│     ✓ Token signature valid?                                │
│     ✓ Token not expired?                                    │
│     ✓ Token not blacklisted?                                │
│     ✓ User still active?                                    │
│  4. Backend generates new tokens                             │
│  5. Frontend updates session                                 │
│  6. User continues working (seamless)                        │
└─────────────────────────────────────────────────────────────┘
                          ↓
              (Repeat for 90 days)
                          ↓
┌─────────────────────────────────────────────────────────────┐
│               REFRESH TOKEN EXPIRES                          │
│  • 90 days have passed                                       │
│  • Cannot refresh anymore                                    │
│  • User must log in again                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Summary

### **Your Token System**

| Token Type           | Lifetime | Purpose            | Renewal                  |
| -------------------- | -------- | ------------------ | ------------------------ |
| **Access Token**     | 6 hours  | API authentication | Via refresh token        |
| **Refresh Token**    | 90 days  | Token renewal      | Must re-login            |
| **Frontend Session** | 24h / 7d | UI state           | Depends on "Remember Me" |

### **Key Points**

1. ✅ **Access tokens are short-lived** (6h) for security
2. ✅ **Refresh tokens are long-lived** (90d) for convenience
3. ✅ **Auto-refresh happens 5 minutes before expiry** (seamless UX)
4. ✅ **Refresh tokens can be revoked** (via blacklist)
5. ✅ **Frontend session respects "Remember Me"** (24h vs 7d)

### **The Magic**

You log in once and can work for **90 days** without re-entering your password, while maintaining security by refreshing the short-lived access token every 6 hours automatically! 🎉

---

**Want to see your tokens in action?**

Open browser DevTools → Application → Cookies → Look for:

- `next-auth.session-token` (contains your access + refresh tokens)

Or decode your JWT at: https://jwt.io/
