export default class ImportError extends Error {
    constructor(message) {
        super(`Error while importing. (Malformed JSON?): ${message}`);
    }
}
//# sourceMappingURL=ImportError.js.map