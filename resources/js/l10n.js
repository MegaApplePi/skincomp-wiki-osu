import InvalidLocale from "./Error/InvalidLocale.js";
import strings from "./strings.js";
class l10n {
    static setLocale(locale) {
        if (Object.keys(strings).includes(locale)) {
            this.locale = locale;
        }
        else {
            this.locale = "en";
            throw new InvalidLocale();
        }
    }
    static getString(string) {
        if (strings[this.locale][string]) {
            return strings[this.locale][string];
        }
        else {
            return strings["en"][string];
        }
    }
}
l10n.locale = "en";
export default l10n;
//# sourceMappingURL=l10n.js.map