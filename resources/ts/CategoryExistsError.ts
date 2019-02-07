export default class CategoryExistsError extends Error {
  constructor() {
    super("Category already exists.");
  }
}
