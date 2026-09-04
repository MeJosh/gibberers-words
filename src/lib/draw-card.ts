import type { Card, GameData, Generation } from './game-data';

export function drawCard(
  data: GameData,
  generation: Generation,
  previousCardNumber?: number,
  random: () => number = Math.random,
): Card {
  const cards = data[generation.toString() as keyof GameData];
  const eligibleCards =
    cards.length > 1 && previousCardNumber !== undefined
      ? cards.filter((card) => card.card_number !== previousCardNumber)
      : cards;
  const index = Math.floor(random() * eligibleCards.length);

  return eligibleCards[Math.min(index, eligibleCards.length - 1)]!;
}
