# Granular Master Data Permissions

## Overview

This document explains the granular permission system implemented for Master Data and Roles & Permissions sections.

## Problem Solved

### Before:

1. **Masters** and **Roles & Permissions** sections had no `subject` property
2. All master items required `MANAGE_ALL` permission (Super Admin only)
3. Couldn't grant access to individual master items (e.g., only "Countries")
4. Admin users couldn't be given partial access to master data

### After:

1. All sections and items now have `subject` properties
2. Each master item has specific permissions (`VIEW_*` and `MANAGE_*`)
3. Can grant granular access to individual master items
4. Parent sections are visible if user has access to ANY child item

## New Permissions Added

### Master Data Permissions:

```typescript
// Agencies
VIEW_AGENCIES, MANAGE_AGENCIES;

// Office Locations
VIEW_OFFICE_LOCATIONS, MANAGE_OFFICE_LOCATIONS;

// Relationship Types
VIEW_RELATIONSHIP_TYPES, MANAGE_RELATIONSHIP_TYPES;

// Note: Other master permissions already existed:
// Countries, Dzongkhags, Gewogs, Cities, Genders,
// Marital Status, Literacy Status, Census Status,
// Naturalization Types, Regularization Types,
// Relationship Certificate Purposes
```

## How It Works

### Example 1: Give a user access to only "Countries"

```typescript
// Assign these permissions to the user's role:
permissions: ['view:countries', 'manage:countries'];

// Result:
// ✅ User sees "Masters" section (parent is visible)
// ✅ User sees "Countries" menu item
// ❌ User doesn't see other master items
```

### Example 2: Give a user access to multiple master items

```typescript
// Assign these permissions:
permissions: [
  'view:countries',
  'manage:countries',
  'view:dzongkhags',
  'manage:dzongkhags',
  'view:gewogs',
  'manage:gewogs'
];

// Result:
// ✅ User sees "Masters" section
// ✅ User sees "Countries", "Dzongkhags", and "Gewogs"
// ❌ User doesn't see other master items
```

### Example 3: Give a user view-only access to roles

```typescript
// Assign these permissions:
permissions: ['view:roles'];

// Result:
// ✅ User sees "Roles & Permissions" section
// ✅ User sees "Roles" menu item (but can only view, not edit)
// ❌ User doesn't see "Permissions" item
```

## Access Control Logic

### Parent Sections

Parent sections (Masters, Roles & Permissions) are now visible if the user has **any** of the child permissions:

```typescript
// Masters section is visible if user has ANY of:
[
  'manage:all',
  'view:agencies',
  'view:office-locations',
  'view:relationship-types',
  'view:countries'
  // ... etc (all master view permissions)
][
  // Roles & Permissions section is visible if user has ANY of:
  ('manage:all',
  'manage:roles',
  'view:roles',
  'manage:permissions',
  'view:permissions')
];
```

### Child Items

Each child item checks for specific permissions:

```typescript
// Countries item is visible if user has ANY of:
['manage:all', 'view:countries', 'manage:countries'][
  // Roles item is visible if user has ANY of:
  ('manage:all', 'manage:roles', 'view:roles')
];
```

## Benefits

1. **Granular Control**: Assign specific master data management to different teams
2. **Security**: No need to give `MANAGE_ALL` for simple master data access
3. **Flexibility**: Mix and match permissions as needed
4. **Better UX**: Users only see what they have access to

## Use Cases

### Use Case 1: Location Manager

A user who only manages geographic data:

```typescript
permissions: [
  'view:countries',
  'manage:countries',
  'view:dzongkhags',
  'manage:dzongkhags',
  'view:gewogs',
  'manage:gewogs',
  'view:cities',
  'manage:cities'
];
```

### Use Case 2: Demographics Manager

A user who only manages demographic master data:

```typescript
permissions: [
  'view:genders',
  'manage:genders',
  'view:marital-status',
  'manage:marital-status',
  'view:literacy-status',
  'manage:literacy-status'
];
```

### Use Case 3: Role Viewer

A user who can view roles but not modify them:

```typescript
permissions: ['view:roles', 'view:permissions'];
```

## Implementation Notes

1. **Removed `superAdminOnly` flag**: No longer needed since we use permissions
2. **Added `subject` to all items**: Required for ability-based filtering
3. **Backward compatible**: `MANAGE_ALL` still grants access to everything
4. **Frontend filtering**: Navigation automatically filters based on user permissions

## Next Steps

1. Update backend controllers to check these new permissions
2. Seed these new permissions in the database
3. Update role assignment UI to include these new permissions
4. Test permission combinations thoroughly
