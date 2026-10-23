import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMeta } from '../lib/seoData.mjs';
import { SERVICES } from '../lib/servicesData.mjs';
import { FAQ_DATA } from '../lib/faqData.mjs';
import { REGIONS } from '../lib/regionData.mjs';
import { buildRegionServiceContent, REGION_LANDING_SERVICES } from '../lib/regionServiceContent.mjs';

const meta = (pathname) => buildMeta({ pathname, services: SERVICES, currentUrl: `https://preview.example${pathname}?utm_source=test#faq` });
const graph = (pathname) => meta(pathname).jsonLd['@graph'];

test('canonical and entity URLs use the production origin without tracking parameters', () => {
  const result = meta('/services/office/');
  assert.equal(result.canonicalUrl, 'https://www.neutiul.com/services/office');
  assert.doesNotMatch(JSON.stringify(result.jsonLd), /preview\.example|utm_source/);
});

test('unknown service, region and route are noindex; valid routes remain indexable', () => {
  for (const path of ['/missing', '/services/missing', '/services/office/missing', '/services/office/gangnam/extra', '/admin']) {
    assert.equal(meta(path).shouldNoindex, true, path);
  }
  for (const path of ['/', '/about', '/services/office', '/services/office/gangnam']) {
    assert.equal(meta(path).shouldNoindex, false, path);
  }
});

test('FAQ schema only describes questions on that page, with one FAQ entity per page', () => {
  for (const path of ['/about', '/contact', '/privacy', '/portfolio', '/services']) {
    assert.equal(graph(path).filter(x => x['@type'] === 'FAQPage').length, 0, path);
  }
  const homeFaq = graph('/').find(x => x['@type'] === 'FAQPage');
  assert.equal(homeFaq.mainEntity.length, FAQ_DATA.flatMap(x => x.qas).length);
  assert.equal(graph('/services/office/gangnam').filter(x => x['@type'] === 'FAQPage').length, 1);
});

test('every regional FAQ schema preserves the exact questions and answers used by its visible page', () => {
  for (const serviceId of REGION_LANDING_SERVICES) {
    for (const region of REGIONS) {
      const pathname = `/services/${serviceId}/${region.id}`;
      const content = buildRegionServiceContent(region, serviceId);
      const result = meta(pathname);
      const faqEntities = result.jsonLd['@graph'].filter(entity => entity['@type'] === 'FAQPage');
      assert.equal(faqEntities.length, 1, pathname);
      assert.deepEqual(faqEntities[0].mainEntity.map(item => ({ q: item.name, a: item.acceptedAnswer.text })), content.faqs, pathname);
      assert.equal(result.shouldNoindex, false, pathname);
      assert.equal(result.canonicalUrl, `https://www.neutiul.com${pathname}`, pathname);
      const service = result.jsonLd['@graph'].find(entity => entity['@type'] === 'Service');
      assert.equal(service.description, content.intro, `${pathname} schema must not retain an older experience claim`);
    }
  }
});

test('no invented rating, zero-price cleaning offer or unrelated HowTo is published', () => {
  for (const path of ['/', '/services/office', '/services/office/gangnam']) {
    const json = JSON.stringify(meta(path).jsonLd);
    assert.doesNotMatch(json, /aggregateRating|"price":"0"|"HowTo"|"CleaningService"/);
  }
});

test('every service has distinct title and canonical, absolute social image, and focused keywords', () => {
  const titles = new Set();
  for (const service of SERVICES) {
    const result = meta(`/services/${service.id}`);
    titles.add(result.title);
    assert.equal(result.canonicalUrl, `https://www.neutiul.com/services/${service.id}`);
    assert.match(result.image, /^https:\/\//);
    assert.ok(result.keywords.split(',').length <= 12);
    assert.equal(result.ogType, 'website');
  }
  assert.equal(titles.size, SERVICES.length);
});

test('service main landing pages use their own SEO copy, region pages do not', () => {
  for (const service of SERVICES) {
    assert.ok(service.seoTitle && service.seoDescription && service.heroLead, `${service.id} needs landing copy`);
    const keyword = service.seoDescription.split(' 전문업체')[0];
    assert.ok(service.seoTitle.startsWith(keyword), `${service.id} title leads with its keyword`);
    assert.ok(service.heroLead.startsWith(service.title), `${service.id} hero line leads with the service name`);
    assert.equal(service.heroLead.split('\n').length, 2, `${service.id} hero line breaks into two lines on PC`);
    assert.match(service.seoDescription, /비용과 견적/);
    assert.doesNotMatch(`${service.seoTitle} ${service.seoDescription} ${service.heroLead}`, /완벽|내구성|세계적/);
    assert.doesNotMatch(`${service.seoTitle} ${service.seoDescription} ${service.heroLead}`, /24시|즉시|바로 안내/, `${service.id} must not promise unverified hours or response times`);

    const landing = meta(`/services/${service.id}`);
    assert.equal(landing.title, service.seoTitle);
    assert.equal(landing.description, service.seoDescription);

    const region = meta(`/services/${service.id}/gangnam`);
    assert.notEqual(region.title, service.seoTitle);
    assert.notEqual(region.description, service.seoDescription);
  }
});
