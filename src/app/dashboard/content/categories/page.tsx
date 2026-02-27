'use client';

import { useEffect, useState, useMemo } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTable } from '@/components/ui/table/data-table';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { getColumns } from './_components/columns';
import { CategoryDialog } from './_components/category-dialog';
import {
  AnnouncementCategory,
  getAnnouncementCategories,
  createAnnouncementCategory,
  updateAnnouncementCategory,
  deleteAnnouncementCategory
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function CategoriesPage() {
  const [data, setData] = useState<AnnouncementCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<AnnouncementCategory | null>(null);

  // Delete states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getAnnouncementCategories();
    if (result.success && result.data) {
      setData(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleEdit = (category: AnnouncementCategory) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleSave = async (formData: Partial<AnnouncementCategory>) => {
    try {
      if (selectedCategory) {
        const result = await updateAnnouncementCategory(
          selectedCategory.id,
          formData
        );
        if (result.success) {
          toast.success(result.message);
          setDialogOpen(false);
        } else {
          toast.error(result.error || 'Failed to update category');
        }
      } else {
        const result = await createAnnouncementCategory(formData as any);
        if (result.success) {
          toast.success(result.message);
          setDialogOpen(false);
        } else {
          toast.error(result.error || 'Failed to create category');
        }
      }
      fetchData();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('An error occurred while saving');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await deleteAnnouncementCategory(deleteId);
      if (result.success) toast.success(result.message);
      else toast.error(result.error || 'Failed to delete category');
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
      pageTitle="Notice Categories"
      pageDescription="Manage categories for organizing public notices and official updates."
      pageHeaderAction={
        <Button onClick={handleAdd}>
          <Icons.add className="mr-2 h-4 w-4" /> Add Category
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? (
          <DataTableSkeleton columnCount={5} rowCount={5} />
        ) : (
          <DataTable columns={columns} data={data} totalItems={data.length} />
        )}
      </div>

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={selectedCategory}
        onSave={handleSave}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone. Note: You cannot delete categories that have associated announcements."
      />
    </PageContainer>
  );
}
