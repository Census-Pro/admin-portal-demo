# CM Content (Content Pages) Integration Guide

## Overview

This document explains the integration of the Content Management System (CMS) for content pages in the admin portal, including the API integration and foreign key constraint fix.

## API Endpoint

- **URL**: `POST /cm-content`
- **Service**: Common Service (Port 5003)
- **Base URL**: `http://localhost:5003` (development)

## Request Schema

```json
{
  "cms_navigation_id": "uuid or null",
  "slug": "string",
  "title": "string",
  "body": "string (HTML content)",
  "featured_image_id": "uuid or null",
  "status": "draft | published",
  "order": "number",
  "updated_by_id": "number or string (from session)",
  "updated_by_name": "string (from session)"
}
```

## Frontend Location

- **Page**: `/dashboard/content/pages`
- **Component**: `src/app/dashboard/content/pages/_components/page-dialog.tsx`
- **Action**: `src/actions/common/cms-actions.ts`

## Foreign Key Constraint Issue

### The Problem

When creating a content page, you may encounter this error:

```
error: insert or update on table "cm_content" violates foreign key constraint "FK_af5797f09222faf322cc3ae9cfb"
```

### Root Cause

This happens when:

1. The `cms_navigation_id` doesn't exist in the `cm_navigation` table
2. The `featured_image_id` doesn't exist in the `cm_media_library` table
3. The fields are sent as empty strings `""` instead of `null` for optional values

### The Solution

We implemented proper null handling for optional foreign key fields:

```typescript
// In cms-actions.ts - createCmsPage()
const cleanedData: any = {
  title: data.title,
  slug: data.slug,
  body: data.body || '',
  status: data.status || 'draft',
  order: data.order || 1,
  cms_navigation_id:
    data.cms_navigation_id && data.cms_navigation_id !== 'none'
      ? data.cms_navigation_id
      : null, // ← Send null instead of empty string
  featured_image_id:
    data.featured_image_id && data.featured_image_id !== 'none'
      ? data.featured_image_id
      : null, // ← Send null instead of empty string
  updated_by_id: session?.user?.id || session?.user?.sessionId,
  updated_by_name:
    session?.user?.fullName || session?.user?.name || 'Admin User'
};
```

### Error Handling Improvements

Added user-friendly error messages for foreign key violations:

```typescript
if (
  errorMessage.includes('foreign key constraint') ||
  errorMessage.includes('violates foreign key')
) {
  if (errorMessage.includes('cms_navigation_id')) {
    errorMessage =
      'The selected navigation item does not exist. Please refresh and try again.';
  } else if (errorMessage.includes('featured_image_id')) {
    errorMessage =
      'The selected featured image does not exist. Please refresh and try again.';
  } else {
    errorMessage =
      'Invalid reference data. Please check your selections and try again.';
  }
}
```

## How to Use the Content Page Form

### 1. Access the Page

Navigate to: `http://localhost:3000/dashboard/content/pages`

### 2. Click "Add Page" Button

This opens the content page dialog modal.

### 3. Fill in the Form

**Required Fields:**

- **Title**: The page title (e.g., "Privacy Policy - Census 2026")
- **Slug**: URL-friendly identifier (e.g., "privacy-policy")

**Optional Fields:**

- **Body Content**: Rich text HTML content (uses TipTap editor)
- **Featured Image**: Select from media library (optional)
- **Nav Link**: Parent navigation item (optional)
- **Order**: Display order (default: 1)
- **Status**: Draft or Published

### 4. Submit the Form

- The form validates required fields
- Sends POST request to `/cm-content`
- Shows success/error toast notification
- Refreshes the content pages list

## Database Schema

```sql
CREATE TABLE cm_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cms_navigation_id UUID REFERENCES cm_navigation(id) ON DELETE SET NULL,
  featured_image_id UUID REFERENCES cm_media_library(id) ON DELETE SET NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(500) NOT NULL,
  body TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  updated_by_id INTEGER,
  updated_by_name VARCHAR(255),
  "order" INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Common Issues & Solutions

### Issue 1: Navigation Item Not Found

**Error**: "The selected navigation item does not exist"

**Solution**:

- Go to `/dashboard/content/navigation`
- Create navigation items first
- Refresh the content pages form

### Issue 2: Featured Image Not Found

**Error**: "The selected featured image does not exist"

**Solution**:

- Go to `/dashboard/content/media`
- Upload images to the media library
- Refresh the content pages form

### Issue 3: Empty String vs Null

**Error**: Foreign key constraint violation

**Solution**:
Our fix automatically converts empty strings and "none" values to `null`:

```typescript
cms_navigation_id: value && value !== 'none' ? value : null;
```

## Testing Checklist

- [ ] Create a content page without navigation link
- [ ] Create a content page without featured image
- [ ] Create a content page with both navigation link and featured image
- [ ] Edit an existing content page
- [ ] Remove navigation link from a page (set to None)
- [ ] Remove featured image from a page (set to None)
- [ ] Toggle status between draft and published
- [ ] Delete a content page
- [ ] Verify proper error messages on failure

## API Response Examples

### Success Response (Create)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Privacy Policy - Census 2026",
  "slug": "privacy-policy",
  "body": "<h1>Privacy Policy</h1><p>Your privacy is important...</p>",
  "status": "draft",
  "cms_navigation_id": null,
  "featured_image_id": null,
  "order": 1,
  "updated_by_id": 1,
  "updated_by_name": "Admin User",
  "created_at": "2026-03-03T10:30:00.000Z",
  "updated_at": "2026-03-03T10:30:00.000Z"
}
```

### Error Response (Foreign Key Violation)

```json
{
  "statusCode": 400,
  "message": "insert or update on table \"cm_content\" violates foreign key constraint",
  "error": "Bad Request"
}
```

## Files Modified

1. **`src/actions/common/cms-actions.ts`**

   - Updated `createCmsPage()` to handle null values properly
   - Updated `updateCmsPage()` to handle null values properly
   - Added user-friendly error messages for FK violations

2. **`src/app/dashboard/content/pages/_components/page-dialog.tsx`**

   - Changed default values from empty strings to `undefined`
   - Updated form state management

3. **`src/app/dashboard/content/pages/page.tsx`**
   - Improved error handling in `handleSave()`
   - Shows specific error messages from API

## Best Practices

1. **Always validate foreign keys exist** before sending the request
2. **Use null for optional foreign keys**, not empty strings
3. **Provide user-friendly error messages** for constraint violations
4. **Refresh dropdown data** when opening the form to ensure latest data
5. **Log API requests and responses** for debugging

## Related Documentation

- [CMS API Integration Guide](./CMS-API-INTEGRATION.md)
- [CMS Troubleshooting Guide](./CMS-TROUBLESHOOTING.md)
- [Dashboard Documentation](./documentation.md)

## Support

For issues or questions:

- Check the browser console for detailed error logs
- Review the backend logs in common_service
- Verify database foreign key relationships
- Ensure navigation items and media files exist before referencing them
