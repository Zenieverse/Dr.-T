# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | :white_check_mark: |
| 1.x.x   | :x:                |

---

## 🔒 Acoustic & Data Security Commitments

**PIANIST — Touch Grass** operates on strict privacy and security principles:
1. **Zero Secret Leaks**: No API keys, credentials, or proprietary tokens are bundled in client assets or repository source files.
2. **Audio Privacy**: Microphone streams are accessed only with explicit user interaction, processed in-memory via the Web Audio API, and discarded immediately after musical feature extraction.
3. **Location Privacy**: Outdoor sound maps store only temporary, coarse acoustic categories (e.g. "Footsteps", "Park Bench") with zero persistent GPS coordinates or location breadcrumbs.

---

## 🚨 Reporting a Vulnerability

If you discover a potential security issue or data exposure in this project:

1. **Do not create a public GitHub issue.**
2. Send an email with vulnerability details to `security@zenieverse.com` (or contact `zenieverse@gmail.com`).
3. Include reproduction steps, browser/operating system environment, and potential impact.

We will acknowledge receipt within 48 hours and work with you on a responsible disclosure timeline.
