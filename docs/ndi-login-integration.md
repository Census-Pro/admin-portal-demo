# NDI Login Integration - Admin Portal

## Overview

This document describes the complete NDI (National Digital Identity) login integration for the Census Admin Portal. The integration allows administrators to authenticate using their Bhutan NDI wallet app instead of traditional username/password.

## Architecture

### Flow Diagram

```
1. User clicks "Login with Bhutan NDI" button
2. Admin Portal → POST /api/auth/ndi/admin-login → Auth Service
3. Auth Service creates proof request with NDI and returns:
   - Thread ID
   - QR Code URL
   - Deep Link URL
4. Admin Portal displays QR code (desktop) or deep link (mobile)
5. Admin Portal opens SSE connection to /api/auth/ndi/stream/:threadId
6. User scans QR code or opens deep link in NDI Wallet app
7. User approves verification in NDI app
8. NDI sends verification result via NATS to Auth Service
9. Auth Service validates admin exists and returns tokens via SSE
10. Admin Portal receives tokens and signs in with NextAuth
11. User is redirected to dashboard
```

## Backend Implementation (Auth Service)

### API Endpoints

#### 1. Create Admin Proof Request

**Endpoint:** `POST /auth/ndi/admin-login`

**Request Body:**

```json
{
  "proofName": "Admin Login - Census System",
  "attributes": ["ID Number", "Full Name"]
}
```

**Response:**

```json
{
  "proofRequestThreadId": "abc123-def456-ghi789",
  "deepLinkURL": "bhutanndi://proof-request?threadId=abc123",
  "proofRequestURL": "https://staging.bhutanndi.com/qr/abc123",
  "accessToken": "eyJraWQiOiJzd3hhdGVQK1...",
  "tokenType": "Bearer"
}
```

#### 2. Stream Verification Status

**Endpoint:** `GET /auth/ndi/stream/:threadId`

**Response Type:** Server-Sent Events (SSE)

**Event Data:**

```json
// Success
{
  "status": "verified",
  "cidNo": "11234567890",
  "loginData": {
    "accessToken": "...",
    "refreshToken": "...",
    "user": {
      "id": "uuid",
      "cidNo": "11234567890",
      "fullName": "John Doe",
      "roles": ["ADMIN"],
      "ability": [...]
    }
  }
}

// Failure
{
  "status": "failed",
  "error": "User not found or not an admin"
}

// Rejected
{
  "status": "rejected"
}

// Timeout
{
  "status": "timeout"
}
```

## Frontend Implementation (Admin Portal)

### Files Created/Modified

#### 1. API Routes

**File:** `src/app/api/auth/ndi/admin-login/route.ts`

- Proxies requests to auth service
- Creates NDI proof request for admin login

**File:** `src/app/api/auth/ndi/stream/[threadId]/route.ts`

- Streams SSE events from auth service to frontend
- Maintains connection until verification completes

#### 2. Components

**File:** `src/components/auth/ndi-login-button.tsx`

- Triggers NDI login flow
- Fetches QR code from backend
- Opens modal with QR code/deep link

**File:** `src/components/auth/ndi-login-modal.tsx`

- Displays QR code for desktop users
- Shows deep link button for mobile users
- Listens to SSE stream for verification status
- Handles authentication with NextAuth when verified
- Shows status messages and loading states

#### 3. Authentication Config

**File:** `src/auth.config.ts`

- Extended credentials provider to accept NDI tokens
- Supports both password and token-based login
- Transforms abilities to permissions format

### Component Usage

```tsx
import { NDILoginButton } from '@/components/auth/ndi-login-button';

<NDILoginButton
  variant="default" // or "outline" | "ghost"
  size="md" // or "sm" | "lg"
  onLoginSuccess={(data) => {
    console.log('Login successful:', data);
  }}
  onLoginError={(error) => {
    console.error('Login failed:', error);
  }}
/>;
```

## Environment Variables

### Admin Portal (.env)

```bash
AUTH_SERVICE=http://localhost:5001
NEXTAUTH_SECRET="your-secret-here"
```

### Auth Service (.env)

```bash
# NDI Configuration
NDI_AUTH_URL=https://staging.bhutanndi.com/authentication/v1/authenticate
NDI_CLIENT_ID=your_client_id
NDI_CLIENT_SECRET=your_client_secret
NDI_VERIFIER_URL=https://staging.bhutanndi.com
NDI_SCHEMA_NAME=Foundational ID
NDI_NATS_URL=nats://staging.bhutanndi.com:4222
NDI_NATS_SEED=your_nkey_seed

# Internal NATS (for multi-pod sync)
NATS_ENABLED=true
NATS_HOST=nats
NATS_PORT=4222
```

## Security Considerations

### Admin Verification

- Only existing admins in the database can log in via NDI
- CID number from NDI is matched against admin records
- Non-admin users receive "User not found or not an admin" error

### Token Handling

- Access tokens are stored in NextAuth session
- Refresh tokens enable automatic token rotation
- Sessions respect "Remember Me" duration settings

### Network Security

- All API calls go through Next.js API routes (proxy pattern)
- Auth service is not directly exposed to frontend
- SSE connections are properly cleaned up on disconnect

## User Experience

### Desktop Flow

1. Click "Login with Bhutan NDI" button
2. QR code appears in modal
3. Open NDI Wallet app on phone
4. Tap scan button
5. Scan QR code
6. Approve verification in app
7. Automatically logged in and redirected

### Mobile Flow

1. Click "Login with Bhutan NDI" button
2. Modal shows "Open NDI Wallet" button
3. Tap button to open NDI Wallet app
4. Approve verification in app
5. Return to browser (automatically logged in)

### Error Handling

- QR code expiration (5 minutes) with refresh button
- Network errors with retry capability
- User rejection with appropriate messaging
- Timeout after 5 minutes with ability to restart

## Testing

### Manual Testing Steps

1. **Desktop Testing:**

   ```bash
   # Start admin portal
   cd admin-portal
   pnpm dev

   # Navigate to login page
   open http://localhost:3000/login
   ```

   - Click "Login with Bhutan NDI"
   - Verify QR code displays
   - Scan with NDI Wallet app
   - Verify successful login

2. **Mobile Testing:**

   - Access login page on mobile device
   - Click "Login with Bhutan NDI"
   - Verify deep link button displays
   - Tap to open NDI Wallet app
   - Verify successful login

3. **Error Testing:**
   - Test with non-admin CID (should fail)
   - Test QR code expiration (wait 5 minutes)
   - Test network errors (disconnect backend)
   - Test user rejection (deny in app)

### API Testing

```bash
# Test proof request creation
curl -X POST http://localhost:3000/api/auth/ndi/admin-login \
  -H "Content-Type: application/json" \
  -d '{"proofName": "Test", "attributes": ["ID Number"]}'

# Test SSE stream
curl -N http://localhost:3000/api/auth/ndi/stream/YOUR_THREAD_ID
```

## Troubleshooting

### QR Code Not Displaying

- Check `AUTH_SERVICE` environment variable
- Verify auth service is running
- Check browser console for errors

### Verification Not Completing

- Check SSE connection in Network tab
- Verify NATS connection in auth service logs
- Check NDI service credentials

### Login Fails After Verification

- Verify user exists in database as admin
- Check user roles and permissions
- Review auth service logs for errors

### Mobile Deep Link Not Working

- Verify NDI Wallet app is installed
- Check deep link URL format
- Test with different browsers

## Future Enhancements

1. **Biometric Options**

   - Add fingerprint/face ID support
   - Implement device trust

2. **Session Management**

   - Show active NDI sessions
   - Allow remote session termination

3. **Audit Logging**

   - Track NDI login attempts
   - Log verification failures

4. **Multi-Factor Authentication**
   - Combine NDI with other factors
   - Require NDI for sensitive actions

## Support

For issues or questions:

- Check auth service logs: `docker logs auth_service`
- Check admin portal logs: browser console
- Review NDI documentation: https://www.youtube.com/@BhutanNDI

## References

- [NDI Service Documentation](../auth_service/NDI_SERVICE_DOCUMENTATION.md)
- [NextAuth Documentation](https://next-auth.js.org/)
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Bhutan NDI](https://bhutanndi.com/)
