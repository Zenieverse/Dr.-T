export interface FetchOptions {
  maxRedirects?: number;
}

export function isPrivateSubnet(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname === '169.254.169.254'
  );
}

export function validateRedirectDestination(currentUrl: string, locationHeader: string): string {
  const resolved = new URL(locationHeader, currentUrl);
  if (resolved.protocol !== 'http:' && resolved.protocol !== 'https:') {
    throw new Error(`Invalid redirect protocol: ${resolved.protocol}`);
  }
  if (isPrivateSubnet(resolved.hostname)) {
    throw new Error(`SSRF blocked redirect to private subnet: ${resolved.hostname}`);
  }
  return resolved.toString();
}
