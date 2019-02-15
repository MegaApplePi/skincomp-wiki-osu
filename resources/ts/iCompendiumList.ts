import iCategory from "./iCategory.js";
import iEntry from "./iEntry.js";

interface iCompendiumList {
  "categories": iCategory[];
  "entries": iEntry[];
  "nextCategoryId": number;
  "nextEntryId": number;
  "_version": number;
}

export default iCompendiumList;
