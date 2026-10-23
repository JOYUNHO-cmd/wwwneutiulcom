import test from 'node:test';
import assert from 'node:assert/strict';
import { REGIONS } from '../lib/regionData.mjs';
import { REGION_LANDING_SERVICES, buildRegionServiceContent } from '../lib/regionServiceContent.mjs';

test('regional consultation copy does not promise universal free visits or around-the-clock availability', () => {
  for (const region of REGIONS) {
    for (const service of REGION_LANDING_SERVICES) {
      const content = buildRegionServiceContent(region, service);
      assert.doesNotMatch(JSON.stringify(content), /100%|24시간|24시|즉시 출동|언제든 달려/, `${region.id}/${service}`);
      const quote = content.faqs.find(faq => /무료/.test(faq.q));
      if (quote) assert.match(quote.a, /방문.*비용.*상담|비용.*방문.*상담/);
    }
  }
});

test('sensitive-service copy offers agreed timing and routes instead of secrecy promises', () => {
  for (const region of REGIONS) {
    for (const service of ['special', 'trash-house', 'lonely-death']) {
      const content = buildRegionServiceContent(region, service);
      assert.doesNotMatch(JSON.stringify(content), /이웃 모르게|이웃(?:이나 건물|에게).*알려지지 않게/);
      const privacy = content.faqs.find(faq => /프라이버시/.test(faq.q));
      assert.ok(privacy, `${region.id}/${service}: privacy FAQ`);
      assert.match(privacy.a, /방문 시간/);
      assert.match(privacy.a, /반출 동선/);
      assert.match(privacy.a, /상의.*노출을 줄/);
    }
  }
});

test('first regional FAQ preserves locality without repeating a dong already in the region name', () => {
  for (const region of REGIONS) {
    for (const service of REGION_LANDING_SERVICES) {
      const content = buildRegionServiceContent(region, service);
      const locality = region.name.includes(region.dongs[0])
        ? region.name : `${region.name} ${region.dongs[0]}`;
      assert.ok(content.faqs[0].q.startsWith(`${locality} 일대 `), `${region.id}/${service}: ${content.faqs[0].q}`);
      assert.equal(content.faqs.length, 4);
      assert.deepEqual(content.dongs, region.dongs);
      assert.ok(content.intro.includes(region.name));
      for (const faq of content.faqs) {
        assert.deepEqual(Object.keys(faq), ['q', 'a']);
        assert.ok(faq.q && faq.a);
      }
    }
  }
});
