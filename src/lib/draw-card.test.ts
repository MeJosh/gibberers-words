import { describe, expect, it } from 'vitest';

import { drawCard } from './draw-card';
import { gameDataResult } from './game-data';

if (!gameDataResult.success) {
  throw gameDataResult.error;
}

const data = gameDataResult.data;

describe('drawCard', () => {
  it('draws from the requested generation', () => {
    expect(drawCard(data, 1, undefined, () => 0).card_number).toBe(1);
    expect(drawCard(data, 5, undefined, () => 0).card_number).toBe(70);
  });

  it('can reach the last card in a generation', () => {
    expect(drawCard(data, 1, undefined, () => 0.999_999).card_number).toBe(17);
  });

  it('does not immediately repeat a card when alternatives exist', () => {
    const previousCardNumber = 1;
    const nextCard = drawCard(data, 1, previousCardNumber, () => 0);

    expect(nextCard.card_number).not.toBe(previousCardNumber);
  });
});
