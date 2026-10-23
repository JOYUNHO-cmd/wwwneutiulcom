import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { buildMeta } from '../lib/seoData.mjs';
import { SERVICES } from '../lib/servicesData.mjs';
import { REGIONS } from '../lib/regionData.mjs';
import { REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';
import { getRegionCases } from '../lib/regionCaseData.mjs';
import * as blogs from '../lib/serviceBlogLinks.mjs';

const availabilityPromises = /24\s*시|연중무휴|긴급\s*출동|무료|100\s*%/;
const meta = (pathname, companyInfo = {}) => buildMeta({ pathname, services: SERVICES, companyInfo });

test('home, catalog and contact SEO descriptions avoid unverified availability and free-visit promises', () => {
  for (const pathname of ['/', '/services', '/contact']) {
    const result = meta(pathname);
    assert.doesNotMatch(result.description, availabilityPromises, pathname);
    assert.match(result.description, /서울·인천·경기/);
    assert.match(result.description, /상담/);
    assert.equal(result.jsonLd['@graph'].find(entity => entity['@id'] === `${result.canonicalUrl}#webpage`).description, result.description);
  }
});

test('regional fallback SEO descriptions retain local service context without availability promises', () => {
  let fallbackCount = 0;
  for (const serviceId of REGION_LANDING_SERVICES) {
    for (const region of REGIONS) {
      if (getRegionCases(serviceId, region.id).length) continue;
      fallbackCount++;
      const pathname = `/services/${serviceId}/${region.id}`;
      const result = meta(pathname);
      assert.doesNotMatch(result.description, availabilityPromises, pathname);
      assert.ok(result.description.includes(region.name), pathname);
      assert.match(result.description, /작업 범위|방문 일정/);
      assert.equal(result.shouldNoindex, false);
    }
  }
  assert.ok(fallbackCount > 0, 'exercise the actual no-case fallback branch');
});

test('service blog editorial descriptions avoid absolute efficacy, safety and regulatory promises', () => {
  const unsupportedPromises = /완벽|완전|전부 제거|흔적 없이|손상 없이|손상 없는|무손상|티끌 하나 없는|친환경|안전한|안전을 위한|안전한 환경|안심하고|건강한|유독성|유독물질|유해\s*(분진|먼지|물질)|위생 검열 기준|멸균|살균|고온 소독|악취 차단|곰팡이를 억제|악취를 예방|수명을 연장|내구성|정전기 방지|새것과 같은|신축 복원/;
  for (const service of SERVICES) {
    const links = blogs.getServiceBlogLinks(service.id);
    assert.ok(links.length > 0, service.id);
    for (const link of links) {
      assert.doesNotMatch(link.desc, unsupportedPromises, `${service.id}: ${link.url}`);
      assert.doesNotMatch(link.desc, availabilityPromises, `${service.id}: ${link.url}`);
      assert.ok(link.desc.trim().length > 0);
    }
  }
});

test('curated blog titles, URLs, media, other fields, quantity and order remain unchanged', () => {
  const protectedData = Object.fromEntries(Object.entries(blogs)
    .filter(([, value]) => Array.isArray(value))
    .map(([key, value]) => [key, value.map(({ desc, ...protectedFields }) => protectedFields)]));
  assert.equal(createHash('sha256').update(JSON.stringify(protectedData)).digest('hex'),
    '29d1c0efed7fcfc955bf0ff3f78f92123d25a38129deb998c50aaf3da6484890');
});

test('contact SEO uses the configured contact phone without changing canonical or entity IDs', () => {
  const result = meta('/contact', { phone: '02-123-4567' });
  assert.match(result.description, /02-123-4567/);
  assert.equal(result.canonicalUrl, 'https://www.neutiul.com/contact');
  assert.ok(result.jsonLd['@graph'].some(entity => entity['@id'] === 'https://www.neutiul.com/contact#webpage'));
});
