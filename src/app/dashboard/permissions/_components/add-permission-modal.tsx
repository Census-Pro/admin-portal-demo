'use client';

import { useState } from 'react';
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
import { createPermission } from '@/actions/common/permission-actions';
import { toast } from 'sonner';
import { AVAILABLE_ACTIONS } from '@/config/permission-subjects';

interface AddPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddPermissionModal({
  isOpen,
  onClose,
  onSuccess
}: AddPermissionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    actions: [] as string[],
    subjects: [] as string[]
  });
  const [actionInput, setActionInput] = useState<string>('');
  const [subjectInput, setSubjectInput] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      const result = await createPermission(formData);

      if (result.success) {
        toast.success(result.message || 'Permission created successfully');
        onSuccess();
        handleClose();
      } else {
        toast.error(result.error || 'Failed to create permission');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Create permission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', actions: [], subjects: [] });
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

  const handleActionBlur = () => {
    const cleanedInput = actionInput
      .split(/[,\n]/)
      .map((action) => action.trim())
      .filter((action) => action.length > 0)
      .join(', ');
    setActionInput(cleanedInput);
  };

  const handleSubjectBlur = () => {
    const cleanedInput = subjectInput
      .split(/[,\n]/)
      .map((subject) => subject.trim())
      .filter((subject) => subject.length > 0)
      .join(', ');
    setSubjectInput(cleanedInput);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Permission</DialogTitle>
          <DialogDescription>
            Create a new permission by selecting actions and subjects that
            correspond to menu items
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
              onBlur={handleActionBlur}
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
              onBlur={handleSubjectBlur}
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
              {isLoading ? 'Creating...' : 'Create Permission'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
