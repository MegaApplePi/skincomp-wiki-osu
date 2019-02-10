export default class ExportError extends Error {
  constructor(message: string) {
    // just in case -- this should never occur
    super(`Error while exporting. (Malformed data?): ${message}`);
  }
}
