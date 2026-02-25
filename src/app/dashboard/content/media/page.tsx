'use client';

import { useEffect, useState, useMemo } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTable } from '@/components/ui/table/data-table';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { getColumns } from './_components/columns';
import { MediaDialog } from './_components/media-dialog';
import {
  MediaItem,
  getMediaItems,
  uploadMediaFile,
  updateMediaFileWithUpload,
  updateMediaItem,
  deleteMediaItem
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function MediaLibraryPage() {
  const [data, setData] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Delete states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getMediaItems();
    if (result.success && result.data) {
      setData(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedMedia(null);
    setDialogOpen(true);
  };

  const handleEdit = (mediaData: MediaItem) => {
    setSelectedMedia(mediaData);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleSave = async (
    formData: FormData | Partial<MediaItem>,
    file?: File
  ) => {
    try {
      if (selectedMedia) {
        // Updating existing media
        if (file && formData instanceof FormData) {
          const result = await updateMediaFileWithUpload(
            selectedMedia.id,
            formData
          );
          if (result.success) toast.success(result.message);
          else toast.error(result.error);
        } else if (formData && !(formData instanceof FormData)) {
          const result = await updateMediaItem(selectedMedia.id, formData);
          if (result.success) toast.success(result.message);
          else toast.error(result.error);
        }
      } else {
        // Creating new media
        if (formData instanceof FormData) {
          const result = await uploadMediaFile(formData);
          if (result.success) toast.success(result.message);
          else toast.error(result.error);
        }
      }
      fetchData();
    } catch (error) {
      toast.error('An error occurred');
      console.error('Save error:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await deleteMediaItem(deleteId);
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
      pageTitle="Media Library"
      pageDescription="Manage media assets (images, documents, videos)."
      pageHeaderAction={
        <Button onClick={handleAdd}>
          <Icons.add className="mr-2 h-4 w-4" /> Upload Media
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

      <MediaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        media={selectedMedia}
        onSave={handleSave}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
        title="Delete Media"
        description="Are you sure you want to delete this media file? This action cannot be undone."
      />
    </PageContainer>
  );
}
