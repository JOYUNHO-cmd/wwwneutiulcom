import test from 'node:test';
import assert from 'node:assert/strict';
import { SERVICES } from '../lib/servicesData.mjs';
import { serviceEditPayload, mergeServiceOverrides } from '../lib/serviceOverrides.mjs';

const displayFields = ['title', 'description', 'details', 'image'];
const protectedFields = service => Object.fromEntries(Object.entries(service).filter(([key]) => !displayFields.includes(key)));
const form = () => ({
  title: '  변경한 준공청소 제목  ',
  description: '관리자에서 수정한 소개입니다.\n서울·인천·경기 현장을 안내합니다.',
  details: ['창틀 분진 제거', '바닥 마감 상태 확인'],
  image: '/images/services/service-new-construction.webp',
});

test('saved service display fields survive JSON storage and appear in the public catalog', () => {
  const original = structuredClone(SERVICES);
  const source = original.find(service => service.id === 'new-construction');
  const payload = serviceEditPayload({ ...form(), id: 'untrusted-route', seoTitle: 'must not overwrite SEO' });
  const stored = JSON.parse(JSON.stringify(payload));
  const merged = mergeServiceOverrides(original, [{ id: source.id, ...stored }]);
  const displayed = merged.find(service => service.id === source.id);

  assert.deepEqual(Object.keys(payload).sort(), [...displayFields].sort());
  assert.equal(displayed.title, '변경한 준공청소 제목');
  assert.equal(displayed.description, form().description);
  assert.deepEqual(displayed.details, form().details);
  assert.equal(displayed.image, form().image);
  assert.deepEqual(original, SERVICES, 'loading saved content must not mutate the versioned catalog');
  assert.equal(merged.length, SERVICES.length);
  assert.deepEqual(merged.map(service => `/services/${service.id}`), SERVICES.map(service => `/services/${service.id}`));
  for (const service of merged) {
    const baseline = SERVICES.find(item => item.id === service.id);
    assert.deepEqual(protectedFields(service), protectedFields(baseline), service.id);
    if (service.id !== source.id) assert.deepEqual(service, baseline);
  }
});

test('database fields cannot replace service route IDs, SEO metadata, icons or ordering', () => {
  const service = SERVICES[0];
  const [displayed] = mergeServiceOverrides(SERVICES, [{
    id: service.id, ...serviceEditPayload(form()),
    seoTitle: 'Injected SEO', seoDescription: 'Injected metadata', heroLead: 'Injected hero lead',
    icon: 'InjectedIcon', order: -999, route: '/admin', internalNotes: 'not public display content',
  }]);
  assert.deepEqual(protectedFields(displayed), protectedFields(service));
  assert.equal(Object.hasOwn(displayed, 'route'), false);
  assert.equal(Object.hasOwn(displayed, 'internalNotes'), false);
});

test('unknown service IDs and malformed record lists leave existing routes intact', () => {
  const unknown = { ...serviceEditPayload(form()), id: 'unregistered-service' };
  for (const records of [undefined, null, {}, [null, false, {}, unknown]]) {
    assert.deepEqual(mergeServiceOverrides(SERVICES, records), SERVICES);
  }
});

test('omitted optional display fields keep the existing image and work items', () => {
  const service = SERVICES[0];
  const saved = JSON.parse(JSON.stringify({
    id: service.id, title: '제목만 변경', description: '소개만 변경', details: undefined, image: undefined,
  }));
  const [displayed] = mergeServiceOverrides(SERVICES, [saved]);
  assert.equal(displayed.title, '제목만 변경');
  assert.equal(displayed.description, '소개만 변경');
  assert.equal(displayed.image, service.image);
  assert.deepEqual(displayed.details, service.details);
  assert.deepEqual(protectedFields(displayed), protectedFields(service));
});

test('unsafe images and non-text work items fail edits and cannot poison public content', () => {
  const invalidChanges = [
    { image: 'javascript:alert(1)' },
    { image: 'data:image/svg+xml;base64,PHN2Zz4=' },
    { image: '/images/../admin' },
    { image: 'https://name:password@example.com/asset.jpg' },
    { image: null },
    { details: 'not a list' },
    { details: ['valid', { html: '<script>attack</script>' }] },
    { details: [1] },
    { details: Array(31).fill('too many') },
    { details: ['x'.repeat(5001)] },
    { title: '   ' },
    { title: 'x'.repeat(201) },
    { description: 'x'.repeat(5001) },
  ];
  for (const change of invalidChanges) {
    assert.throws(() => serviceEditPayload({ ...form(), ...change }));
    assert.deepEqual(mergeServiceOverrides(SERVICES, [{ ...form(), ...change, id: SERVICES[0].id }]), SERVICES);
  }
});

test('intentional empty descriptions and work lists persist without restoring old text', () => {
  const input = { ...form(), description: '', details: [], image: '' };
  const payload = serviceEditPayload(input);
  const [displayed] = mergeServiceOverrides(SERVICES, [{ id: SERVICES[0].id, ...JSON.parse(JSON.stringify(payload)) }]);
  assert.equal(displayed.description, '');
  assert.deepEqual(displayed.details, []);
  assert.equal(displayed.image, '');
  assert.notEqual(payload.details, input.details, 'payload must not share the mutable form array');
});
