import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import { SERVICES } from '../lib/servicesData.mjs';
import { REGIONS } from '../lib/regionData.mjs';
import { buildRegionServiceContent, REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';
import { HOUSING_PROFILE_REGION_IDS, getHousingBridge } from '../lib/regionHousingProfile.mjs';
import { RESIDENTIAL_STORIES } from '../lib/regionResidentialStory.mjs';
import { getServiceBlogLinks } from '../lib/serviceBlogLinks.mjs';
import { SERVICE_KEYWORDS_MAP, buildMeta } from '../lib/seoData.mjs';
import { matchesServicePhoto } from '../lib/servicePhotoMatch.mjs';

const portfolioManifest = JSON.parse(
  fs.readFileSync(new URL('../lib/portfolioManifest.json', import.meta.url), 'utf8'),
);

const SPLIT = ['special', 'trash-house', 'lonely-death'];

test('특수청소 is split into three independent services with their own title and region pages', () => {
  const byId = Object.fromEntries(SERVICES.map((s) => [s.id, s]));
  assert.equal(new Set(SERVICES.map((s) => s.id)).size, SERVICES.length, 'service ids must be unique');
  assert.equal(new Set(SERVICES.map((s) => s.title)).size, SERVICES.length, 'service titles must be unique');
  assert.equal(byId.special.title, '특수청소');
  assert.equal(byId['trash-house'].title, '쓰레기집 청소');
  assert.equal(byId['lonely-death'].title, '고독사 청소');
  for (const id of SPLIT) {
    assert.ok(byId[id].details.length >= 5, `${id} needs its own job-scope steps`);
    assert.ok(REGION_LANDING_SERVICES.includes(id), `${id} needs region landing pages`);
  }
});

test('the existing /services/special URL and its indexed case articles are untouched', () => {
  assert.ok(SERVICES.some((s) => s.id === 'special'));
  const meta = buildMeta({ pathname: '/services/special', services: SERVICES });
  assert.equal(meta.canonicalUrl, 'https://www.neutiul.com/services/special');
});

test('each new service gets region pages with region-specific copy and a full FAQ', () => {
  for (const serviceId of ['trash-house', 'lonely-death']) {
    const intros = new Set();
    for (const region of REGIONS) {
      const content = buildRegionServiceContent(region, serviceId);
      assert.ok(content, `${serviceId}/${region.id}`);
      assert.equal(content.faqs.length, 4, `${serviceId}/${region.id} faq count`);
      assert.ok(content.intro.includes(region.name), `${serviceId}/${region.id} intro names the region`);
      // Same regional ingredients as every other service's region page, with
      // the housing-focused description instead of the business-demand story.
      const residential = RESIDENTIAL_STORIES[region.id];
      assert.ok(residential, `${region.id} needs a residential description`);
      assert.ok(content.intro.includes(residential), `${serviceId}/${region.id} intro carries the residential description`);
      assert.ok(!content.intro.includes(region.story), `${serviceId}/${region.id} intro should not reuse the business story`);
      assert.ok(content.faqs[0].a.includes(region.landmark), `${serviceId}/${region.id} first FAQ names the landmark`);
      assert.ok(JSON.stringify(content).includes(region.dongs[0]), `${serviceId}/${region.id} lists the region's dongs`);
      assert.doesNotMatch(JSON.stringify(content), /undefined|\[object/, `${serviceId}/${region.id}`);
      // These are residential/sensitive jobs: no blanket "we keep meeting
      // these sites in every region" experience claim.
      assert.doesNotMatch(content.intro, /꾸준히 만나 왔습니다/, `${serviceId}/${region.id}`);
      intros.add(content.intro);
    }
    assert.equal(intros.size, REGIONS.length, `${serviceId} intros must differ per region`);
  }
});

test('the two new services do not borrow each other\'s subject matter', () => {
  const region = REGIONS[0];
  const trash = JSON.stringify(buildRegionServiceContent(region, 'trash-house'));
  const lonely = JSON.stringify(buildRegionServiceContent(region, 'lonely-death'));
  assert.doesNotMatch(trash, /고독사/);
  assert.doesNotMatch(lonely, /쓰레기집/);
});

test('region housing profiles only reference real regions', () => {
  const ids = new Set(REGIONS.map((r) => r.id));
  for (const id of HOUSING_PROFILE_REGION_IDS) assert.ok(ids.has(id), `unknown region id in housing profile: ${id}`);
  for (const id of Object.keys(RESIDENTIAL_STORIES)) assert.ok(ids.has(id), `unknown region id in residential stories: ${id}`);
  assert.equal(new Set(Object.values(RESIDENTIAL_STORIES)).size, Object.keys(RESIDENTIAL_STORIES).length, 'residential descriptions must be distinct');
  const withBridge = REGIONS.filter((r) => getHousingBridge(r));
  assert.ok(withBridge.length > 40, 'most regions should carry a housing-specific sentence');
  // a region without a profile gets no sentence, never a wrong one
  assert.equal(getHousingBridge({ id: 'gangnam' }), '');
});

test('each service keeps only the Naver blog posts that fit it', () => {
  const trash = getServiceBlogLinks('trash-house');
  const special = getServiceBlogLinks('special');
  const lonely = getServiceBlogLinks('lonely-death');
  assert.ok(trash.length >= 5);
  assert.ok(special.length > 0 && special.length < trash.length);
  assert.equal(lonely.length, 1);
  assert.match(lonely[0].desc, /고독사/);
  for (const post of [...special, ...lonely]) assert.ok(trash.some((t) => t.url === post.url));
});

test('search keywords are split by service instead of shared', () => {
  assert.ok(SERVICE_KEYWORDS_MAP['lonely-death'].includes('고독사청소'));
  assert.ok(SERVICE_KEYWORDS_MAP['trash-house'].includes('쓰레기집청소'));
  assert.ok(SERVICE_KEYWORDS_MAP.special.includes('특수청소'));
  assert.ok(!SERVICE_KEYWORDS_MAP.special.includes('쓰레기집청소'));
  assert.ok(!SERVICE_KEYWORDS_MAP.special.includes('고독사청소'));
  assert.ok(!SERVICE_KEYWORDS_MAP['trash-house'].includes('고독사청소'));
});

test('every existing special-category photo lands on exactly one of the three services', () => {
  const specialPhotos = portfolioManifest.filter((item) => ['special', 'mold-removal', 'etc'].includes(item.category));
  assert.ok(specialPhotos.length > 0);
  for (const item of specialPhotos) {
    const owners = SPLIT.filter((id) => matchesServicePhoto(id, item));
    assert.equal(owners.length, 1, `${item.id} (${item.title}) -> ${owners.join(',') || 'nobody'}`);
  }
  const owner = (title) => SPLIT.filter((id) => matchesServicePhoto(id, { category: 'special', title }));
  assert.deepEqual(owner('수원 쓰레기집 청소'), ['trash-house']);
  assert.deepEqual(owner('부천 고독사 청소'), ['lonely-death']);
  assert.deepEqual(owner('군포 니코틴 청소'), ['special']);
});
