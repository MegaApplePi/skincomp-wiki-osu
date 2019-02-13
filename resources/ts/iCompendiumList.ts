import iCategory from "./iCategory.js";

interface CompendiumList {
  "categories": iCategory[];
  "nextCategoryId": number;
  "nextEntryId": number;
  "_version": number;
}

export default CompendiumList;
