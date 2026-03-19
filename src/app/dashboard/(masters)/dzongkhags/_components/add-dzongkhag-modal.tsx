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
  createDzongkhags,
  updateDzongkhag
} from '@/actions/common/dzongkhag-actions';
import { toast } from 'sonner';

interface AddDzongkhagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (result?: any) => void;
  initialData?: {
    id: string;
    name: string;
    dzongkha_name?: string;
    code?: string;
  } | null;
}

export function AddDzongkhagModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddDzongkhagModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || '');
  const [dzongkhaName, setDzongkhaName] = useState(
    initialData?.dzongkha_name || ''
  );
  const [code, setCode] = useState(initialData?.code || '');

  // Update fields when initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDzongkhaName(initialData.dzongkha_name || '');
      setCode(initialData.code || '');
    } else {
      setName('');
      setDzongkhaName('');
      setCode('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (initialData) {
        result = await updateDzongkhag(initialData.id, {
          name,
          dzongkha_name: dzongkhaName,
          code
        });
      } else {
        result = await createDzongkhags({
          name,
          dzongkha_name: dzongkhaName,
          code
        });
      }

      if (result && !result.error) {
        toast.success(
          `Dzongkhag ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess(result);
        onClose();
        setName('');
        setDzongkhaName('');
        setCode('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} dzongkhag`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save dzongkhag error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit' : 'Add New'} Dzongkhag
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the dzongkhag details.'
              : 'Create a new dzongkhag in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Dzongkhag Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter dzongkhag name (e.g., Thimphu, Paro, Punakha)"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dzongkha_name">Dzongkha Name</Label>
            <Input
              id="dzongkha_name"
              value={dzongkhaName}
              onChange={(e) => setDzongkhaName(e.target.value)}
              placeholder="Enter dzongkha name (e.g., ཐིམ་ཕུག, སྤ་རོ, སྤུ་ན་ཁ)"
            />
            <p className="text-muted-foreground text-xs">
              Optional: Enter the Dzongkha name for the dzongkhag
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="code">Dzongkhag Code *</Label>
            <Input
              id="code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter dzongkhag code (e.g., 01, 02)"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : initialData
                  ? 'Update Dzongkhag'
                  : 'Create Dzongkhag'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
