export default class ImportError extends Error {
  constructor(message: string) {
    super(`Error while importing. (Malformed JSON?): ${message}`);
  }
}
