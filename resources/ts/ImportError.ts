export default class ImportError extends Error {
  constructor(message) {
    super(`Error while importing. (Invalid JSON?) ${message}`);
  }
}
