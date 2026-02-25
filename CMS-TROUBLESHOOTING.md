# CMS Integration Troubleshooting Guide

## Problem: No data showing in Announcements, Navigation, or Content pages

### Step 1: Check if Common Service is Running

```bash
# Navigate to common_service directory
cd /Users/ngawangdorji/Desktop/Census/common_service

# Start the service
pnpm install
pnpm start:dev
```

**Expected Output:**

```
[Nest] Application successfully started
[Nest] Mapped {/announcement-and-news, GET}
[Nest] Mapped {/cm-navigation, GET}
[Nest] Mapped {/cm-content, GET}
[Nest] Mapped {/cm-media-library, GET}
```

The service should be running on: `http://localhost:5003`

### Step 2: Test API Endpoints Directly

Open your browser or use curl to test:

#### Test Announcements:

```bash
curl http://localhost:5003/announcement-and-news/all
```

#### Test Navigation:

```bash
curl http://localhost:5003/cm-navigation/all
```

#### Test Content:

```bash
curl http://localhost:5003/cm-content/all
```

**Expected Response:**

- Empty array `[]` if no data exists
- Array of objects if data exists
- Error if service is not running

### Step 3: Check Database Connection

The Common Service connects to PostgreSQL. Check your `.env` file in `common_service`:

```bash
DB_TYPE=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=census@123
DB_DATABASE=common_service
```

### Step 4: Run Database Migrations

```bash
cd /Users/ngawangdorji/Desktop/Census/common_service

# Run migrations to create tables
pnpm migration:run

# Or sync the database
pnpm typeorm schema:sync
```

### Step 5: Add Test Data

Since the database is empty, you need to add some test data. Use Swagger UI:

1. Go to: `http://localhost:5003/api/documentation`
2. Click "Authorize" and add your JWT token
3. Create test data:

#### Create a Navigation Item:

```json
POST /cm-navigation
{
  "label": "Home",
  "message": "Homepage navigation",
  "status": "active",
  "created_by_id": "your-admin-id",
  "created_by_name": "Admin User",
  "order": 1
}
```

#### Create an Announcement:

```json
POST /announcement-and-news
{
  "headline": "Welcome to Census Portal",
  "message": "This is a test announcement",
  "status": "active",
  "created_by_id": "your-admin-id",
  "created_by_name": "Admin User"
}
```

#### Create Content Page:

```json
POST /cm-content
{
  "slug": "about-us",
  "title": "About Us",
  "body": "<h1>About Our Organization</h1>",
  "status": "published",
  "updated_by_id": "your-admin-id",
  "updated_by_name": "Admin User",
  "order": 1
}
```

### Step 6: Check Admin Portal Environment

In `admin-portal/.env.local`:

```bash
COMMON_SERVICE_URL=http://localhost:5003
```

### Step 7: Check Browser Console

1. Open Admin Portal: `http://localhost:3000`
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Navigate to `/dashboard/content/announcements`
5. Look for errors like:
   - `Failed to fetch` - Common Service not running
   - `401 Unauthorized` - Authentication issue
   - `404 Not Found` - Wrong URL

### Step 8: Check Network Tab

1. Open Browser DevTools → Network tab
2. Refresh the page
3. Look for requests to:
   - `http://localhost:5003/announcement-and-news/all`
   - `http://localhost:5003/cm-navigation/all`
   - `http://localhost:5003/cm-content/all`

Check the response:

- **Status 200** ✅ - Success
- **Status 500** ❌ - Server error
- **Status 401** ❌ - Not authenticated
- **Failed** ❌ - Service not running

### Step 9: Common Issues & Solutions

#### Issue 1: CORS Error

**Solution:** Add CORS configuration in Common Service `main.ts`:

```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true
});
```

#### Issue 2: Empty Array Response

**Solution:** Database is empty. Add test data using Swagger UI.

#### Issue 3: 401 Unauthorized

**Solution:** Make sure you're logged in to the admin portal and the JWT token is valid.

#### Issue 4: Port Already in Use

**Solution:**

```bash
# Kill process on port 5003
lsof -ti:5003 | xargs kill -9

# Then restart the service
pnpm start:dev
```

### Step 10: Quick Test Script

Create a file `test-cms-api.sh` in your common_service directory:

```bash
#!/bin/bash

echo "Testing Common Service CMS APIs..."
echo ""

echo "1. Testing Announcements API..."
curl -s http://localhost:5003/announcement-and-news/all | jq '.'
echo ""

echo "2. Testing Navigation API..."
curl -s http://localhost:5003/cm-navigation/all | jq '.'
echo ""

echo "3. Testing Content API..."
curl -s http://localhost:5003/cm-content/all | jq '.'
echo ""

echo "4. Testing Media Library API..."
curl -s http://localhost:5003/cm-media-library/all | jq '.'
echo ""

echo "Done!"
```

Run it:

```bash
chmod +x test-cms-api.sh
./test-cms-api.sh
```

---

## Quick Checklist

- [ ] Common Service is running on port 5003
- [ ] Database is connected and migrations ran
- [ ] Test data exists in the database
- [ ] Admin portal .env.local has COMMON_SERVICE_URL=http://localhost:5003
- [ ] You're logged in to the admin portal
- [ ] No CORS errors in browser console
- [ ] API endpoints return 200 status

---

## Still Not Working?

Share the following information:

1. **Browser Console Errors** (F12 → Console)
2. **Network Tab Response** (F12 → Network)
3. **Common Service Logs** (terminal output)
4. **Common Service Status**:
   ```bash
   curl http://localhost:5003/health
   ```

---

## Expected Behavior

Once everything is working:

1. Navigate to `/dashboard/content/announcements`
2. Click "Add Announcement"
3. Fill in the form and submit
4. The announcement should appear in the table
5. You can edit and delete it

Same for Navigation and Content pages.
