# NDI Login Quick Test Guide

## Prerequisites

- Auth service running on port 5001
- Admin portal running on port 3000
- Admin user exists in database with valid CID
- NDI Wallet app installed on mobile device

## Quick Test

### 1. Start Services

```bash
# Terminal 1 - Auth Service
cd auth_service
pnpm dev

# Terminal 2 - Admin Portal
cd admin-portal
pnpm dev
```

### 2. Test Desktop Flow

1. Open http://localhost:3000/login
2. Click "Login with Bhutan NDI" button
3. Observe modal opens with QR code
4. Check browser console for:
   ```
   📱 NDI Proof Request created: {...}
   🔌 Connecting to SSE stream for threadId: xxx
   ```
5. Scan QR code with NDI Wallet app
6. Approve verification
7. Watch for console messages:
   ```
   📨 SSE message received: {status: "verified", ...}
   ✅ Login successful via NDI
   ```
8. Verify redirect to dashboard

### 3. Test Mobile Flow

1. Open http://localhost:3000/login on mobile
2. Click "Login with Bhutan NDI" button
3. Tap "Open NDI Wallet" button
4. Approve verification in app
5. Return to browser - should be logged in

### 4. Test Error Cases

#### Non-Admin User

- Use CID that's not in admin table
- Should see: "User not found or not an admin"

#### Rejection

- Click "Login with Bhutan NDI"
- Reject verification in app
- Should see: "Verification was rejected"

#### Timeout

- Click "Login with Bhutan NDI"
- Wait 5 minutes without scanning
- Should see: "Verification timed out"

#### QR Expiration

- Click "Login with Bhutan NDI"
- Wait for QR to expire (if implemented)
- Click "Refresh" button
- Should get new QR code

## Debugging

### Check API Endpoints

```bash
# Test proof request creation
curl -X POST http://localhost:3000/api/auth/ndi/admin-login \
  -H "Content-Type: application/json" \
  -d '{
    "proofName": "Test Admin Login",
    "attributes": ["ID Number", "Full Name"]
  }'

# Expected response:
# {
#   "proofRequestThreadId": "xxx",
#   "deepLinkURL": "bhutanndi://...",
#   "proofRequestURL": "https://...",
#   "accessToken": "...",
#   "tokenType": "Bearer"
# }
```

### Check SSE Stream

```bash
# Replace THREAD_ID with actual thread ID from above
curl -N http://localhost:3000/api/auth/ndi/stream/THREAD_ID

# Should keep connection open
# Will show messages when verification happens
```

### Check Browser Network Tab

1. Open DevTools → Network tab
2. Click "Login with Bhutan NDI"
3. Look for:
   - `admin-login` (fetch) - should return 200
   - `stream/xxx` (eventsource) - should stay pending
4. After scanning:
   - `stream/xxx` should show "data:" messages
   - Final message should have status: "verified"

### Check Console Logs

**Auth Service:**

```bash
# Should see:
✅ Connected to internal NATS for multi-pod synchronization
Extracted ThreadId: xxx
🔌 [streamNdiStatus] Client connected to SSE stream for thread: xxx
```

**Admin Portal:**

```bash
# Should see:
📱 NDI Proof Request created: {...}
🔌 Connecting to SSE stream for threadId: xxx
📨 SSE message received: {status: "verified", ...}
✅ Login successful via NDI
```

## Common Issues

### Issue: QR Code Not Displaying

**Solution:**

- Check `AUTH_SERVICE` in `.env` is correct
- Verify auth service is running
- Check console for error messages

### Issue: SSE Connection Fails

**Solution:**

- Check Network tab for 404 on stream endpoint
- Verify thread ID is being passed correctly
- Check auth service logs

### Issue: Verification Completes but No Login

**Solution:**

- Check user exists in database
- Verify user has admin role
- Check NextAuth configuration
- Review session/JWT handling

### Issue: Deep Link Doesn't Work

**Solution:**

- Verify NDI Wallet app is installed
- Try different mobile browser
- Check deep link URL format in console

## Success Criteria

✅ QR code displays in modal  
✅ SSE connection establishes  
✅ Can scan QR code with NDI app  
✅ Verification message received  
✅ NextAuth session created  
✅ Redirect to dashboard works  
✅ User info displayed correctly  
✅ Permissions loaded properly

## Next Steps

After successful testing:

1. Test with multiple admin users
2. Test concurrent logins
3. Test session persistence
4. Test logout and re-login
5. Test permission-based access to features
6. Deploy to staging environment
7. Test with real NDI staging/production URLs

## Need Help?

- Review logs in both services
- Check documentation: `docs/ndi-login-integration.md`
- Review NDI service code: `auth_service/src/modules/auth/ndi.service.ts`
- Check similar implementation for user login (non-admin)
