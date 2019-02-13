import iCategory from "./iCategory.js";

interface CompendiumList {
  "categories": iCategory[];
  "nextCategoryId": number;
  "nextEntryId": number;
}

export default CompendiumList;
