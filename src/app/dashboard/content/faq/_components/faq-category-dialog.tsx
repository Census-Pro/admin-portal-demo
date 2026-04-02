'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  createFaqCategory,
  updateFaqCategory
} from '@/actions/common/cms-actions';
import { FaqCategory } from '@/actions/common/cms-actions';

const faqCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  order_index: z.number().min(0).default(0),
  status: z.enum(['active', 'inactive']).default('active')
});

type FaqCategoryFormData = z.infer<typeof faqCategorySchema>;

interface FaqCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  category?: FaqCategory | null;
}

export function FaqCategoryDialog({
  isOpen,
  onClose,
  category
}: FaqCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FaqCategoryFormData>({
    resolver: zodResolver(faqCategorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      order_index: 0,
      status: 'active'
    }
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        order_index: category.order_index,
        status: category.status
      });
    } else {
      form.reset({
        name: '',
        slug: '',
        description: '',
        order_index: 0,
        status: 'active'
      });
    }
  }, [category, form]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    form.setValue('name', name);
    if (!category) {
      // Only auto-generate slug for new categories
      form.setValue('slug', generateSlug(name));
    }
  };

  const onSubmit = async (data: FaqCategoryFormData) => {
    try {
      setIsSubmitting(true);

      let result;
      if (category) {
        result = await updateFaqCategory(category.id, data);
      } else {
        result = await createFaqCategory(data);
      }

      if (result.success) {
        // Trigger event to refresh categories table
        window.dispatchEvent(new Event('faqCategoriesChanged'));
        onClose();
      } else {
        alert(result.error || 'Failed to save FAQ category');
      }
    } catch (error) {
      console.error('Failed to save FAQ category:', error);
      alert('Failed to save FAQ category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit FAQ Category' : 'Create New FAQ Category'}
          </DialogTitle>
          <DialogDescription>
            {category
              ? 'Update the FAQ category details below.'
              : 'Fill in the details to create a new FAQ category.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      onChange={(e) => handleNameChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter slug" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL-friendly version of the name
                  </FormDescription>
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
                      placeholder="Enter description (optional)"
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="order_index"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
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
                  <FormItem className="flex flex-col items-start space-y-2">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.value === 'active'}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? 'active' : 'inactive')
                          }
                        />
                        <span className="text-muted-foreground text-sm">
                          {field.value === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : category ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
