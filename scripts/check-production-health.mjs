// Read-only checks: no admin sign-in, enquiry submission or database writes.
import { setTimeout as delay } from 'node:timers/promises';
const origin = 'https://www.neutiul.com';
const checks = [
  ...['/', '/services/office', '/portfolio', '/contact', '/admin'].map(path => ({
    name: path,
    url: origin + path,
    async verify(response) {
      if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
      if (response.headers.get('x-content-type-options') !== 'nosniff') throw new Error('nosniff header missing');
      if (response.headers.get('x-frame-options') !== 'DENY') throw new Error('frame protection missing');
      if (!response.headers.get('content-security-policy')?.includes("frame-ancestors 'none'")) throw new Error('CSP frame protection missing');
      const html = await response.text();
      if (!html.includes('<div id="root"') || !html.includes('/assets/')) throw new Error('application HTML missing');
    },
  })),
  ...['kslee0143', 'decline11731'].map(blog => ({
    name: `RSS ${blog}`,
    url: `${origin}/api/naver-rss?blog=${blog}`,
    async verify(response) {
      if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.items) || data.items.length === 0) throw new Error('feed items missing');
    },
  })),
  {
    name: 'Firestore anonymous system read denied',
    url: 'https://firestore.googleapis.com/v1/projects/project-d3a46906-dd76-40a2-9ed/databases/ai-studio-0808-84969666-e5d5-45d6-9343-2a2105407806/documents/system/security-check',
    async verify(response) {
      if (response.status !== 403) throw new Error(`Expected HTTP 403, received ${response.status}`);
    },
  },
];
let failed = false;
for (const check of checks) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(check.url, { signal: AbortSignal.timeout(12000), redirect: 'error' });
      await check.verify(response);
      console.log(`PASS ${check.name}`);
      break;
    } catch (error) {
      if (attempt < 3) { await delay(1500); continue; }
      failed = true;
      console.error(`FAIL ${check.name}: ${error.message}`);
    }
  }
}
if (failed) process.exitCode = 1;
