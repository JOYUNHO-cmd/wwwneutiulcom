import { SERVICES } from '../lib/servicesData.mjs';
import { FAQ_DATA } from '../lib/faqData.mjs';
import { REGIONS } from '../lib/regionData.mjs';

// Optional reading aid for AI tools, generated from the same public service
// and FAQ content as the website. It does not control crawling or rankings.
export function buildLlmDocuments(companyInfo = {}) {
  const origin = 'https://www.neutiul.com';
  const company = [
    '# 느티울종합청소', '',
    '> 서울·인천·경기 청소 서비스. 서비스별 작업 범위와 견적 문의, 실제 시공 사진을 안내합니다.', '',
    '대표: 조윤호',
    `전화: ${companyInfo.phone || '010-4880-7386'}`,
    `이메일: ${companyInfo.email || 'danger3662@naver.com'}`,
    `주소: ${companyInfo.address || '경기도 군포시 도마교동 463 1층'}`, '',
    '견적은 현장 면적, 오염 상태, 작업 범위를 확인한 후 상담으로 안내합니다. 지역 안내는 서비스 상담 가능 지역이며 별도 지점이나 해당 지역의 시공 실적을 뜻하지 않습니다.', '',
  ];
  const pages = [
    ['홈', '/'], ['회사 소개', '/about'], ['전체 서비스', '/services'],
    ['실제 시공 전후 사진', '/portfolio'], ['견적 문의', '/contact'],
    ['자주 묻는 질문', '/#faq'], ['개인정보처리방침', '/privacy'],
  ];
  const links = SERVICES.map(s => `- [${s.title}](${origin}/services/${s.id}): 작업 범위와 견적 안내`);
  const brief = [...company, '## 주요 페이지', '',
    ...pages.map(([name, path]) => `- [${name}](${origin}${path})`), '',
    '## 서비스', '', ...links, '', '## 참고 자료', '',
    `- [서비스·FAQ 전체 안내](${origin}/llms-full.txt)`,
    `- [사이트맵](${origin}/sitemap.xml)`, '',
  ].join('\n');
  const full = [...company, ...SERVICES.flatMap(s => [
    `## ${s.title}`, '', `[서비스 원문](${origin}/services/${s.id})`, '',
    s.description.replace(/\n+/g, ' '), '', ...s.details.map(detail => `- ${detail}`), '',
  ]), '## 자주 묻는 질문', '',
  ...FAQ_DATA.flatMap(cat => cat.qas.flatMap(qa => [`### ${qa.q}`, '', qa.a, ''])),
  '## 지역 안내', '',
  REGIONS.map(region => region.name).join(', '), '',
  `세부 지역별 안내는 [사이트맵](${origin}/sitemap.xml)에서 확인할 수 있습니다.`, '',
  ].join('\n');
  return { 'llms.txt': brief, 'llms-full.txt': full };
}
