import iEntryData from "./iEntryData";

interface iCategory {
  "id": number;
  "name": object; // object for l10n
  "description": object; // object for l10n
  "entries": iEntryData[];
}

export default iCategory;
