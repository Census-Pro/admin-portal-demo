# Troubleshooting: Sub-Link Not Saving to Database

## 🔍 Issue: Content Page Not Being Saved When Adding Sub-Link

If you're experiencing issues where clicking "Add Sub-Link" and filling the form doesn't save the content page to the database, follow this troubleshooting guide.

---

## ✅ Step 1: Check Browser Console

### Open Browser Developer Tools

1. Press `F12` or `Right-click → Inspect`
2. Go to **Console** tab
3. Try adding a sub-link again
4. Look for these logs:

```javascript
// Expected logs when adding sub-link:
[handleSavePage] Data to save: { ... }
[handleSavePage] preSelectedNavId: <uuid-string>
[createCmsPage] Payload: { ... }
[handleSavePage] Create result: { success: true, ... }
```

### Common Console Errors:

#### ❌ Error 1: `cms_navigation_id is undefined`

```javascript
[handleSavePage] preSelectedNavId: undefined
```

**Cause:** The navigation ID wasn't passed correctly  
**Solution:** Check that you clicked "View Sub-Links" → "Add Sub-Link" (not "Add Page" directly)

---

#### ❌ Error 2: `Foreign key constraint violation`

```javascript
[createCmsPage] Error response: { message: "violates foreign key constraint" }
```

**Cause:** The navigation ID doesn't exist in the database  
**Solution:**

1. Refresh the page
2. Verify the navigation item exists
3. Try again

---

#### ❌ Error 3: `Network Error` or `Failed to fetch`

```javascript
[createCmsPage] Error: Failed to fetch
```

**Cause:** Common Service is not running or unreachable  
**Solution:**

1. Check if Common Service is running on port 5003
2. Verify: `http://localhost:5003/api/health` (should return OK)
3. Restart Common Service if needed

---

## ✅ Step 2: Check Network Tab

### Open Network Tab

1. Developer Tools → **Network** tab
2. Filter by `Fetch/XHR`
3. Try adding a sub-link again
4. Look for a request to `/cm-content`

### Check the Request:

#### Request URL:

```
POST http://localhost:5003/api/cm-content
```

#### Request Payload (should include):

```json
{
  "title": "Your Title",
  "slug": "your-slug",
  "body": "<h1>Your content</h1>",
  "status": "published",
  "order": 1,
  "cms_navigation_id": "<uuid-of-navigation-item>", // ← This MUST be present!
  "featured_image_id": null,
  "updated_by_id": "<user-uuid>",
  "updated_by_name": "Admin User"
}
```

#### Response Status:

- **201 Created** ✅ → Success
- **400 Bad Request** ❌ → Validation error
- **404 Not Found** ❌ → Endpoint not found (Common Service issue)
- **500 Server Error** ❌ → Database or server error

---

## ✅ Step 3: Verify Services Are Running

### Check Admin Portal (Port 3000):

```bash
# Should see the app running
curl http://localhost:3000
```

### Check Common Service (Port 5003):

```bash
# Should return health status
curl http://localhost:5003/api/health
```

### Check Auth Service (Port 5001):

```bash
# Should return health status
curl http://localhost:5001/api/health
```

If any service is down:

```bash
# Navigate to the service directory and run:
npm run dev
# or
pnpm dev
```

---

## ✅ Step 4: Check Database Connection

### Verify Common Service Database Connection:

1. Check Common Service logs for database connection errors
2. Look for messages like:
   ```
   ✓ Database connected successfully
   ```
   or
   ```
   ✗ Database connection failed
   ```

### Test Database Query:

Run this query in your PostgreSQL client:

```sql
-- Check if cm_navigation table exists
SELECT * FROM cm_navigation LIMIT 1;

-- Check if cm_content table exists
SELECT * FROM cm_content LIMIT 1;

-- Verify the navigation item exists
SELECT id, label FROM cm_navigation WHERE status = 'active';
```

---

## ✅ Step 5: Verify Form Data

### Check if all required fields are filled:

When filling the "Add Page" form, ensure:

- ✅ **Title** is not empty
- ✅ **Slug** is not empty (no spaces, use hyphens)
- ✅ **Body** has content (can be empty but field exists)
- ✅ **Status** is selected (Draft or Published)
- ✅ **Order** is a number (default: 1)
- ✅ **Nav Link** should show the parent navigation item's name

---

## ✅ Step 6: Check Pre-Selected Navigation ID

### Debug the preSelectedNavId:

The issue might be that `preSelectedNavId` is not being set correctly.

**Expected Flow:**

1. Click "View Sub-Links" on "About Us"

   - `selectedNavForSubLinks` = Navigation object
   - `subLinksOpen` = true

2. Click "Add Sub-Link"

   - `handleAddSubLink(navigationId)` is called
   - `preSelectedNavId` = `navigationId` (UUID string)
   - `pageDialogOpen` = true

3. PageDialog opens with:
   - `preSelectedNavigationId` prop = `preSelectedNavId`
   - Form initializes with `cms_navigation_id: preSelectedNavigationId`

**To verify:**

Add this temporary console log in the PageDialog component:

```tsx
// In page-dialog.tsx, inside the useEffect that sets formData:
console.log('[PageDialog] preSelectedNavigationId:', preSelectedNavigationId);
console.log(
  '[PageDialog] formData.cms_navigation_id:',
  formData.cms_navigation_id
);
```

You should see the UUID value for both.

---

## ✅ Step 7: Check Common Service Endpoint

### Verify the `/cm-content` endpoint exists:

1. Go to Common Service code
2. Check file: `src/modules/cm-content/cm-content.controller.ts`
3. Verify there's a POST endpoint:

```typescript
@Post()
async create(@Body() createDto: CreateCmContentDto) {
  return this.cmContentService.create(createDto);
}
```

### Test the endpoint directly with curl:

```bash
curl -X POST http://localhost:5003/api/cm-content \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Page",
    "slug": "test-page",
    "body": "<h1>Test</h1>",
    "status": "draft",
    "order": 1,
    "cms_navigation_id": "YOUR_NAVIGATION_UUID_HERE",
    "updated_by_name": "Test User"
  }'
```

**Expected Response:**

```json
{
  "id": "new-uuid",
  "title": "Test Page",
  "slug": "test-page",
  ...
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Nothing happens when I click Save"

**Possible Causes:**

- Form validation failed
- JavaScript error in console
- Event handler not attached

**Solution:**

1. Check browser console for errors
2. Verify all required fields are filled
3. Check Network tab to see if request was sent

---

### Issue 2: "Page saves but doesn't appear under navigation"

**Possible Causes:**

- `cms_navigation_id` is NULL in database
- Sub-links dialog not refreshing

**Solution:**

1. Check database: `SELECT cms_navigation_id FROM cm_content WHERE slug = 'your-slug';`
2. If NULL, the navigation ID wasn't saved
3. Close and reopen the Sub-Links dialog

---

### Issue 3: "Error: Navigation item does not exist"

**Possible Causes:**

- Navigation item was deleted
- Wrong UUID being passed

**Solution:**

1. Refresh the page
2. Go to Navigation page and verify the item exists
3. Try again from the beginning

---

### Issue 4: "Duplicate key error on slug"

**Error Message:**

```
duplicate key value violates unique constraint "UQ_cm_content_slug"
```

**Solution:**
Change the slug to something unique (slugs must be unique across all pages)

---

## 🔧 Quick Debugging Commands

### Check if data reached the database:

```sql
-- Get all content pages (should show your new page)
SELECT id, title, slug, cms_navigation_id, status
FROM cm_content
ORDER BY created_at DESC
LIMIT 10;

-- Get content pages for specific navigation
SELECT
  cn.label as nav_label,
  cc.title as page_title,
  cc.slug,
  cc.created_at
FROM cm_content cc
JOIN cm_navigation cn ON cc.cms_navigation_id = cn.id
WHERE cn.label = 'About Us';

-- Check if ANY pages exist
SELECT COUNT(*) as total_pages FROM cm_content;
```

---

## 📋 Debugging Checklist

Run through this checklist:

- [ ] Browser console shows no errors
- [ ] Network tab shows POST request to `/cm-content`
- [ ] Request payload includes `cms_navigation_id` with a UUID value
- [ ] Response status is 200/201 (success)
- [ ] All services (Admin Portal, Common Service, Auth) are running
- [ ] Database tables `cm_navigation` and `cm_content` exist
- [ ] Navigation item exists in database
- [ ] Form has all required fields filled
- [ ] `preSelectedNavId` is not undefined in console logs

---

## 🆘 Still Not Working?

If you've tried all the above and it's still not working:

### 1. Share Console Logs:

Copy all logs from the browser console when trying to add a sub-link

### 2. Share Network Request:

- Open Network tab
- Find the `/cm-content` request
- Copy the Request Payload and Response

### 3. Share Database Query Result:

```sql
SELECT * FROM cm_navigation WHERE status = 'active';
SELECT * FROM cm_content ORDER BY created_at DESC LIMIT 5;
```

### 4. Check Common Service Logs:

Look for any errors in the Common Service terminal when you try to save

---

## ✅ Expected Successful Flow

When everything works correctly, you should see:

### Console Output:

```
[handleSavePage] Data to save: {
  title: "About Census 2026",
  slug: "about-census-2026",
  body: "<h1>About Census 2026</h1>...",
  status: "published",
  order: 1,
  cms_navigation_id: "abc-123-def-456",
  featured_image_id: null,
  updated_by_name: "Admin User"
}
[handleSavePage] preSelectedNavId: abc-123-def-456
[createCmsPage] Payload: { ... }
[handleSavePage] Create result: { success: true, message: "Page created successfully" }
```

### Network Tab:

```
POST http://localhost:5003/api/cm-content
Status: 201 Created
```

### Database:

```sql
-- New record in cm_content table
SELECT * FROM cm_content WHERE slug = 'about-census-2026';
```

### UI:

- ✅ Success toast appears: "Page created successfully"
- ✅ Dialog closes automatically
- ✅ Sub-links dialog refreshes and shows the new page
- ✅ Page appears in the sub-links list

---

Good luck debugging! 🚀
