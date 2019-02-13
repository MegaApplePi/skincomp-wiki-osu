import InvalidLocale from "./Error/InvalidLocale.js";
import strings from "./strings.js";

abstract class l10n {
  private static locale = "en";

  public static get currentLocale() {
    return this.locale;
  }

  public static setLocale(locale: string): void {
    if (Object.keys(strings).includes(locale)) {
      this.locale = locale;
    } else {
      this.locale = "en";
      throw new InvalidLocale();
    }
  }

  public static getString(string: string): string {
    if (strings[this.locale][string]) {
      return strings[this.locale][string];
    }
    return strings["en"][string];
  }

  public static hasLocale(locale: string): boolean {
    if (locale in strings) {
      return true;
    }
    return false;
  }
}

export default l10n;
