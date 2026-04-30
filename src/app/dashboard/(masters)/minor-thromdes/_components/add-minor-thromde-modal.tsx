'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  createMinorThromde,
  updateMinorThromde
} from '@/actions/common/minor-thromde-actions';
import { getAllDzongkhags } from '@/actions/common/dzongkhag-actions';
import { toast } from 'sonner';

interface Dzongkhag {
  id: string;
  name: string;
  dzongkha_name?: string;
}

interface AddMinorThromdeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: string;
    thromdeName: string;
    dzongkhagId?: string;
    dzongkhagName?: string;
  } | null;
}

export function AddMinorThromdeModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddMinorThromdeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [thromdeName, setThromdeName] = useState(
    initialData?.thromdeName || ''
  );
  const [dzongkhagId, setDzongkhagId] = useState(
    initialData?.dzongkhagId || ''
  );
  const [dzongkhags, setDzongkhags] = useState<Dzongkhag[]>([]);
  const [loadingDzongkhags, setLoadingDzongkhags] = useState(false);

  useEffect(() => {
    const fetchDzongkhags = async () => {
      setLoadingDzongkhags(true);
      try {
        const result = await getAllDzongkhags();
        // Handle different response formats
        if (result && typeof result === 'object' && 'data' in result) {
          setDzongkhags((result as any).data || []);
        } else if (Array.isArray(result)) {
          setDzongkhags(result);
        } else {
          setDzongkhags([]);
        }
      } catch (error) {
        console.error('Error fetching dzongkhags:', error);
        toast.error('Failed to load dzongkhags');
      } finally {
        setLoadingDzongkhags(false);
      }
    };

    if (isOpen) {
      fetchDzongkhags();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setThromdeName(initialData.thromdeName);
      setDzongkhagId(initialData.dzongkhagId || '');
    } else {
      setThromdeName('');
      setDzongkhagId('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Find the selected dzongkhag to get its name
      const selectedDzongkhag = dzongkhags.find((d) => d.id === dzongkhagId);

      if (!selectedDzongkhag) {
        toast.error('Please select a dzongkhag');
        setIsLoading(false);
        return;
      }

      const payload = {
        thromdeName,
        dzongkhagName: selectedDzongkhag.name
      };

      console.log('Submitting minor thromde payload:', payload);

      let result;
      if (initialData) {
        result = await updateMinorThromde(initialData.id, payload);
      } else {
        result = await createMinorThromde(payload);
      }

      if (result && !result.error) {
        toast.success(
          `Minor thromde ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess?.();
        onClose();
        setThromdeName('');
        setDzongkhagId('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} minor thromde`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save minor thromde error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} Minor Thromde
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the minor thromde details.'
              : 'Create a new minor thromde in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="thromdeName">Thromde Name *</Label>
            <Input
              id="thromdeName"
              required
              value={thromdeName}
              onChange={(e) => setThromdeName(e.target.value)}
              placeholder="Enter thromde name (e.g., Phuntsholing)"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dzongkhag">Dzongkhag *</Label>
            <Select
              value={dzongkhagId}
              onValueChange={setDzongkhagId}
              disabled={loadingDzongkhags}
              required
            >
              <SelectTrigger id="dzongkhag">
                <SelectValue
                  placeholder={
                    loadingDzongkhags
                      ? 'Loading dzongkhags...'
                      : 'Select a dzongkhag'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {dzongkhags.map((dzongkhag) => (
                  <SelectItem key={dzongkhag.id} value={dzongkhag.id}>
                    {dzongkhag.name}
                    {dzongkhag.dzongkha_name && ` (${dzongkhag.dzongkha_name})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Select the dzongkhag this minor thromde belongs to
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !dzongkhagId}>
              {isLoading
                ? 'Saving...'
                : initialData
                  ? 'Update Minor Thromde'
                  : 'Create Minor Thromde'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
