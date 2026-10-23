import { safePortfolioImage } from './recommendedPortfolio.mjs';

// Only editable display fields may override the versioned route/SEO catalog.
export function serviceEditPayload(input) {
  if (!input || typeof input.title !== 'string' || !input.title.trim() || input.title.length > 200
    || typeof input.description !== 'string' || input.description.length > 5000
    || !Array.isArray(input.details) || input.details.length > 30
    || input.details.some(detail => typeof detail !== 'string' || detail.length > 5000)
    || typeof input.image !== 'string' || (input.image !== '' && !safePortfolioImage(input.image))) {
    throw new Error('제목·설명·작업 항목(최대 30개)과 이미지 주소를 확인해 주세요.');
  }
  return { title: input.title.trim(), description: input.description, details: [...input.details], image: input.image };
}

export function mergeServiceOverrides(catalog, records) {
  const byId = new Map((Array.isArray(records) ? records : []).filter(record => record && typeof record.id === 'string').map(record => [record.id, record]));
  return catalog.map(service => {
    const record = byId.get(service.id);
    if (!record) return service;
    try {
      const fields = serviceEditPayload({ ...service, ...record });
      return { ...service, ...fields };
    } catch {
      return service;
    }
  });
}
