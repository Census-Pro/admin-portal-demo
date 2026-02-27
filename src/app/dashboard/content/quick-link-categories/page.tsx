'use client';

import { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTable } from '@/components/ui/table/data-table';
import { QuickLinkCategoryDialog } from './_components/category-dialog';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { toast } from 'sonner';
import {
  QuickLinkCategory,
  getQuickLinkCategories,
  deleteQuickLinkCategory,
  toggleQuickLinkCategoryStatus
} from '@/actions/common/cms-actions';
import { createColumns } from './_components/columns';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function QuickLinkCategoriesPage() {
  const [categories, setCategories] = useState<QuickLinkCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] =
    useState<QuickLinkCategory | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const result = await getQuickLinkCategories();
      if (result.success && result.data) {
        setCategories(result.data);
      } else {
        toast.error(result.error || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: QuickLinkCategory) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  };

  const handleDelete = (category: QuickLinkCategory) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    setDeleting(true);
    try {
      const result = await deleteQuickLinkCategory(selectedCategory.id);

      if (result.success) {
        toast.success(result.message);
        fetchCategories();
      } else {
        toast.error(result.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
    }
  };

  const handleToggleActive = async (category: QuickLinkCategory) => {
    try {
      const result = await toggleQuickLinkCategoryStatus(category.id);

      if (result.success) {
        toast.success('Status updated successfully');
        fetchCategories();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Error updating status');
    }
  };

  const columns = createColumns(handleEdit, handleDelete, handleToggleActive);

  return (
    <PageContainer
      pageTitle="Quick Link Categories"
      pageDescription="Manage categories for organizing quick links"
      pageHeaderAction={
        <Button
          onClick={() => {
            setSelectedCategory(null);
            setDialogOpen(true);
          }}
        >
          <Icons.add className="mr-2 h-5 w-5" />
          Add Category
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? (
          <DataTableSkeleton columnCount={6} rowCount={5} />
        ) : (
          <DataTable
            columns={columns}
            data={categories}
            totalItems={categories.length}
          />
        )}
      </div>

      <QuickLinkCategoryDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        onSave={() => {
          fetchCategories();
          setDialogOpen(false);
          setSelectedCategory(null);
        }}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedCategory(null);
        }}
        onConfirm={confirmDelete}
        isLoading={deleting}
        title="Delete Category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"? All quick links in this category will need to be reassigned.`}
      />
    </PageContainer>
  );
}
