import { z } from "zod";


export const collectionSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  topicId: z.coerce.number({ required_error: "Please select a topic." }),
  description: z.string().nullish(),
  customString1State: z.boolean().default(false),
  customString1Name: z.string().nullish(),
  customString2State: z.boolean().default(false),
  customString2Name: z.string().nullish(),
  customString3State: z.boolean().default(false),
  customString3Name: z.string().nullish(),

  customInteger1State: z.boolean().default(false),
  customInteger1Name: z.string().nullish(),
  customInteger2State: z.boolean().default(false),
  customInteger2Name: z.string().nullish(),
  customInteger3State: z.boolean().default(false),
  customInteger3Name: z.string().nullish(),

  customText1State: z.boolean().default(false),
  customText1Name: z.string().nullish(),
  customText2State: z.boolean().default(false),
  customText2Name: z.string().nullish(),
  customText3State: z.boolean().default(false),
  customText3Name: z.string().nullish(),

  customDate1State: z.boolean().default(false),
  customDate1Name: z.string().nullish(),
  customDate2State: z.boolean().default(false),
  customDate2Name: z.string().nullish(),
  customDate3State: z.boolean().default(false),
  customDate3Name: z.string().nullish(),

  customBoolean1State: z.boolean().default(false),
  customBoolean1Name: z.string().nullish(),
  customBoolean2State: z.boolean().default(false),
  customBoolean2Name: z.string().nullish(),
  customBoolean3State: z.boolean().default(false),
  customBoolean3Name: z.string().nullish(),
});

export type Collection = z.infer<typeof collectionSchema>;

export type CreateCollection = Omit<Collection, "id">;
export type CollectionCustomFields = Omit<Collection, "id" | "name" | "topicId" | "description">;
export type CollectionCustomFieldKeys = keyof CollectionCustomFields;