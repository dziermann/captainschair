import { defineCollection, z } from 'astro:content';

const cardsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    source: z.string(),
    set: z.string(),
    count: z.number(),
    cards: z.array(z.object({
      id: z.string(),
      name: z.string(),
      category: z.string(),
      traits: z.array(z.string()),
      translations: z.record(z.object({
        name: z.string(),
      }))
    }))
  })
});

export const collections = {
  'cards': cardsCollection,
};
