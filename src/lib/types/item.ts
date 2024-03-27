import { z } from "zod";

// const customFieldSchema = z.object({
//   state: name: 
// }).optional();

export const itemSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  tags: z.array(z.string().nullish()).nullish(),
  // newTags: z.array(z.string().trim().max(100, { message: "Currently, we only support max 100 character length tags" })),

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

export type Item = z.infer<typeof itemSchema>;

export const collectionSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  topicId: z.coerce.number({ required_error: "Please select a topic." }),
  description: z.string().nullish(),
  customString1State: z.boolean(),
  customString1Name: z.string().nullish(),
  customString2State: z.boolean(),
  customString2Name: z.string().nullish(),
  customString3State: z.boolean(),
  customString3Name: z.string().nullish(),

  customInteger1State: z.boolean(),
  customInteger1Name: z.string().nullish(),
  customInteger2State: z.boolean(),
  customInteger2Name: z.string().nullish(),
  customInteger3State: z.boolean(),
  customInteger3Name: z.string().nullish(),

  customText1State: z.boolean(),
  customText1Name: z.string().nullish(),
  customText2State: z.boolean(),
  customText2Name: z.string().nullish(),
  customText3State: z.boolean(),
  customText3Name: z.string().nullish(),

  customDate1State: z.boolean(),
  customDate1Name: z.string().nullish(),
  customDate2State: z.boolean(),
  customDate2Name: z.string().nullish(),
  customDate3State: z.boolean(),
  customDate3Name: z.string().nullish(),

  customBoolean1State: z.boolean(),
  customBoolean1Name: z.string().nullish(),
  customBoolean2State: z.boolean(),
  customBoolean2Name: z.string().nullish(),
  customBoolean3State: z.boolean(),
  customBoolean3Name: z.string().nullish(),
});

export type Collection = z.infer<typeof collectionSchema>;