'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { IconFileText, IconLoader2 } from '@tabler/icons-react';

interface BirthCertificateViewerProps {
  applicationId: string;
  hasCertificateUrl: boolean;
}

type Status = 'loading' | 'available' | 'unavailable';

export function BirthCertificateViewer({
  applicationId,
  hasCertificateUrl
}: BirthCertificateViewerProps) {
  const [status, setStatus] = useState<Status>(
    hasCertificateUrl ? 'loading' : 'unavailable'
  );

  const proxyUrl = `/api/birth-applications/${applicationId}/certificate`;

  useEffect(() => {
    if (!hasCertificateUrl) {
      setStatus('unavailable');
      return;
    }

    // HEAD-check the proxy route to confirm the file actually exists
    fetch(proxyUrl, { method: 'HEAD' })
      .then((res) => {
        setStatus(res.ok ? 'available' : 'unavailable');
      })
      .catch(() => setStatus('unavailable'));
  }, [applicationId, hasCertificateUrl, proxyUrl]);

  if (status === 'loading') {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-gray-400">
        <IconLoader2 className="h-8 w-8 animate-spin opacity-40" />
        <p>Loading document...</p>
      </div>
    );
  }

  if (status === 'unavailable') {
    return (
      <div className="flex h-[200px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-gray-400">
        <IconFileText className="h-8 w-8 opacity-40" />
        <p>No supporting documents attached</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Birth Certificate</p>
        <Badge variant="secondary">PDF</Badge>
      </div>
      <div className="border-muted overflow-hidden rounded-lg border">
        <iframe
          src={proxyUrl}
          className="h-[600px] w-full"
          title="Birth Certificate"
        />
      </div>
    </div>
  );
}
