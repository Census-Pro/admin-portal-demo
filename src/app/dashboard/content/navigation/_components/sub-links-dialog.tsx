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
            Content Pages for "{navigationItem.label}"
          </DialogTitle>
          <DialogDescription>
            Manage content pages that appear as dropdown items under this
            navigation link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {subLinks.length} {subLinks.length === 1 ? 'page' : 'pages'}
            </p>
            <Button onClick={() => onAddSubLink(navigationItem.id)} size="sm">
              <Icons.add className="mr-2 h-4 w-4" />
              Add Page
            </Button>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {subLinks.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed">
                <IconExternalLink className="text-muted-foreground mb-2 h-10 w-10" />
                <p className="text-muted-foreground text-sm">No pages yet</p>
                <p className="text-muted-foreground mt-1 text-xs">
                  Click "Add Page" to create content for this link
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {subLinks.map((page) => (
                  <div
                    key={page.id}
                    className="hover:bg-accent/50 group flex items-start justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="bg-muted text-muted-foreground flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-bold">
                          {page.order || 0}
                        </span>
                        <h4 className="max-w-full min-w-0 truncate font-semibold sm:max-w-md">
                          {page.title}
                        </h4>
                        <Badge
                          variant={
                            page.status === 'published'
                              ? 'default'
                              : 'secondary'
                          }
                          className="h-4 shrink-0 px-1.5 text-[10px] tracking-wider uppercase"
                        >
                          {page.status}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground flex min-w-0 items-center gap-1 font-mono text-[10px]">
                        <span className="shrink-0">Slug:</span>
                        <span className="min-w-0 truncate">/{page.slug}</span>
                      </div>
                      {page.body && (
                        <p className="text-muted-foreground border-muted mt-1 line-clamp-1 overflow-hidden border-l-2 pl-2 text-xs break-all italic">
                          {page.body
                            .replace(/<[^>]*>/g, '') // remove HTML tags
                            .replace(/\s+/g, ' ') // replace multiple spaces/newlines with single space
                            .trim()
                            .substring(0, 100)}
                          ...
                        </p>
                      )}
                    </div>
                    <div className="ml-4 flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEditSubLink(page)}
                        title="Edit Page"
                      >
                        <IconEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                        onClick={() => onDeleteSubLink(page.id)}
                        title="Delete Page"
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
