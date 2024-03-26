import { z } from "zod";

const customFieldSchema = z.object({
  state: z.boolean().optional(), name: z.string().optional()
}).optional();

export const collectionSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  topicId: z.coerce.number({ required_error: "Please select a topic." }),
  description: z.string().optional().nullable(),
  customString1: customFieldSchema,
  customString2: customFieldSchema,
  customString3: customFieldSchema,
  customInteger1: customFieldSchema,
  customInteger2: customFieldSchema,
  customInteger3: customFieldSchema,
  customText1: customFieldSchema,
  customText2: customFieldSchema,
  customText3: customFieldSchema,
  customDate1: customFieldSchema,
  customDate2: customFieldSchema,
  customDate3: customFieldSchema,
  customBoolean1: customFieldSchema,
  customBoolean2: customFieldSchema,
  customBoolean3: customFieldSchema,
});

export type Collection = z.infer<typeof collectionSchema>;