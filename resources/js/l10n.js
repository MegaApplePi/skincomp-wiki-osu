import InvalidLocale from "./Error/InvalidLocale.js";
import strings from "./strings.js";
class l10n {
    static getLocale() {
        return this.locale;
    }
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
        return strings["en"][string];
    }
    static localeExists(locale) {
        if (locale in strings) {
            return true;
        }
        return false;
    }
}
l10n.locale = "en";
export default l10n;
//# sourceMappingURL=l10n.js.map