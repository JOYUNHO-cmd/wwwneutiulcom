import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMeta } from '../lib/seoData.mjs';
import { SERVICES } from '../lib/servicesData.mjs';
import { FAQ_DATA } from '../lib/faqData.mjs';

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
