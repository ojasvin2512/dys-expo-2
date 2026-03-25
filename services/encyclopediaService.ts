import { HUMAN_BODY_ENCYCLOPEDIA } from '../data/encyclopedia/human_body';
import { SCIENCE_ENCYCLOPEDIA } from '../data/encyclopedia/science';
import { LITERACY_NUMERACY_ENCYCLOPEDIA } from '../data/encyclopedia/literacy_numeracy';
import { PREPARATORY_ENCYCLOPEDIA } from '../data/encyclopedia/preparatory';
import { MIDDLE_STAGE_ENCYCLOPEDIA } from '../data/encyclopedia/middle_stage';

export interface EncyclopediaEntry {
  title: string;
  explanation: string;
  funFact?: string;
  imagePath?: string;
  gradeLevel?: number;
}

const ALL_ENCYCLOPEDIA: Record<string, EncyclopediaEntry> = {
  ...HUMAN_BODY_ENCYCLOPEDIA,
  ...SCIENCE_ENCYCLOPEDIA,
  ...LITERACY_NUMERACY_ENCYCLOPEDIA,
  ...PREPARATORY_ENCYCLOPEDIA,
  ...MIDDLE_STAGE_ENCYCLOPEDIA,
};

/**
 * Searches the local encyclopedia for a matching entry based on the user's prompt.
 */
export function findEncyclopediaEntry(prompt: string): EncyclopediaEntry | null {
  const lowerPrompt = prompt.toLowerCase();
  
  // 1. Direct match with keys
  for (const key in ALL_ENCYCLOPEDIA) {
    if (lowerPrompt.includes(key)) {
      return ALL_ENCYCLOPEDIA[key];
    }
  }

  // 2. Fuzzy/Keyword match (optional, but keep it simple for now)
  return null;
}
