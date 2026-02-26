'use client';

import { useEffect, useState, useMemo } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { DataTable } from '@/components/ui/table/data-table';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { getColumns } from './_components/columns';
import { NavigationDialog } from './_components/navigation-dialog';
import { SubLinksDialog } from './_components/sub-links-dialog';
import { PageDialog } from '../pages/_components/page-dialog';
import {
  NavigationItem,
  CmsPage,
  getNavigationItems,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  createCmsPage,
  updateCmsPage,
  deleteCmsPage
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';

export default function NavigationPage() {
  const [data, setData] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);

  // Sub-links dialog states
  const [subLinksOpen, setSubLinksOpen] = useState(false);
  const [selectedNavForSubLinks, setSelectedNavForSubLinks] =
    useState<NavigationItem | null>(null);

  // Page (sub-link) dialog states
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);
  const [preSelectedNavId, setPreSelectedNavId] = useState<string | null>(null);

  // Delete states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Delete sub-link states
  const [deletePageOpen, setDeletePageOpen] = useState(false);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [deletingPage, setDeletingPage] = useState(false);

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

  const handleManageSubLinks = (navItem: NavigationItem) => {
    setSelectedNavForSubLinks(navItem);
    setSubLinksOpen(true);
  };

  const handleAddSubLink = (navigationId: string) => {
    setPreSelectedNavId(navigationId);
    setSelectedPage(null);
    setPageDialogOpen(true);
  };

  const handleEditSubLink = (page: CmsPage) => {
    setSelectedPage(page);
    setPreSelectedNavId(null);
    setPageDialogOpen(true);
  };

  const handleDeleteSubLinkClick = (pageId: string) => {
    setDeletePageId(pageId);
    setDeletePageOpen(true);
  };

  const handleSave = async (formData: Partial<NavigationItem>) => {
    try {
      if (selectedItem) {
        const result = await updateNavigationItem(selectedItem.id, formData);
        if (result.success) {
          toast.success(result.message);
          setDialogOpen(false);
          fetchData();
        } else {
          toast.error(result.error || 'Failed to update navigation item');
        }
      } else {
        const result = await createNavigationItem(formData as any);
        if (result.success) {
          toast.success(result.message);
          setDialogOpen(false);
          fetchData();
        } else {
          toast.error(result.error || 'Failed to create navigation item');
        }
      }
    } catch (error) {
      console.error('[NavigationPage] Save error:', error);
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

  const handleSavePage = async (formData: Partial<CmsPage>) => {
    try {
      // If preSelectedNavId is set, use it (for new pages from sub-links dialog)
      const dataToSave = preSelectedNavId
        ? { ...formData, cms_navigation_id: preSelectedNavId }
        : formData;

      if (selectedPage) {
        const result = await updateCmsPage(selectedPage.id, dataToSave);
        if (result.success) {
          toast.success(result.message);
          setPageDialogOpen(false);
          fetchData();
          // Refresh the sub-links dialog if open
          if (subLinksOpen && selectedNavForSubLinks) {
            const updated = await getNavigationItems();
            if (updated.success) {
              const refreshed = updated.data.find(
                (n: NavigationItem) => n.id === selectedNavForSubLinks.id
              );
              if (refreshed) setSelectedNavForSubLinks(refreshed);
            }
          }
        }
      } else {
        const result = await createCmsPage(dataToSave as any);
        if (result.success) {
          toast.success(result.message);
          setPageDialogOpen(false);
          fetchData();
          // Refresh the sub-links dialog if open
          if (subLinksOpen && selectedNavForSubLinks) {
            const updated = await getNavigationItems();
            if (updated.success) {
              const refreshed = updated.data.find(
                (n: NavigationItem) => n.id === selectedNavForSubLinks.id
              );
              if (refreshed) setSelectedNavForSubLinks(refreshed);
            }
          }
        }
      }
    } catch {
      toast.error('An error occurred');
    }
  };

  const handleConfirmDeletePage = async () => {
    if (!deletePageId) return;
    setDeletingPage(true);
    try {
      const result = await deleteCmsPage(deletePageId);
      if (result.success) {
        toast.success(result.message);
        fetchData();
        // Refresh the sub-links dialog if open
        if (subLinksOpen && selectedNavForSubLinks) {
          const updated = await getNavigationItems();
          if (updated.success) {
            const refreshed = updated.data.find(
              (n: NavigationItem) => n.id === selectedNavForSubLinks.id
            );
            if (refreshed) setSelectedNavForSubLinks(refreshed);
          }
        }
      }
    } catch {
      toast.error('Failed to delete');
    }
    setDeletingPage(false);
    setDeletePageOpen(false);
  };

  const columns = useMemo(
    () =>
      getColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
        onManageSubLinks: handleManageSubLinks
      }),
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

      <SubLinksDialog
        open={subLinksOpen}
        onOpenChange={setSubLinksOpen}
        navigationItem={selectedNavForSubLinks}
        onAddSubLink={handleAddSubLink}
        onEditSubLink={handleEditSubLink}
        onDeleteSubLink={handleDeleteSubLinkClick}
      />

      <PageDialog
        open={pageDialogOpen}
        onOpenChange={setPageDialogOpen}
        page={selectedPage}
        onSave={handleSavePage}
        preSelectedNavigationId={preSelectedNavId}
      />

      <DeleteConfirmationDialog
        open={deletePageOpen}
        onOpenChange={setDeletePageOpen}
        onConfirm={handleConfirmDeletePage}
        isLoading={deletingPage}
        title="Delete Sub-Link"
        description="Are you sure you want to delete this content page? This action cannot be undone."
      />
    </PageContainer>
  );
}
