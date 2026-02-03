'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  IconLock,
  IconLoader2,
  IconEye,
  IconEyeOff
} from '@tabler/icons-react';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password')
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  async function onSubmit(data: PasswordFormValues) {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Password change requested:', data);
      toast.success('Password updated successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <FormField
        control={form.control}
        name="currentPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Password</FormLabel>
            <FormControl>
              <div className="relative">
                <IconLock className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="px-9"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="text-muted-foreground hover:text-foreground absolute top-2.5 right-3 h-4 w-4"
                >
                  {showCurrent ? (
                    <IconEyeOff size={16} />
                  ) : (
                    <IconEye size={16} />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="newPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <div className="relative">
                <IconLock className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  type={showNew ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="px-9"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="text-muted-foreground hover:text-foreground absolute top-2.5 right-3 h-4 w-4"
                >
                  {showNew ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm New Password</FormLabel>
            <FormControl>
              <div className="relative">
                <IconLock className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="px-9"
                  {...field}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="text-muted-foreground hover:text-foreground absolute top-2.5 right-3 h-4 w-4"
                >
                  {showConfirm ? (
                    <IconEyeOff size={16} />
                  ) : (
                    <IconEye size={16} />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Password
      </Button>
    </Form>
  );
}
