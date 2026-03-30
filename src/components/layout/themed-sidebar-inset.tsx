'use client';

import React from 'react';
import { useTheme } from 'next-themes';
import { SidebarInset } from '@/components/ui/sidebar';

interface ThemedSidebarInsetProps {
  children: React.ReactNode;
  className?: string;
}

export function ThemedSidebarInset({
  children,
  className
}: ThemedSidebarInsetProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const backgroundImage =
    mounted && resolvedTheme === 'dark'
      ? `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('/darkmodeBg.png')`
      : `linear-gradient(var(--bg-overlay), var(--bg-overlay)), url('/lightmodeBg.png')`;

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
