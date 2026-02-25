# CMS API Integration - Complete Guide

## Overview

This document outlines the integration of Content Management System (CMS) APIs from the Common Service to the Admin Portal frontend.

## Services and Ports

- **Common Service (Backend)**: `http://localhost:5003`
- **Admin Portal (Frontend)**: `http://localhost:3000`
- **Auth Service**: `http://localhost:5001`

## Implemented API Endpoints

### 1. Announcements & News

**Backend Endpoint**: `/announcement-and-news`

#### API Structure:

```typescript
interface Announcement {
  id: string;
  headline: string;
  message?: string;
  status: 'active' | 'inactive';
  created_by_id?: string;
  created_by_name?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

#### Frontend Actions:

- `getAnnouncements()` → GET `/announcement-and-news/all`
- `createAnnouncement(data)` → POST `/announcement-and-news`
- `updateAnnouncement(id, data)` → PATCH `/announcement-and-news/:id`
- `deleteAnnouncement(id)` → DELETE `/announcement-and-news/:id`

#### Frontend Pages:

- **Location**: `/admin-portal/src/app/dashboard/content/announcements/`
- **Components**:
  - `page.tsx` - Main page with data table
  - `_components/columns.tsx` - Table column definitions
  - `_components/announcement-dialog.tsx` - Create/Edit dialog

---

### 2. Content Pages

**Backend Endpoint**: `/cm-content`

#### API Structure:

```typescript
interface CmsPage {
  id: string;
  cms_navigation_id?: string;
  slug: string;
  title: string;
  body?: string;
  status: 'draft' | 'published';
  updated_by_id?: string;
  updated_by_name?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  navigation?: {
    id: string;
    label: string;
  };
}
```

#### Frontend Actions:

- `getCmsPages()` → GET `/cm-content/all`
- `createCmsPage(data)` → POST `/cm-content`
- `updateCmsPage(id, data)` → PATCH `/cm-content/:id`
- `deleteCmsPage(id)` → DELETE `/cm-content/:id`

#### Frontend Pages:

- **Location**: `/admin-portal/src/app/dashboard/content/pages/`
- **Components**:
  - `page.tsx` - Main page with data table
  - `_components/columns.tsx` - Table column definitions ✅ Updated
  - `_components/page-dialog.tsx` - Create/Edit dialog (needs update)

---

### 3. Media Library

**Backend Endpoint**: `/cm-media-library`

#### API Structure:

```typescript
interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  category: 'forms' | 'banners';
  createdAt?: string;
  updatedAt?: string;
}
```

#### Frontend Actions:

- `getMediaItems()` → GET `/cm-media-library/all`
- `createMediaItem(data)` → POST `/cm-media-library`
- `updateMediaItem(id, data)` → PATCH `/cm-media-library/:id`
- `deleteMediaItem(id)` → DELETE `/cm-media-library/:id`

#### Frontend Pages:

- **Location**: `/admin-portal/src/app/dashboard/content/media/`
- **Components**:
  - `page.tsx` - Main page with data table
  - `_components/columns.tsx` - Table column definitions (needs update)
  - `_components/media-dialog.tsx` - Create/Edit dialog (needs update)

---

### 4. Navigation Menus

**Backend Endpoint**: `/cm-navigation`

#### API Structure:

```typescript
interface NavigationItem {
  id: string;
  label: string;
  message?: string;
  status: 'active' | 'inactive';
  created_by_id?: string;
  created_by_name?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}
```

#### Frontend Actions:

- `getNavigationItems()` → GET `/cm-navigation/all`
- `createNavigationItem(data)` → POST `/cm-navigation`
- `updateNavigationItem(id, data)` → PATCH `/cm-navigation/:id`
- `deleteNavigationItem(id)` → DELETE `/cm-navigation/:id`

#### Frontend Pages:

- **Location**: `/admin-portal/src/app/dashboard/content/navigation/`
- **Components**:
  - `page.tsx` - Main page with data table
  - `_components/columns.tsx` - Table column definitions (needs update)
  - `_components/navigation-dialog.tsx` - Create/Edit dialog (needs update)

---

## Files Modified

### 1. CMS Actions File

**File**: `/admin-portal/src/actions/common/cms-actions.ts`

- ✅ Replaced dummy data with real API calls
- ✅ Updated all type definitions to match backend
- ✅ Added proper error handling
- ✅ Added cache revalidation with `revalidatePath`

### 2. Environment Configuration

**File**: `/admin-portal/.env.local`

- ✅ Added `COMMON_SERVICE_URL=http://localhost:5003`

### 3. Frontend Components Updated

- ✅ `/dashboard/content/announcements/_components/columns.tsx` - Updated to use new field names
- ✅ `/dashboard/content/announcements/_components/announcement-dialog.tsx` - Updated form fields
- ✅ `/dashboard/content/pages/_components/columns.tsx` - Updated to use new field names

### 4. Frontend Components Needing Update

- ⏳ `/dashboard/content/pages/_components/page-dialog.tsx`
- ⏳ `/dashboard/content/media/_components/columns.tsx`
- ⏳ `/dashboard/content/media/_components/media-dialog.tsx`
- ⏳ `/dashboard/content/navigation/_components/columns.tsx`
- ⏳ `/dashboard/content/navigation/_components/navigation-dialog.tsx`

---

## Testing Guide

### 1. Start the Common Service

```bash
cd common_service
pnpm install
pnpm start:dev
```

The service should run on `http://localhost:5003`

### 2. Start the Admin Portal

```bash
cd admin-portal
pnpm install
pnpm dev
```

The portal should run on `http://localhost:3000`

### 3. Test Each CMS Module

#### Announcements

1. Navigate to: `/dashboard/content/announcements`
2. Click "Add Announcement"
3. Fill in: Headline, Message, Status
4. Click "Save"
5. Verify the announcement appears in the table
6. Test Edit and Delete functionalities

#### Content Pages

1. Navigate to: `/dashboard/content/pages`
2. Test CRUD operations

#### Media Library

1. Navigate to: `/dashboard/content/media`
2. Test media upload and management

#### Navigation

1. Navigate to: `/dashboard/content/navigation`
2. Test menu item creation and ordering

---

## API Authentication

All CMS API calls use the `instance()` function which automatically includes:

- JWT Bearer token from the authenticated session
- Proper headers for JSON requests

Example from the code:

```typescript
const headers = await instance();
const response = await fetch(url, {
  method: 'GET',
  headers,
  cache: 'no-store'
});
```

---

## Common Issues & Solutions

### 1. CORS Errors

**Solution**: Make sure the Common Service has CORS enabled for `http://localhost:3000`

### 2. Authentication Errors

**Solution**: Ensure you're logged in to the admin portal and the JWT token is valid

### 3. Port Conflicts

**Solution**:

- Common Service: Port 5003
- Auth Service: Port 5001
- Admin Portal: Port 3000

### 4. Type Mismatches

**Solution**: The frontend types now match the backend DTOs exactly. Refer to the type definitions above.

---

## Next Steps

1. ✅ Update remaining dialog components to match new API structure
2. ✅ Update media and navigation column components
3. ✅ Test all CRUD operations end-to-end
4. ✅ Add loading states and error messages
5. ✅ Add form validation
6. ✅ Test permissions and access control

---

## Benefits of This Integration

1. **Real Data**: No more dummy data - all operations persist to the database
2. **Consistency**: Same data across all users and sessions
3. **Scalability**: Backend can handle multiple users and large datasets
4. **Security**: All API calls are authenticated and authorized
5. **Maintainability**: Clear separation between frontend and backend
6. **RESTful**: Following standard REST conventions for all operations

---

## Support

For issues or questions:

1. Check Common Service documentation: `/common_service/docs/CMS-COMPLETE.md`
2. Review API examples: `/common_service/COMMON_SERVICE.md`
3. Check Swagger documentation: `http://localhost:5003/api/documentation`
