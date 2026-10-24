const sentenceSegmenter = new Intl.Segmenter('ko', { granularity: 'sentence' });

// Segments retain their original punctuation and whitespace. Joining them must
// reproduce the input exactly; layout must never become a copy-editing step.
export function readingSentences(text) {
  return Array.from(sentenceSegmenter.segment(text), part => part.segment);
}

export function readingUnits(text) {
  const unit = /\d+(?:[.,]\d+)*(?:\s*[~–-]\s*\d+(?:[.,]\d+)*)?\s*(?:㎡|m²|평|명|시간|분|개월|년|일|주|개|곳|층|회|원|%)/gu;
  const parts = [];
  let offset = 0;
  for (const match of text.matchAll(unit)) {
    if (match.index > offset) parts.push({ text: text.slice(offset, match.index), keepTogether: false });
    parts.push({ text: match[0], keepTogether: true });
    offset = match.index + match[0].length;
  }
  if (offset < text.length) parts.push({ text: text.slice(offset), keepTogether: false });
  return parts;
}
