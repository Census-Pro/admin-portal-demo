# 🚀 Quick Start Guide - CMS Real-Time Synchronization

## ⚡ 5-Minute Setup

### Step 1: Configure Environment Variables

#### Admin Portal

Create or update `/admin-portal/.env`:

```bash
COMMON_SERVICE_URL=http://localhost:5003
CLIENT_PORTAL_URL=http://localhost:3001
REVALIDATE_SECRET=census-revalidate-secret-2026
```

#### Client Portal

Create or update `/client-portal/.env`:

```bash
COMMON_SERVICE_URL=http://localhost:5003
NEXT_PUBLIC_COMMON_SERVICE_URL=http://localhost:5003
REVALIDATE_SECRET=census-revalidate-secret-2026
```

### Step 2: Start Services

```bash
# Terminal 1: Common Service (Backend)
cd common_service
pnpm start:dev

# Terminal 2: Admin Portal
cd admin-portal
pnpm dev

# Terminal 3: Client Portal
cd client-portal
pnpm dev
```

### Step 3: Test Synchronization

1. **Open Client Portal**: http://localhost:3001
2. **Note announcements** on homepage
3. **Open Admin Portal**: http://localhost:3000/dashboard/content/announcements
4. **Create new announcement**:
   - Headline: "Test Synchronization"
   - Message: "This is a test"
   - Status: Active
   - Click Save
5. **Refresh Client Portal** homepage
6. **✅ New announcement should appear immediately!**

---

## 🧪 Quick Tests

### Test 1: Announcements

```bash
# Admin: Create announcement
# Client: Refresh homepage → See new announcement
```

### Test 2: Navigation

```bash
# Admin: Edit navigation label
# Client: Refresh any page → See updated navigation
```

### Test 3: Direct Revalidation

```bash
curl -X POST http://localhost:3001/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: census-revalidate-secret-2026" \
  -d '{"type": "all"}'

# Response: {"success":true,"message":"Revalidated: ALL",...}
```

---

## 🐛 Troubleshooting

### Not seeing changes?

**Check 1: Environment variables loaded**

```bash
# In Client Portal terminal, check:
echo $REVALIDATE_SECRET

# Should output: census-revalidate-secret-2026
```

**Check 2: Revalidation endpoint working**

```bash
curl http://localhost:3001/api/revalidate

# Should return: {"message":"Revalidation endpoint is active",...}
```

**Check 3: Console logs**

- Admin Portal console: Look for `[revalidateClientPortal]` logs
- Client Portal console: Look for `[Revalidate]` logs

### 401 Unauthorized?

- Secret mismatch! Ensure both `.env` files have identical `REVALIDATE_SECRET`

### Still not working?

- Restart both portals after changing `.env`
- Clear browser cache
- Check Common Service is running on port 5003

---

## 📚 Full Documentation

For detailed information, see:

- **CMS_REALTIME_SYNC.md** - Complete implementation guide
- **CMS_SYNC_IMPLEMENTATION.md** - Implementation summary
- **CONTENT_MANAGEMENT_FLOW.md** - CMS architecture overview

---

**Ready to go!** Any content you create/edit/delete in the Admin Portal will instantly sync to the Client Portal. No manual steps required! 🎉
