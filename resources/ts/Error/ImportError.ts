export default class ImportError extends Error {
  constructor(message: string) {
    super(`Import Error: ${message}`);
  }
}
