export default class EntryNonexistsError extends Error {
  constructor() {
    super("Entry does not exist.");
  }
}
