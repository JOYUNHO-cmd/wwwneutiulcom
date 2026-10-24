import React from 'react';
import SentenceFlow from './SentenceFlow';
import { getRegionHeroReading } from '../lib/regionHeroReading.mjs';

interface RegionHeroIntroProps {
  text: string;
  region: { id: string; name: string; story: string; dongs: string[] };
  serviceId: string;
}

const RegionHeroIntro: React.FC<RegionHeroIntroProps> = ({ text, region, serviceId }) => {
  const { contextParts, guidance } = getRegionHeroReading(text, region, serviceId);
  return (
    <p className="reading-copy reading-lead reading-hero mt-6 text-left">
      <span className="reading-hero-context">
        {contextParts.map((part: string, index: number) => (
          <span className="reading-hero-part" key={index}><SentenceFlow text={part} /></span>
        ))}
      </span>
      {guidance && <span className="reading-hero-guidance"><SentenceFlow text={guidance} /></span>}
    </p>
  );
};

export default RegionHeroIntro;
