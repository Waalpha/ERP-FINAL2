import React, { useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlatformShell } from './shells/PlatformShell';
import { TenantShell } from './shells/TenantShell';
import { TenantNotFound } from './pages/TenantNotFound';
import { getEffectiveHostname, resolveTenantFromHost, isPreviewOrLocalEnv } from './services/TenantResolver';
import { DevDomainBar } from './components/DevDomainBar';

const AppRoot: React.FC = () => {
  const { allTenants } = useAuth();

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
      {/* Strict Shell Separation based on Hostname */}
      <div className="flex-1 flex flex-col">
        {resolution.type === 'PLATFORM' && <PlatformShell />}

        {resolution.type === 'TENANT' && <TenantShell tenant={resolution.tenant} />}

        {resolution.type === 'NOT_FOUND' && (
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
