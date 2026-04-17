'use client';

import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { IconInfoCircle } from '@tabler/icons-react';

interface ApplicationPhotoProps {
  photoUrl: string | null;
  originalPhotoUrl?: string;
}

export function ApplicationPhoto({
  photoUrl,
  originalPhotoUrl
}: ApplicationPhotoProps) {
  if (!photoUrl) {
    return (
      <Alert>
        <IconInfoCircle className="h-4 w-4" />
        <AlertDescription>
          No photo uploaded for this application.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Applicant Photo</p>
        <Badge variant="secondary">IMAGE</Badge>
      </div>
      <div className="border-muted overflow-hidden rounded-lg border">
        <img
          src={photoUrl}
          alt="Applicant Photo"
          className="h-auto w-full object-contain"
          style={{ maxHeight: '600px' }}
          onError={(e) => {
            console.error('Image failed to load:', photoUrl);
            e.currentTarget.src = '/placeholder-user.png';
          }}
        />
      </div>
    </>
  );
}
