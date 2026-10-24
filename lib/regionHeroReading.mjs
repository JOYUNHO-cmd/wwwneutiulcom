import { REGION_HERO_CONTEXT } from './regionHeroContext.mjs';
import { getRegionHeroContextParts } from './regionHeroServiceContext.mjs';

// Reviewed clause endings in region.story, not arbitrary commas or word counts.
// In particular, Seongnam's "분당, 최근 개발된 위례신도시" is one list and
// must remain together. These boundaries apply only to the regional story,
// never to quantities, service guidance or the residential context.
const STORY_CLAUSE_ENDINGS = new Set([
  '자리잡아', '계획도시로', '곳으로', '지역이라', '리모델링되며',
  '신도시로', '국가산업단지로', '위성도시로', '첨단산업도시로',
  '거점으로', "실리콘밸리'로", '산업도시로', '개발되며', '지역으로',
  '더해지며', '들어서며', '공존해', '있어', '원도심으로', '공업지구로',
  '남구로', '중심지로', '밀집지역으로', '주거지로', '하나로', '구역으로',
  '택지지구로',
]);

// This long sentence has a second reviewed connection before its comma.
const EXTRA_STORY_BOUNDARIES = { suwon: ['역사도시이자 '] };

function storyBoundaries(story, regionId) {
  const offsets = new Set();
  for (const match of story.matchAll(/(\S+),[ \t]+/g)) {
    if (STORY_CLAUSE_ENDINGS.has(match[1])) offsets.add(match.index + match[0].length);
  }
  for (const phrase of EXTRA_STORY_BOUNDARIES[regionId] || []) {
    const index = story.indexOf(phrase);
    if (index !== -1 && story.indexOf(phrase, index + phrase.length) === -1) {
      offsets.add(index + phrase.length);
    }
  }
  return [...offsets].sort((a, b) => a - b);
}

/** Return original substrings only; joining the output reproduces text exactly. */
export function getRegionHeroReading(text, region, serviceId) {
  const unchanged = { contextParts: text ? [text] : [], guidance: '' };
  if (typeof text !== 'string' || !region || !serviceId) return unchanged;

  const separator = ' — ';
  const separatorIndex = text.indexOf(separator);
  if (separatorIndex === -1) return unchanged;
  const prefixEnd = separatorIndex + separator.length;
  const reviewedParts = getRegionHeroContextParts(region, serviceId);
  if (reviewedParts && text.startsWith(reviewedParts.join(''), prefixEnd)) {
    let offset = 0;
    const contextParts = reviewedParts.map((part, index) => {
      const end = offset + part.length + (index === 0 ? prefixEnd : 0);
      const original = text.slice(offset, end);
      offset = end;
      return original;
    });
    return { contextParts, guidance: text.slice(offset) };
  }

  // Preserve the previous exact-text rendering for unreviewed regions and
  // cached old copy; an unrelated override still returns the complete text.
  const residential = serviceId === 'trash-house' || serviceId === 'lonely-death';
  const originalContext = residential ? REGION_HERO_CONTEXT[region.id] : region.story;
  if (typeof originalContext !== 'string' || !originalContext) return unchanged;

  // General heroes have one joining space after the story; residential
  // context already contains its original trailing space. Never trim either.
  const context = residential ? originalContext : `${originalContext} `;
  if (!text.startsWith(context, prefixEnd)) return unchanged;
  const contextEnd = prefixEnd + context.length;
  const boundaries = residential ? [] : storyBoundaries(originalContext, region.id);
  const contextParts = [];
  let offset = 0;
  for (const boundary of boundaries) {
    const end = prefixEnd + boundary;
    if (end > offset && end < contextEnd) {
      contextParts.push(text.slice(offset, end));
      offset = end;
    }
  }
  contextParts.push(text.slice(offset, contextEnd));
  return { contextParts, guidance: text.slice(contextEnd) };
}
