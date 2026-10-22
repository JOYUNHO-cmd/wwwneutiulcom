// Public rendering only accepts the fields used by the recommendation cards.
// Firestore rules remain the authority for writes; these checks also protect
// visitors from malformed records left by older admin tools.
const SERVICE_CATEGORIES = {
  'new-construction': '준공청소',
  interior: '인테리어청소',
  'move-in': '입주청소',
  office: '사무실청소',
  floor: '바닥청소',
  'floor-wax': '바닥코팅',
  restaurant: '주방청소',
  hood: '후드청소',
  factory: '공장청소',
  flood: '침수청소',
  fire: '화재청소',
  special: '특수청소',
  'trash-house': '쓰레기집청소',
  'lonely-death': '고독사청소',
  'external-wall': '외벽청소',
  'government-school': '관공서청소',
};

function boundedText(value, maxLength) {
  return typeof value === 'string' && value.length <= maxLength ? value.trim() : '';
}

export function safePortfolioLink(value) {
  if (typeof value !== 'string' || value.length > 2000 || /[\s\u0000-\u001f\u007f\\]/.test(value)) return '';
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
}

export function safePortfolioImage(value) {
  if (typeof value !== 'string') return '';
  if (value.length <= 350000 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value)) return value;
  if (value.length <= 2000 && /^\/images\/[^\s\\?#]+$/.test(value)) {
    // Reject dot-segment paths, including encoded ones, before URL normalization.
    try {
      const decoded = decodeURIComponent(value);
      if (!decoded.split('/').some(part => part === '.' || part === '..') && !decoded.includes('\\')) return value;
    } catch { /* Invalid percent encoding is not an asset path. */ }
  }
  return safePortfolioLink(value);
}

/** Return safe recommendation cards, preserving the database's newest-first order. */
export function selectRecommendedPortfolio(items, serviceId) {
  if (!Array.isArray(items)) return [];
  const category = serviceId ? SERVICE_CATEGORIES[serviceId] : undefined;
  if (serviceId && !category) return [];
  return items.flatMap(item => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const id = boundedText(item.id, 128);
    const title = boundedText(item.title, 200);
    const itemCategory = boundedText(item.category, 50);
    const afterImage = safePortfolioLink(item.afterImage);
    if (!/^[a-zA-Z0-9_-]+$/.test(id) || !title || !itemCategory || !afterImage) return [];
    if (category && itemCategory !== category) return [];
    return [{
      id,
      title,
      category: itemCategory,
      beforeImage: safePortfolioImage(item.beforeImage),
      afterImage,
      description: boundedText(item.description, 5000),
      date: boundedText(item.date, 50),
    }];
  });
}
