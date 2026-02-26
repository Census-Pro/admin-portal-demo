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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { NavigationItem } from '@/actions/common/cms-actions';
import { IconPicker } from '@/components/ui/icon-picker';

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
    icon: '',
    message: '',
    status: 'active',
    order: 0,
    created_by_name: 'Admin User'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        label: item.label,
        url: item.url || '',
        icon: item.icon || '',
        message: item.message || '',
        status: item.status,
        order: item.order || 0,
        created_by_name: item.created_by_name || 'Admin User'
      });
    } else {
      setFormData({
        label: '',
        url: '',
        icon: '',
        message: '',
        status: 'active',
        order: 0,
        created_by_name: 'Admin User'
      });
    }
  }, [item, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({ ...formData, order: Number(formData.order ?? 0) });
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
            <Label htmlFor="label">Menu Label *</Label>
            <Input
              id="label"
              required
              value={formData.label}
              onChange={(e) =>
                setFormData({ ...formData, label: e.target.value })
              }
              placeholder="e.g. Divisions, Services, About"
            />
            <p className="text-muted-foreground text-xs">
              This will appear in the navigation menu
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL/Link (Optional)</Label>
            <Input
              id="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              placeholder="e.g. /divisions or https://example.com"
            />
            <p className="text-muted-foreground text-xs">
              Leave empty if this item has dropdown sub-links
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Optional)</Label>
            <IconPicker
              value={formData.icon || ''}
              onChange={(val) => setFormData({ ...formData, icon: val })}
            />
            <p className="text-muted-foreground text-xs">
              Select an icon for the menu item
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Description (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Optional description or tooltip text"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                required
                type="number"
                min="0"
                value={formData.order ?? ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const parsed = parseInt(val, 10);
                  setFormData({
                    ...formData,
                    // keep undefined when input is empty or invalid to avoid NaN
                    order:
                      val === '' || Number.isNaN(parsed) ? undefined : parsed
                  });
                }}
              />
              <p className="text-muted-foreground text-xs">
                0 = first, higher = later
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val: any) =>
                  setFormData({ ...formData, status: val })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
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
