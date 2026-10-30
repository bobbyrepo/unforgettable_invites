import { AUTHORIZED_HOSTS } from '@/config/domains';

export function isAuthorizedHost(host: string | null): boolean {
  if (!host) return false;
  const cleanHost = host.toLowerCase().split(':')[0];
  return AUTHORIZED_HOSTS.some((allowed) => {
    const cleanAllowed = allowed.toLowerCase().split(':')[0];
    return cleanHost === cleanAllowed || cleanHost.endsWith(`.${cleanAllowed}`);
  });
}
