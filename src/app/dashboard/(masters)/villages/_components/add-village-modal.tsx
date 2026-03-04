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
import { getAllDzongkhags } from '@/actions/common/dzongkhag-actions';
import { toast } from 'sonner';

interface Gewog {
  id: string;
  name: string;
  dzongkha_name?: string;
  dzongkhag_id?: string;
}

interface Dzongkhag {
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
    dzongkhag_id?: string;
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
  const [dzongkhagId, setDzongkhagId] = useState(
    initialData?.dzongkhag_id || ''
  );
  const [gewogId, setGewogId] = useState(initialData?.gewog_id || '');
  const [dzongkhags, setDzongkhags] = useState<Dzongkhag[]>([]);
  const [gewogs, setGewogs] = useState<Gewog[]>([]);
  const [filteredGewogs, setFilteredGewogs] = useState<Gewog[]>([]);
  const [loadingDzongkhags, setLoadingDzongkhags] = useState(false);
  const [loadingGewogs, setLoadingGewogs] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDzongkhags(true);
      setLoadingGewogs(true);
      try {
        const [dzongkhagsResult, gewogsResult] = await Promise.all([
          getAllDzongkhags(),
          getAllGewogs()
        ]);

        if (dzongkhagsResult && !dzongkhagsResult.error) {
          setDzongkhags(dzongkhagsResult.data || dzongkhagsResult || []);
        }

        if (gewogsResult && !gewogsResult.error) {
          setGewogs(gewogsResult.data || gewogsResult || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      } finally {
        setLoadingDzongkhags(false);
        setLoadingGewogs(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  // Filter gewogs based on selected dzongkhag
  useEffect(() => {
    if (dzongkhagId) {
      const filtered = gewogs.filter(
        (gewog) => gewog.dzongkhag_id === dzongkhagId
      );
      setFilteredGewogs(filtered);

      // Reset gewog selection if the current selection doesn't belong to the selected dzongkhag
      if (gewogId && !filtered.find((g) => g.id === gewogId)) {
        setGewogId('');
      }
    } else {
      setFilteredGewogs([]);
      setGewogId('');
    }
  }, [dzongkhagId, gewogs, gewogId]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDzongkhaName(initialData.dzongkha_name || '');
      setDzongkhagId(initialData.dzongkhag_id || '');
      setGewogId(initialData.gewog_id || '');
    } else {
      setName('');
      setDzongkhaName('');
      setDzongkhagId('');
      setGewogId('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        name,
        dzongkha_name: dzongkhaName,
        dzongkhag_id: dzongkhagId,
        gewog_id: gewogId
      };

      console.log('Submitting village data:', payload);

      let result;
      if (initialData) {
        result = await updateVillage(initialData.id, payload);
      } else {
        result = await createVillages(payload);
      }

      console.log('Result:', result);

      if (result && !result.error) {
        toast.success(
          `Village ${initialData ? 'updated' : 'created'} successfully`
        );
        onSuccess?.();
        onClose();
        setName('');
        setDzongkhaName('');
        setDzongkhagId('');
        setGewogId('');
      } else {
        const errorMsg =
          result?.message ||
          `Failed to ${initialData ? 'update' : 'create'} village`;
        console.error('Village operation failed:', errorMsg, result);
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error('Save village error:', error);
      toast.error('An unexpected error occurred. Check console for details.');
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
              Select the dzongkhag this village belongs to
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gewog">Gewog *</Label>
            <Select
              value={gewogId}
              onValueChange={setGewogId}
              disabled={loadingGewogs || !dzongkhagId}
              required
            >
              <SelectTrigger id="gewog">
                <SelectValue
                  placeholder={
                    !dzongkhagId
                      ? 'Select a dzongkhag first'
                      : loadingGewogs
                        ? 'Loading gewogs...'
                        : 'Select a gewog'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredGewogs.map((gewog) => (
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
            <Button
              type="submit"
              disabled={isLoading || !dzongkhagId || !gewogId}
            >
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
