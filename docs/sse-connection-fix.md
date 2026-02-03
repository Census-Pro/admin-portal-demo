# SSE Connection Error - Quick Fix

## The Issue

The SSE (Server-Sent Events) connection is failing. This could be due to:

1. Next.js 15+ requires `params` to be awaited
2. Auth service SSE endpoint not accessible
3. CORS or connection issues

## What I Fixed

Updated `/api/auth/ndi/stream/[threadId]/route.ts` to:

- ✅ Await the `params` object (Next.js 15+ requirement)
- ✅ Add detailed logging
- ✅ Better error handling

## Test the Fix

**1. Restart your dev server** (required for API route changes):

```bash
# In admin-portal terminal, press Ctrl+C, then:
pnpm dev
```

**2. Try the login flow again:**

- Go to http://localhost:3000/login
- Click "Login with Bhutan NDI"
- Check the terminal for SSE logs

## Expected Terminal Output

**Admin Portal terminal should show:**

```
🔌 [SSE Stream] Client connecting for threadId: xxx-xxx-xxx
🔌 [SSE Stream] Backend URL: http://localhost:5001/auth/ndi/stream/xxx-xxx-xxx
🔌 [SSE Stream] Connecting to backend...
🔌 [SSE Stream] Backend response status: 200
✅ [SSE Stream] Connected, streaming data...
```

**Auth Service terminal should show:**

```
🔌 [streamNdiStatus] Client connected to SSE stream for thread: xxx-xxx-xxx
```

## Debugging Steps

### 1. Test Auth Service SSE Endpoint Directly

```bash
# Replace THREAD_ID with your actual thread ID from the QR code response
curl -N http://localhost:5001/auth/ndi/stream/THREAD_ID

# Should keep connection open
# Press Ctrl+C to stop
```

### 2. Check Browser DevTools

**Network Tab:**

1. Filter by "stream"
2. Should see: `stream/[threadId]` with type "eventsource"
3. Status should be "pending" (not "failed")

**Console:**
Look for SSE logs:

```
🔌 Connecting to SSE stream for threadId: xxx
```

### 3. Check for CORS Issues

If you see CORS errors, the auth service needs to allow SSE:

**In auth_service, check if CORS is configured:**

```typescript
// src/main.ts should have:
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true
});
```

## Common Issues

### Issue 1: "Failed to connect to verification stream"

**Cause:** Auth service not running or wrong port

**Fix:**

```bash
cd auth_service
pnpm dev
# Should be on port 5001
```

### Issue 2: Connection closes immediately

**Cause:** SSE endpoint not returning proper headers

**Check auth service logs** for errors in `streamNdiStatus` controller

### Issue 3: "Stream not available"

**Cause:** Backend response doesn't have a readable body

**This is rare but check auth service logs**

## Test Without Scanning QR

To test the SSE connection without NDI app:

```bash
# Terminal 1: Auth service
cd auth_service
pnpm dev

# Terminal 2: Create proof request and get thread ID
curl -X POST http://localhost:5001/auth/ndi/admin-login \
  -H "Content-Type: application/json" \
  -d '{"proofName":"Test","attributes":["ID Number"]}' | jq .proofRequestThreadId

# Copy the thread ID, then test SSE:
curl -N http://localhost:5001/auth/ndi/stream/YOUR_THREAD_ID

# Should keep connection open for 5 minutes (timeout)
```

## Alternative: Use Regular Polling Instead of SSE

If SSE continues to fail, we can switch to polling. Let me know if you need this fallback.

## After Restart

1. Clear browser cache (Ctrl+Shift+R)
2. Open DevTools → Console
3. Click "Login with Bhutan NDI"
4. Watch for detailed SSE logs

## Still Having Issues?

Share:

1. Admin portal terminal output
2. Auth service terminal output
3. Browser console output
4. Network tab screenshot of the stream request

I'll help debug further!
