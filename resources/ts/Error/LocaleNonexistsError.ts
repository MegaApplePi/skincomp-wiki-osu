export default class LocaleNonexistsError extends Error {
  constructor() {
    super(`Locale does not exist.`);
  }
}
