// lib/seoData.mjs
//
// Pure data + logic, no React/DOM dependency. Imported by:
//   - components/SEO.tsx (browser) — applies the result to the live DOM
//   - scripts/prerender.mjs (Node, build time) — bakes the result into
//     static HTML files so non-JS crawlers see correct per-page meta
//
// Keeping this in one plain module means the live site and the
// prerendered files can never drift out of sync with each other.

export const SERVICE_KEYWORDS_MAP = {
  'new-construction': [
    '신축준공청소', '준공청소', '상가준공청소', '아파트준공청소', '지식산업센터준공청소', '오피스텔준공청소', '공장준공청소',
    '빌라준공청소', '인테리어마감청소', '리모델링입주청소', '보양지제거', '시멘트분진제거', '페인트자국제거', '창틀시멘트제거',
    '준공청소비용', '준공청소업체추천', '서울준공청소', '강남준공청소', '마곡준공청소', '송도준공청소', '청라준공청소',
    '검단준공청소', '판교준공청소', '동탄준공청소', '군포준공청소', '안양준공청소', '수원준공청소', '강남구신축준공청소',
    '여의도신축준공청소', '구로디지털단지신축준공청소', '가산디지털단지신축준공청소', '성수동신축준공청소', '송도국제도시신축준공청소', '청라국제도시신축준공청소', '남동공단신축준공청소',
    '군포시신축준공청소', '산본신축준공청소', '안양시신축준공청소', '평촌신축준공청소', '수원시신축준공청소', '의왕시신축준공청소', '판교신축준공청소',
    '안산시신축준공청소', '반월공단신축준공청소'
  ],
  'post-construction': [
    '신축준공청소', '준공청소', '상가준공청소', '아파트준공청소', '지식산업센터준공청소', '오피스텔준공청소', '공장준공청소',
    '빌라준공청소', '인테리어마감청소', '리모델링입주청소', '보양지제거', '시멘트분진제거', '페인트자국제거', '창틀시멘트제거',
    '준공청소비용', '준공청소업체추천', '서울준공청소', '강남준공청소', '마곡준공청소', '송도준공청소', '청라준공청소',
    '검단준공청소', '판교준공청소', '동탄준공청소', '군포준공청소', '안양준공청소', '수원준공청소', '강남구신축준공청소',
    '여의도신축준공청소', '구로디지털단지신축준공청소', '가산디지털단지신축준공청소', '성수동신축준공청소', '송도국제도시신축준공청소', '청라국제도시신축준공청소', '남동공단신축준공청소',
    '군포시신축준공청소', '산본신축준공청소', '안양시신축준공청소', '평촌신축준공청소', '수원시신축준공청소', '의왕시신축준공청소', '판교신축준공청소',
    '안산시신축준공청소', '반월공단신축준공청소'
  ],
  'interior': [
    '인테리어청소', '인테리어마감청소', '리모델링청소', '상가인테리어청소', '아파트인테리어청소', '공사분진제거', '도배풀제거',
    '새집증후군청소', '보양지제거', '실리콘자국제거', '페인트제거', '피톤치드소독', '서울인테리어청소', '강남인테리어청소',
    '성수동인테리어청소', '송도인테리어청소', '판교인테리어청소', '강남구인테리어청소', '여의도인테리어청소', '구로디지털단지인테리어청소', '가산디지털단지인테리어청소',
    '송도국제도시인테리어청소', '청라국제도시인테리어청소', '남동공단인테리어청소', '군포시인테리어청소', '산본인테리어청소', '안양시인테리어청소', '평촌인테리어청소',
    '수원시인테리어청소', '의왕시인테리어청소', '안산시인테리어청소', '반월공단인테리어청소'
  ],
  'move-in': [
    '입주청소', '이사청소', '아파트입주청소', '오피스텔입주청소', '원룸입주청소', '빌라입주청소', '욕실표면세척',
    '주방기름때제거', '욕실물때제거', '창틀먼지제거', '배수구세척', '수납장내부청소', '서울입주청소', '인천입주청소',
    '경기입주청소', '수원입주청소', '군포입주청소', '안양입주청소', '강남구입주청소', '여의도입주청소', '구로디지털단지입주청소',
    '가산디지털단지입주청소', '성수동입주청소', '송도국제도시입주청소', '청라국제도시입주청소', '남동공단입주청소', '군포시입주청소', '산본입주청소',
    '안양시입주청소', '평촌입주청소', '수원시입주청소', '의왕시입주청소', '판교입주청소', '안산시입주청소', '반월공단입주청소'
  ],
  'office': [
    '사무실청소', '사무실정기청소', '사무실대청소', '공유오피스청소', '스타트업사무실청소', 'IT기업사옥청소', '빌딩관리청소',
    '계단청소', '병원정기청소', '학원청소', '헬스장청소', '상가화장실청소', '사무실바닥청소', '사무실청소견적',
    '사무실청소업체', '강남사무실청소', '여의도사무실청소', '가산디지털단지사무실청소', '구로디지털단지사무실청소', '성수동사무실청소', '마포사무실청소',
    '상암사무실청소', '판교사무실청소', '분당사무실청소', '송도사무실청소', '수원사무실청소', '강남구사무실청소', '송도국제도시사무실청소',
    '청라국제도시사무실청소', '남동공단사무실청소', '군포시사무실청소', '산본사무실청소', '안양시사무실청소', '평촌사무실청소', '수원시사무실청소',
    '의왕시사무실청소', '안산시사무실청소', '반월공단사무실청소'
  ],
  'floor': [
    '바닥청소', '바닥기계세척', '디럭스타일청소', '데코타일세척', '에폭시바닥청소', '우레탄바닥청소', '도끼다시세척',
    '테라조청소', '대리석세척', '바닥찌든때제거', '기름때제거', '오염수흡입', '서울바닥청소', '인천바닥청소',
    '경기바닥청소', '군포바닥청소', '안양바닥청소', '강남구바닥청소', '여의도바닥청소', '구로디지털단지바닥청소', '가산디지털단지바닥청소',
    '성수동바닥청소', '송도국제도시바닥청소', '청라국제도시바닥청소', '남동공단바닥청소', '군포시바닥청소', '산본바닥청소', '안양시바닥청소',
    '평촌바닥청소', '수원시바닥청소', '의왕시바닥청소', '판교바닥청소', '안산시바닥청소', '반월공단바닥청소'
  ],
  'floor-wax': [
    '바닥청소', '바닥왁스코팅', '왁스코팅', '데코타일왁스코팅', '디럭스타일박리작업', '아스타일코팅', '에폭시바닥청소',
    '우레탄바닥청소', '도끼다시연마광택', '테라조연마광택', '대리석연마광택', '바닥찌든때제거', '바닥기름때제거', '바닥왁스코팅가격',
    '바닥광택복원', '서울바닥코팅', '인천바닥코팅', '강남바닥코팅', '여의도바닥코팅', '가산바닥코팅', '송도바닥코팅',
    '남동공단바닥코팅', '판교바닥코팅', '안산바닥코팅', '수원바닥코팅', '강남구바닥왁스코팅', '여의도바닥왁스코팅', '구로디지털단지바닥왁스코팅',
    '가산디지털단지바닥왁스코팅', '성수동바닥왁스코팅', '송도국제도시바닥왁스코팅', '청라국제도시바닥왁스코팅', '남동공단바닥왁스코팅', '군포시바닥왁스코팅', '산본바닥왁스코팅',
    '안양시바닥왁스코팅', '평촌바닥왁스코팅', '수원시바닥왁스코팅', '의왕시바닥왁스코팅', '판교바닥왁스코팅', '안산시바닥왁스코팅', '반월공단바닥왁스코팅'
  ],
  'restaurant': [
    '주방청소', '업소주방청소', '닥트기름때제거', '후드청소', '튀김기청소', '업소용주방청소', '주방바닥청소',
    '주방위생점검청소', '주방트렌치청소', '배기덕트청소', '그리스트랩청소', '주방오픈청소', '서울주방청소', '인천주방청소',
    '강남주방청소', '홍대주방청소', '성수동주방청소', '수원주방청소', '강남구주방청소', '여의도주방청소', '구로디지털단지주방청소',
    '가산디지털단지주방청소', '송도국제도시주방청소', '청라국제도시주방청소', '남동공단주방청소', '군포시주방청소', '산본주방청소', '안양시주방청소',
    '평촌주방청소', '수원시주방청소', '의왕시주방청소', '판교주방청소', '안산시주방청소', '반월공단주방청소'
  ],
  'factory': [
    '공장청소', '물류창고청소', '공장분진청소', '기계설비세척', '공장바닥에폭시청소', '배관청소', '공장외벽청소',
    '산업체청소', 'H빔청소', '고소작업청소', '남동공단공장청소', '반월공단청소', '시화공단청소', '주안공단청소',
    '화성공장청소', '평택공장청소', '고색산단청소', '군포첨단산단청소', '강남구공장청소', '여의도공장청소', '구로디지털단지공장청소',
    '가산디지털단지공장청소', '성수동공장청소', '송도국제도시공장청소', '청라국제도시공장청소', '군포시공장청소', '산본공장청소', '안양시공장청소',
    '평촌공장청소', '수원시공장청소', '의왕시공장청소', '판교공장청소', '안산시공장청소', '반월공단공장청소'
  ],
  'flood': [
    '침수청소', '수해복구청소', '침수복구청소', '지하침수청소', '지하주차장침수배수', '양수기배수작업', '산업용제습건조',
    '고압세척진흙제거', '오니제거', '침수오염세척', '빗물역류청소', '하수구역류청소', '침수폐기물처리', '침수배수상담',
    '침수복구업체', '서울침수청소', '인천침수청소', '경기침수청소', '강남침수청소', '지하상가침수청소', '침수청소일정상담',
    '강남구침수청소', '여의도침수청소', '구로디지털단지침수청소', '가산디지털단지침수청소', '성수동침수청소', '송도국제도시침수청소', '청라국제도시침수청소',
    '남동공단침수청소', '군포시침수청소', '산본침수청소', '안양시침수청소', '평촌침수청소', '수원시침수청소', '의왕시침수청소',
    '판교침수청소', '안산시침수청소', '반월공단침수청소'
  ],
  'fire': [
    '화재청소', '화재복구청소', '화재그을음제거', '그을음청소', '화재냄새제거', '탄냄새제거', '잔존냄새상담',
    '화재오염청소', '화재폐기물처리', '화재현장철거', '주방화재청소', '공장화재청소', '아파트화재청소', '상가화재복구',
    '화재보험청구견적서', '화재청소상담', '서울화재청소', '인천화재청소', '경기화재청소', '수도권화재청소', '화재현장청소상담',
    '강남구화재청소', '여의도화재청소', '구로디지털단지화재청소', '가산디지털단지화재청소', '성수동화재청소', '송도국제도시화재청소', '청라국제도시화재청소',
    '남동공단화재청소', '군포시화재청소', '산본화재청소', '안양시화재청소', '평촌화재청소', '수원시화재청소', '의왕시화재청소',
    '판교화재청소', '안산시화재청소', '반월공단화재청소'
  ],
  'special': [
    '특수청소', '특수청소업체', '특수청소비용', '혈흔제거', '현장악취청소', '특수오염청소', '부패취제거',
    '해충방제상담', '니코틴청소', '니코틴제거', '유품정리', '유품정리업체', '방문반출상담', '폐기물수거처리',
    '서울특수청소', '인천특수청소', '경기특수청소', '수도권특수청소', '강남구특수청소', '여의도특수청소', '구로디지털단지특수청소',
    '가산디지털단지특수청소', '성수동특수청소', '송도국제도시특수청소', '청라국제도시특수청소', '남동공단특수청소', '군포시특수청소',
    '산본특수청소', '안양시특수청소', '평촌특수청소', '수원시특수청소', '의왕시특수청소', '판교특수청소', '안산시특수청소', '반월공단특수청소'
  ],
  'trash-house': [
    '쓰레기집청소', '쓰레기집청소업체', '쓰레기집청소비용', '저장강박증청소', '원룸쓰레기집청소', '오피스텔쓰레기집청소', '비대면쓰레기집청소',
    '방문반출상담', '폐기물수거처리', '야간쓰레기집청소', '쓰레기집해충상담', '해충방제상담', '서울쓰레기집청소', '인천쓰레기집청소',
    '경기쓰레기집청소', '수도권쓰레기집청소', '강남구쓰레기집청소', '여의도쓰레기집청소', '구로디지털단지쓰레기집청소', '가산디지털단지쓰레기집청소',
    '성수동쓰레기집청소', '송도국제도시쓰레기집청소', '청라국제도시쓰레기집청소', '남동공단쓰레기집청소', '군포시쓰레기집청소', '산본쓰레기집청소',
    '안양시쓰레기집청소', '평촌쓰레기집청소', '수원시쓰레기집청소', '의왕시쓰레기집청소', '판교쓰레기집청소', '안산시쓰레기집청소', '반월공단쓰레기집청소'
  ],
  'lonely-death': [
    '고독사청소', '고독사청소업체', '고독사청소비용', '고독사현장정리', '고독사특수청소', '유품정리', '혈흔제거', '현장악취청소',
    '부패취제거', '특수오염청소', '방문반출상담', '해충방제상담', '서울고독사청소', '인천고독사청소', '경기고독사청소', '수도권고독사청소',
    '강남구고독사청소', '여의도고독사청소', '구로디지털단지고독사청소', '가산디지털단지고독사청소', '성수동고독사청소', '송도국제도시고독사청소',
    '청라국제도시고독사청소', '남동공단고독사청소', '군포시고독사청소', '산본고독사청소', '안양시고독사청소', '평촌고독사청소',
    '수원시고독사청소', '의왕시고독사청소', '판교고독사청소', '안산시고독사청소', '반월공단고독사청소'
  ],
  'external-wall': [
    '외벽청소', '외벽세척', '건물외벽청소', '유리외벽청소', '석재외벽청소', '복합판넬청소', '드라이비트외벽청소',
    '외벽고압세척', '외벽물때제거', '외벽백화현상제거', '외벽매연제거', '고소작업청소', '스카이차외벽청소', '로프외벽청소',
    '유리창청소', '외벽발수코팅', '외벽청소업체', '외벽청소비용', '서울외벽청소', '인천외벽청소', '경기외벽청소',
    '강남구외벽청소', '여의도외벽청소', '구로디지털단지외벽청소', '가산디지털단지외벽청소', '성수동외벽청소',
    '송도국제도시외벽청소', '청라국제도시외벽청소', '남동공단외벽청소', '군포시외벽청소', '산본외벽청소', '안양시외벽청소', '평촌외벽청소',
    '수원시외벽청소', '의왕시외벽청소', '판교외벽청소', '안산시외벽청소', '반월공단외벽청소'
  ],
  hood: [
    '후드청소', '덕트청소', '주방후드청소', '배기덕트청소', '후드필터청소', '후드기름때제거', '후드세척상담',
    '어린이집후드청소', '요양원후드청소', '구내식당후드청소', '후드청소업체', '후드청소비용', '서울후드청소', '인천후드청소',
    '경기후드청소', '강남후드청소', '수원후드청소', '안양후드청소', '군포후드청소', '강남구후드청소', '여의도후드청소',
    '구로디지털단지후드청소', '가산디지털단지후드청소', '성수동후드청소', '송도국제도시후드청소', '청라국제도시후드청소', '남동공단후드청소',
    '군포시후드청소', '산본후드청소', '안양시후드청소', '평촌후드청소', '수원시후드청소', '의왕시후드청소', '판교후드청소',
    '안산시후드청소', '반월공단후드청소'
  ],
  'government-school': [
    '관공서청소', '학교청소', '관공서청소업체', '학교청소업체', '어린이집청소', '교실청소', '강당청소', '복지관청소',
    '주민센터청소', '공공기관청소', '학교바닥왁스코팅', '교실바닥청소', '관공서청소비용', '서울관공서청소', '인천관공서청소',
    '경기관공서청소', '강남구관공서청소', '여의도관공서청소', '구로디지털단지관공서청소', '가산디지털단지관공서청소', '성수동관공서청소',
    '송도국제도시관공서청소', '청라국제도시관공서청소', '남동공단관공서청소', '군포시관공서청소', '산본관공서청소', '안양시관공서청소',
    '평촌관공서청소', '수원시관공서청소', '의왕시관공서청소', '판교관공서청소', '안산시관공서청소', '반월공단관공서청소'
  ]
};

export const BASE_KEYWORDS = [
  '느티울', '느티울종합청소', '느티울청소', '조윤호대표', '수도권종합청소', '수도권청소업체',
  '특수청소', '준공청소', '사무실청소', '바닥청소', '바닥왁스코팅', '왁스코팅', '주방청소', '공장청소',
  '화재청소', '침수청소', '쓰레기집청소', '고독사청소', '유품정리', '인테리어청소', '입주청소', '상가청소',
  '지식산업센터청소', '빌딩관리청소', '계단청소', '외벽청소', '유리창청소', '후드청소', '관공서청소', '학교청소',
  '서울청소업체', '강남청소업체', '강남사무실청소', '여의도사무실청소', '성수동사무실청소', '가산디지털단지사무실청소', '구로디지털단지사무실청소',
  '마곡사무실청소', '마포사무실청소', '상암DMC사무실청소', '서초사무실청소', '송파사무실청소', '문정동사무실청소', '종로사무실청소', '을지로사무실청소',
  '인천청소업체', '송도청소업체', '송도사무실청소', '송도준공청소', '청라청소업체', '영종도청소업체', '부평청소업체', '남동공단청소', '검단청소업체', '주안청소업체',
  '군포청소업체', '산본청소', '안양청소업체', '평촌청소', '수원청소업체', '광교청소', '영통청소', '의왕청소', '성남청소업체', '판교사무실청소', '분당사무실청소',
  '부천청소업체', '안산청소업체', '반월공단청소', '시흥청소업체', '배곧청소', '시화공단청소', '광명청소업체', '과천청소업체', '화성청소업체', '동탄사무실청소',
  '용인청소업체', '일산사무실청소', '김포청소업체', '파주청소업체', '평택청소업체', '하남미사청소', '남양주청소업체'
];

const ORG_ID = 'https://www.neutiul.com/#organization';
const SITE_ORIGIN = 'https://www.neutiul.com';

// og:image (and Service schema "image") need an absolute URL — most social
// crawlers (KakaoTalk, Facebook, Twitter) don't resolve relative image paths
// against the page URL the way browsers do, so a bare "/images/..." path
// silently drops the link-preview thumbnail. servicesData.mjs stores each
// service's image as a site-relative path, so anything sourced from there
// needs this before it reaches og:image.
const toAbsoluteUrl = (path) => (path && path.startsWith('/') ? `${SITE_ORIGIN}${path}` : path);

// Region-landing-page data/logic (see lib/regionData.mjs, lib/regionServiceContent.mjs).
// Both are dependency-free plain JS, safe to import into any consumer of this file.
import { getRegion } from './regionData.mjs';
import { buildRegionServiceContent, REGION_LANDING_SERVICES } from './regionServiceContent.mjs';
import { getRegionCase, getRegionCases } from './regionCaseData.mjs';
import { getServiceFaqData } from './faqData.mjs';

const AREA_SERVED = [
  { '@type': 'City', name: '서울특별시' },
  { '@type': 'AdministrativeArea', name: '강남구' },
  { '@type': 'AdministrativeArea', name: '서초구' },
  { '@type': 'AdministrativeArea', name: '송파구' },
  { '@type': 'AdministrativeArea', name: '강동구' },
  { '@type': 'AdministrativeArea', name: '영등포구 (여의도)' },
  { '@type': 'AdministrativeArea', name: '마포구 (상암DMC/홍대)' },
  { '@type': 'AdministrativeArea', name: '구로구 (구로디지털단지)' },
  { '@type': 'AdministrativeArea', name: '금천구 (가산디지털단지)' },
  { '@type': 'AdministrativeArea', name: '성동구 (성수동)' },
  { '@type': 'AdministrativeArea', name: '용산구 (한남동/이태원)' },
  { '@type': 'AdministrativeArea', name: '중구 (을지로/명동)' },
  { '@type': 'AdministrativeArea', name: '종로구 (광화문)' },
  { '@type': 'AdministrativeArea', name: '강서구 (마곡지구)' },
  { '@type': 'AdministrativeArea', name: '양천구 (목동)' },
  { '@type': 'AdministrativeArea', name: '강북구' },
  { '@type': 'AdministrativeArea', name: '관악구' },
  { '@type': 'AdministrativeArea', name: '광진구' },
  { '@type': 'AdministrativeArea', name: '노원구' },
  { '@type': 'AdministrativeArea', name: '도봉구' },
  { '@type': 'AdministrativeArea', name: '동대문구' },
  { '@type': 'AdministrativeArea', name: '동작구' },
  { '@type': 'AdministrativeArea', name: '서대문구' },
  { '@type': 'AdministrativeArea', name: '성북구' },
  { '@type': 'AdministrativeArea', name: '은평구' },
  { '@type': 'AdministrativeArea', name: '중랑구' },
  { '@type': 'City', name: '인천광역시' },
  { '@type': 'AdministrativeArea', name: '연수구 (송도국제도시)' },
  { '@type': 'AdministrativeArea', name: '서구 (청라국제도시·검단신도시)' },
  { '@type': 'AdministrativeArea', name: '중구 (영종국제도시/영종도)' },
  { '@type': 'AdministrativeArea', name: '부평구 (부평)' },
  { '@type': 'AdministrativeArea', name: '남동구 (남동공단·구월동·논현동)' },
  { '@type': 'AdministrativeArea', name: '미추홀구 (주안)' },
  { '@type': 'AdministrativeArea', name: '계양구' },
  { '@type': 'AdministrativeArea', name: '동구' },
  { '@type': 'AdministrativeArea', name: '강화군' },
  { '@type': 'State', name: '경기도' },
  { '@type': 'City', name: '군포시' },
  { '@type': 'City', name: '안양시' },
  { '@type': 'City', name: '수원시 (광교·영통)' },
  { '@type': 'City', name: '의왕시' },
  { '@type': 'City', name: '성남시 (분당·판교)' },
  { '@type': 'City', name: '부천시' },
  { '@type': 'City', name: '안산시' },
  { '@type': 'City', name: '시흥시 (배곧)' },
  { '@type': 'City', name: '광명시' },
  { '@type': 'City', name: '과천시' },
  { '@type': 'City', name: '화성시 (동탄)' },
  { '@type': 'City', name: '용인시 (수지·기흥)' },
  { '@type': 'City', name: '고양시 (일산)' },
  { '@type': 'City', name: '김포시' },
  { '@type': 'City', name: '파주시' },
  { '@type': 'City', name: '평택시 (고덕)' },
  { '@type': 'City', name: '하남시 (미사)' },
  { '@type': 'City', name: '남양주시 (다산·별내)' },
];

/**
 * Pure function: given the current route + site data, returns everything
 * needed to render <title>, meta tags, and JSON-LD — with no DOM access.
 *
 * @param {{
 *   pathname: string,
 *   serviceId?: string,
 *   regionId?: string,
 *   companyInfo?: { logo?: string, phone?: string, email?: string, address?: string, blog?: string, blog2?: string },
 *   services?: Array<{ id: string, title: string, description: string, image?: string }>,
 *   currentUrl?: string,
 * }} args
 */
export function buildMeta({ pathname, serviceId, regionId, companyInfo = {}, services = [], currentUrl }) {
  pathname = pathname.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  currentUrl = `${SITE_ORIGIN}${pathname}`;
  const isServiceDetail = pathname.startsWith('/services/');
  const pathParts = pathname.split('/services/')[1]?.split('/').filter(Boolean) || [];
  const resolvedServiceId = serviceId || pathParts[0];
  const resolvedRegionId = regionId || pathParts[1];
  const region = resolvedRegionId ? getRegion(resolvedRegionId) : null;
  const knownService = services.some((s) => s.id === resolvedServiceId);
  const isRegionDetail = isServiceDetail && knownService && pathParts.length === 2 && !!region && REGION_LANDING_SERVICES.includes(resolvedServiceId);
  const resolvedCaseSlug = pathParts[2];
  const regionCase = isServiceDetail && knownService && pathParts.length === 3 && region && REGION_LANDING_SERVICES.includes(resolvedServiceId)
    ? getRegionCase(resolvedServiceId, resolvedRegionId, resolvedCaseSlug)
    : null;
  const isCaseDetail = !!regionCase;
  const knownPage = ['/', '/about', '/services', '/portfolio', '/contact', '/privacy'].includes(pathname)
    || (isServiceDetail && knownService && pathParts.length === 1) || isRegionDetail || isCaseDetail;

  let pageTitle = '서울·인천·경기 쓰레기집, 침수, 화재 특수청소 전문업체 | 느티울';
  let pageDescription = '서울·인천·경기 쓰레기집, 침수, 화재 특수청소 전문업체 느티울. 고독사청소와 바닥·인테리어·사무실청소의 작업 범위, 방문 일정과 비용을 현장 상태에 맞춰 상담합니다.';
  let pageKeywords = BASE_KEYWORDS.slice(0, 10).join(', ');
  let pageImage = toAbsoluteUrl(companyInfo.logo) || 'https://www.neutiul.com/images/professional-cleaning.webp';
  let currentService = null;
  let regionContent = null;
  let shouldNoindex = !knownPage;

  if (pathname === '/about') {
    pageTitle = '회사 소개 & 청소 철학 | 느티울종합청소 (서울·인천·경기 수도권)';
    pageDescription = '현장에서 직접 발로 뛰며 확인하는 조윤호 대표의 청소 철학. 비전문 하청 없는 100% 책임 시공, 신뢰와 정직으로 고객님의 공간에 쾌적함을 선물하는 느티울의 전문가 팀을 만나보세요.';
  } else if (pathname === '/services') {
    pageTitle = '전문 청소 서비스 안내 (서울/인천/수도권) | 느티울종합청소';
    pageDescription = '신축 준공청소, 인테리어 청소, 입주청소, 사무실/상가 청소, 바닥 왁스 코팅, 주방/공장 청소, 화재/침수/특수청소까지 서울·인천·경기 청소 서비스의 작업 범위와 견적 상담을 안내합니다.';
  } else if (isCaseDetail) {
    currentService = services.find((s) => s.id === resolvedServiceId) || null;
    pageTitle = regionCase.title;
    pageDescription = regionCase.description;
    const specificKeywords = SERVICE_KEYWORDS_MAP[resolvedServiceId] || [];
    pageKeywords = [...new Set([`${region.name}${currentService?.title || ''}`, ...specificKeywords.slice(0, 6), '느티울종합청소'])].join(', ');
    pageImage = toAbsoluteUrl(regionCase.thumbnail) || pageImage;
  } else if (isRegionDetail) {
    currentService = services.find((s) => s.id === resolvedServiceId) || null;
    const rc = buildRegionServiceContent(region, resolvedServiceId);
    regionContent = rc;
    pageTitle = `${region.name} ${rc.serviceLabel} 전문업체 | 느티울종합청소`;
    const firstLocalCase = getRegionCases(resolvedServiceId, region.id)[0];
    pageDescription = firstLocalCase
      ? `${region.name} ${rc.serviceLabel} 현장 기록. ${firstLocalCase.teaser} 작업 범위와 견적 상담 안내.`
      : `${region.name} ${rc.serviceLabel} 상담 안내. 공간 용도와 오염 상태, 출입 여건을 확인해 작업 범위와 방문 일정, 견적을 안내합니다.`;
    const regionKeywords = [`${region.name}${rc.serviceLabel}`, ...region.dongs.map((d) => `${d}${rc.serviceLabel}`)];
    const specificKeywords = SERVICE_KEYWORDS_MAP[resolvedServiceId] || [];
    pageKeywords = [...new Set([...regionKeywords.slice(0, 5), ...specificKeywords.slice(0, 5), '느티울종합청소'])].join(', ');
    if (firstLocalCase?.thumbnail) pageImage = toAbsoluteUrl(firstLocalCase.thumbnail);
    else if (currentService?.image) pageImage = toAbsoluteUrl(currentService.image);
  } else if (isServiceDetail && resolvedServiceId) {
    currentService = services.find((s) => s.id === resolvedServiceId) || null;
    if (currentService) {
      pageTitle = currentService.seoTitle
        || `${currentService.title} 전문 케어 (서울·인천·수도권) | 느티울종합청소`;
      pageDescription = currentService.seoDescription
        || `${currentService.title} - ${currentService.description.replace(/\n+/g, ' ').slice(0, 140)}... 조윤호 대표 직접 책임 시공, 서울·인천·수도권 전지역 현장 상태에 따른 범위·일정 및 견적 상담.`;
      if (currentService.image) pageImage = toAbsoluteUrl(currentService.image);
      const specificKeywords = SERVICE_KEYWORDS_MAP[resolvedServiceId] || [];
      if (specificKeywords.length > 0) pageKeywords = [...new Set([currentService.title, ...specificKeywords.slice(0, 8), '느티울종합청소'])].join(', ');
    } else {
      pageTitle = `${resolvedServiceId} 청소 서비스 | 느티울종합청소`;
    }
  } else if (pathname === '/portfolio') {
    pageTitle = '시공 갤러리 (Before & After) | 느티울종합청소';
    pageDescription = '실제 현장 전후 비교 사진으로 증명하는 완벽한 청소 품질! 서울, 인천, 경기 전역 바닥 왁스코팅, 준공청소, 화재/침수 복구, 쓰레기집 원상복구 등 생생한 시공 실적을 확인하세요.';
  } else if (pathname === '/contact') {
    pageTitle = '청소 견적 문의 및 방문 상담 | 느티울종합청소';
    pageDescription = `서울·인천·경기 청소 문의 및 견적 상담 안내. 전화 ${companyInfo.phone || '010-4880-7386'}으로 공간 용도와 오염 상태, 희망 일정을 알려주시면 작업 범위와 방문 가능 여부를 상담합니다.`;
  } else if (pathname === '/privacy') {
    pageTitle = '개인정보처리방침 | 느티울종합청소';
    pageDescription = '느티울종합청소 웹사이트가 수집하는 개인정보의 항목, 이용 목적, 보유 기간 및 정보주체의 권리를 안내하는 개인정보처리방침입니다.';
  } else if (pathname.startsWith('/admin')) {
    pageTitle = '관리자 시스템 | 느티울종합청소';
    pageDescription = '느티울종합청소 관리자 대시보드 시스템.';
    shouldNoindex = true;
  }

  if (!knownPage && !pathname.startsWith('/admin')) {
    pageTitle = '페이지를 찾을 수 없습니다 | 느티울종합청소';
    pageDescription = '주소를 확인하거나 서비스 안내에서 필요한 청소 서비스를 찾아주세요.';
    currentService = null;
  }

  const jsonLdGraph = [
    {
      '@type': ['LocalBusiness', 'ProfessionalService'],
      '@id': ORG_ID,
      name: '느티울종합청소',
      alternateName: ['느티울', '느티울 청소', 'Zelkova Cleaning', '느티울특수청소', '느티울종합관리'],
      url: 'https://www.neutiul.com',
      logo: toAbsoluteUrl(companyInfo.logo) || 'https://www.neutiul.com/images/logo.webp',
      image: 'https://www.neutiul.com/images/professional-cleaning.webp',
      description: '조윤호 대표가 직접 관리 및 책임 시공하는 서울·인천·경기 수도권 종합청소 전문 기업. 신축 준공청소, 사무실/상가 청소, 바닥 왁스코팅, 화재/침수/쓰레기집 특수청소의 작업 범위와 방문 일정을 현장 상태에 맞춰 상담합니다.',
      telephone: companyInfo.phone || '010-4880-7386',
      email: companyInfo.email || 'danger3662@naver.com',
      priceRange: '₩₩',
      currenciesAccepted: 'KRW',
      address: {
        '@type': 'PostalAddress',
        streetAddress: companyInfo.address || '도마교동 463 1층',
        addressLocality: '군포시',
        addressRegion: '경기도',
        addressCountry: 'KR',
      },
      hasMap: 'https://map.naver.com/p/search/%EB%8A%90%ED%8B%B0%EC%9A%B8%EC%A2%85%ED%95%A9%EC%B2%AD%EC%86%8C',
      areaServed: AREA_SERVED,
      founder: { '@type': 'Person', name: '조윤호', jobTitle: '대표 / 책임 시공 총괄', description: '현장에서 직접 발로 뛰며 확인하는 수도권 청소 전문가' },
      knowsAbout: [
        '신축 준공청소 (아파트, 상가, 지식산업센터, 오피스텔, 공장)',
        '인테리어 마감 청소 및 리모델링 입주청소',
        '사무실 정기청소, 대청소 및 빌딩 종합관리',
        '바닥 왁스코팅, 데코타일 박리 및 고광택 왁스코팅',
        '도끼다시/테라조/대리석 연마광택 및 에폭시 바닥 세척',
        '화재청소, 그을음 제거, 잔존 냄새 관련 상담 및 청소 견적',
        '침수청소, 현장 여건에 따른 배수·표면 세척 및 별도 건조 상담',
        '쓰레기집 청소, 저장강박증 원상복구, 고독사 특수청소, 유품정리',
        '주방청소, 닥트/후드 기름때 고온 스팀 세척',
        '공장 및 물류창고 대형 바닥/설비 청소',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: '느티울종합청소 전문 서비스 카탈로그',
        itemListElement: services.map((srv) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: srv.title,
            description: (srv.description || '').replace(/\n+/g, ' ').slice(0, 100) || srv.title,
          },
        })),
      },
      sameAs: [companyInfo.blog || 'https://blog.naver.com/kslee0143', companyInfo.blog2 || 'https://blog.naver.com/decline11731'].filter(Boolean),
    },
    { '@type': 'WebSite', '@id': 'https://www.neutiul.com/#website', url: 'https://www.neutiul.com', name: '느티울종합청소', publisher: { '@id': ORG_ID } },
    {
      '@type': pathname === '/about' ? 'AboutPage' : pathname === '/contact' ? 'ContactPage' : 'WebPage',
      '@id': `${currentUrl}#webpage`, url: currentUrl, name: pageTitle,
      description: pageDescription, inLanguage: 'ko-KR',
      isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
      about: { '@id': ORG_ID }, publisher: { '@id': ORG_ID },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: isCaseDetail
        ? [
            { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.neutiul.com/' },
            { '@type': 'ListItem', position: 2, name: currentService?.title || resolvedServiceId, item: `https://www.neutiul.com/services/${resolvedServiceId}` },
            { '@type': 'ListItem', position: 3, name: region.name, item: `https://www.neutiul.com/services/${resolvedServiceId}/${resolvedRegionId}` },
            { '@type': 'ListItem', position: 4, name: regionCase.heading, item: currentUrl },
          ]
        : isRegionDetail
        ? [
            { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.neutiul.com/' },
            { '@type': 'ListItem', position: 2, name: currentService?.title || regionContent.serviceLabel, item: `https://www.neutiul.com/services/${resolvedServiceId}` },
            { '@type': 'ListItem', position: 3, name: region.name, item: currentUrl },
          ]
        : pathname === '/' ? [{ '@type': 'ListItem', position: 1, name: '홈', item: currentUrl }] : [
            { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.neutiul.com/' },
            { '@type': 'ListItem', position: 2, name: pageTitle.split('|')[0].trim(), item: currentUrl },
          ],
    },
  ];

  // Only describe FAQ content rendered on this route. Regional pages have
  // their own questions; about/contact/portfolio do not contain this section.
  if (pathname === '/' || (knownPage && currentService && !isRegionDetail && !isCaseDetail)) {
    jsonLdGraph.push({
      '@type': 'FAQPage', '@id': `${currentUrl}#faq`,
      mainEntity: getServiceFaqData(pathname === '/' ? undefined : currentService.id).flatMap(cat => cat.qas).map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  }

  if (isCaseDetail) {
    jsonLdGraph.push({
      '@type': 'Service',
      '@id': `${currentUrl}#service`,
      url: currentUrl,
      name: regionCase.heading,
      description: regionCase.intro,
      provider: { '@id': ORG_ID },
      areaServed: { '@type': 'AdministrativeArea', name: region.name },
      image: pageImage,
    });
    jsonLdGraph.push({
      '@type': 'FAQPage',
      '@id': `${currentUrl}#faq`,
      mainEntity: regionCase.faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  } else if (isRegionDetail && regionContent) {
    jsonLdGraph.push({
      '@type': 'Service',
      '@id': `${currentUrl}#service`,
      url: currentUrl,
      name: `${region.name} ${regionContent.serviceLabel}`,
      description: regionContent.intro,
      provider: { '@id': ORG_ID },
      areaServed: { '@type': 'AdministrativeArea', name: region.name },
      image: pageImage,
    });
    jsonLdGraph.push({
      '@type': 'FAQPage',
      '@id': `${currentUrl}#faq`,
      mainEntity: regionContent.faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    });
  } else if (currentService) {
    jsonLdGraph.push({
      '@type': 'Service',
      '@id': `${currentUrl}#service`,
      url: currentUrl,
      name: currentService.title,
      description: (currentService.description || '').replace(/\n+/g, ' ') || currentService.title,
      provider: { '@id': ORG_ID },
      areaServed: [
        { '@type': 'City', name: '서울특별시' },
        { '@type': 'City', name: '인천광역시' },
        { '@type': 'State', name: '경기도' },
        { '@type': 'AdministrativeArea', name: '수도권 전지역 (서울·인천·경기)' },
      ],
      image: toAbsoluteUrl(currentService.image) || pageImage,
    });
  }

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: pageKeywords,
    image: pageImage,
    canonicalUrl: currentUrl,
    ogType: 'website',
    shouldNoindex,
    jsonLd: { '@context': 'https://schema.org', '@graph': knownPage ? jsonLdGraph : [] },
  };
}
