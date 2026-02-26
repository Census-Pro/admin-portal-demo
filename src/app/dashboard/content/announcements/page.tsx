'use client';

import { useEffect, useState, useMemo } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTable } from '@/components/ui/table/data-table';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { getColumns } from './_components/columns';
import { AnnouncementDialog } from './_components/announcement-dialog';
import {
  Announcement,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function AnnouncementsPage() {
  const [data, setData] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  // Delete states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const result = await getAnnouncements();
    if (result.success && result.data) {
      setData(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    setSelectedAnnouncement(null);
    setDialogOpen(true);
  };

  const handleEdit = (ann: Announcement) => {
    setSelectedAnnouncement(ann);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleSave = async (formData: Partial<Announcement>, file?: File) => {
    try {
      if (selectedAnnouncement) {
        const result = await updateAnnouncement(
          selectedAnnouncement.id,
          formData,
          file
        );
        if (result.success) {
          toast.success(result.message);
          setDialogOpen(false);
        } else {
          toast.error(result.error || 'Failed to update announcement');
        }
      } else {
        const result = await createAnnouncement(formData as any, file);
        if (result.success) {
          toast.success(result.message);
          setDialogOpen(false);
        } else {
          toast.error(result.error || 'Failed to create announcement');
        }
      }
      fetchData();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('An error occurred while saving');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await deleteAnnouncement(deleteId);
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
      pageTitle="Announcements & News"
      pageDescription="Manage announcements and news for the portal."
      pageHeaderAction={
        <Button onClick={handleAdd}>
          <Icons.add className="mr-2 h-4 w-4" /> Add Announcement
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

      <AnnouncementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        announcement={selectedAnnouncement}
        onSave={handleSave}
      />

      <DeleteConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
        title="Delete Announcement"
        description="Are you sure you want to delete this announcement? This action cannot be undone."
      />
    </PageContainer>
  );
}
