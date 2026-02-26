'use client';

import { useEffect, useState, useMemo } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTable } from '@/components/ui/table/data-table';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { getColumns } from './_components/columns';
import { NavigationDialog } from './_components/navigation-dialog';
import {
  NavigationItem,
  getNavigationItems,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function NavigationPage() {
  const [data, setData] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);

  // Delete states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getNavigationItems();
    if (result.success && result.data) {
      setData(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };

  const handleEdit = (navData: NavigationItem) => {
    setSelectedItem(navData);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleSave = async (formData: Partial<NavigationItem>) => {
    try {
      if (selectedItem) {
        const result = await updateNavigationItem(selectedItem.id, formData);
        if (result.success) toast.success(result.message);
      } else {
        const result = await createNavigationItem(formData as any);
        if (result.success) toast.success(result.message);
      }
      fetchData();
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await deleteNavigationItem(deleteId);
      if (result.success) toast.success(result.message);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
    setDeleting(false);
    setDeleteOpen(false);
  };

  const columns = useMemo(
    () => getColumns({ onEdit: handleEdit, onDelete: handleDeleteClick }),
    []
  );

  return (
    <PageContainer
      pageTitle="Navigation Links (NavLinks)"
      pageDescription="Manage main navigation menu items. Each nav item can have sub-links (content pages) as dropdowns."
      pageHeaderAction={
        <Button onClick={handleAdd}>
          <Icons.add className="mr-2 h-4 w-4" /> Add Nav Link
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? (
          <DataTableSkeleton columnCount={4} rowCount={5} />
        ) : (
          <DataTable columns={columns} data={data} totalItems={data.length} />
        )}
      </div>

      <NavigationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={selectedItem}
        onSave={handleSave}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
        title="Delete Menu Item"
        description="Are you sure you want to delete this menu item? This action cannot be undone."
      />
    </PageContainer>
  );
}
