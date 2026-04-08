'use client';

import { useState } from 'react';
import {
  createOperator,
  checkCidExists
} from '@/actions/common/operator-actions';
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

interface AddOperatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddOperatorModal({
  open,
  onOpenChange,
  onSuccess
}: AddOperatorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingCid, setIsCheckingCid] = useState(false);
  const [cidNo, setCidNo] = useState('');
  const [error, setError] = useState('');

  const handleCidBlur = async () => {
    if (cidNo && cidNo.length === 11) {
      setIsCheckingCid(true);
      const result = await checkCidExists(cidNo);
      setIsCheckingCid(false);

      if (result.exists) {
        setError('This CID number is already registered as an operator');
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

    // Double-check CID existence before submitting
    const checkResult = await checkCidExists(cidNo);
    if (checkResult.exists) {
      setError('This CID number is already registered as an operator');
      setIsSubmitting(false);
      return;
    }

    const result = await createOperator({ cidNo });

    if (result.success) {
      toast.success(result.message || 'Operator created successfully');
      setCidNo('');
      setError('');
      onSuccess?.();
    } else {
      toast.error(result.error || 'Failed to create operator');
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Operator</DialogTitle>
          <DialogDescription>
            Create a new operator by entering their CID number.
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
                className="font-mono"
              />
              {isCheckingCid && (
                <IconLoader2 className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
              )}
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <p className="text-muted-foreground text-xs">
              Enter a valid 11-digit CID number
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
            <Button type="submit" disabled={isSubmitting || isCheckingCid}>
              {isSubmitting && (
                <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Operator
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
