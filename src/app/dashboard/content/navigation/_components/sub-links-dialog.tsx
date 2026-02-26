'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { NavigationItem, CmsPage } from '@/actions/common/cms-actions';
import { IconEdit, IconTrash, IconExternalLink } from '@tabler/icons-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SubLinksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navigationItem: NavigationItem | null;
  onAddSubLink: (navigationId: string) => void;
  onEditSubLink: (page: CmsPage) => void;
  onDeleteSubLink: (pageId: string) => void;
}

export function SubLinksDialog({
  open,
  onOpenChange,
  navigationItem,
  onAddSubLink,
  onEditSubLink,
  onDeleteSubLink
}: SubLinksDialogProps) {
  const [subLinks, setSubLinks] = useState<CmsPage[]>([]);

  useEffect(() => {
    if (navigationItem?.contentPages) {
      // Sort by order
      const sorted = [...navigationItem.contentPages].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      setSubLinks(sorted);
    } else {
      setSubLinks([]);
    }
  }, [navigationItem]);

  if (!navigationItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconExternalLink className="h-5 w-5" />
            Sub-Links for "{navigationItem.label}"
          </DialogTitle>
          <DialogDescription>
            Manage content pages that appear as dropdown items under this
            navigation link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {subLinks.length}{' '}
              {subLinks.length === 1 ? 'sub-link' : 'sub-links'}
            </p>
            <Button onClick={() => onAddSubLink(navigationItem.id)} size="sm">
              <Icons.add className="mr-2 h-4 w-4" />
              Add Sub-Link
            </Button>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {subLinks.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                <IconExternalLink className="text-muted-foreground mb-2 h-10 w-10" />
                <p className="text-muted-foreground text-sm">
                  No sub-links yet
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Click "Add Sub-Link" to create content pages
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {subLinks.map((page) => (
                  <div
                    key={page.id}
                    className="hover:bg-accent/50 flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs font-medium">
                          #{page.order || 0}
                        </span>
                        <h4 className="font-medium">{page.title}</h4>
                        <Badge
                          variant={
                            page.status === 'published'
                              ? 'default'
                              : 'secondary'
                          }
                          className="text-xs"
                        >
                          {page.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Slug: /{page.slug}
                      </p>
                      {page.body && (
                        <p className="text-muted-foreground line-clamp-2 text-xs">
                          {page.body.replace(/<[^>]*>/g, '').substring(0, 150)}
                          ...
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditSubLink(page)}
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteSubLink(page.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
