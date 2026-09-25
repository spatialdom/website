import type { PropsWithChildren } from 'react';

function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      {children}
    </div>
  );
}

export default AppShell;
