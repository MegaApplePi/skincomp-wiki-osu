import iEntry from "./iEntry";
import iCategory from "./iCategory";

interface iSortedCategory {
  "category": iCategory;
  "entries": Map<string, iEntry>;
}

export default iSortedCategory;
