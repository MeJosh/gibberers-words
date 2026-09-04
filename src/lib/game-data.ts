import { z } from 'zod';

import rawGameData from '../../data/words.json';

export const generationSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const rewardCodeSchema = z.enum(['Y', 'B', 'R', 'G', 'P']);

const wordChoiceSchema = z.strictObject({
  word: z.string().trim().min(1),
  categories: z.array(rewardCodeSchema).min(1).max(3),
});

const cardSchema = z.strictObject({
  card_number: z.number().int().positive(),
  words: z.array(wordChoiceSchema).length(5),
});

export const gameDataSchema = z
  .strictObject({
    '1': z.array(cardSchema).min(1),
    '2': z.array(cardSchema).min(1),
    '3': z.array(cardSchema).min(1),
    '4': z.array(cardSchema).min(1),
    '5': z.array(cardSchema).min(1),
  })
  .superRefine((data, context) => {
    const cardNumbers = Object.values(data).flatMap((cards) =>
      cards.map((card) => card.card_number),
    );
    const duplicates = cardNumbers.filter((number, index) => cardNumbers.indexOf(number) !== index);

    if (duplicates.length > 0) {
      context.addIssue({
        code: 'custom',
        message: `Card numbers must be unique. Repeated: ${[...new Set(duplicates)].join(', ')}`,
      });
    }
  });

export type Generation = z.infer<typeof generationSchema>;
export type RewardCode = z.infer<typeof rewardCodeSchema>;
export type GameData = z.infer<typeof gameDataSchema>;
export type Card = GameData[keyof GameData][number];
export type WordChoice = Card['words'][number];

export const gameDataResult = gameDataSchema.safeParse(rawGameData);

export const rewardDetails: Record<
  RewardCode,
  { name: string; shortName: string; className: string; order: number }
> = {
  Y: { name: 'Daily reward', shortName: 'Daily', className: 'reward--daily', order: 0 },
  B: { name: 'Concept reward', shortName: 'Concept', className: 'reward--concept', order: 1 },
  G: {
    name: 'Scientific reward',
    shortName: 'Scientific',
    className: 'reward--scientific',
    order: 2,
  },
  R: { name: 'Military reward', shortName: 'Military', className: 'reward--military', order: 3 },
  P: { name: 'Wonder reward', shortName: 'Wonder', className: 'reward--wonder', order: 4 },
};

export const rewardCodes = rewardCodeSchema.options;
