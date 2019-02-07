export default class ExportError extends Error {
    constructor(message) {
        super(`Error while exporting. (Malformed data?): ${message}`);
    }
}
//# sourceMappingURL=ExportError.js.map