export default class CategoryNonexistsError extends Error {
  constructor() {
    super("Category does not exist.");
  }
}
