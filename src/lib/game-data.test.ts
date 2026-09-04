import { describe, expect, it } from 'vitest';

import rawGameData from '../../data/words.json';
import { gameDataResult, gameDataSchema } from './game-data';

describe('game data', () => {
  it('validates the bundled deck', () => {
    expect(gameDataResult.success).toBe(true);
  });

  it('contains 76 complete cards and 380 word choices', () => {
    if (!gameDataResult.success) {
      throw gameDataResult.error;
    }

    const cards = Object.values(gameDataResult.data).flat();
    expect(cards).toHaveLength(76);
    expect(cards.flatMap((card) => card.words)).toHaveLength(380);
    expect(cards.every((card) => card.words.length === 5)).toBe(true);
  });

  it('rejects unrecognized reward codes', () => {
    const invalidData = structuredClone(rawGameData);
    invalidData['1'][0]!.words[0]!.categories = ['X'];

    expect(gameDataSchema.safeParse(invalidData).success).toBe(false);
  });

  it('rejects duplicate card numbers', () => {
    const invalidData = structuredClone(rawGameData);
    invalidData['2'][0]!.card_number = invalidData['1'][0]!.card_number;

    expect(gameDataSchema.safeParse(invalidData).success).toBe(false);
  });

  it('rejects cards that do not contain exactly five choices', () => {
    const invalidData = structuredClone(rawGameData);
    invalidData['1'][0]!.words.pop();

    expect(gameDataSchema.safeParse(invalidData).success).toBe(false);
  });
});
