import iCategory from "./iCategory.js";
import iEntryData from "./iEntryData.js";

interface iCompendiumList {
  "categories": iCategory[];
  "entries": iEntryData[];
  "nextCategoryId": number;
  "nextEntryId": number;
  "_version": number;
}

export default iCompendiumList;
