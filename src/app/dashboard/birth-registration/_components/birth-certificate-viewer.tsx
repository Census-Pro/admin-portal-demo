'use client';

import { Badge } from '@/components/ui/badge';

interface BirthCertificateViewerProps {
  applicationId: string;
  hasCertificateUrl: boolean;
}

export function BirthCertificateViewer({
  applicationId,
  hasCertificateUrl
}: BirthCertificateViewerProps) {
  // Always display the dummy birth certificate for demonstration
  const dummyPdfUrl = '/dummy_birth_certificate_bhutan.pdf';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Birth Certificate</p>
        <Badge variant="secondary">PDF</Badge>
      </div>
      <div className="border-muted overflow-hidden rounded-lg border">
        <iframe
          src={dummyPdfUrl}
          className="h-[600px] w-full"
          title="Birth Certificate"
        />
      </div>
    </div>
  );
}
