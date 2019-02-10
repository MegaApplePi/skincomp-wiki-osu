export default class InvalidLocale extends Error {
  constructor() {
    super(`Locale does not exist (reverted to English).`);
  }
}
