# 3-Tier Navigation Structure: Navigation → Sub-Links → Content

## 📋 Overview

This document explains the **3-tier hierarchical structure** for the content management system:

```
Navigation (Top Level)
├── Sub-Link 1 (Category/Group)
│   ├── Content Page A
│   ├── Content Page B
│   └── Content Page C
└── Sub-Link 2 (Category/Group)
    ├── Content Page D
    └── Content Page E
```

## 🏗️ Architecture

### Tier 1: Navigation (`cm_navigation`)

- **Purpose**: Main menu items in the header/navigation bar
- **Example**: "About Us", "Services", "Resources"
- **Relationship**: One Navigation → Many Sub-Links

### Tier 2: Sub-Links (`cm_sub_links`)

- **Purpose**: Categories or groups under each navigation item
- **Example**: Under "About Us" → "Our History", "Our Team", "Our Mission"
- **Relationship**: One Sub-Link → Many Content Pages

### Tier 3: Content Pages (`cm_content`)

- **Purpose**: Actual content/articles
- **Example**: Specific articles, pages, documents
- **Relationship**: Belongs to one Sub-Link (or optionally one Navigation for legacy support)

## 📊 Database Schema

### `cm_navigation` Table

```sql
CREATE TABLE cm_navigation (
  id UUID PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  url VARCHAR(500),
  icon VARCHAR(100),
  "order" INTEGER DEFAULT 0,
  message TEXT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_by_id UUID NOT NULL,
  created_by_name VARCHAR(255) NOT NULL,
  updated_by_id UUID,
  updated_by_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `cm_sub_links` Table (NEW)

```sql
CREATE TABLE cm_sub_links (
  id UUID PRIMARY KEY,
  cms_navigation_id UUID NOT NULL REFERENCES cm_navigation(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  "order" INTEGER DEFAULT 0,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_by_id UUID NOT NULL,
  created_by_name VARCHAR(255) NOT NULL,
  updated_by_id UUID,
  updated_by_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `cm_content` Table (Updated)

```sql
CREATE TABLE cm_content (
  id UUID PRIMARY KEY,
  cms_navigation_id UUID REFERENCES cm_navigation(id),  -- Legacy (optional)
  cm_sub_link_id UUID REFERENCES cm_sub_links(id),      -- New (optional)
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  featured_image_id UUID REFERENCES cm_media_library(id),
  status ENUM('draft', 'published') DEFAULT 'draft',
  "order" INTEGER DEFAULT 0,
  updated_by_id UUID,
  updated_by_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔄 Relationships

```
┌─────────────────┐
│  cm_navigation  │
│  (Main Menu)    │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│  cm_sub_links   │
│  (Categories)   │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│   cm_content    │
│  (Pages)        │
└─────────────────┘
```

## 🚀 API Endpoints

### Navigation Endpoints

- `GET /cm-navigation/all` - Get all navigation items
- `POST /cm-navigation` - Create navigation item
- `PATCH /cm-navigation/:id` - Update navigation item
- `DELETE /cm-navigation/:id` - Delete navigation item

### Sub-Links Endpoints (NEW)

- `GET /cm-sub-links/all` - Get all sub-links
- `GET /cm-sub-links/active` - Get active sub-links only
- `GET /cm-sub-links/navigation/:navigationId` - Get sub-links for specific navigation
- `GET /cm-sub-links/navigation/:navigationId/count` - Count sub-links for navigation
- `GET /cm-sub-links/:id` - Get specific sub-link
- `POST /cm-sub-links` - Create sub-link
- `PATCH /cm-sub-links/:id` - Update sub-link
- `PUT /cm-sub-links/:id/toggle-status` - Toggle sub-link status
- `DELETE /cm-sub-links/:id` - Delete sub-link

### Content Endpoints

- `GET /cm-content/all` - Get all content pages
- `POST /cm-content` - Create content page
- `PATCH /cm-content/:id` - Update content page
- `DELETE /cm-content/:id` - Delete content page

## 💡 Usage Examples

### Example 1: Creating a 3-Tier Structure

#### Step 1: Create Navigation

```javascript
POST /cm-navigation
{
  "label": "About Us",
  "icon": "info-circle",
  "order": 1,
  "status": "active",
  "created_by_id": "user-uuid",
  "created_by_name": "Admin User"
}
// Response: { id: "nav-123", ... }
```

#### Step 2: Create Sub-Links

```javascript
POST /cm-sub-links
{
  "cms_navigation_id": "nav-123",
  "label": "Our History",
  "description": "Learn about our organization's history",
  "order": 1,
  "status": "active",
  "created_by_id": "user-uuid",
  "created_by_name": "Admin User"
}
// Response: { id: "sublink-456", ... }

POST /cm-sub-links
{
  "cms_navigation_id": "nav-123",
  "label": "Our Team",
  "description": "Meet our team members",
  "order": 2,
  "status": "active",
  "created_by_id": "user-uuid",
  "created_by_name": "Admin User"
}
// Response: { id: "sublink-789", ... }
```

#### Step 3: Create Content Pages

```javascript
POST /cm-content
{
  "cm_sub_link_id": "sublink-456",  // Links to "Our History"
  "slug": "founding-story",
  "title": "Our Founding Story",
  "body": "In 1990, our organization was founded...",
  "status": "published",
  "order": 1
}

POST /cm-content
{
  "cm_sub_link_id": "sublink-456",  // Links to "Our History"
  "slug": "major-milestones",
  "title": "Major Milestones",
  "body": "Key achievements throughout our history...",
  "status": "published",
  "order": 2
}

POST /cm-content
{
  "cm_sub_link_id": "sublink-789",  // Links to "Our Team"
  "slug": "leadership-team",
  "title": "Leadership Team",
  "body": "Meet our executive leadership...",
  "status": "published",
  "order": 1
}
```

### Example 2: Fetching Complete Hierarchy

```javascript
// Get navigation with sub-links and content
GET / cm -
  navigation /
    all[
      // Response:
      {
        id: 'nav-123',
        label: 'About Us',
        icon: 'info-circle',
        order: 1,
        status: 'active',
        subLinks: [
          {
            id: 'sublink-456',
            label: 'Our History',
            order: 1,
            contentPages: [
              {
                id: 'content-1',
                title: 'Our Founding Story',
                slug: 'founding-story',
                order: 1
              },
              {
                id: 'content-2',
                title: 'Major Milestones',
                slug: 'major-milestones',
                order: 2
              }
            ]
          },
          {
            id: 'sublink-789',
            label: 'Our Team',
            order: 2,
            contentPages: [
              {
                id: 'content-3',
                title: 'Leadership Team',
                slug: 'leadership-team',
                order: 1
              }
            ]
          }
        ]
      }
    ];
```

## 🔀 Migration Path (2-Tier to 3-Tier)

### Current 2-Tier Structure

```
Navigation → Content Pages (as sub-links)
```

### New 3-Tier Structure

```
Navigation → Sub-Links → Content Pages
```

### Backward Compatibility

The system supports both structures:

- **Legacy**: Content can still link directly to Navigation (`cms_navigation_id`)
- **New**: Content can link to Sub-Links (`cm_sub_link_id`)
- You can migrate gradually without breaking existing content

### Migration Strategy

1. **Keep existing content** with `cms_navigation_id`
2. **Create sub-links** under navigation items
3. **Gradually update content** to use `cm_sub_link_id` instead
4. **Clear `cms_navigation_id`** when content is moved to sub-links

## 📝 Frontend Implementation

### TypeScript Types

```typescript
interface NavigationItem {
  id: string;
  label: string;
  url?: string;
  icon?: string;
  order?: number;
  status: 'active' | 'inactive';
  subLinks?: SubLink[];
  contentPages?: CmsPage[]; // Legacy
}

interface SubLink {
  id: string;
  cms_navigation_id: string;
  label: string;
  description?: string;
  icon?: string;
  order?: number;
  status: 'active' | 'inactive';
  contentPages?: CmsPage[];
}

interface CmsPage {
  id: string;
  cms_navigation_id?: string; // Legacy
  cm_sub_link_id?: string; // New
  slug: string;
  title: string;
  body?: string;
  status: 'draft' | 'published';
  order?: number;
}
```

### Rendering Navigation

```tsx
function NavigationMenu({ items }: { items: NavigationItem[] }) {
  return (
    <nav>
      {items.map((navItem) => (
        <div key={navItem.id}>
          <a href={navItem.url || '#'}>{navItem.label}</a>

          {/* Render sub-links */}
          {navItem.subLinks && navItem.subLinks.length > 0 && (
            <ul>
              {navItem.subLinks.map((subLink) => (
                <li key={subLink.id}>
                  <strong>{subLink.label}</strong>

                  {/* Render content pages under sub-link */}
                  {subLink.contentPages && subLink.contentPages.length > 0 && (
                    <ul>
                      {subLink.contentPages.map((page) => (
                        <li key={page.id}>
                          <a href={`/pages/${page.slug}`}>{page.title}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Legacy: Render content pages directly under navigation */}
          {navItem.contentPages && navItem.contentPages.length > 0 && (
            <ul>
              {navItem.contentPages.map((page) => (
                <li key={page.id}>
                  <a href={`/pages/${page.slug}`}>{page.title}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
}
```

## ✅ Benefits of 3-Tier Structure

1. **Better Organization**: Group related content under sub-categories
2. **Cleaner Navigation**: Separate grouping from actual content
3. **Flexibility**: Each sub-link can have multiple content pages
4. **Scalability**: Easier to manage large amounts of content
5. **User Experience**: More intuitive menu structure
6. **SEO**: Better content hierarchy for search engines

## 🎯 Use Cases

### Use Case 1: Government Website

```
Services (Navigation)
├── Citizen Services (Sub-Link)
│   ├── Birth Registration
│   ├── Death Registration
│   └── Marriage Registration
└── Business Services (Sub-Link)
    ├── Business Registration
    ├── Tax Filing
    └── Licensing
```

### Use Case 2: Company Website

```
About (Navigation)
├── Company Info (Sub-Link)
│   ├── History
│   ├── Mission & Vision
│   └── Awards
└── Team (Sub-Link)
    ├── Leadership
    ├── Departments
    └── Careers
```

### Use Case 3: Educational Portal

```
Resources (Navigation)
├── Study Materials (Sub-Link)
│   ├── Textbooks
│   ├── Practice Papers
│   └── Video Lectures
└── Examinations (Sub-Link)
    ├── Exam Schedule
    ├── Results
    └── Certificates
```

## 🔧 Admin Panel Features

The admin panel should support:

1. **Navigation Management**

   - Create/Edit/Delete navigation items
   - Reorder navigation items
   - Toggle active/inactive status

2. **Sub-Links Management**

   - View sub-links for each navigation item
   - Create sub-links under navigation
   - Edit sub-link details (label, description, icon, order)
   - Toggle sub-link status
   - Delete sub-links

3. **Content Management**
   - Create content and assign to sub-link
   - Move content between sub-links
   - Preview content hierarchy
   - Bulk operations (move, delete, publish)

## 📌 Important Notes

- **Cascade Delete**: Deleting a navigation item deletes all its sub-links and associated content
- **Order Management**: Both sub-links and content pages have `order` fields for sorting
- **Status Control**: Each tier (navigation, sub-link, content) has independent status control
- **Validation**: Content must belong to either a sub-link OR navigation (not both)
- **URLs**: Navigation items can have direct URLs (for external links) even with sub-links

## 🚦 Next Steps

1. ✅ Run database migration to create `cm_sub_links` table
2. ✅ Update frontend types to include SubLink interface
3. ✅ Create UI for managing sub-links in admin panel
4. ✅ Update content creation form to support sub-link selection
5. ✅ Test the complete hierarchy
6. ✅ Document the new structure for team members

---

**Last Updated**: March 6, 2026  
**Version**: 2.0.0 (3-Tier Structure)
