import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as faq from '../lib/faqData.mjs';
import { SERVICES } from '../lib/servicesData.mjs';
import { buildMeta, SERVICE_KEYWORDS_MAP } from '../lib/seoData.mjs';

const unsupported = /완벽|완전(?:히|한|\s*제거|\s*박멸)|무해|살균|멸균|사멸|박멸|24시|100%|기한\s*없는|세계적|원천\s*차단|근본적으로|이웃\s*모르게|노출되지\s*않도록|밖으로\s*알리지|즉시\s*출동|손상\s*없이|새집증후군을\s*예방|바닥에\s*바닥에|전전화를/;

test('service catalog and main-page metadata describe conditional cleaning scope without unsupported guarantees', () => {
  assert.equal(SERVICES.length, 16);
  for (const service of SERVICES) {
    const copy = [service.description, service.heroLead, service.seoDescription, ...service.details].join(' ');
    assert.doesNotMatch(copy, unsupported, service.id);
    assert.match(service.details.join(' '), scopeTopics[service.id], `${service.id}: concrete work detail`);
    assert.match(copy, /확인|협의/, `${service.id}: scope depends on site`);
    assert.match(copy, /별도|한계|남을|제외/, `${service.id}: distinguishes limits or optional work`);
    const meta = buildMeta({ pathname: `/services/${service.id}`, services: SERVICES });
    assert.doesNotMatch(JSON.stringify(meta), unsupported, `${service.id}: SEO must not revive removed claims`);
    const business = meta.jsonLd['@graph'].find(item => item['@type']?.includes('LocalBusiness'));
    assert.equal(business.openingHoursSpecification, undefined, 'unverified all-day hours must not be asserted');
    assert.equal(business.paymentAccepted, undefined, 'payment methods are confirmed in consultation');
  }
});

test('home FAQ stays service-neutral and leaves business terms to consultation', () => {
  const items = faq.FAQ_DATA.flatMap(cat => cat.qas);
  assert.doesNotMatch(JSON.stringify(items), unsupported);
  assert.doesNotMatch(items.map(item => item.q).join(' '), /냉장고|에어컨|반려동물|입주청소|마루/);
  for (const topic of [/견적/, /범위/, /세정|자재/, /보험/, /취소/, /사후|보완/]) {
    assert.match(JSON.stringify(items), topic);
  }
  assert.doesNotMatch(JSON.stringify(items), /5%|1주일|15년|무료로|하루면|기한 없는/);
  const home = buildMeta({ pathname: '/', services: SERVICES }).jsonLd['@graph'].find(item => item['@type'] === 'FAQPage');
  assert.deepEqual(home.mainEntity.map(item => ({ q: item.name, a: item.acceptedAnswer.text })), items);
});

test('main landing template removes price statistics, response promises, typos and unverified credential guarantees', async () => {
  const source = await readFile(new URL('../pages/ServiceLanding.tsx', import.meta.url), 'utf8');
  const copy = source.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  assert.doesNotMatch(copy, unsupported);
  assert.doesNotMatch(copy, /10분|\d+만 원|평균 (?:비용|작업)|고객님께 의뢰를 제시|검증된 전문 자격|만족할 때까지|전문 자격증 보유 현황|즉시 상담|절대|원천 차단/);
  assert.match(copy, /포함.*별도|별도.*포함/);
  assert.match(copy, /보완.*범위|범위.*보완/);
});

test('FAQ contact prompts do not imply free visits or continuous consultation', async () => {
  const source = await readFile(new URL('../components/FAQSection.tsx', import.meta.url), 'utf8');
  const copy = source.replace(/\/\/[^\n]*|\{\/\*[\s\S]*?\*\/\}/g, '');
  assert.doesNotMatch(copy, /무료 상담|언제든 문의|24시|즉시/);
  assert.match(copy, /상담 가능 시간|일정.*확인|확인.*일정/);
});

test('SEO keyword pools do not advertise unverified prevention, pest eradication or specialist availability', () => {
  assert.doesNotMatch(JSON.stringify(SERVICE_KEYWORDS_MAP), /화재예방|클린룸청소|쓰레기집쥐퇴치|긴급출동|비밀보장|살균|유독가스중화|24시/);
});

const scopeTopics = {
  'new-construction': /공사|보양/,
  interior: /마감|공사/,
  'move-in': /가전|분해/,
  office: /업무|서류/,
  floor: /바닥재|코팅/,
  'floor-wax': /박리|건조/,
  restaurant: /조리|식재료/,
  factory: /가동|출입/,
  flood: /건조|수리/,
  fire: /출입|복구/,
  special: /오염|방제/,
  'trash-house': /보관|반출/,
  'lonely-death': /유품|권한/,
  hood: /덕트|팬/,
  'government-school': /방학|휴관/,
  'external-wall': /고소|보행/,
};

test('all sixteen main services render their own FAQ source with exactly matching JSON-LD', async () => {
  assert.equal(typeof faq.getServiceFaqData, 'function', 'service FAQ selector must exist');
  const { build } = await import('esbuild');
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const compiled = await build({ entryPoints: ['components/FAQSection.tsx'], bundle: true, packages: 'external', format: 'cjs', platform: 'node', write: false });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', compiled.outputFiles[0].text)(require, module, module.exports);
  {
    const { default: FAQSection } = module.exports;
    const React = require('react');
    const { renderToStaticMarkup } = require('react-dom/server');
    const { MemoryRouter } = require('react-router-dom');
    const { parse } = await import('node-html-parser');
    const sources = new Set();
    for (const service of SERVICES) {
      const data = faq.getServiceFaqData(service.id);
      const items = data.flatMap(cat => cat.qas);
      assert.ok(items.length >= 4, service.id);
      assert.match(JSON.stringify(items), scopeTopics[service.id], service.id);
      sources.add(JSON.stringify(items));
      const meta = buildMeta({ pathname: `/services/${service.id}`, services: SERVICES });
      const entities = meta.jsonLd['@graph'].filter(item => item['@type'] === 'FAQPage');
      assert.equal(entities.length, 1, service.id);
      assert.deepEqual(entities[0].mainEntity.map(item => ({ q: item.name, a: item.acceptedAnswer.text })), items, service.id);
      const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(FAQSection, { serviceId: service.id })));
      const text = parse(html).textContent;
      for (const item of items) {
        assert.ok(text.includes(item.q), `${service.id}: rendered question ${item.q}`);
        assert.ok(text.includes(item.a), `${service.id}: rendered answer ${item.q}`);
      }
      const homeOnly = faq.FAQ_DATA.flatMap(cat => cat.qas).filter(item => !items.some(qa => qa.q === item.q));
      for (const item of homeOnly) assert.ok(!text.includes(item.q), `${service.id}: no unrelated home FAQ`);
    }
    assert.equal(sources.size, 16, 'every service has distinct, useful questions');
    assert.deepEqual(faq.getServiceFaqData(), faq.FAQ_DATA);
    assert.deepEqual(faq.getServiceFaqData('unknown'), faq.FAQ_DATA);
    const landing = await readFile(new URL('../pages/ServiceLanding.tsx', import.meta.url), 'utf8');
    assert.match(landing, /<FAQSection\b[^>]*serviceId=\{service\.id\}/);
  }
});
