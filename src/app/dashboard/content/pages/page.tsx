'use client';

import { useEffect, useState, useMemo } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTable } from '@/components/ui/table/data-table';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { getColumns } from './_components/columns';
import { PageDialog } from './_components/page-dialog';
import {
  CmsPage,
  getCmsPages,
  createCmsPage,
  updateCmsPage,
  deleteCmsPage
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function ContentPage() {
  const [data, setData] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);

  // Delete states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getCmsPages();
    if (result.success && result.data) {
      setData(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedPage(null);
    setDialogOpen(true);
  };

  const handleEdit = (pageData: CmsPage) => {
    setSelectedPage(pageData);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleSave = async (formData: Partial<CmsPage>) => {
    try {
      if (selectedPage) {
        const result = await updateCmsPage(selectedPage.id, formData);
        if (result.success) toast.success(result.message);
      } else {
        const result = await createCmsPage(formData as any);
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
      const result = await deleteCmsPage(deleteId);
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
      pageTitle="Content Pages"
      pageDescription="Manage content pages for the portal."
      pageHeaderAction={
        <Button onClick={handleAdd}>
          <Icons.add className="mr-2 h-4 w-4" /> Add Page
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

      <PageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        page={selectedPage}
        onSave={handleSave}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
        title="Delete Page"
        description="Are you sure you want to delete this page? This action cannot be undone."
      />
    </PageContainer>
  );
}
