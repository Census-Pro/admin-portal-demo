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
import { Textarea } from '@/components/ui/textarea';
import { updatePermission } from '@/actions/common/permission-actions';
import { toast } from 'sonner';
import { AVAILABLE_ACTIONS } from '@/config/permission-subjects';

interface Permission {
  id: string;
  name: string;
  description?: string;
  actions: string | string[]; // Can be string (from backend) or array (for form)
  subjects: string | string[]; // Can be string (from backend) or array (for form)
  isActive?: boolean;
}

interface EditPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  permission: Permission | null;
}

export function EditPermissionModal({
  isOpen,
  onClose,
  onSuccess,
  permission
}: EditPermissionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    actions: [] as string[],
    subjects: [] as string[]
  });
  const [actionInput, setActionInput] = useState<string>('');
  const [subjectInput, setSubjectInput] = useState<string>('');

  // Initialize form data when permission changes
  useEffect(() => {
    if (permission) {
      // Convert string to array if needed (backend returns comma-separated string)
      const actionsArray =
        typeof permission.actions === 'string'
          ? permission.actions
              .split(',')
              .map((a) => a.trim())
              .filter(Boolean)
          : permission.actions || [];
      const subjectsArray =
        typeof permission.subjects === 'string'
          ? permission.subjects
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : permission.subjects || [];

      setFormData({
        name: permission.name || '',
        description: permission.description || '',
        actions: actionsArray,
        subjects: subjectsArray
      });
      setActionInput(actionsArray.join(', ') || '');
      setSubjectInput(subjectsArray.join(', ') || '');
    }
  }, [permission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!permission) {
      toast.error('No permission selected');
      return;
    }

    if (formData.actions.length === 0) {
      toast.error('Please add at least one action');
      return;
    }

    if (formData.subjects.length === 0) {
      toast.error('Please add at least one subject');
      return;
    }

    setIsLoading(true);

    try {
      const result = await updatePermission({
        id: permission.id,
        ...formData
      });

      if (result.success) {
        toast.success(result.message || 'Permission updated successfully');
        onSuccess();
        handleClose();
      } else {
        toast.error(result.error || 'Failed to update permission');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Update permission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', description: '', actions: [], subjects: [] });
    setActionInput('');
    setSubjectInput('');
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleActionInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setActionInput(value);

    // Parse actions from textarea (comma or newline separated)
    const inputActions = value
      .split(/[,\n]/)
      .map((action) => action.trim().toLowerCase())
      .filter((action) => action.length > 0);

    // Find original case from AVAILABLE_ACTIONS
    const actionsWithCorrectCase = inputActions.map((action) => {
      const found = AVAILABLE_ACTIONS.find(
        (validAction) => validAction.toLowerCase() === action
      );
      return found || action;
    });

    setFormData((prev) => ({
      ...prev,
      actions: Array.from(new Set(actionsWithCorrectCase)) // Remove duplicates
    }));
  };

  const handleSubjectInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setSubjectInput(value);

    // Parse subjects from textarea (comma or newline separated)
    const inputSubjects = value
      .split(/[,\n]/)
      .map((subject) => subject.trim())
      .filter((subject) => subject.length > 0);

    setFormData((prev) => ({
      ...prev,
      subjects: Array.from(new Set(inputSubjects)) // Remove duplicates
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Permission</DialogTitle>
          <DialogDescription>
            Update the permission by modifying actions and subjects
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Permission Details Header */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold">Permission Details</h3>
            <p className="text-muted-foreground text-sm">
              To change your permission details, edit and save from here
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Permission Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., manage-users"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actions">
              Actions <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="actions"
              placeholder="Type action names separated by commas or new lines (e.g., manage)"
              value={actionInput}
              onChange={handleActionInputChange}
              disabled={isLoading}
              rows={4}
              className="resize-none font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjects">
              Subjects <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="subjects"
              placeholder="Type subject names separated by commas or new lines (e.g., Dashboard, User, Master)"
              value={subjectInput}
              onChange={handleSubjectInputChange}
              disabled={isLoading}
              rows={4}
              className="resize-none font-mono text-sm"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Permission'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
