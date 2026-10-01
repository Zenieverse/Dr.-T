import { validateRedirectDestination } from './redirect_handler';

const current = 'https://example.com/initial';

// Valid redirect
const target = validateRedirectDestination(current, '/destination.pdf');
if (target !== 'https://example.com/destination.pdf') {
  console.error(`FAIL: Expected https://example.com/destination.pdf, got ${target}`);
  process.exit(1);
}

// Blocked private subnet redirect
let blocked = false;
try {
  validateRedirectDestination(current, 'http://169.254.169.254/latest/meta-data/');
} catch (e: any) {
  if (e.message.includes('SSRF blocked')) {
    blocked = true;
  }
}

if (!blocked) {
  console.error('FAIL: Private metadata IP redirect was not blocked');
  process.exit(1);
}

console.log('PASS: validateRedirectDestination secures hop-by-hop redirects against SSRF');
process.exit(0);
