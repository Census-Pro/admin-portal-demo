# Master Data CRUD Implementation Guide

This guide shows how to implement instant CRUD operations for all master data entities following the same pattern as agencies and office-locations.

## Entities to Update

1. Countries
2. Dzongkhags
3. Gewogs
4. Cities
5. Genders
6. Marital Status
7. Literacy Status
8. Census Status
9. Naturalization Types
10. Regularization Types
11. Relationship Certificate Purposes

## Pattern to Follow (Use Relationships as Reference)

### Step 1: Create Edit Modal

Create `edit-{entity}-modal.tsx` in each entity's `_components/` folder.

**Template** (replace {Entity}, {entity}, {display-name}, {api-path}):

```typescript
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { update{Entity} } from '@/actions/common/{entity}-actions';
import { toast } from 'sonner';

interface {Entity} {
  id: string;
  name: string;
}

interface Edit{Entity}ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  {entity}: {Entity} | null;
}

export function Edit{Entity}Modal({
  isOpen,
  onClose,
  onSuccess,
  {entity}
}: Edit{Entity}ModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if ({entity}) {
      setFormData({
        name: {entity}.name
      });
    }
  }, [{entity}]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!{entity}) return;

    setIsLoading(true);

    try {
      const result = await update{Entity}({
        id: {entity}.id,
        name: formData.name
      });

      if (result.success) {
        toast.success(result.message || '{Display Name} updated successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || 'Failed to update {display name}');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Update {display name} error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit {Display Name}</DialogTitle>
          <DialogDescription>
            Update the {display name} details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{Display Name} Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter {display name} name"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update {Display Name}'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Step 2: Update columns.tsx

1. Remove unused imports (DropdownMenu, useRouter)
2. Add Edit modal import
3. Make columns a function: `export const columns = (onDataChange?: () => void): ColumnDef<{Entity}>[] => [`
4. Update ActionsCell to accept onDataChange
5. Replace router.refresh() with onDataChange?.()
6. Add edit modal and handler

**Key Changes**:

```typescript
// Remove these
import { useRouter } from 'next/navigation';
import { DropdownMenu, ... } from '@/components/ui/dropdown-menu';

// Add this
import { Edit{Entity}Modal } from './edit-{entity}-modal';

// Change from
export const columns: ColumnDef<{Entity}>[] = [

// To
export const columns = (onDataChange?: () => void): ColumnDef<{Entity}>[] => [

// In ActionsCell
function ActionsCell({ {entity}, onDataChange }: { {entity}: {Entity}; onDataChange?: () => void }) {
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    onDataChange?.();
  };

  const handleConfirmDelete = async () => {
    // ... existing delete logic
    onDataChange?.(); // Replace router.refresh()
  };

  return (
    <>
      <Edit{Entity}Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        {entity}={{entity}}
      />
      {/* ... existing dialogs and buttons */}
    </>
  );
}
```

### Step 3: Update table component

Add `useCallback`, `refreshTrigger` support:

```typescript
import { useCallback } from 'react';

interface {Entity}TableProps {
  // ... existing props
  refreshTrigger?: number;
  onDataChange?: () => void;
}

export function {Entity}Table({
  // ... existing props
  refreshTrigger = 0,
  onDataChange
}: {Entity}TableProps) {
  // Wrap fetchData in useCallback
  const fetchData = useCallback(async () => {
    // ... existing fetch logic
  }, [searchParams.page, searchParams.limit]); // Add relevant dependencies

  // Add two useEffects
  useEffect(() => {
    fetchData();
  }, [searchParams.page, searchParams.limit, fetchData]);

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchData();
    }
  }, [refreshTrigger, fetchData]);

  // Update return
  return (
    <DataTable
      columns={columns(onDataChange)}
      data={data}
      totalItems={totalItems}
    />
  );
}
```

### Step 4: Update page.tsx

Convert to client component with refresh trigger:

```typescript
'use client';

import { Suspense, useState, useCallback } from 'react';

export default function {Entity}ManagementPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataChange = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <PageContainer
      pageHeaderAction={<Add{Entity}Button onSuccess={handleDataChange} />}
    >
      <Suspense fallback={<DataTableSkeleton />}>
        <{Entity}Table
          refreshTrigger={refreshTrigger}
          onDataChange={handleDataChange}
        />
      </Suspense>
    </PageContainer>
  );
}
```

### Step 5: Update add button component

Remove router, add onSuccess prop:

```typescript
interface Add{Entity}ButtonProps {
  onSuccess?: () => void;
}

export function Add{Entity}Button({ onSuccess }: Add{Entity}ButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <IconPlus className="mr-2 h-4 w-4" />
        Add {Entity}
      </Button>
      <Add{Entity}Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          onSuccess?.();
          setIsOpen(false);
        }}
      />
    </>
  );
}
```

## Entity-Specific Mappings

| Folder Name                       | Component Name                 | Display Name                     | API Path                          | Action File                              |
| --------------------------------- | ------------------------------ | -------------------------------- | --------------------------------- | ---------------------------------------- |
| countries                         | Country                        | Country                          | countries                         | country-actions                          |
| dzongkhags                        | Dzongkhag                      | Dzongkhag                        | dzongkhags                        | dzongkhag-actions                        |
| gewogs                            | Gewog                          | Gewog                            | gewogs                            | gewog-actions                            |
| cities                            | City                           | City                             | cities                            | city-actions                             |
| genders                           | Gender                         | Gender                           | genders                           | gender-actions                           |
| marital-status                    | MaritalStatus                  | Marital Status                   | marital-statuses                  | marital-status-actions                   |
| literacy-status                   | LiteracyStatus                 | Literacy Status                  | literacy-statuses                 | literacy-status-actions                  |
| census-status                     | CensusStatus                   | Census Status                    | census-statuses                   | census-status-actions                    |
| naturalization-types              | NaturalizationType             | Naturalization Type              | naturalization-types              | naturalization-type-actions              |
| regularization-types              | RegularizationType             | Regularization Type              | regularization-types              | regularization-type-actions              |
| relationship-certificate-purposes | RelationshipCertificatePurpose | Relationship Certificate Purpose | relationship-certificate-purposes | relationship-certificate-purpose-actions |

## Files to Update Per Entity

1. `_components/edit-{entity}-modal.tsx` - CREATE NEW
2. `_components/columns.tsx` - UPDATE
3. `_components/{entity}-table.tsx` - UPDATE
4. `_components/add-{entity}-button.tsx` - UPDATE
5. `page.tsx` - UPDATE

## Testing Checklist

For each entity, verify:

- ✅ Create: New item appears instantly without browser refresh
- ✅ Edit: Changes appear instantly in the table
- ✅ Delete: Item removed instantly from table
- ✅ No console errors
- ✅ Toast notifications appear correctly
- ✅ Pagination works after operations
- ✅ Search works (if applicable)

## Reference Implementation

✅ **Completed**: Relationships, Office Locations, Agencies

Use these as reference when implementing the remaining entities.
