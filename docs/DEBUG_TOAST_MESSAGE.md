# Debug Guide: Toast Message Appearing Too Fast

## 🔧 What I Changed

I've updated the code to help you debug the issue where the toast message appears too fast to read.

### Changes Made:

#### 1. **Extended Toast Duration** ⏱️

- Success messages: **5 seconds** (was instant)
- Error messages: **10 seconds** (was instant)

#### 2. **Enhanced Console Logging** 📝

Added detailed console logs with visual separators:

```
═══════════════════════════════════════════════
[handleSavePage] 🚀 Starting save process...
[handleSavePage] Form data received: { ... }
[handleSavePage] preSelectedNavId: <uuid>
[handleSavePage] Final data to save: { ... }
═══════════════════════════════════════════════
```

#### 3. **Better Error Visibility** 🔍

- Errors now show in toast for 10 seconds
- Full error details logged to console
- Exception stack traces captured

---

## 🔍 How to Debug Now

### Step 1: Open Browser Console

1. Press `F12`
2. Go to **Console** tab
3. Clear the console (right-click → Clear console)

### Step 2: Try Adding a Sub-Link

1. Go to Navigation page
2. Click "View Sub-Links" on a navigation item
3. Click "Add Sub-Link"
4. Fill in the form
5. Click "Save"

### Step 3: Check Console Output

You should see detailed logs like this:

#### ✅ **Success Case:**

```javascript
═══════════════════════════════════════════════
[PageDialog] 📝 Form submitted
[PageDialog] Current form data: {
  title: "About Census 2026",
  slug: "about-census-2026",
  body: "<h1>About...</h1>",
  status: "published",
  order: 1,
  cms_navigation_id: "abc-123-def-456"
}
[PageDialog] preSelectedNavigationId: "abc-123-def-456"
═══════════════════════════════════════════════
═══════════════════════════════════════════════
[handleSavePage] 🚀 Starting save process...
[handleSavePage] Form data received: { ... }
[handleSavePage] preSelectedNavId: abc-123-def-456
[handleSavePage] Final data to save: {
  title: "About Census 2026",
  slug: "about-census-2026",
  body: "<h1>About...</h1>",
  status: "published",
  order: 1,
  cms_navigation_id: "abc-123-def-456",  // ← Should have a UUID value!
  featured_image_id: null,
  updated_by_name: "Admin User"
}
[handleSavePage] Is editing? false
═══════════════════════════════════════════════
[handleSavePage] ➕ Creating new page...
[createCmsPage] Payload: { ... }
[handleSavePage] ✅ Create result: {
  success: true,
  message: "Page created successfully",
  data: { id: "...", title: "...", ... }
}
[handleSavePage] ✅ SUCCESS: Page created successfully
[handleSavePage] Created page data: { ... }
```

**Toast shows:** "Page created successfully" (stays for 5 seconds)

---

#### ❌ **Error Case Example 1: Missing Navigation ID**

```javascript
[handleSavePage] preSelectedNavId: undefined
[handleSavePage] Final data to save: {
  ...
  cms_navigation_id: undefined  // ← PROBLEM!
}
[createCmsPage] Error response: {
  message: "cms_navigation_id must be a UUID"
}
[handleSavePage] ❌ ERROR: Failed to create page
```

**Toast shows:** "Failed to create page" (stays for 10 seconds)

---

#### ❌ **Error Case Example 2: Foreign Key Violation**

```javascript
[createCmsPage] Error response: {
  message: "insert or update on table \"cm_content\" violates foreign key constraint"
}
[handleSavePage] ❌ ERROR: The selected navigation item does not exist. Please refresh and try again.
```

**Toast shows:** "The selected navigation item does not exist..." (stays for 10 seconds)

---

#### ❌ **Error Case Example 3: Network Error**

```javascript
[createCmsPage] Error: Failed to fetch
[handleSavePage] ❌ EXCEPTION: Failed to fetch
```

**Toast shows:** "An error occurred: Failed to fetch" (stays for 10 seconds)

---

## 📋 What to Look For

### Check These in Console:

1. **Is `preSelectedNavId` defined?**

   ```javascript
   [handleSavePage] preSelectedNavId: "abc-123-def-456"  // ✅ Good
   [handleSavePage] preSelectedNavId: undefined          // ❌ Bad
   ```

2. **Does `cms_navigation_id` have a value in the final data?**

   ```javascript
   cms_navigation_id: 'abc-123-def-456'; // ✅ Good
   cms_navigation_id: undefined; // ❌ Bad
   cms_navigation_id: null; // ⚠️ OK for standalone pages only
   ```

3. **What does the result say?**

   ```javascript
   result: { success: true, ... }   // ✅ Good
   result: { success: false, ... }  // ❌ Bad
   ```

4. **Is there a network request?**
   - Check Network tab for POST to `/cm-content`
   - If no request appears, the function might not be called

---

## 🎯 Common Issues & Solutions

### Issue 1: Toast Shows Success but Nothing in Database

**Console will show:**

```javascript
[handleSavePage] ✅ SUCCESS: Page created successfully
[handleSavePage] Created page data: { id: "...", ... }
```

**But:**

- Database query returns no results
- Sub-links list doesn't refresh

**Solution:**

1. Check if `fetchData()` is being called
2. Verify the database connection
3. Check if the page exists: `SELECT * FROM cm_content ORDER BY created_at DESC LIMIT 1;`

---

### Issue 2: `preSelectedNavId` is Undefined

**Console will show:**

```javascript
[handleSavePage] preSelectedNavId: undefined
```

**Cause:**

- Didn't click "View Sub-Links" → "Add Sub-Link"
- State was reset
- Navigation ID wasn't passed correctly

**Solution:**

1. Make sure you click "View Sub-Links" first
2. Then click "Add Sub-Link" (not "Add Page" button elsewhere)
3. Refresh the page and try again

---

### Issue 3: Error Message but Console is Clean

**If toast shows error but console has no error logs:**

**Possible causes:**

- Response is cached
- Service returned 200 but with error flag
- JavaScript error before logging

**Solution:**

1. Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)
2. Clear browser cache
3. Check Network tab → Response payload

---

## 🧪 Test Checklist

After the updates, try this:

- [ ] Open browser console
- [ ] Clear console
- [ ] Go to Navigation page
- [ ] Click "View Sub-Links" on "About Us"
- [ ] Click "Add Sub-Link"
- [ ] Fill in the form:
  - Title: `Test Page`
  - Slug: `test-page`
  - Body: `<h1>Test</h1>`
  - Status: `Published`
- [ ] Click "Save"
- [ ] **Wait and watch:**
  - [ ] Console logs appear (with visual separators)
  - [ ] Toast message appears (stays for 5-10 seconds)
  - [ ] Dialog closes (if success)
- [ ] **Take a screenshot of:**
  - [ ] Console output
  - [ ] Network tab (POST to /cm-content)
  - [ ] Toast message

---

## 📸 Share These Screenshots

If it's still not working, share screenshots of:

### 1. Console Output

Full console logs from the moment you click "Save"

### 2. Network Tab

- Request URL: `POST http://localhost:5003/api/cm-content`
- Request Headers
- Request Payload
- Response Headers
- Response Body

### 3. Toast Message

Take a screenshot when the toast appears (it now stays for 5-10 seconds)

### 4. Database Query

```sql
-- Run this in your PostgreSQL client
SELECT
  id,
  title,
  slug,
  cms_navigation_id,
  status,
  created_at
FROM cm_content
ORDER BY created_at DESC
LIMIT 5;
```

---

## 🎉 Expected Success Output

When everything works correctly:

### Console:

```javascript
═══════════════════════════════════════════════
[PageDialog] 📝 Form submitted
═══════════════════════════════════════════════
═══════════════════════════════════════════════
[handleSavePage] 🚀 Starting save process...
[handleSavePage] ➕ Creating new page...
[createCmsPage] Payload: { ... }
[handleSavePage] ✅ Create result: { success: true }
[handleSavePage] ✅ SUCCESS: Page created successfully
```

### Toast:

🎉 **"Page created successfully"** (green, visible for 5 seconds)

### UI:

- Dialog closes
- Sub-links list refreshes
- New page appears in the list

### Database:

```sql
SELECT * FROM cm_content WHERE slug = 'test-page';
-- Returns 1 row with all your data
```

---

Now try again and let me know what you see in the console! 🚀
