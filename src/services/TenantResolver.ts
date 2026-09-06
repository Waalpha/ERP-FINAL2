import { Tenant } from '../types';

export type TenantResolutionResult =
  | { type: 'PLATFORM'; hostname: string }
  | { type: 'TENANT'; tenant: Tenant; hostname: string; subdomain: string }
  | { type: 'NOT_FOUND'; requestedHost: string; subdomain?: string };

export const PLATFORM_SUBDOMAINS = ['app', 'admin', 'master', 'cloud', 'platform', 'hq', 'www'];
export const MAIN_DOMAIN_SUFFIX = 'davetech.co.ke';

/**
 * Extracts the effective hostname to resolve, accounting for URL query parameters
 * in development/sandbox environments (?host=kcacollege.davetech.co.ke or ?tenant=kcacollege).
 */
export function getEffectiveHostname(): string {
  if (typeof window === 'undefined') return 'app.davetech.co.ke';

  const searchParams = new URLSearchParams(window.location.search);
  const hostParam = searchParams.get('host');
  const tenantParam = searchParams.get('tenant');

  if (hostParam && hostParam.trim()) {
    return hostParam.trim().toLowerCase();
  }

  if (tenantParam && tenantParam.trim()) {
    const cleanTenant = tenantParam.trim().toLowerCase();
    if (PLATFORM_SUBDOMAINS.includes(cleanTenant) || cleanTenant === 'platform') {
      return 'app.davetech.co.ke';
    }
    return `${cleanTenant}.${MAIN_DOMAIN_SUFFIX}`;
  }

  // Real browser hostname
  const realHost = window.location.hostname.toLowerCase();
  return realHost;
}

/**
 * Central TenantResolver that parses the hostname and resolves to:
 * - PLATFORM: app.davetech.co.ke
 * - TENANT: <subdomain>.davetech.co.ke or custom domain (e.g. erp.kcacollege.ac.ke)
 * - NOT_FOUND: unknown.davetech.co.ke
 */
export function resolveTenantFromHost(
  hostname: string,
  tenantsList: Tenant[]
): TenantResolutionResult {
  const cleanHost = hostname.split(':')[0].toLowerCase();

  // 1. Direct platform hostnames
  if (
    cleanHost === 'app.davetech.co.ke' ||
    cleanHost === 'admin.davetech.co.ke' ||
    cleanHost === 'master.davetech.co.ke' ||
    cleanHost === 'davetech.co.ke' ||
    cleanHost === 'www.davetech.co.ke'
  ) {
    return { type: 'PLATFORM', hostname: cleanHost };
  }

  // 2. Check for *.davetech.co.ke subdomains
  if (cleanHost.endsWith('.davetech.co.ke') || cleanHost.endsWith('.davetech.io') || cleanHost.endsWith('.davetech.app')) {
    const parts = cleanHost.split('.');
    // For foo.davetech.co.ke -> parts are ['foo', 'davetech', 'co', 'ke']
    const subdomain = parts[0];

    if (PLATFORM_SUBDOMAINS.includes(subdomain)) {
      return { type: 'PLATFORM', hostname: cleanHost };
    }

    const cleanSub = subdomain.trim();
    const cleanSubNormalized = cleanSub.replace(/[\s-_]/g, '');

    const matchedTenant = tenantsList.find(
      (t) =>
        t.subdomain?.toLowerCase() === cleanSub ||
        t.subdomain?.toLowerCase().replace(/[\s-_]/g, '') === cleanSubNormalized ||
        t.code?.toLowerCase() === cleanSub ||
        t.code?.toLowerCase().replace(/[\s-_]/g, '') === cleanSubNormalized ||
        t.id?.toLowerCase() === `tenant-${cleanSub}` ||
        t.id?.toLowerCase().replace(/[\s-_]/g, '') === `tenant-${cleanSubNormalized}`
    );

    if (matchedTenant) {
      return {
        type: 'TENANT',
        tenant: matchedTenant,
        hostname: cleanHost,
        subdomain
      };
    }

    // Tenant does not exist on DAVETECH Cloud -> NOT_FOUND (never fall back!)
    return {
      type: 'NOT_FOUND',
      requestedHost: cleanHost,
      subdomain
    };
  }

  // 3. Check for custom domains (e.g. portal.staustins.ac.ke, erp.kcacollege.ac.ke)
  const customDomainTenant = tenantsList.find(
    (t) => t.customDomain && t.customDomain.toLowerCase() === cleanHost
  );

  if (customDomainTenant) {
    return {
      type: 'TENANT',
      tenant: customDomainTenant,
      hostname: cleanHost,
      subdomain: customDomainTenant.subdomain || customDomainTenant.code.toLowerCase()
    };
  }

  // 4. Development / Sandbox fallback (e.g. localhost or *.run.app)
  // If we are in local dev or cloud preview with no custom subdomain specified, default to PLATFORM
  const isDevOrPreview =
    cleanHost === 'localhost' ||
    cleanHost === '127.0.0.1' ||
    cleanHost.endsWith('.run.app') ||
    cleanHost.endsWith('.web.app') ||
    cleanHost.endsWith('.firebaseapp.com');

  if (isDevOrPreview) {
    return { type: 'PLATFORM', hostname: cleanHost };
  }

  // Otherwise, unrecognized custom domain
  return {
    type: 'NOT_FOUND',
    requestedHost: cleanHost
  };
}

/**
 * Checks if the current environment is running on a preview or local development host.
 */
export function isPreviewOrLocalEnv(): boolean {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname.toLowerCase();
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.run.app') ||
    host.endsWith('.web.app') ||
    host.endsWith('.firebaseapp.com') ||
    window.location.search.includes('host=') ||
    window.location.search.includes('tenant=')
  );
}

/**
 * Navigates to a specific host (production URL or dev query simulation).
 */
export function navigateToHost(targetHost: string): void {
  if (typeof window === 'undefined') return;

  const currentRealHost = window.location.hostname.toLowerCase();

  // If running in production *.davetech.co.ke environment
  if (currentRealHost.endsWith('davetech.co.ke') && !currentRealHost.includes('.run.app')) {
    window.location.href = `https://${targetHost}`;
    return;
  }

  // In AI Studio preview / development sandbox: update search query and reload
  const url = new URL(window.location.href);
  url.searchParams.delete('tenant');
  url.searchParams.set('host', targetHost);
  window.location.href = url.toString();
}

/**
 * Navigates to a tenant by subdomain (e.g. kcacollege -> kcacollege.davetech.co.ke).
 */
export function navigateToTenantSubdomain(subdomain: string): void {
  navigateToHost(`${subdomain}.${MAIN_DOMAIN_SUFFIX}`);
}

/**
 * Navigates to the DAVETECH Master Platform (app.davetech.co.ke).
 */
export function navigateToPlatform(): void {
  navigateToHost(`app.${MAIN_DOMAIN_SUFFIX}`);
}
