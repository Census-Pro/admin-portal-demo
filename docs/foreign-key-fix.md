# Quick Fix: Foreign Key Constraint Violation

## The Error

```
error: insert or update on table "cm_content" violates foreign key constraint "FK_af5797f09222faf322cc3ae9cfb"
```

## What This Means

You're trying to create/update a content page with a reference (foreign key) to a record that doesn't exist in another table.

## Common Causes

### 1. Navigation ID doesn't exist

```json
{
  "cms_navigation_id": "123e4567-e89b-12d3-a456-426614174000" // ← This ID doesn't exist
}
```

**Fix**:

- Create the navigation item first at `/dashboard/content/navigation`
- Or set to `null` if optional: `"cms_navigation_id": null`

### 2. Featured Image ID doesn't exist

```json
{
  "featured_image_id": "123e4567-e89b-12d3-a456-426614174001" // ← This ID doesn't exist
}
```

**Fix**:

- Upload the image first at `/dashboard/content/media`
- Or set to `null` if optional: `"featured_image_id": null`

### 3. Empty String vs Null

```json
{
  "cms_navigation_id": "" // ← WRONG! Empty string violates FK constraint
}
```

**Fix**: Use `null` for optional foreign keys:

```json
{
  "cms_navigation_id": null // ← CORRECT!
}
```

## The Solution (Already Implemented)

We've updated the code to automatically handle this:

```typescript
// Automatically converts empty strings and "none" to null
cms_navigation_id: value && value !== 'none' ? value : null,
featured_image_id: value && value !== 'none' ? value : null
```

## How to Verify the Fix Works

### Test 1: Create Page Without Navigation Link

1. Go to `/dashboard/content/pages`
2. Click "Add Page"
3. Fill in Title and Slug
4. Leave "Nav Link" as "None"
5. Submit ✅ Should work!

### Test 2: Create Page Without Featured Image

1. Click "Add Page"
2. Fill in required fields
3. Leave "Featured Image" as "None"
4. Submit ✅ Should work!

### Test 3: Create Page With Valid References

1. First, create a navigation item at `/dashboard/content/navigation`
2. Then, create a content page and select that navigation item
3. Submit ✅ Should work!

## User-Friendly Error Messages

If you still get an error, you'll now see helpful messages:

- ❌ "The selected navigation item does not exist. Please refresh and try again."
- ❌ "The selected featured image does not exist. Please refresh and try again."
- ❌ "Invalid reference data. Please check your selections and try again."

Instead of the cryptic database error.

## Still Having Issues?

### Check the Database

```sql
-- Verify navigation item exists
SELECT id, label FROM cm_navigation WHERE id = 'your-uuid-here';

-- Verify media item exists
SELECT id, file_name FROM cm_media_library WHERE id = 'your-uuid-here';
```

### Check Browser Console

Look for logs like:

```
[createCmsPage] Payload: { cms_navigation_id: null, ... }
[createCmsPage] Error response: { message: "..." }
```

### Refresh the Page

Sometimes the dropdown data is stale. Refresh the browser to load latest navigation items and media files.

## Summary

✅ **Fixed**: Empty strings now convert to `null` automatically  
✅ **Fixed**: Better error messages for FK violations  
✅ **Fixed**: Proper handling of "None" selections in dropdowns  
✅ **Fixed**: Both create and update operations

🎉 You can now create content pages without worrying about foreign key constraints!
