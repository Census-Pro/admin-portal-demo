'use client';

import { useState, useEffect, useMemo } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTable } from '@/components/ui/table/data-table';
import { QuickLinkDialog } from './_components/quick-link-dialog';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { toast } from 'sonner';
import {
  QuickLink,
  getQuickLinks,
  deleteQuickLink,
  toggleQuickLinkStatus
} from '@/actions/common/cms-actions';
import { createColumns } from './_components/columns';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function QuickLinksPage() {
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState<QuickLink | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchQuickLinks = async () => {
    try {
      setLoading(true);
      const result = await getQuickLinks();
      if (result.success && result.data) {
        setQuickLinks(result.data);
      } else {
        toast.error(result.error || 'Failed to fetch quick links');
      }
    } catch (error) {
      console.error('Error fetching quick links:', error);
      toast.error('Error loading quick links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuickLinks();
  }, []);

  const handleEdit = (link: QuickLink) => {
    setSelectedLink(link);
    setDialogOpen(true);
  };

  const handleDelete = (link: QuickLink) => {
    setSelectedLink(link);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedLink) return;

    setDeleting(true);
    try {
      const result = await deleteQuickLink(selectedLink.id);

      if (result.success) {
        toast.success(result.message);
        fetchQuickLinks();
      } else {
        toast.error(result.error || 'Failed to delete quick link');
      }
    } catch (error) {
      console.error('Error deleting quick link:', error);
      toast.error('Error deleting quick link');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setSelectedLink(null);
    }
  };

  const handleToggleActive = async (link: QuickLink) => {
    try {
      const result = await toggleQuickLinkStatus(link.id);

      if (result.success) {
        toast.success(
          `Quick link ${link.is_active ? 'deactivated' : 'activated'}`
        );
        fetchQuickLinks();
      } else {
        toast.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast.error('Error updating status');
    }
  };

  const columns = useMemo(
    () => createColumns(handleEdit, handleDelete, handleToggleActive),
    []
  );

  return (
    <PageContainer
      pageTitle="Quick Links"
      pageDescription="Manage sidebar links, downloads, and external resources"
      pageHeaderAction={
        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 rounded-xl px-8 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          onClick={() => {
            setSelectedLink(null);
            setDialogOpen(true);
          }}
        >
          <Icons.add className="mr-2 h-5 w-5" />
          Add Quick Link
        </Button>
      }
    >
      <div className="space-y-4">
        {loading ? (
          <DataTableSkeleton columnCount={6} rowCount={5} />
        ) : (
          <DataTable
            columns={columns}
            data={quickLinks}
            totalItems={quickLinks.length}
          />
        )}
      </div>

      <QuickLinkDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedLink(null);
        }}
        quickLink={selectedLink}
        onSave={() => {
          fetchQuickLinks();
          setDialogOpen(false);
          setSelectedLink(null);
        }}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedLink(null);
        }}
        onConfirm={confirmDelete}
        isLoading={deleting}
        title="Delete Quick Link"
        description={`Are you sure you want to delete "${selectedLink?.title}"? This action cannot be undone.`}
      />
    </PageContainer>
  );
}
