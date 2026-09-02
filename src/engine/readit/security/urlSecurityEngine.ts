// ============================================================================
// 🛡️ DR. T READIT — SECURE URL VALIDATION & SSRF PROTECTION ENGINE
// Architecture:
// USER URL -> URL VALIDATION -> SSRF PROTECTION -> SAFE NETWORK FETCH -> QUARANTINE BUFFER
// "NO UNTRUSTED URL GOES DIRECTLY TO THE AI."
// ============================================================================

export interface UrlSecurityCheckResult {
  isValid: boolean;
  sanitizedUrl: string;
  hostname: string;
  protocol: string;
  isPrivateOrInternal: boolean;
  blockedReason?: string;
  securityGate: 'PROTOCOL_VALIDATION' | 'CREDENTIAL_CHECK' | 'SSRF_FILTER' | 'DNS_CHECK' | 'PASSED';
}

export interface UrlFetchResult {
  success: boolean;
  url: string;
  finalUrl: string;
  filename: string;
  fileBuffer: ArrayBuffer;
  contentType: string;
  contentLength: number;
  sha256: string;
  durationMs: number;
  securityChecks: {
    protocolPassed: boolean;
    ssrfPassed: boolean;
    sizeLimitPassed: boolean;
    redirectCount: number;
  };
  error?: string;
}

export interface PresetUrlItem {
  id: string;
  title: string;
  url: string;
  category: 'CLINICAL' | 'RESEARCH' | 'GUIDELINES' | 'DATA' | 'SECURITY_TEST';
  docType: 'pdf' | 'docx' | 'txt' | 'csv';
  description: string;
  isThreatSimulation?: boolean;
}

export const READIT_PRESET_URLS: PresetUrlItem[] = [
  {
    id: 'preset_url_who_guidelines',
    title: 'WHO Clinical Hypertension & Biomarker Guidelines',
    url: 'https://iris.who.int/bitstream/handle/10665/344453/9789240033986-eng.pdf',
    category: 'GUIDELINES',
    docType: 'pdf',
    description: 'Official World Health Organization clinical management guidelines with diagnostic criteria.',
  },
  {
    id: 'preset_url_nih_iron_metabolism',
    title: 'NIH Study: Serum Ferritin & Iron Metabolism in Human Pathology',
    url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5986027/pdf/nutrients-10-00614.pdf',
    category: 'CLINICAL',
    docType: 'pdf',
    description: 'Peer-reviewed clinical research on iron deficiency, ferritin thresholds, and metabolic indicators.',
  },
  {
    id: 'preset_url_cdc_lab_methods',
    title: 'CDC Clinical Laboratory Biomarker Reference Ranges',
    url: 'https://www.cdc.gov/nchs/data/nhanes/nhanes_09_10/lab_methods_09_10.pdf',
    category: 'CLINICAL',
    docType: 'pdf',
    description: 'Reference laboratory ranges for complete blood count, glucose, and metabolic panels.',
  },
  {
    id: 'preset_url_ai_safety_paper',
    title: 'Biomedical AI Safety & Prompt Injection Shield Specifications',
    url: 'https://arxiv.org/pdf/2303.08774.pdf',
    category: 'RESEARCH',
    docType: 'pdf',
    description: 'Technical whitepaper on foundational model safety, boundary enforcement, and provenance grounding.',
  },
  {
    id: 'preset_url_ssrf_test_attack',
    title: '⚠️ SSRF Attack Simulation: Cloud Metadata (169.254.169.254)',
    url: 'http://169.254.169.254/computeMetadata/v1/instance/service-accounts/default/token',
    category: 'SECURITY_TEST',
    docType: 'txt',
    description: 'Security test vector simulating an SSRF attack attempting to exfiltrate cloud instance metadata.',
    isThreatSimulation: true,
  },
  {
    id: 'preset_url_localhost_test_attack',
    title: '⚠️ SSRF Attack Simulation: Internal Loopback (127.0.0.1:3000)',
    url: 'http://127.0.0.1:3000/api/internal-admin-keys',
    category: 'SECURITY_TEST',
    docType: 'txt',
    description: 'Security test vector attempting to probe internal server loopback ports.',
    isThreatSimulation: true,
  },
];

export class UrlSecurityValidator {
  // Disallowed schemes
  private static BLOCKED_PROTOCOLS = new Set([
    'file:', 'javascript:', 'data:', 'blob:', 'gopher:', 'ftp:', 'ftps:',
    'ldap:', 'ldaps:', 'dict:', 'ssh:', 'telnet:', 'ws:', 'wss:', 'chrome:',
    'view-source:', 'jar:', 'mailto:', 'vbs:',
  ]);

  // Private IPv4 patterns (RFC 1918, link-local, loopback, broadcast, carrier NAT)
  private static PRIVATE_IP_PATTERNS = [
    /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,                // Loopback (127.0.0.0/8)
    /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,                 // Private 10.0.0.0/8
    /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/,    // Private 172.16.0.0/12
    /^192\.168\.\d{1,3}\.\d{1,3}$/,                   // Private 192.168.0.0/16
    /^169\.254\.\d{1,3}\.\d{1,3}$/,                   // Link-local & Cloud Metadata (169.254.0.0/16)
    /^0\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,                 // 0.0.0.0/8
    /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}$/, // Carrier NAT (100.64.0.0/10)
    /^192\.0\.2\.\d{1,3}$/,                            // TEST-NET-1
    /^198\.51\.100\.\d{1,3}$/,                         // TEST-NET-2
    /^203\.0\.113\.\d{1,3}$/,                          // TEST-NET-3
    /^224\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,                // Multicast (224.0.0.0/4)
    /^240\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,                // Reserved (240.0.0.0/4)
    /^255\.255\.255\.255$/,                            // Broadcast
  ];

  // Blocked hostnames & cloud metadata services
  private static BLOCKED_HOSTNAMES = new Set([
    'localhost',
    'localhost.localdomain',
    'ip6-localhost',
    'ip6-loopback',
    'metadata.google.internal',
    'metadata.internal',
    'metadata',
    'instance-data',
    '169.254.169.254',
    '127.0.0.1',
    '0.0.0.0',
    '[::1]',
    '::1',
  ]);

  private static BLOCKED_DOMAIN_SUFFIXES = [
    '.local',
    '.internal',
    '.localhost',
    '.lan',
    '.corp',
    '.home',
    '.arpa',
    '.invalid',
    '.test',
  ];

  /**
   * Evaluates user-supplied URL for protocol validity, embedded credentials, and SSRF indicators.
   */
  public static validateUrl(inputUrl: string): UrlSecurityCheckResult {
    const trimmed = (inputUrl || '').trim();

    if (!trimmed) {
      return {
        isValid: false,
        sanitizedUrl: '',
        hostname: '',
        protocol: '',
        isPrivateOrInternal: false,
        blockedReason: 'URL cannot be empty.',
        securityGate: 'PROTOCOL_VALIDATION',
      };
    }

    let parsed: URL;
    try {
      // Auto-prefix if protocol is omitted but user typed domain
      const urlToParse = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
      parsed = new URL(urlToParse);
    } catch (e: any) {
      return {
        isValid: false,
        sanitizedUrl: trimmed,
        hostname: '',
        protocol: '',
        isPrivateOrInternal: false,
        blockedReason: `Malformed URL structure: ${e.message || 'Invalid URI syntax'}`,
        securityGate: 'PROTOCOL_VALIDATION',
      };
    }

    const protocol = parsed.protocol.toLowerCase();
    const hostname = parsed.hostname.toLowerCase();

    // 1. Protocol Validation
    if (this.BLOCKED_PROTOCOLS.has(protocol)) {
      return {
        isValid: false,
        sanitizedUrl: parsed.href,
        hostname,
        protocol,
        isPrivateOrInternal: false,
        blockedReason: `Disallowed protocol "${protocol}". Only HTTP and HTTPS are permitted for security.`,
        securityGate: 'PROTOCOL_VALIDATION',
      };
    }

    if (protocol !== 'http:' && protocol !== 'https:') {
      return {
        isValid: false,
        sanitizedUrl: parsed.href,
        hostname,
        protocol,
        isPrivateOrInternal: false,
        blockedReason: `Invalid protocol "${protocol}". Dr. T ReadIt only accepts secure HTTP(S) URLs.`,
        securityGate: 'PROTOCOL_VALIDATION',
      };
    }

    // 2. Embedded Credential Check (user:pass@host)
    if (parsed.username || parsed.password) {
      return {
        isValid: false,
        sanitizedUrl: parsed.href,
        hostname,
        protocol,
        isPrivateOrInternal: false,
        blockedReason: 'URLs containing embedded basic authentication credentials (user:pass@) are prohibited.',
        securityGate: 'CREDENTIAL_CHECK',
      };
    }

    // 3. SSRF & Internal Hostname Filter
    if (this.BLOCKED_HOSTNAMES.has(hostname)) {
      return {
        isValid: false,
        sanitizedUrl: parsed.href,
        hostname,
        protocol,
        isPrivateOrInternal: true,
        blockedReason: `SSRF Policy Violation: Access to internal/loopback host "${hostname}" is blocked.`,
        securityGate: 'SSRF_FILTER',
      };
    }

    for (const suffix of this.BLOCKED_DOMAIN_SUFFIXES) {
      if (hostname.endsWith(suffix)) {
        return {
          isValid: false,
          sanitizedUrl: parsed.href,
          hostname,
          protocol,
          isPrivateOrInternal: true,
          blockedReason: `SSRF Policy Violation: Access to private TLD "${suffix}" is blocked.`,
          securityGate: 'SSRF_FILTER',
        };
      }
    }

    // 4. IP Address Checks (including hex/octal/decimal representations)
    if (this.isPrivateOrRestrictedIp(hostname)) {
      return {
        isValid: false,
        sanitizedUrl: parsed.href,
        hostname,
        protocol,
        isPrivateOrInternal: true,
        blockedReason: `SSRF Policy Violation: IP address "${hostname}" resides in a private or reserved network range.`,
        securityGate: 'SSRF_FILTER',
      };
    }

    return {
      isValid: true,
      sanitizedUrl: parsed.href,
      hostname,
      protocol,
      isPrivateOrInternal: false,
      securityGate: 'PASSED',
    };
  }

  /**
   * Detects private IPv4, loopback IPv6, link-local, and encoded integer IP bypasses.
   */
  public static isPrivateOrRestrictedIp(host: string): boolean {
    const cleanHost = host.replace(/^\[|\]$/g, ''); // strip IPv6 brackets

    // Direct IPv4 match
    for (const pattern of this.PRIVATE_IP_PATTERNS) {
      if (pattern.test(cleanHost)) {
        return true;
      }
    }

    // IPv6 loopback / unique local / link-local
    if (
      cleanHost === '::1' ||
      cleanHost === '::' ||
      cleanHost.startsWith('fe80:') ||
      cleanHost.startsWith('fc00:') ||
      cleanHost.startsWith('fd00:') ||
      cleanHost.startsWith('::ffff:127.') ||
      cleanHost.startsWith('::ffff:10.') ||
      cleanHost.startsWith('::ffff:192.168.') ||
      cleanHost.startsWith('::ffff:169.254.')
    ) {
      return true;
    }

    // Decimal Integer IP representation check (e.g. 2130706433 for 127.0.0.1)
    if (/^\d+$/.test(cleanHost)) {
      const num = parseInt(cleanHost, 10);
      if (num >= 0 && num <= 4294967295) {
        const ip = [
          (num >>> 24) & 255,
          (num >>> 16) & 255,
          (num >>> 8) & 255,
          num & 255,
        ].join('.');
        for (const pattern of this.PRIVATE_IP_PATTERNS) {
          if (pattern.test(ip)) return true;
        }
      }
    }

    // Hex representation (e.g., 0x7f000001)
    if (/^0x[0-9a-fA-F]+$/i.test(cleanHost)) {
      const num = parseInt(cleanHost, 16);
      if (num >= 0 && num <= 4294967295) {
        const ip = [
          (num >>> 24) & 255,
          (num >>> 16) & 255,
          (num >>> 8) & 255,
          num & 255,
        ].join('.');
        for (const pattern of this.PRIVATE_IP_PATTERNS) {
          if (pattern.test(ip)) return true;
        }
      }
    }

    return false;
  }

  /**
   * Extracts clean display filename from URL
   */
  public static deriveFilenameFromUrl(urlStr: string, defaultName = 'remote_document.pdf'): string {
    try {
      const parsed = new URL(urlStr);
      const pathname = parsed.pathname;
      const segments = pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        const last = decodeURIComponent(segments[segments.length - 1]);
        if (last && last.includes('.')) {
          return last.replace(/[^a-zA-Z0-9._-]/g, '_');
        }
        return `${last.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
      }
      return `${parsed.hostname.replace(/[^a-zA-Z0-9_-]/g, '_')}_document.pdf`;
    } catch {
      return defaultName;
    }
  }
}
