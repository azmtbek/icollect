import { z } from "zod";


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

export type CreateCollection = Omit<Collection, "id">;
export type CollectionCustomFields = Omit<Collection, "id" | "name" | "topicId" | "description">;
export type CollectionCustomFieldKeys = keyof CollectionCustomFields;