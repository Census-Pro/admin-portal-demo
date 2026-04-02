'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SubLink } from '@/actions/common/cms-actions';
import { IconPicker } from '@/components/ui/icon-picker';

const subLinkSchema = z.object({
  label: z.string().min(1, 'Label is required').max(255),
  description: z.string().optional().or(z.literal('')),
  icon: z.string().optional().or(z.literal('')),
  order: z.coerce.number().min(0),
  status: z.enum(['active', 'inactive'])
});

type SubLinkFormData = z.infer<typeof subLinkSchema>;

interface SubLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: SubLink;
  navigationId: string;
  onSave: (data: Partial<SubLink>) => Promise<void>;
}

export function SubLinkDialog({
  open,
  onOpenChange,
  item,
  navigationId,
  onSave
}: SubLinkDialogProps) {
  const form = useForm<SubLinkFormData>({
    resolver: zodResolver(subLinkSchema) as any,
    defaultValues: {
      label: '',
      description: '',
      icon: '',
      order: 0,
      status: 'active'
    }
  });

  useEffect(() => {
    if (item) {
      form.reset({
        label: item.label,
        description: item.description || '',
        icon: item.icon || '',
        order: item.order || 0,
        status: item.status
      });
    } else {
      form.reset({
        label: '',
        description: '',
        icon: '',
        order: 0,
        status: 'active'
      });
    }
  }, [item, form]);

  const onSubmit = async (data: SubLinkFormData) => {
    await onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit Sub-Link' : 'Create Sub-Link'}
          </DialogTitle>
          <DialogDescription>
            {item
              ? 'Update the sub-link details below'
              : 'Create a new category or group under this navigation item'}
          </DialogDescription>
        </DialogHeader>

        <Form
          form={form}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Our History" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of this sub-link"
                    {...field}
                    rows={3}
                  />
                </FormControl>
                <FormDescription>
                  Optional description to help organize content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <IconPicker
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Optional icon to display with this sub-link
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormDescription>Display order (0 = first)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{item ? 'Update' : 'Create'} Sub-Link</Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
