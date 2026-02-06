#!/bin/bash

# Script to generate edit modals for all master entities
# This creates the edit modal component for each entity type

# Usage: ./generate-edit-modals.sh

ENTITIES=(
  "countries:Country:countries:countries"
  "dzongkhags:Dzongkhag:dzongkhags:dzongkhags"
  "gewogs:Gewog:gewogs:gewogs"
  "cities:City:cities:cities"
  "genders:Gender:genders:genders"
  "marital-status:MaritalStatus:marital status:marital-statuses"
  "literacy-status:LiteracyStatus:literacy status:literacy-statuses"
  "census-status:CensusStatus:census status:census-statuses"
  "naturalization-types:NaturalizationType:naturalization type:naturalization-types"
  "regularization-types:RegularizationType:regularization type:regularization-types"
  "relationship-certificate-purposes:RelationshipCertificatePurpose:relationship certificate purpose:relationship-certificate-purposes"
)

for entity_info in "${ENTITIES[@]}"; do
  IFS=':' read -r folder_name component_name display_name api_path <<< "$entity_info"
  
  file_name="edit-${folder_name//_/-}-modal.tsx"
  file_path="../src/app/dashboard/(masters)/${folder_name}/_components/${file_name}"
  
  # Convert folder name to PascalCase for types (e.g., marital-status -> MaritalStatus)
  type_name="${component_name}"
  
  # Convert to camelCase for variable names (e.g., MaritalStatus -> maritalStatus)
  var_name="$(echo ${type_name:0:1} | tr '[:upper:]' '[:lower:]')${type_name:1}"
  
  # Generate action import name (e.g., marital-status-actions)
  action_file="${folder_name}-actions"
  
  cat > "${file_path}" << EOF
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
import { update${type_name} } from '@/actions/common/${action_file}';
import { toast } from 'sonner';

interface ${type_name} {
  id: string;
  name: string;
}

interface Edit${type_name}ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ${var_name}: ${type_name} | null;
}

export function Edit${type_name}Modal({
  isOpen,
  onClose,
  onSuccess,
  ${var_name}
}: Edit${type_name}ModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (${var_name}) {
      setFormData({
        name: ${var_name}.name
      });
    }
  }, [${var_name}]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!${var_name}) return;

    setIsLoading(true);

    try {
      const result = await update${type_name}({
        id: ${var_name}.id,
        name: formData.name
      });

      if (result.success) {
        toast.success(result.message || '${display_name^} updated successfully');
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || 'Failed to update ${display_name}');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Update ${display_name} error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit ${display_name^}</DialogTitle>
          <DialogDescription>
            Update the ${display_name} details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">${display_name^} Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter ${display_name} name"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update ${display_name^}'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
EOF

  echo "Created: ${file_path}"
done

echo "✓ All edit modals generated successfully!"
EOF
