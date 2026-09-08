import React, { useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlatformShell } from './shells/PlatformShell';
import { TenantShell } from './shells/TenantShell';
import { TenantNotFound } from './pages/TenantNotFound';
import { getEffectiveHostname, resolveTenantFromHost } from './services/TenantResolver';

const AppRoot: React.FC = () => {
  const { allTenants, user, isPlatformMode } = useAuth();

  // Determine the effective hostname to resolve
  const effectiveHostname = useMemo(() => {
    return getEffectiveHostname();
  }, []);

  // Central resolution: PLATFORM, TENANT, or NOT_FOUND
  const resolution = useMemo(() => {
    return resolveTenantFromHost(effectiveHostname, allTenants);
  }, [effectiveHostname, allTenants]);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white bg-slate-100">
      {/* Strict Shell Separation based on Hostname or Super Admin user */}
      <div className="flex-1 flex flex-col">
        {(user?.role === 'SUPER_ADMIN' || isPlatformMode || resolution.type === 'PLATFORM') && <PlatformShell />}

        {resolution.type === 'TENANT' && !(user?.role === 'SUPER_ADMIN' || isPlatformMode) && <TenantShell tenant={resolution.tenant} />}

        {resolution.type === 'NOT_FOUND' && !(user?.role === 'SUPER_ADMIN' || isPlatformMode) && (
          <TenantNotFound
            requestedHost={resolution.requestedHost}
            subdomain={resolution.subdomain}
          />
        )}
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppRoot />
    </AuthProvider>
  );
}

export default App;
