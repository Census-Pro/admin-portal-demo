'use client';

import { useState, useEffect, useRef } from 'react';
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
import { getAllChiwogs } from '@/actions/common/chiwog-actions';
import { getAllDzongkhags } from '@/actions/common/dzongkhag-actions';
import { toast } from 'sonner';

interface Gewog {
  id: string;
  name: string;
  dzongkha_name?: string;
  dzongkhag_id?: string;
}

interface Chiwog {
  id: string;
  name: string;
  dzongkha_name?: string;
  gewog_id?: string;
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
    chiwog_id?: string;
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
  const [chiwogId, setChiwogId] = useState(initialData?.chiwog_id || '');
  const [dzongkhags, setDzongkhags] = useState<Dzongkhag[]>([]);
  const [gewogs, setGewogs] = useState<Gewog[]>([]);
  const [chiwogs, setChiwogs] = useState<Chiwog[]>([]);
  const [filteredGewogs, setFilteredGewogs] = useState<Gewog[]>([]);
  const [filteredChiwogs, setFilteredChiwogs] = useState<Chiwog[]>([]);
  const [loadingDzongkhags, setLoadingDzongkhags] = useState(false);
  const [loadingGewogs, setLoadingGewogs] = useState(false);
  const [loadingChiwogs, setLoadingChiwogs] = useState(false);
  const isUserChangingDzongkhag = useRef(false);
  const isUserChangingGewog = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingDzongkhags(true);
      setLoadingGewogs(true);
      setLoadingChiwogs(true);
      try {
        const [dzongkhagsResult, gewogsResult, chiwogsResult] =
          await Promise.all([
            getAllDzongkhags(),
            getAllGewogs(),
            getAllChiwogs()
          ]);

        if (dzongkhagsResult && !dzongkhagsResult.error) {
          setDzongkhags(dzongkhagsResult.data || dzongkhagsResult || []);
        }

        if (gewogsResult && !gewogsResult.error) {
          setGewogs(gewogsResult.data || gewogsResult || []);
        }

        if (chiwogsResult && !chiwogsResult.error) {
          setChiwogs(chiwogsResult.data || chiwogsResult || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      } finally {
        setLoadingDzongkhags(false);
        setLoadingGewogs(false);
        setLoadingChiwogs(false);
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

      // Only reset gewog selection when the user actively changes the dzongkhag
      if (isUserChangingDzongkhag.current) {
        setGewogId('');
        setChiwogId('');
        isUserChangingDzongkhag.current = false;
      }
    } else {
      setFilteredGewogs([]);
      if (isUserChangingDzongkhag.current) {
        setGewogId('');
        setChiwogId('');
        isUserChangingDzongkhag.current = false;
      }
    }
  }, [dzongkhagId, gewogs]);

  // Filter chiwogs based on selected gewog
  useEffect(() => {
    if (gewogId) {
      const filtered = chiwogs.filter((c) => c.gewog_id === gewogId);
      setFilteredChiwogs(filtered);

      // Only reset chiwog selection when the user actively changes the gewog
      if (isUserChangingGewog.current) {
        setChiwogId('');
        isUserChangingGewog.current = false;
      }
    } else {
      setFilteredChiwogs([]);
      if (isUserChangingGewog.current) {
        setChiwogId('');
        isUserChangingGewog.current = false;
      }
    }
  }, [gewogId, chiwogs]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDzongkhaName(initialData.dzongkha_name || '');
      setDzongkhagId(initialData.dzongkhag_id || '');
      setGewogId(initialData.gewog_id || '');
      setChiwogId(initialData.chiwog_id || '');
    } else {
      setName('');
      setDzongkhaName('');
      setDzongkhagId('');
      setGewogId('');
      setChiwogId('');
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
        gewog_id: gewogId,
        chiwog_id: chiwogId
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
        setChiwogId('');
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
              onValueChange={(val) => {
                isUserChangingDzongkhag.current = true;
                setDzongkhagId(val);
              }}
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
              onValueChange={(val) => {
                isUserChangingGewog.current = true;
                setGewogId(val);
              }}
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

          <div className="grid gap-2">
            <Label htmlFor="chiwog">Chiwog</Label>
            <Select
              value={chiwogId}
              onValueChange={setChiwogId}
              disabled={loadingChiwogs || !gewogId}
            >
              <SelectTrigger id="chiwog">
                <SelectValue
                  placeholder={
                    !gewogId
                      ? 'Select a gewog first'
                      : loadingChiwogs
                        ? 'Loading chiwogs...'
                        : 'Select a chiwog'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {filteredChiwogs.map((chiwog) => (
                  <SelectItem key={chiwog.id} value={chiwog.id}>
                    {chiwog.name}
                    {chiwog.dzongkha_name && ` (${chiwog.dzongkha_name})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Select the chiwog this village belongs to
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
