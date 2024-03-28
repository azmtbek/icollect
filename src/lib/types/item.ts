import { z } from "zod";

export const itemSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  tags: z.array(z.string().nullish()).nullish(),
  customString1: z.string().max(256, { message: 'String is supported only 256 characters, use text instead.' }).nullish(),
  customString2: z.string().max(256, { message: 'String is supported only 256 characters, use text instead.' }).nullish(),
  customString3: z.string().max(256, { message: 'String is supported only 256 characters, use text instead.' }).nullish(),
  customInteger1: z.coerce.number().nullish(),
  customInteger2: z.coerce.number().nullish(),
  customInteger3: z.coerce.number().nullish(),
  customText1: z.string().nullish(),
  customText2: z.string().nullish(),
  customText3: z.string().nullish(),
  customDate1: z.date().nullish(),
  customDate2: z.date().nullish(),
  customDate3: z.date().nullish(),
  customBoolean1: z.boolean().nullish(),
  customBoolean2: z.boolean().nullish(),
  customBoolean3: z.boolean().nullish(),
});

export const createItemSchema = itemSchema
  .omit({ id: true })
  .extend({
    newTags: z.array(z.string().nullish()).nullish()
  });

export type Item = z.infer<typeof itemSchema>;
export type CreateItem = z.infer<typeof createItemSchema>;
export type ItemCustomFields = Omit<Item, "id" | "name" | "tags">;