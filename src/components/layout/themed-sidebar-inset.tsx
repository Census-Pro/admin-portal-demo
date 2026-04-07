'use client';

import React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';

interface ThemedSidebarInsetProps {
  children: React.ReactNode;
  className?: string;
}

export function ThemedSidebarInset({
  children,
  className
}: ThemedSidebarInsetProps) {
  const backgroundImage = `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('/lightmodeBg.png')`;

  return (
    <SidebarInset
      className={className}
      style={{
        backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {children}
    </SidebarInset>
  );
}
