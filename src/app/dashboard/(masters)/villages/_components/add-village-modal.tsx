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
  createVillages,
  updateVillage
} from '@/actions/common/village-actions';
import { getAllGewogs } from '@/actions/common/gewog-actions';
import { toast } from 'sonner';

interface Gewog {
  id: string;
  name: string;
  dzongkha_name?: string;
}

interface AddVillageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: {
    id: string;
    name: string;
    dzongkha_name?: string;
    gewog_id?: string;
  } | null;
}

export function AddVillageModal({
  isOpen,
  onClose,
  onSuccess,
  initialData
}: AddVillageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || '');
  const [dzongkhaName, setDzongkhaName] = useState(
    initialData?.dzongkha_name || ''
  );
  const [gewogId, setGewogId] = useState(initialData?.gewog_id || '');
  const [gewogs, setGewogs] = useState<Gewog[]>([]);
  const [loadingGewogs, setLoadingGewogs] = useState(false);

  useEffect(() => {
    const fetchGewogs = async () => {
      setLoadingGewogs(true);
      try {
        const result = await getAllGewogs();
        if (result && !result.error) {
          setGewogs(result.data || result || []);
        }
      } catch (error) {
        console.error('Error fetching gewogs:', error);
        toast.error('Failed to load gewogs');
      } finally {
        setLoadingGewogs(false);
      }
    };

    if (isOpen) {
      fetchGewogs();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDzongkhaName(initialData.dzongkha_name || '');
      setGewogId(initialData.gewog_id || '');
    } else {
      setName('');
      setDzongkhaName('');
      setGewogId('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (initialData) {
        result = await updateVillage(initialData.id, {
          name,
          dzongkha_name: dzongkhaName,
          gewog_id: gewogId
        });
      } else {
        result = await createVillages({
          name,
          dzongkha_name: dzongkhaName,
          gewog_id: gewogId
        });
      }

      if (result && !result.error) {
        toast.success(
          `Village ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess?.();
        onClose();
        setName('');
        setDzongkhaName('');
        setGewogId('');
      } else {
        toast.error(
          result?.message ||
            `Failed to ${initialData ? 'update' : 'create'} village`
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Save village error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit' : 'Add New'} Village</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the village details.'
              : 'Create a new village in the system.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Village Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter village name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dzongkha_name">Dzongkha Name</Label>
            <Input
              id="dzongkha_name"
              value={dzongkhaName}
              onChange={(e) => setDzongkhaName(e.target.value)}
              placeholder="Enter dzongkha name"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gewog">Gewog *</Label>
            <Select
              value={gewogId}
              onValueChange={setGewogId}
              disabled={loadingGewogs}
              required
            >
              <SelectTrigger id="gewog">
                <SelectValue
                  placeholder={
                    loadingGewogs ? 'Loading gewogs...' : 'Select a gewog'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {gewogs.map((gewog) => (
                  <SelectItem key={gewog.id} value={gewog.id}>
                    {gewog.name}
                    {gewog.dzongkha_name && ` (${gewog.dzongkha_name})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Select the gewog this village belongs to
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !gewogId}>
              {isLoading
                ? 'Saving...'
                : initialData
                  ? 'Update Village'
                  : 'Create Village'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
