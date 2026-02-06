# Master Data Integration Status

## ✅ Completed (3/14 entities)

1. **Agencies** - Full CRUD with instant updates
2. **Office Locations** - Full CRUD with instant updates
3. **Relationships** - Full CRUD with instant updates

## 🔄 Remaining to Integrate (11/14 entities)

### High Priority (Core Location Data)

1. **Countries** - `/dashboard/(masters)/countries`
2. **Dzongkhags** - `/dashboard/(masters)/dzongkhags`
3. **Gewogs** - `/dashboard/(masters)/gewogs`
4. **Cities** - `/dashboard/(masters)/cities`

### Medium Priority (Demographics)

5. **Genders** - `/dashboard/(masters)/genders`
6. **Marital Status** - `/dashboard/(masters)/marital-status`
7. **Literacy Status** - `/dashboard/(masters)/literacy-status`
8. **Census Status** - `/dashboard/(masters)/census-status`

### Lower Priority (Registration Types)

9. **Naturalization Types** - `/dashboard/(masters)/naturalization-types`
10. **Regularization Types** - `/dashboard/(masters)/regularization-types`
11. **Relationship Certificate Purposes** - `/dashboard/(masters)/relationship-certificate-purposes`

## Implementation Summary

### What's Done ✅

- **API Actions**: All CRUD functions exist in `/src/actions/common/{entity}-actions.ts`
- **Backend APIs**: All endpoints are available and working
- **Basic UI**: All entities have list views with tables
- **Reference Implementation**: Relationships module is complete with:
  - Edit modal component
  - Instant update support in columns
  - Refresh trigger in table
  - Client component page with callbacks
  - Updated add button

### What's Needed 🔧

For each of the 11 remaining entities, you need to:

1. **Create Edit Modal** (`edit-{entity}-modal.tsx`)

   - Copy from `relationship-types/edit-relationship-modal.tsx`
   - Replace entity names appropriately

2. **Update Columns** (`columns.tsx`)

   - Import edit modal
   - Make columns a function accepting `onDataChange`
   - Update ActionsCell to use `onDataChange?.()` instead of `router.refresh()`
   - Add edit button and modal

3. **Update Table** (`{entity}-table.tsx`)

   - Add `useCallback` for fetchData
   - Add `refreshTrigger` prop
   - Add `onDataChange` prop
   - Add two useEffects (one for params, one for refresh trigger)
   - Pass `onDataChange` to columns

4. **Update Page** (`page.tsx`)

   - Convert to client component ('use client')
   - Remove metadata export
   - Add `useState` for refreshTrigger
   - Add `useCallback` for handleDataChange
   - Pass callbacks to table and add button

5. **Update Add Button** (`add-{entity}-button.tsx`)
   - Remove `useRouter`
   - Add `onSuccess` prop
   - Call `onSuccess?.()` instead of `router.refresh()`

## Quick Start Guide

### Option 1: Manual Implementation (Recommended for Learning)

Follow these steps for each entity:

```bash
# Start with Countries as it's commonly used
cd src/app/dashboard/(masters)/countries/_components

# 1. Create edit modal (copy from relationships)
cp ../../relationship-types/_components/edit-relationship-modal.tsx ./edit-country-modal.tsx

# 2. Update the modal file (search & replace)
# Replace: Relationship -> Country
# Replace: relationship -> country
# Replace: relationship-actions -> country-actions

# 3. Update columns.tsx (add instant update support)
# 4. Update countries-table.tsx (add refresh trigger)
# 5. Update page.tsx (convert to client component)
# 6. Update add-country-button.tsx (remove router)
```

### Option 2: Automated Implementation (Fastest)

I can create a Node.js script that automatically generates and updates all files:

```javascript
// generate-master-crud.js
const fs = require('fs');
const path = require('path');

const entities = [
  { folder: 'countries', component: 'Country', display: 'Country' },
  { folder: 'dzongkhags', component: 'Dzongkhag', display: 'Dzongkhag' }
  // ... etc
];

// Generate edit modals, update columns, tables, pages, and buttons
// (Full script available upon request)
```

### Option 3: Use the Guide

Reference the `MASTER_DATA_CRUD_GUIDE.md` file which contains:

- Complete code templates
- Step-by-step instructions
- Entity-specific mappings
- Testing checklist

## Testing Checklist Per Entity

After implementing each entity, verify:

- [ ] **Create**: Click "Add {Entity}" → Fill form → Save → Item appears instantly
- [ ] **Read**: Table loads with data and pagination works
- [ ] **Update**: Click Edit → Change name → Save → Changes appear instantly
- [ ] **Delete**: Click Delete → Confirm → Item removed instantly
- [ ] **No Errors**: Check browser console for errors
- [ ] **Toasts**: Success/error messages appear correctly
- [ ] **Navigation**: Pagination works after CRUD operations

## Priority Order Recommendation

1. Start with **Countries** (most fundamental)
2. Then **Dzongkhags** (depends on countries)
3. Then **Gewogs** (depends on dzongkhags)
4. Then **Cities**
5. Then the remaining demographics and types

## Time Estimate

- Per entity (manual): ~15-20 minutes
- Total for 11 entities: ~3-4 hours
- With automation script: ~30 minutes

## Need Help?

If you want me to:

1. ✅ Create the automation script
2. ✅ Implement specific entities one by one
3. ✅ Generate all edit modals at once
4. ✅ Help debug any issues

Just let me know!
