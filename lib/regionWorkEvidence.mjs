import { getRegionCases } from './regionCaseData.mjs';

/**
 * Read only the records explicitly assigned to this service and region.
 * Navigation parents, nearby areas and photo-title matches are not evidence
 * that a particular job took place here or involved this service.
 * Keep the source wording, including uncertainty and remaining damage.
 */
export function getRegionWorkEvidence(serviceId, regionId) {
  if (!serviceId || !regionId) return [];
  const records = getRegionCases(serviceId, regionId);
  if (!Array.isArray(records)) return [];

  return records.map((record) => {
    // Some case limitations are in the final section rather than `note`.
    // Keep that section alongside the short facts instead of implying that
    // every recorded job ended with all damage or stains removed.
    const closingSection = record.sections?.at(-1);
    const thumbnailMedia = record.steps?.flatMap((step) => step.media || []).find(
      (media) => media.type === 'image' && media.src === record.thumbnail,
    );
    return {
      slug: record.slug,
      heading: record.heading,
      teaser: record.teaser,
      thumbnail: record.thumbnail,
      thumbnailWidth: thumbnailMedia?.width,
      thumbnailHeight: thumbnailMedia?.height,
      sourceUrl: `/services/${serviceId}/${regionId}/${record.slug}`,
      facts: record.facts,
      note: record.note || '',
      closingSection: closingSection
        ? { heading: closingSection.heading, body: closingSection.body }
        : null,
    };
  });
}
