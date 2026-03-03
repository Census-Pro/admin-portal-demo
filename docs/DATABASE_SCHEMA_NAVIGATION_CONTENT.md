# Database Schema: Navigation & Content Pages

## 📊 Database Tables Overview

The navigation links (nav links) and sub-links (content pages) are stored in **TWO separate tables** in the database:

1. **`cm_navigation`** - Stores parent navigation menu items
2. **`cm_content`** - Stores content pages (sub-links)

---

## 🗄️ Table Structure

### Table 1: `cm_navigation` (Navigation Items / Parent Menu)

This table stores the **main navigation menu items** that appear in your navigation bar.

```sql
CREATE TABLE cm_navigation (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  label             varchar(255) NOT NULL,        -- e.g., "About Us", "Services"
  url               varchar(500) NULL,            -- e.g., "/about" (optional)
  icon              varchar(100) NULL,            -- e.g., "info", "apps"
  message           text NULL,                    -- Hover message
  status            enum('active', 'inactive') DEFAULT 'active',
  "order"           integer DEFAULT 0,            -- Display order
  created_by_id     uuid NOT NULL,
  created_by_name   varchar(255) NOT NULL,
  updated_by_id     uuid NULL,
  updated_by_name   varchar(255) NULL,
  created_at        timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at        timestamp DEFAULT CURRENT_TIMESTAMP
);
```

**Example Records:**

| id (uuid) | label          | url       | icon | status | order |
| --------- | -------------- | --------- | ---- | ------ | ----- |
| `abc-123` | About Us       | /about    | info | active | 1     |
| `def-456` | Services       | /services | apps | active | 2     |
| `ghi-789` | Help & Support | /help     | help | active | 3     |

---

### Table 2: `cm_content` (Content Pages / Sub-Links)

This table stores the **actual content pages** that can appear as dropdown items under navigation links.

```sql
CREATE TABLE cm_content (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  cms_navigation_id   uuid NULL,                  -- Foreign key to cm_navigation (nullable!)
  featured_image_id   uuid NULL,                  -- Foreign key to cm_media_library
  slug                varchar(255) UNIQUE NOT NULL, -- e.g., "about-census-2026"
  title               varchar(500) NOT NULL,       -- e.g., "About Census 2026"
  body                text NOT NULL,               -- HTML content
  status              enum('draft', 'published') DEFAULT 'draft',
  "order"             integer DEFAULT 0,           -- Display order within nav group
  updated_by_id       uuid NULL,
  updated_by_name     varchar(255) NULL,
  created_at          timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at          timestamp DEFAULT CURRENT_TIMESTAMP,

  -- Foreign Key Constraints
  CONSTRAINT fk_cm_content_navigation
    FOREIGN KEY (cms_navigation_id)
    REFERENCES cm_navigation(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_cm_content_featured_image
    FOREIGN KEY (featured_image_id)
    REFERENCES cm_media_library(id)
    ON DELETE SET NULL
);
```

**Example Records:**

| id (uuid)  | title              | slug               | cms_navigation_id    | status    | order |
| ---------- | ------------------ | ------------------ | -------------------- | --------- | ----- |
| `page-001` | About Census 2026  | about-census-2026  | `abc-123` (About Us) | published | 1     |
| `page-002` | Our Team           | our-team           | `abc-123` (About Us) | published | 2     |
| `page-003` | Birth Registration | birth-registration | `def-456` (Services) | published | 1     |
| `page-004` | Privacy Policy     | privacy-policy     | `NULL` (standalone)  | published | 1     |

---

## 🔗 Relationship Diagram

```
┌─────────────────────────────────────┐
│      cm_navigation                  │  ← PARENT TABLE (Nav Links)
├─────────────────────────────────────┤
│ id (PK)           uuid              │
│ label             varchar(255)      │  "About Us"
│ url               varchar(500)      │  "/about"
│ icon              varchar(100)      │  "info"
│ status            enum              │  "active"
│ order             integer           │  1
└─────────────────────────────────────┘
         ↑
         │ One-to-Many Relationship
         │ (One navigation can have many content pages)
         │
         │ cms_navigation_id (FK)
         │
┌─────────────────────────────────────┐
│      cm_content                     │  ← CHILD TABLE (Content Pages / Sub-Links)
├─────────────────────────────────────┤
│ id (PK)                uuid         │
│ cms_navigation_id (FK) uuid NULL    │  Points to cm_navigation.id
│ featured_image_id (FK) uuid NULL    │  Points to cm_media_library.id
│ title                  varchar(500) │  "About Census 2026"
│ slug                   varchar(255) │  "about-census-2026"
│ body                   text         │  "<h1>About...</h1>..."
│ status                 enum         │  "published" or "draft"
│ order                  integer      │  Display order within nav group
└─────────────────────────────────────┘
```

---

## 🎯 How Navigation Links Work

### Navigation Item (Parent)

- Stored in **`cm_navigation`** table
- Has properties: `label`, `url`, `icon`, `status`, `order`
- Can have **zero or many** content pages linked to it

### Sub-Links (Content Pages)

- Stored in **`cm_content`** table
- Has a **foreign key** `cms_navigation_id` that points to `cm_navigation.id`
- If `cms_navigation_id` is **NULL**, it's a **standalone page** (no navigation link)
- If `cms_navigation_id` has a **value**, it appears as a sub-link under that navigation item

---

## 📋 Example: "About Us" with Sub-Links

### Step 1: Navigation Item Created

```sql
INSERT INTO cm_navigation (id, label, url, icon, status, "order")
VALUES ('abc-123-def-456', 'About Us', '/about', 'info', 'active', 1);
```

**Result in `cm_navigation` table:**

| id              | label    | url    | icon | status | order |
| --------------- | -------- | ------ | ---- | ------ | ----- |
| abc-123-def-456 | About Us | /about | info | active | 1     |

---

### Step 2: Content Pages (Sub-Links) Created

**Content Page #1: "About Census 2026"**

```sql
INSERT INTO cm_content (id, cms_navigation_id, title, slug, body, status, "order")
VALUES (
  'page-001',
  'abc-123-def-456',  -- Links to "About Us"
  'About Census 2026',
  'about-census-2026',
  '<h1>About Census 2026</h1>...',
  'published',
  1
);
```

**Content Page #2: "Our Team"**

```sql
INSERT INTO cm_content (id, cms_navigation_id, title, slug, body, status, "order")
VALUES (
  'page-002',
  'abc-123-def-456',  -- Links to "About Us"
  'Our Team',
  'our-team',
  '<h1>Meet Our Team</h1>...',
  'published',
  2
);
```

**Result in `cm_content` table:**

| id       | cms_navigation_id | title             | slug              | status    | order |
| -------- | ----------------- | ----------------- | ----------------- | --------- | ----- |
| page-001 | abc-123-def-456   | About Census 2026 | about-census-2026 | published | 1     |
| page-002 | abc-123-def-456   | Our Team          | our-team          | published | 2     |

---

## 🔍 Database Query Examples

### 1. Get All Navigation Items with Their Sub-Links

```sql
SELECT
  cn.id as nav_id,
  cn.label as nav_label,
  cn.url as nav_url,
  cn.status as nav_status,
  cc.id as page_id,
  cc.title as page_title,
  cc.slug as page_slug,
  cc.status as page_status,
  cc."order" as page_order
FROM cm_navigation cn
LEFT JOIN cm_content cc ON cn.id = cc.cms_navigation_id
ORDER BY cn."order", cc."order";
```

**Expected Result:**

| nav_label | nav_url   | page_title         | page_slug          | page_order |
| --------- | --------- | ------------------ | ------------------ | ---------- |
| About Us  | /about    | About Census 2026  | about-census-2026  | 1          |
| About Us  | /about    | Our Team           | our-team           | 2          |
| Services  | /services | Birth Registration | birth-registration | 1          |
| Services  | /services | Death Registration | death-registration | 2          |

---

### 2. Get All Standalone Pages (No Navigation Link)

```sql
SELECT
  id,
  title,
  slug,
  status
FROM cm_content
WHERE cms_navigation_id IS NULL
ORDER BY "order";
```

**Expected Result:**

| title                | slug                 | status    |
| -------------------- | -------------------- | --------- |
| Privacy Policy       | privacy-policy       | published |
| Terms and Conditions | terms-and-conditions | published |

---

### 3. Count Sub-Links Per Navigation Item

```sql
SELECT
  cn.label,
  COUNT(cc.id) as sub_link_count
FROM cm_navigation cn
LEFT JOIN cm_content cc ON cn.id = cc.cms_navigation_id
GROUP BY cn.id, cn.label
ORDER BY cn."order";
```

**Expected Result:**

| label          | sub_link_count |
| -------------- | -------------- |
| About Us       | 2              |
| Services       | 2              |
| Resources      | 0              |
| Help & Support | 2              |

---

### 4. Get Sub-Links for Specific Navigation Item

```sql
SELECT
  cc.id,
  cc.title,
  cc.slug,
  cc.status,
  cc."order"
FROM cm_content cc
JOIN cm_navigation cn ON cc.cms_navigation_id = cn.id
WHERE cn.label = 'About Us'
ORDER BY cc."order";
```

**Expected Result:**

| title             | slug              | status    | order |
| ----------------- | ----------------- | --------- | ----- |
| About Census 2026 | about-census-2026 | published | 1     |
| Our Team          | our-team          | published | 2     |

---

## 🎨 Visual Representation

```
DATABASE STRUCTURE:

cm_navigation (Parent)
├── id: abc-123-def-456
├── label: "About Us"
├── url: "/about"
└── contentPages (sub-links):
    ├── cm_content (Child)
    │   ├── id: page-001
    │   ├── cms_navigation_id: abc-123-def-456 ✅
    │   ├── title: "About Census 2026"
    │   └── slug: "about-census-2026"
    └── cm_content (Child)
        ├── id: page-002
        ├── cms_navigation_id: abc-123-def-456 ✅
        ├── title: "Our Team"
        └── slug: "our-team"

cm_content (Standalone - No Parent)
├── id: page-999
├── cms_navigation_id: NULL ❌ (no nav link)
├── title: "Privacy Policy"
└── slug: "privacy-policy"
```

---

## 🔑 Key Points

✅ **Navigation items** are stored in `cm_navigation`  
✅ **Content pages (sub-links)** are stored in `cm_content`  
✅ The link between them is the **`cms_navigation_id`** foreign key  
✅ If `cms_navigation_id` is **NULL** → Standalone page (no dropdown)  
✅ If `cms_navigation_id` has a **value** → Sub-link under that navigation  
✅ **One navigation** can have **many content pages** (One-to-Many)  
✅ **Cascade delete**: If you delete a navigation item, all its sub-links are also deleted

---

## 📊 Complete Data Flow

```
USER ACTION                  DATABASE OPERATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Create "About Us"    →    INSERT INTO cm_navigation (label, url, ...)
   navigation item           VALUES ('About Us', '/about', ...);
                             ✅ Record in cm_navigation table

2. Click "View          →    SELECT * FROM cm_content
   Sub-Links"                WHERE cms_navigation_id = 'abc-123';
                             ✅ Shows empty list (no sub-links yet)

3. Click "Add           →    Opens PageDialog modal
   Sub-Link"                 Pre-fills cms_navigation_id = 'abc-123'

4. Fill form and        →    INSERT INTO cm_content
   Save                      (cms_navigation_id, title, slug, body, ...)
                             VALUES ('abc-123', 'About Census 2026', ...);
                             ✅ Record in cm_content table with FK link

5. View Sub-Links       →    SELECT * FROM cm_content
   again                     WHERE cms_navigation_id = 'abc-123';
                             ✅ Shows "About Census 2026" in list
```

---

## 🎯 Summary

| Feature             | Table           | Column                        | Description                       |
| ------------------- | --------------- | ----------------------------- | --------------------------------- |
| **Navigation Item** | `cm_navigation` | `id`, `label`, `url`, `icon`  | Parent menu item                  |
| **Sub-Link**        | `cm_content`    | `id`, `title`, `slug`, `body` | Content page                      |
| **Link Between**    | `cm_content`    | `cms_navigation_id` (FK)      | Points to parent navigation       |
| **Standalone Page** | `cm_content`    | `cms_navigation_id = NULL`    | No navigation link                |
| **Featured Image**  | `cm_content`    | `featured_image_id` (FK)      | Optional image from media library |

---

## ✅ You're All Set!

Now you know exactly where everything is stored in the database! 🎉

- **Nav Links** → `cm_navigation` table
- **Sub-Links (Content Pages)** → `cm_content` table
- **Relationship** → `cms_navigation_id` foreign key in `cm_content`
