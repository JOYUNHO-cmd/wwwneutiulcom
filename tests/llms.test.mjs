import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLlmDocuments } from '../scripts/generate-llms.mjs';
import { SERVICES } from '../lib/servicesData.mjs';
import { FAQ_DATA } from '../lib/faqData.mjs';

test('AI reading index links all existing services using standard Markdown links', () => {
  const docs = buildLlmDocuments();
  assert.match(docs['llms.txt'], /^# 느티울종합청소\n/);
  const urls = [...docs['llms.txt'].matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(x => x[1]);
  for (const service of SERVICES) assert.ok(urls.includes(`https://www.neutiul.com/services/${service.id}`));
  assert.match(docs['llms.txt'], /별도 지점이나 해당 지역의 시공 실적을 뜻하지 않습니다/);
  for (const { q, a } of FAQ_DATA.flatMap(cat => cat.qas)) {
    assert.ok(docs['llms-full.txt'].includes(q));
    assert.ok(docs['llms-full.txt'].includes(a));
  }
  assert.doesNotMatch(docs['llms-full.txt'], /4\.98|184|37\.3323|126\.9037/);
});

test('public company contact changes propagate into both AI documents', () => {
  const docs = buildLlmDocuments({ phone: '02-123-4567', address: '테스트 공개 주소', email: 'public@example.com' });
  for (const value of Object.values(docs)) {
    assert.ok(value.includes('02-123-4567'));
    assert.ok(value.includes('테스트 공개 주소'));
    assert.ok(value.includes('public@example.com'));
  }
});
