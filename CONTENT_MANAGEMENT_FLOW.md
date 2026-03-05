# Content Management System (CMS) - Complete Flow Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Content Modules](#content-modules)
4. [Data Flow](#data-flow)
5. [Frontend Structure](#frontend-structure)
6. [Backend Integration](#backend-integration)
7. [User Journey](#user-journey)
8. [Database Schema](#database-schema)
9. [API Reference](#api-reference)

---

## 🎯 Overview

The Content Management System (CMS) allows administrators to manage all public-facing content for the Census Portal through the Admin Portal. The system follows a **Server-Side Rendering (SSR)** approach with **Server Actions** for data management.

### Key Features

- ✅ **Public Notices & Announcements** - Official updates and news
- ✅ **Content Pages** - Static content pages with rich text editing
- ✅ **Media Library** - Centralized media asset management
- ✅ **Navigation Management** - Dynamic menu structure
- ✅ **Quick Links** - Sidebar links and resources
- ✅ **Categorization** - Organize content with categories

### Technology Stack

- **Frontend**: Next.js 14+ (App Router), React Server Components
- **Backend**: Common Service (NestJS) - Port 5003
- **Storage**: MinIO (Object Storage) for media files
- **Database**: PostgreSQL (TypeORM)
- **Authentication**: JWT via Auth Service (Port 5001)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         ADMIN PORTAL                            │
│                    (Next.js - Port 3000)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            /dashboard/content/*                          │  │
│  │                                                          │  │
│  │  • announcements/    ← Public notices management        │  │
│  │  • categories/       ← Notice categories                │  │
│  │  • pages/            ← Content pages (About, Privacy)   │  │
│  │  • media/            ← Media library (images, PDFs)     │  │
│  │  • navigation/       ← Main menu structure              │  │
│  │  • quick-links/      ← Sidebar quick links              │  │
│  │  • quick-link-categories/ ← Quick link categories       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         src/actions/common/cms-actions.ts                │  │
│  │         (Server Actions - API Integration)               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP Requests (JWT Auth)
┌─────────────────────────────────────────────────────────────────┐
│                      COMMON SERVICE                             │
│                    (NestJS - Port 5003)                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    API Endpoints                         │  │
│  │                                                          │  │
│  │  POST   /announcement-and-news                          │  │
│  │  GET    /announcement-and-news/all                      │  │
│  │  PATCH  /announcement-and-news/:id                      │  │
│  │  DELETE /announcement-and-news/:id                      │  │
│  │                                                          │  │
│  │  POST   /announcement-categories                        │  │
│  │  GET    /announcement-categories/all                    │  │
│  │                                                          │  │
│  │  POST   /cm-content                                     │  │
│  │  GET    /cm-content/all                                 │  │
│  │  PATCH  /cm-content/:id                                 │  │
│  │                                                          │  │
│  │  POST   /cm-media-library                               │  │
│  │  GET    /cm-media-library/all                           │  │
│  │  GET    /media/:category/:filename (Proxy)              │  │
│  │                                                          │  │
│  │  POST   /cm-navigation                                  │  │
│  │  GET    /cm-navigation/all                              │  │
│  │                                                          │  │
│  │  POST   /cm-quick-links                                 │  │
│  │  GET    /cm-quick-links/all                             │  │
│  │                                                          │  │
│  │  POST   /cm-quick-link-categories                       │  │
│  │  GET    /cm-quick-link-categories/all                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE                                │
│                      (PostgreSQL)                               │
│                                                                 │
│  • announcement_and_news           ← Public notices            │
│  • announcement_categories         ← Notice categories         │
│  • cm_content                      ← Content pages             │
│  • cm_media_library                ← Media metadata            │
│  • cm_navigation                   ← Navigation items          │
│  • cm_quick_links                  ← Quick links               │
│  • cm_quick_link_categories        ← Quick link categories     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      MINIO (Object Storage)                     │
│                        (Port 9000)                              │
│                                                                 │
│  Buckets:                                                       │
│  • census-media/announcements/     ← Announcement images       │
│  • census-media/banners/           ← Banner images             │
│  • census-media/forms/             ← Form documents            │
│  • census-media/media/             ← General media assets      │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Content Consumption
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT PORTAL                              │
│                   (Next.js - Port 3001)                         │
│                                                                 │
│  Displays:                                                      │
│  • Public notices on homepage                                   │
│  • Dynamic navigation menu                                      │
│  • Content pages (About, Privacy, etc.)                         │
│  • Quick links in sidebar                                       │
│  • Media assets (images, documents)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Content Modules

### 1. **Public Notices & Announcements**

**Path**: `/dashboard/content/announcements`

**Purpose**: Manage official notices, updates, and news for the public portal.

**Features**:

- Create, edit, delete announcements
- Rich text editor for messages
- Image upload support
- Categorization
- Active/Inactive status toggle
- Creator tracking

**Data Model**:

```typescript
interface Announcement {
  id: string;
  headline: string; // Required
  message?: string; // Optional HTML content
  image_url?: string; // MinIO URL
  image_name?: string; // Original filename
  category_id?: string; // FK to announcement_categories
  category?: AnnouncementCategory;
  status: 'active' | 'inactive'; // Visibility control
  created_by_id?: string; // User ID
  created_by_name?: string; // Display name
  createdAt?: string;
  updatedAt?: string;
}
```

---

### 2. **Notice Categories**

**Path**: `/dashboard/content/categories`

**Purpose**: Organize announcements into categories (e.g., General, Census 2026, Updates).

**Features**:

- Multi-language support (English & Dzongkha)
- URL slug generation
- Active/Inactive status
- Display order management

**Data Model**:

```typescript
interface AnnouncementCategory {
  id: string;
  name: string; // English name
  name_dzo?: string; // Dzongkha name
  description?: string;
  slug: string; // URL-friendly identifier
  is_active: boolean;
  order: number; // Display order
  createdAt?: string;
  updatedAt?: string;
}
```

---

### 3. **Content Pages**

**Path**: `/dashboard/content/pages`

**Purpose**: Create and manage static content pages (About Us, Privacy Policy, Terms of Service, etc.).

**Features**:

- Rich text editor with TipTap
- Featured image selection
- Link to navigation items (creates dropdown menu)
- Draft/Published workflow
- Display order control
- Editor tracking

**Data Model**:

```typescript
interface CmsPage {
  id: string;
  cms_navigation_id?: string; // FK to navigation (optional)
  slug: string; // URL path (e.g., "privacy-policy")
  title: string; // Page title
  body?: string; // HTML content
  featured_image_id?: string; // FK to media library
  status: 'draft' | 'published';
  updated_by_id?: string;
  updated_by_name?: string;
  order?: number; // Order within navigation dropdown
  createdAt?: string;
  updatedAt?: string;
  navigation?: NavigationItem; // Related navigation
  featuredImage?: MediaItem; // Related media
}
```

**Foreign Key Constraints**:

- `cms_navigation_id` → `cm_navigation.id` (ON DELETE SET NULL)
- `featured_image_id` → `cm_media_library.id` (ON DELETE SET NULL)

---

### 4. **Media Library**

**Path**: `/dashboard/content/media`

**Purpose**: Centralized storage and management of all media assets.

**Features**:

- File upload (images, PDFs, documents)
- Categorization (Forms, Banners, Media)
- File size validation (10MB limit)
- File type validation
- Preview support for images
- MinIO integration with proxy URL

**Data Model**:

```typescript
interface MediaItem {
  id: string;
  file_name: string; // Original filename
  file_path: string; // MinIO path
  category: 'forms' | 'banners' | 'media';
  url?: string; // Proxied URL
  createdAt?: string;
  updatedAt?: string;
}
```

**Upload Flow**:

1. Admin selects file in dialog
2. Client validates file size/type
3. FormData sent to server action
4. Server uploads to MinIO
5. Metadata saved to PostgreSQL
6. Returns proxy URL for access

**URL Transformation**:

- **MinIO URL**: `http://localhost:9000/census-media/announcements/file.jpg`
- **Proxy URL**: `http://localhost:5003/media/announcements/file.jpg`

---

### 5. **Navigation Links**

**Path**: `/dashboard/content/navigation`

**Purpose**: Manage the main navigation menu structure for the portal.

**Features**:

- Menu item creation
- Icon selection
- URL or dropdown configuration
- Sub-page assignment (links to content pages)
- Display order management
- Active/Inactive status

**Data Model**:

```typescript
interface NavigationItem {
  id: string;
  label: string; // Menu text (e.g., "About", "Services")
  url?: string; // Direct URL (if no dropdown)
  icon?: string; // Icon identifier
  order?: number; // Menu order
  message?: string; // Tooltip/description
  status: 'active' | 'inactive';
  created_by_id?: string;
  created_by_name?: string;
  createdAt?: string;
  updatedAt?: string;
  contentPages?: CmsPage[]; // Associated sub-pages
}
```

**Navigation Types**:

- **Direct Link**: Has `url`, no content pages → Click navigates to URL
- **Dropdown Menu**: No `url`, has content pages → Hover shows sub-menu

---

### 6. **Quick Links**

**Path**: `/dashboard/content/quick-links`

**Purpose**: Manage sidebar quick links for downloads, external resources, etc.

**Features**:

- Link to external URLs or internal content pages
- Category assignment
- Icon support
- Open in new tab option
- Display order
- Active/Inactive status

**Data Model**:

```typescript
interface QuickLink {
  id: string;
  title: string; // Link text
  description?: string;
  url?: string; // External URL
  content_page_id?: string; // OR internal page FK
  contentPage?: CmsPage;
  category_id?: string; // FK to quick link categories
  category?: QuickLinkCategory;
  type: string; // Link type
  order: number;
  is_active: boolean;
  opens_in_new_tab: boolean;
  icon?: string;
  created_at: string;
  created_by_name?: string;
}
```

---

### 7. **Quick Link Categories**

**Path**: `/dashboard/content/quick-link-categories`

**Purpose**: Organize quick links into categories (e.g., Downloads, Forms, Resources).

**Features**:

- Multi-language support
- Active/Inactive status
- Display order
- Slug generation

**Data Model**:

```typescript
interface QuickLinkCategory {
  id: string;
  name: string;
  name_dzo?: string;
  description?: string;
  slug: string;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}
```

---

## 🔄 Data Flow

### **Create Content Flow** (Example: Creating an Announcement)

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. USER ACTION                                                  │
│    Admin clicks "Add Notice" button                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. DIALOG OPENS                                                 │
│    • AnnouncementDialog component renders                       │
│    • Fetches categories for dropdown                            │
│    • Form initialized with empty state                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. USER FILLS FORM                                              │
│    • Headline: "Census 2026 Registration Open"                  │
│    • Message: Rich text content                                 │
│    • Category: "General Updates"                                │
│    • Image: Upload file                                         │
│    • Status: Active                                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. CLIENT-SIDE VALIDATION                                       │
│    • Checks required fields (headline, category)                │
│    • Validates image file (if uploaded)                         │
│    • Validates file size/type                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 5. SUBMIT HANDLER                                               │
│    • Calls onSave(formData, file)                               │
│    • onSave → createAnnouncement() server action                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 6. SERVER ACTION (cms-actions.ts)                               │
│    • Gets auth headers with JWT token                           │
│    • Gets current user from session                             │
│    • Creates FormData object                                    │
│    • Appends text fields & file                                 │
│    • Sends POST to Common Service                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 7. COMMON SERVICE (NestJS)                                      │
│    • Validates JWT token                                        │
│    • Validates request body                                     │
│    • Uploads file to MinIO                                      │
│    • Saves metadata to PostgreSQL                               │
│    • Returns success response with data                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 8. RESPONSE HANDLING                                            │
│    • Server action receives response                            │
│    • Calls revalidatePath('/dashboard/content/announcements')   │
│    • Returns { success: true, data, message }                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 9. UI UPDATE                                                    │
│    • Dialog closes                                              │
│    • Toast notification shows success message                   │
│    • Table automatically refreshes (RSC)                        │
│    • New announcement appears in list                           │
└─────────────────────────────────────────────────────────────────┘
```

### **Update Content Flow**

Similar to create, but:

- Pre-fills form with existing data
- Uses PATCH instead of POST
- May or may not include new file upload
- Revalidates same path

### **Delete Content Flow**

```
User clicks delete → Confirmation dialog → DELETE request →
Database soft/hard delete → Revalidate path → UI updates
```

---

## 🗂️ Frontend Structure

### **Directory Layout**

```
src/app/dashboard/content/
├── announcements/
│   ├── page.tsx                          # Server Component (SSR)
│   └── _components/
│       ├── announcements-table.tsx       # Client table wrapper
│       ├── add-announcement-button.tsx   # Add button
│       ├── announcement-dialog.tsx       # Create/Edit dialog
│       ├── columns.tsx                   # Table column definitions
│       └── cell-action.tsx               # Row actions (edit/delete)
│
├── categories/
│   ├── page.tsx
│   └── _components/
│       ├── categories-table.tsx
│       ├── add-category-button.tsx
│       ├── category-dialog.tsx
│       ├── columns.tsx
│       └── cell-action.tsx
│
├── pages/
│   ├── page.tsx
│   └── _components/
│       ├── pages-table.tsx
│       ├── add-page-button.tsx
│       ├── page-dialog.tsx
│       ├── columns.tsx
│       └── cell-action.tsx
│
├── media/
│   ├── page.tsx
│   └── _components/
│       ├── media-table.tsx
│       ├── add-media-button.tsx
│       ├── media-dialog.tsx
│       ├── columns.tsx
│       └── cell-action.tsx
│
├── navigation/
│   ├── page.tsx
│   └── _components/
│       ├── navigation-table.tsx
│       ├── add-navigation-button.tsx
│       ├── navigation-dialog.tsx
│       ├── columns.tsx
│       └── cell-action.tsx
│
├── quick-links/
│   ├── page.tsx
│   └── _components/
│       ├── quick-links-table.tsx
│       ├── add-link-button.tsx
│       ├── quick-link-dialog.tsx
│       ├── columns.tsx
│       └── cell-action.tsx
│
└── quick-link-categories/
    ├── page.tsx
    └── _components/
        ├── categories-table.tsx
        ├── add-category-button.tsx
        ├── category-dialog.tsx
        ├── columns.tsx
        └── cell-action.tsx
```

### **Component Patterns**

#### **1. Server Component (page.tsx)**

```tsx
// Async server component
export default async function AnnouncementsPage() {
  return (
    <PageContainer
      pageTitle="Public Notices"
      pageDescription="Manage public notices..."
      pageHeaderAction={<AddAnnouncementButton />}
    >
      <Suspense fallback={<DataTableSkeleton />}>
        <AnnouncementsDataWrapper />
      </Suspense>
    </PageContainer>
  );
}

// Separate async data fetcher
async function AnnouncementsDataWrapper() {
  const result = await getAnnouncements(); // Server action

  if (!result.success) {
    return <ErrorDisplay error={result.error} />;
  }

  return <AnnouncementsTable data={result.data} />;
}
```

**Benefits**:

- Server-side data fetching
- No loading states needed
- SEO-friendly
- Automatic refresh on revalidation

#### **2. Client Table Component**

```tsx
'use client';

export function AnnouncementsTable({ data }) {
  return <DataTable columns={columns} data={data} />;
}
```

#### **3. Dialog Component**

```tsx
'use client';

export function AnnouncementDialog({ open, onOpenChange, item, onSave }) {
  const [formData, setFormData] = useState({...});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
      </form>
    </Dialog>
  );
}
```

#### **4. Cell Action Component**

```tsx
'use client';

export function CellAction({ data }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleEdit = async (formData) => {
    const result = await updateAnnouncement(data.id, formData);
    if (result.success) {
      toast.success(result.message);
    }
  };

  const handleDelete = async () => {
    const result = await deleteAnnouncement(data.id);
    if (result.success) {
      toast.success(result.message);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenu>

      <AnnouncementDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        announcement={data}
        onSave={handleEdit}
      />

      <AlertDialog
        open={showDeleteAlert}
        onOpenChange={setShowDeleteAlert}
        onConfirm={handleDelete}
      />
    </>
  );
}
```

---

## 🔌 Backend Integration

### **Server Actions** (`src/actions/common/cms-actions.ts`)

All API calls are handled through server actions for:

- **Security**: Tokens handled server-side
- **Type Safety**: Full TypeScript support
- **Error Handling**: Centralized error management
- **Cache Revalidation**: Automatic with `revalidatePath()`

### **Authentication Flow**

```typescript
// All requests include JWT token
const headers = await instance(); // Gets auth headers

const response = await fetch(url, {
  method: 'POST',
  headers, // Includes Authorization: Bearer <token>
  body: JSON.stringify(data)
});
```

### **Error Handling Pattern**

```typescript
export async function createAnnouncement(data, file) {
  try {
    const headers = await instance();
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message || 'Failed to create'
      };
    }

    const result = await response.json();
    revalidatePath('/dashboard/content/announcements');

    return {
      success: true,
      message: 'Created successfully',
      data: result
    };
  } catch (error) {
    console.error('[createAnnouncement] Error:', error);
    return {
      success: false,
      error: 'Failed to create announcement'
    };
  }
}
```

### **File Upload Handling**

```typescript
export async function createAnnouncement(data, file) {
  const formData = new FormData();

  // Add text fields
  formData.append('headline', data.headline);
  formData.append('message', data.message);
  formData.append('category_id', data.category_id);
  formData.append('status', data.status);

  // Add file
  if (file) {
    formData.append('file', file);
  }

  // Remove Content-Type to let browser set boundary
  const { 'Content-Type': _, ...headersWithoutContentType } = headers;

  const response = await fetch(url, {
    method: 'POST',
    headers: headersWithoutContentType,
    body: formData
  });
}
```

---

## 👤 User Journey

### **Admin Creating a Public Notice**

1. **Login** to Admin Portal
2. **Navigate** to `/dashboard/content/announcements`
3. **View** existing announcements in data table
4. **Click** "Add Notice" button
5. **Dialog opens** with form
6. **Fill in** details:
   - Headline: "Census 2026 Registration Extended"
   - Message: Rich text with formatting
   - Category: Select from dropdown
   - Image: Upload relevant image
   - Status: Toggle active/inactive
7. **Click** "Save"
8. **Validation** runs (client & server)
9. **Upload** to MinIO, save to database
10. **Success toast** appears
11. **Table refreshes** automatically
12. **New notice** appears in list
13. **Client portal** now shows the announcement

### **Admin Managing Navigation**

1. **Navigate** to `/dashboard/content/navigation`
2. **Click** "Add Navigation Item"
3. **Create** menu item: "About Us"
   - Label: "About Us"
   - URL: Leave empty (will have dropdown)
   - Icon: Select icon
   - Order: 1
4. **Save** navigation item
5. **Navigate** to `/dashboard/content/pages`
6. **Create** content pages:
   - "Our History" → Link to "About Us" nav
   - "Our Team" → Link to "About Us" nav
   - "Contact Info" → Link to "About Us" nav
7. **Result**: "About Us" menu shows dropdown with 3 pages
8. **Client portal** displays dynamic navigation

---

## 🗄️ Database Schema

### **Tables Overview**

```sql
-- Announcements
CREATE TABLE announcement_and_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  headline VARCHAR(500) NOT NULL,
  message TEXT,
  image_url TEXT,
  image_name VARCHAR(255),
  category_id UUID REFERENCES announcement_categories(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_by_id VARCHAR(255),
  created_by_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Announcement Categories
CREATE TABLE announcement_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_dzo VARCHAR(255),
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Content Pages
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

-- Media Library
CREATE TABLE cm_media_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_name VARCHAR(500) NOT NULL,
  file_path VARCHAR(1000) NOT NULL,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Navigation
CREATE TABLE cm_navigation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(255) NOT NULL,
  url VARCHAR(500),
  icon VARCHAR(100),
  "order" INTEGER DEFAULT 0,
  message TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_by_id VARCHAR(255),
  created_by_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Quick Links
CREATE TABLE cm_quick_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  url VARCHAR(500),
  content_page_id UUID REFERENCES cm_content(id) ON DELETE SET NULL,
  category_id UUID REFERENCES cm_quick_link_categories(id) ON DELETE SET NULL,
  type VARCHAR(50),
  "order" INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  opens_in_new_tab BOOLEAN DEFAULT false,
  icon VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  created_by_name VARCHAR(255)
);

-- Quick Link Categories
CREATE TABLE cm_quick_link_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_dzo VARCHAR(255),
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Foreign Key Relationships**

```
announcement_and_news
  └── category_id → announcement_categories.id

cm_content
  ├── cms_navigation_id → cm_navigation.id
  └── featured_image_id → cm_media_library.id

cm_quick_links
  ├── content_page_id → cm_content.id
  └── category_id → cm_quick_link_categories.id
```

---

## 📡 API Reference

### **Base URL**: `http://localhost:5003`

### **Authentication**: All requests require JWT token in header

```
Authorization: Bearer <token>
```

---

### **Announcements**

#### **GET /announcement-and-news/all**

Fetch all announcements

**Response**:

```json
[
  {
    "id": "uuid",
    "headline": "Census 2026 Registration Open",
    "message": "<p>Rich text content</p>",
    "image_url": "http://localhost:5003/media/announcements/file.jpg",
    "category": {
      "id": "uuid",
      "name": "General Updates"
    },
    "status": "active",
    "created_by_name": "Admin User",
    "createdAt": "2026-03-05T10:00:00Z"
  }
]
```

#### **POST /announcement-and-news**

Create new announcement

**Request** (multipart/form-data):

```
headline: "Announcement Title"
message: "<p>HTML content</p>"
category_id: "uuid"
status: "active"
created_by_id: "user-id"
created_by_name: "Admin User"
file: (binary)
```

**Response**:

```json
{
  "id": "uuid",
  "headline": "Announcement Title",
  "image_url": "http://localhost:5003/media/announcements/file.jpg",
  ...
}
```

#### **PATCH /announcement-and-news/:id**

Update announcement

**Request**: Same as POST

#### **DELETE /announcement-and-news/:id**

Delete announcement

---

### **Content Pages**

#### **GET /cm-content/all**

Fetch all content pages

**Response**:

```json
[
  {
    "id": "uuid",
    "title": "Privacy Policy",
    "slug": "privacy-policy",
    "body": "<p>Page content</p>",
    "status": "published",
    "navigation": {
      "id": "uuid",
      "label": "Legal"
    },
    "order": 1
  }
]
```

#### **POST /cm-content**

Create new content page

**Request**:

```json
{
  "title": "Privacy Policy",
  "slug": "privacy-policy",
  "body": "<p>Content</p>",
  "cms_navigation_id": "uuid-or-null",
  "featured_image_id": "uuid-or-null",
  "status": "published",
  "order": 1,
  "updated_by_id": "user-id",
  "updated_by_name": "Admin User"
}
```

**Important**: Send `null` not empty string for optional foreign keys!

#### **PATCH /cm-content/:id**

Update content page

#### **DELETE /cm-content/:id**

Delete content page

---

### **Media Library**

#### **GET /cm-media-library/all**

Fetch all media items

**Response**:

```json
[
  {
    "id": "uuid",
    "file_name": "census-logo.png",
    "file_path": "media/census-logo.png",
    "category": "media",
    "url": "http://localhost:5003/media/media/census-logo.png",
    "createdAt": "2026-03-05T10:00:00Z"
  }
]
```

#### **POST /cm-media-library**

Upload media file

**Request** (multipart/form-data):

```
file: (binary)
category: "forms" | "banners" | "media"
```

**File Limits**:

- Max size: 10MB
- Allowed types: Images (JPG, PNG, GIF, SVG, WebP), Documents (PDF, DOC, DOCX)

#### **GET /media/:category/:filename**

Proxy to access media files from MinIO

**Example**: `GET /media/announcements/my-image.jpg`

---

### **Navigation**

#### **GET /cm-navigation/all**

Fetch all navigation items with content pages

**Response**:

```json
[
  {
    "id": "uuid",
    "label": "About Us",
    "url": null,
    "icon": "info",
    "order": 1,
    "status": "active",
    "contentPages": [
      {
        "id": "uuid",
        "title": "Our History",
        "slug": "our-history"
      }
    ]
  }
]
```

#### **POST /cm-navigation**

Create navigation item

**Request**:

```json
{
  "label": "About Us",
  "url": "/about",
  "icon": "info",
  "order": 1,
  "status": "active",
  "created_by_name": "Admin User"
}
```

---

### **Quick Links**

#### **GET /cm-quick-links/all**

Fetch all quick links

#### **POST /cm-quick-links**

Create quick link

**Request**:

```json
{
  "title": "Download Form",
  "description": "Application form",
  "url": "https://example.com/form.pdf",
  "category_id": "uuid",
  "type": "download",
  "order": 1,
  "is_active": true,
  "opens_in_new_tab": true,
  "icon": "download"
}
```

---

## 🎨 UI Components

### **Rich Text Editor**

**Component**: `RichTextEditor` (TipTap)

**Features**:

- Bold, italic, underline
- Headings (H1-H6)
- Bullet/numbered lists
- Color picker
- Link insertion
- Code blocks
- Undo/redo

**Usage**:

```tsx
<RichTextEditor
  content={formData.body}
  onChange={(content) => setFormData({ ...formData, body: content })}
  placeholder="Start typing..."
/>
```

### **Data Table**

**Component**: `DataTable` (shadcn/ui + TanStack Table)

**Features**:

- Sorting
- Filtering
- Pagination
- Column visibility toggle
- Row selection

**Usage**:

```tsx
<DataTable
  columns={columns}
  data={announcements}
  totalItems={announcements.length}
/>
```

### **Icon Picker**

**Component**: `IconPicker`

**Usage**:

```tsx
<IconPicker
  value={formData.icon}
  onChange={(icon) => setFormData({ ...formData, icon })}
/>
```

---

## 🚀 Best Practices

### **1. Null Handling for Foreign Keys**

❌ **Wrong**:

```typescript
cms_navigation_id: ''; // Empty string
```

✅ **Correct**:

```typescript
cms_navigation_id: null; // or undefined
```

### **2. File Upload Validation**

Always validate both client and server:

```typescript
// Client
if (file.size > MAX_FILE_SIZE) {
  alert('File too large');
  return;
}

// Server
if (!allowedTypes.includes(file.mimetype)) {
  throw new BadRequestException('Invalid file type');
}
```

### **3. Error Handling**

Provide user-friendly error messages:

```typescript
if (errorMessage.includes('foreign key constraint')) {
  return {
    success: false,
    error: 'Selected navigation item does not exist. Please refresh.'
  };
}
```

### **4. Cache Revalidation**

Always revalidate after mutations:

```typescript
const result = await updateAnnouncement(id, data);
revalidatePath('/dashboard/content/announcements');
```

### **5. Loading States**

Show loading indicators during async operations:

```tsx
<Button disabled={loading}>{loading ? <Spinner /> : 'Save'}</Button>
```

---

## 🔧 Troubleshooting

### **Issue: Foreign Key Constraint Error**

**Symptom**: `violates foreign key constraint`

**Cause**: Sending empty string instead of null

**Solution**: Convert empty strings to null

```typescript
cms_navigation_id: value && value !== 'none' ? value : null;
```

### **Issue: File Upload Too Large**

**Symptom**: `Body exceeded 1mb limit`

**Solution**:

- Increase server body limit in NestJS
- Add client-side file size validation
- Compress images before upload

### **Issue: Image Not Displaying**

**Symptom**: Broken image links

**Solution**: Use proxy URL instead of direct MinIO URL

```typescript
const transformUrl = (url) => {
  // Convert: minio:9000/census-media/announcements/file.jpg
  // To: localhost:5003/media/announcements/file.jpg
};
```

### **Issue: Table Not Refreshing**

**Symptom**: Changes not appearing

**Solution**: Ensure `revalidatePath()` is called

```typescript
revalidatePath('/dashboard/content/announcements');
```

---

## 📚 Related Documentation

- [CMS API Integration Guide](./CMS-API-INTEGRATION.md)
- [CM Content Integration](./docs/cm-content-integration.md)
- [CMS Troubleshooting](./CMS-TROUBLESHOOTING.md)

---

## 🎯 Summary

The Content Management System provides a complete solution for managing all public-facing content in the Census Portal:

1. **Admins** create/edit content via Admin Portal
2. **Server Actions** handle API communication securely
3. **Common Service** processes and stores data
4. **PostgreSQL** stores metadata
5. **MinIO** stores media files
6. **Client Portal** consumes and displays content

**Key Technologies**:

- Next.js 14 App Router
- React Server Components
- Server Actions
- TypeScript
- NestJS Backend
- PostgreSQL + MinIO

This architecture ensures:

- ✅ Type safety end-to-end
- ✅ Secure authentication
- ✅ Optimal performance (SSR)
- ✅ Automatic cache invalidation
- ✅ Clean separation of concerns
- ✅ Excellent developer experience

---

**Last Updated**: March 5, 2026  
**Author**: Census Development Team  
**Version**: 1.0.0
