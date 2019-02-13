import iEntryData from "./iEntryData";
import iCategory from "./iCategory";

interface iSortedCategory {
  "category": iCategory;
  "entries": Map<string, iEntryData>;
}

export default iSortedCategory;
