'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { NavigationItem } from '@/actions/common/cms-actions';

interface NavigationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: NavigationItem | null;
  onSave: (data: Partial<NavigationItem>) => Promise<void>;
}

export function NavigationDialog({
  open,
  onOpenChange,
  item,
  onSave
}: NavigationDialogProps) {
  const [formData, setFormData] = useState<Partial<NavigationItem>>({
    label: '',
    url: '',
    order: 1,
    isActive: true
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        label: item.label,
        url: item.url,
        order: item.order,
        isActive: item.isActive
      });
    } else {
      setFormData({
        label: '',
        url: '',
        order: 1,
        isActive: true
      });
    }
  }, [item, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...formData, order: Number(formData.order) });
    setLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit Navigation Item' : 'Add Navigation Item'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Menu Label</Label>
            <Input
              required
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              placeholder="e.g. Home"
            />
          </div>
          <div className="space-y-2">
            <Label>URL/Path</Label>
            <Input
              required
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="e.g. /home"
            />
          </div>
          <div className="space-y-2">
            <Label>Display Order</Label>
            <Input
              required
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: parseInt(e.target.value, 10)
                })
              }
            />
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label>Visibility Status</Label>
              <div className="text-muted-foreground text-sm">
                Set if this item appears on the user portal
              </div>
            </div>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
