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
import { createGewogs, updateGewog } from '@/actions/common/gewog-actions';
import { getAllDzongkhags } from '@/actions/common/dzongkhag-actions';
import { toast } from 'sonner';

interface Dzongkhag {
  id: string;
  name: string;
  dzongkha_name?: string;
}

interface AddGewogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: string;
    name: string;
    dzongkha_name?: string;
    dzongkhag_id?: string;
    code?: string;
  } | null;
}

export function AddGewogModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddGewogModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || '');
  const [dzongkhaName, setDzongkhaName] = useState(
    initialData?.dzongkha_name || ''
  );
  const [dzongkhagId, setDzongkhagId] = useState(
    initialData?.dzongkhag_id || ''
  );
  const [code, setCode] = useState(initialData?.code || '');
  const [dzongkhags, setDzongkhags] = useState<Dzongkhag[]>([]);
  const [loadingDzongkhags, setLoadingDzongkhags] = useState(false);

  useEffect(() => {
    const fetchDzongkhags = async () => {
      setLoadingDzongkhags(true);
      try {
        const result = await getAllDzongkhags();
        if (result && !result.error) {
          setDzongkhags(result.data || result || []);
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
      setName(initialData.name);
      setDzongkhaName(initialData.dzongkha_name || '');
      setDzongkhagId(initialData.dzongkhag_id || '');
      setCode(initialData.code || '');
    } else {
      setName('');
      setDzongkhaName('');
      setDzongkhagId('');
      setCode('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (initialData) {
        result = await updateGewog(initialData.id, {
          name,
          dzongkha_name: dzongkhaName,
          dzongkhag_id: dzongkhagId,
          code
        });
      } else {
        result = await createGewogs({
          name,
          dzongkha_name: dzongkhaName,
          dzongkhag_id: dzongkhagId,
          code
        });
      }

      if (result && !result.error) {
        toast.success(
          `Gewog ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess?.();
        onClose();
        setName('');
        setDzongkhaName('');
        setDzongkhagId('');
        setCode('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} gewog`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save gewog error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add New'} Gewog</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the gewog details.'
              : 'Create a new gewog in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Gewog Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter gewog name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dzongkha_name">Dzongkha Name</Label>
            <Input
              id="dzongkha_name"
              value={dzongkhaName}
              onChange={(e) => setDzongkhaName(e.target.value)}
              placeholder="Enter dzongkha name (e.g., ཀ་ཝང)"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="code">Gewog Code *</Label>
            <Input
              id="code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter gewog code (e.g., 01, 02)"
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
              Select the dzongkhag this gewog belongs to
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
                  ? 'Update Gewog'
                  : 'Create Gewog'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
