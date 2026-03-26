'use client';

import { useState } from 'react';
import { IconList } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubLinksDialog } from './sub-links-dialog';
import { PageDialog } from '../../pages/_components/page-dialog';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import {
  NavigationItem,
  CmsPage,
  updateCmsPage,
  deleteCmsPage,
  createCmsPage
} from '@/actions/common/cms-actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface SubLinksCellProps {
  data: NavigationItem;
}

export function SubLinksCell({ data }: SubLinksCellProps) {
  const router = useRouter();
  const [subLinksOpen, setSubLinksOpen] = useState(false);
  const [pageDialogOpen, setPageDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<CmsPage | null>(null);
  const [deletePageOpen, setDeletePageOpen] = useState(false);
  const [deletePageId, setDeletePageId] = useState<string | null>(null);
  const [preSelectedNavId, setPreSelectedNavId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const count = data.contentPages?.length || 0;

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

  const handleSavePage = async (formData: Partial<CmsPage>) => {
    try {
      const dataToSave = preSelectedNavId
        ? { ...formData, cms_navigation_id: preSelectedNavId }
        : formData;

      if (selectedPage) {
        const result = await updateCmsPage(selectedPage.id, dataToSave);
        if (result.success) {
          toast.success(result.message);
          setPageDialogOpen(false);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await createCmsPage(dataToSave as any);
        if (result.success) {
          toast.success(result.message);
          setPageDialogOpen(false);
          router.refresh();
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      toast.error('Error saving sub-link');
    }
  };

  const onConfirmDeletePage = async () => {
    if (!deletePageId) return;
    setLoading(true);
    try {
      const result = await deleteCmsPage(deletePageId);
      if (result.success) {
        toast.success(result.message);
        setDeletePageOpen(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Error deleting sub-link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SubLinksDialog
        open={subLinksOpen}
        onOpenChange={setSubLinksOpen}
        navigationItem={data}
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
        onConfirm={onConfirmDeletePage}
        isLoading={loading}
        title="Delete Content Page"
        description="Are you sure you want to delete this content page? This action cannot be undone."
      />

      <div className="flex items-center justify-center gap-2">
        {count > 0 ? (
          <>
            <Badge variant="outline" className="text-xs">
              {count} {count === 1 ? 'page' : 'pages'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSubLinksOpen(true)}
              className="h-7 px-2 text-xs"
            >
              <IconList className="mr-1 h-3 w-3" />
              Manage
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddSubLink(data.id)}
            className="h-7 border-dashed px-2 text-xs"
          >
            <IconList className="mr-1 h-3 w-3" />
            Add Page
          </Button>
        )}
      </div>
    </>
  );
}
