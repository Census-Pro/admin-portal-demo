'use client';

import { useState, useEffect } from 'react';
import {
  updateResettlement,
  checkCidExists
} from '@/actions/common/resettlement-actions';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { IconLoader2 } from '@tabler/icons-react';

interface Resettlement {
  id: string;
  cidNo: string;
}

interface EditResettlementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resettlement: Resettlement;
  onSuccess?: () => void;
}

export function EditResettlementModal({
  open,
  onOpenChange,
  resettlement,
  onSuccess
}: EditResettlementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingCid, setIsCheckingCid] = useState(false);
  const [cidNo, setCidNo] = useState(resettlement.cidNo);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setCidNo(resettlement.cidNo);
      setError('');
    }
  }, [open, resettlement]);

  const handleCidBlur = async () => {
    // Only check if CID has changed
    if (cidNo && cidNo.length === 11 && cidNo !== resettlement.cidNo) {
      setIsCheckingCid(true);
      const result = await checkCidExists(cidNo);
      setIsCheckingCid(false);

      if (result.exists) {
        setError('This CID number is already registered in resettlement');
      }
    }
  };

  const handleCidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setCidNo(value);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!cidNo || cidNo.length !== 11) {
      setError('CID number must be exactly 11 digits');
      return;
    }

    setIsSubmitting(true);

    // Only check if CID has changed
    if (cidNo !== resettlement.cidNo) {
      const checkResult = await checkCidExists(cidNo);
      if (checkResult.exists) {
        setError('This CID number is already registered in resettlement');
        setIsSubmitting(false);
        return;
      }
    }

    const result = await updateResettlement({
      id: resettlement.id,
      cid_no: cidNo
    });

    if (result.success) {
      toast.success(result.message || 'Resettlement updated successfully');
      onSuccess?.();
    } else {
      toast.error(result.error || 'Failed to update resettlement');
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Resettlement</DialogTitle>
          <DialogDescription>
            Update the CID number for this resettlement.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="cidNo">CID Number *</Label>
            <div className="relative">
              <Input
                id="cidNo"
                placeholder="Enter 11-digit CID number"
                value={cidNo}
                onChange={handleCidChange}
                onBlur={handleCidBlur}
                disabled={isSubmitting}
                maxLength={11}
              />
              {isCheckingCid && (
                <IconLoader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
              )}
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <p className="text-muted-foreground text-xs">
              Enter a unique 11-digit CID number
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Resettlement
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
