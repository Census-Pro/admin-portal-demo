'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { IconPlus, IconTrash, IconEye } from '@tabler/icons-react';
import { Card, CardContent } from '@/components/ui/card';

interface Admin {
  id: string;
  cidNo: string;
  fullName?: string;
  roleType: string;
  abilities: Array<{
    name: string;
    action: string[];
    subject: string | string[];
  }>;
}

interface AssignAbilitiesModalProps {
  admin: Admin;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (adminId: string, abilities: any[]) => Promise<void>;
}

// Available actions in the system
const AVAILABLE_ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
  'approve',
  'reject',
  'verify',
  'export',
  'print'
];

// Available subjects (menu items/resources)
const AVAILABLE_SUBJECTS = [
  'Dashboard',
  'Birth Registration',
  'Death Registration',
  'Marriage Registration',
  'Divorce Registration',
  'CID Issuance',
  'Admin',
  'Users',
  'Roles',
  'Permissions',
  'Reports',
  'Analytics',
  'Settings',
  'Audit Logs'
];

export function AssignAbilitiesModal({
  admin,
  open,
  onOpenChange,
  onSave
}: AssignAbilitiesModalProps) {
  const [abilities, setAbilities] = useState<
    Array<{
      name: string;
      action: string[];
      subject: string[];
    }>
  >([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (admin.abilities) {
      // Convert abilities to editable format
      const formattedAbilities = admin.abilities.map((ability) => ({
        name: ability.name,
        action: ability.action,
        subject: Array.isArray(ability.subject)
          ? ability.subject
          : [ability.subject]
      }));
      setAbilities(formattedAbilities);
    }
  }, [admin]);

  const addNewAbility = () => {
    setAbilities([
      ...abilities,
      {
        name: 'New Ability',
        action: ['read'],
        subject: ['Dashboard']
      }
    ]);
  };

  const removeAbility = (index: number) => {
    setAbilities(abilities.filter((_, i) => i !== index));
  };

  const updateAbilityName = (index: number, name: string) => {
    const updated = [...abilities];
    updated[index].name = name;
    setAbilities(updated);
  };

  const toggleAction = (abilityIndex: number, action: string) => {
    const updated = [...abilities];
    const currentActions = updated[abilityIndex].action;

    if (currentActions.includes(action)) {
      updated[abilityIndex].action = currentActions.filter((a) => a !== action);
    } else {
      updated[abilityIndex].action = [...currentActions, action];
    }

    setAbilities(updated);
  };

  const toggleSubject = (abilityIndex: number, subject: string) => {
    const updated = [...abilities];
    const currentSubjects = updated[abilityIndex].subject;

    if (currentSubjects.includes(subject)) {
      updated[abilityIndex].subject = currentSubjects.filter(
        (s) => s !== subject
      );
    } else {
      updated[abilityIndex].subject = [...currentSubjects, subject];
    }

    setAbilities(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(admin.id, abilities);
    } finally {
      setSaving(false);
    }
  };

  const getMenuItemsVisible = () => {
    // Calculate which menu items will be visible based on current abilities
    const visibleSubjects = new Set<string>();
    abilities.forEach((ability) => {
      ability.subject.forEach((subject) => visibleSubjects.add(subject));
    });
    return Array.from(visibleSubjects);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            Manage Abilities for {admin.fullName || admin.cidNo}
          </DialogTitle>
          <DialogDescription>
            Control what this admin can see and do in the system. Each ability
            defines actions (create, read, update, etc.) on subjects (Birth
            Registration, Admin, etc.)
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Preview what admin will see */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="mb-2 flex items-center gap-2">
                  <IconEye className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">
                    Sidebar Preview
                  </span>
                </div>
                <p className="mb-3 text-sm text-blue-700">
                  This admin will see these menu items:
                </p>
                <div className="flex flex-wrap gap-2">
                  {getMenuItemsVisible().length > 0 ? (
                    getMenuItemsVisible().map((subject) => (
                      <Badge key={subject} variant="secondary">
                        {subject}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      No menu items visible (no abilities assigned)
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Abilities List */}
            {abilities.map((ability, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Ability Name */}
                    <div className="flex items-center justify-between">
                      <div className="mr-4 flex-1">
                        <Label>Ability Name</Label>
                        <Input
                          value={ability.name}
                          onChange={(e) =>
                            updateAbilityName(index, e.target.value)
                          }
                          placeholder="e.g., Birth Registration Access"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeAbility(index)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Actions Selection */}
                    <div>
                      <Label className="mb-2 block">
                        Actions (What they can do)
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {AVAILABLE_ACTIONS.map((action) => (
                          <div
                            key={action}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`${index}-action-${action}`}
                              checked={ability.action.includes(action)}
                              onCheckedChange={() =>
                                toggleAction(index, action)
                              }
                            />
                            <label
                              htmlFor={`${index}-action-${action}`}
                              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {action}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Subjects Selection */}
                    <div>
                      <Label className="mb-2 block">
                        Subjects (Which menu items/resources)
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {AVAILABLE_SUBJECTS.map((subject) => (
                          <div
                            key={subject}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`${index}-subject-${subject}`}
                              checked={ability.subject.includes(subject)}
                              onCheckedChange={() =>
                                toggleSubject(index, subject)
                              }
                            />
                            <label
                              htmlFor={`${index}-subject-${subject}`}
                              className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {subject}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Ability Button */}
            <Button
              variant="outline"
              onClick={addNewAbility}
              className="w-full"
            >
              <IconPlus className="mr-2 h-4 w-4" />
              Add New Ability
            </Button>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Abilities'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
