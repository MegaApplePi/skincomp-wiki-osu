import eModes from "./eModes";

interface iEntry {
  "id": number;
  // l10n not needed
  "name": string;
  "nameLink": string;
  "author": string;
  "authorLink": string;
  "modes": eModes;
  "categories": number[];
}

export default iEntry;
