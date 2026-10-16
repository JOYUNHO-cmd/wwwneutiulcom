import React from 'react';

interface SentenceTextProps {
  text: string;
  className?: string;
  as?: 'p' | 'span' | 'div';
}

// keep-all treats "부평동·산곡동·청천동" as one word, and the browser may still
// wrap right before a "·", starting a line with the dot. Each "word·" is kept
// together and followed by a <wbr>, so lines break after the dot instead.
// The text itself is unchanged.
function withDotBreaks(sentence: string): React.ReactNode {
  const parts = sentence.split('·');
  return parts.map((part, i) => {
    if (i === parts.length - 1) return <React.Fragment key={i}>{part}</React.Fragment>;
    const cut = part.search(/\S+$/);
    const head = cut > 0 ? part.slice(0, cut) : '';
    const word = cut >= 0 ? part.slice(cut) : part;
    return (
      <React.Fragment key={i}>
        {head}
        <span className="whitespace-nowrap">{word}·</span>
        <wbr />
      </React.Fragment>
    );
  });
}

export function splitSentences(text: string): string[] {
  return text.split(/(?<=[.?!])\s+/).filter(Boolean);
}

// Splits only at sentence ends (. ? ! followed by whitespace) — the words
// themselves are never changed. On mobile each sentence starts on its own
// line with a small gap; from `sm` up the sentences flow back into one
// paragraph (the separating space is kept as a text node, so copy/paste and
// the SSR text stay identical to the source string).
const SentenceText: React.FC<SentenceTextProps> = ({ text, className, as: Tag = 'p' }) => {
  const sentences = splitSentences(text);
  return (
    <Tag className={`break-keep ${className ?? ''}`}>
      {sentences.map((s, i) => (
        <React.Fragment key={i}>
          {i > 0 && ' '}
          <span className={i > 0 ? 'block mt-2 sm:mt-0 sm:inline' : 'block sm:inline'}>{withDotBreaks(s)}</span>
        </React.Fragment>
      ))}
    </Tag>
  );
};

export default SentenceText;
