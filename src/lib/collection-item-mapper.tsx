import { Collection } from "./types/collection";
import { ItemCustomFields } from "./types/item";

export const collectionToItem = (collection: Collection | undefined) => {
  return collection ?
    Object.keys(collection)
      .filter((c) =>
        c.startsWith('custom') &&
        c.endsWith('State') &&
        collection[c as keyof typeof collection])
      .map((c) => c.replace('State', ''))
    : [];
};