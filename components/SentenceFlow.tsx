import React from 'react';
import { readingSentences, readingUnits } from '../lib/readingText.mjs';

// Inline on desktop; CSS gives sentences breathing room on small screens.
// Text nodes, including their spaces, are never trimmed or rewritten.
const SentenceFlow: React.FC<{ text: string }> = ({ text }) => <>
  {readingSentences(text).map((sentence, index) => (
    <span className="reading-sentence" key={index}>
      {readingUnits(sentence).map((part, partIndex) => part.keepTogether
        ? <span className="reading-unit" key={partIndex}>{part.text}</span>
        : part.text)}
    </span>
  ))}
</>;

export default SentenceFlow;
