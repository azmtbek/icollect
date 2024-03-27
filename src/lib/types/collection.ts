import { z } from "zod";

// const customFieldSchema = z.object({
//   state: name: 
// }).optional();

export const collectionSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  topicId: z.coerce.number({ required_error: "Please select a topic." }),
  description: z.string().optional().nullable(),
  customString1State: z.boolean(),
  customString1Name: z.string().optional().nullable(),
  customString2State: z.boolean(),
  customString2Name: z.string().optional().nullable(),
  customString3State: z.boolean(),
  customString3Name: z.string().optional().nullable(),

  customInteger1State: z.boolean(),
  customInteger1Name: z.string().optional().nullable(),
  customInteger2State: z.boolean(),
  customInteger2Name: z.string().optional().nullable(),
  customInteger3State: z.boolean(),
  customInteger3Name: z.string().optional().nullable(),

  customText1State: z.boolean(),
  customText1Name: z.string().optional().nullable(),
  customText2State: z.boolean(),
  customText2Name: z.string().optional().nullable(),
  customText3State: z.boolean(),
  customText3Name: z.string().optional().nullable(),

  customDate1State: z.boolean(),
  customDate1Name: z.string().optional().nullable(),
  customDate2State: z.boolean(),
  customDate2Name: z.string().optional().nullable(),
  customDate3State: z.boolean(),
  customDate3Name: z.string().optional().nullable(),

  customBoolean1State: z.boolean(),
  customBoolean1Name: z.string().optional().nullable(),
  customBoolean2State: z.boolean(),
  customBoolean2Name: z.string().optional().nullable(),
  customBoolean3State: z.boolean(),
  customBoolean3Name: z.string().optional().nullable(),
});

export type Collection = z.infer<typeof collectionSchema>;