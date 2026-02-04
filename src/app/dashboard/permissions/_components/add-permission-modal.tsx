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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { IconX } from '@tabler/icons-react';
import { createPermission } from '@/actions/common/permission-actions';
import { toast } from 'sonner';

interface AddPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_ACTIONS = ['create', 'read', 'update', 'delete'];

export function AddPermissionModal({
  isOpen,
  onClose,
  onSuccess
}: AddPermissionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    actions: [] as string[],
    subjects: [] as string[]
  });
  const [subjectInput, setSubjectInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.actions.length === 0) {
      toast.error('Please select at least one action');
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
    setFormData({ name: '', description: '', actions: [], subjects: [] });
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

  const handleActionToggle = (action: string) => {
    setFormData((prev) => ({
      ...prev,
      actions: prev.actions.includes(action)
        ? prev.actions.filter((a) => a !== action)
        : [...prev.actions, action]
    }));
  };

  const addSubject = () => {
    if (
      subjectInput.trim() &&
      !formData.subjects.includes(subjectInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, subjectInput.trim()]
      }));
      setSubjectInput('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((s) => s !== subject)
    }));
  };

  const handleSubjectKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubject();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Permission</DialogTitle>
          <DialogDescription>
            Create a new permission with actions and subjects. This will use
            bearer token authentication.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what this permission allows..."
              value={formData.description}
              onChange={handleChange}
              required
              disabled={isLoading}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>
              Actions <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-2 rounded-md border p-4">
              {AVAILABLE_ACTIONS.map((action) => (
                <div key={action} className="flex items-center space-x-2">
                  <Checkbox
                    id={`action-${action}`}
                    checked={formData.actions.includes(action)}
                    onCheckedChange={() => handleActionToggle(action)}
                    disabled={isLoading}
                  />
                  <Label
                    htmlFor={`action-${action}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {action}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subjects">
              Subjects <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="subjects"
                placeholder="e.g., User, Admin, Role"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyDown={handleSubjectKeyDown}
                disabled={isLoading}
              />
              <Button
                type="button"
                onClick={addSubject}
                disabled={isLoading || !subjectInput.trim()}
              >
                Add
              </Button>
            </div>
            {formData.subjects.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.subjects.map((subject) => (
                  <Badge key={subject} variant="outline" className="gap-1">
                    {subject}
                    <IconX
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSubject(subject)}
                    />
                  </Badge>
                ))}
              </div>
            )}
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
