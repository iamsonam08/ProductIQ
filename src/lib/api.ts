/**
 * ProductIQ API URL Resolver & Fetch Wrapper
 * Handles environment-aware URL construction for development and production cross-origin deployments (Vercel <-> Render).
 */

export function getApiUrl(endpointPath: string): string {
  const cleanPath = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;

  // 1. Explicit environment variable override
  const configuredApiUrl = import.meta.env.VITE_API_URL;
  if (configuredApiUrl && typeof configuredApiUrl === 'string' && configuredApiUrl.trim() !== '') {
    const baseUrl = configuredApiUrl.trim().replace(/\/+$/, '');
    return `${baseUrl}${cleanPath}`;
  }

  // 2. If running on Vercel deployment without VITE_API_URL set, fallback to Render backend URL
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('vercel.app') || host.includes('vercel.dev')) {
      return `https://productiq-5nqv.onrender.com${cleanPath}`;
    }
  }

  // 3. Default relative path for local full-stack dev server / container
  return cleanPath;
}

/**
 * Centralized fetch helper wrapping getApiUrl
 */
export async function apiFetch(endpointPath: string, options: RequestInit = {}): Promise<Response> {
  const url = getApiUrl(endpointPath);
  return fetch(url, options);
}
