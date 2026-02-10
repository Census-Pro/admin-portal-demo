'use client';

import { createContext, useContext } from 'react';

interface PermissionsContextType {
  refreshData: () => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export function PermissionsProvider({
  children,
  refreshData
}: {
  children: React.ReactNode;
  refreshData: () => void;
}) {
  return (
    <PermissionsContext.Provider value={{ refreshData }}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissionsContext() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error(
      'usePermissionsContext must be used within a PermissionsProvider'
    );
  }
  return context;
}
