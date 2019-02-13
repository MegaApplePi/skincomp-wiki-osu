import CategoryExistsError from "./Error/CategoryExistsError.js";
import CategoryNonexistsError from "./Error/CategoryNonexistsError.js";
import EntryNonexistsError from "./Error/EntryNonexistsError.js";
import ImportError from "./Error/ImportError.js";
import LocaleNonexistsError from "./Error/LocaleNonexistsError.js";
import l10n from "./l10n.js";
import eModes from "./eModes.js";
import iEntryData from "./iEntryData.js";
import CompendiumList from "./iCompendiumList.js";
import iCategory from "./iCategory.js";
import iSortedCategory from "./iSortedCategory.js";

interface CategoryIdNameList {
  "name": string;
  "id": number;
}

abstract class CompendiumMan {
  private static list: CompendiumList = {
    "nextEntryId": 0,
    "nextCategoryId": 0,
    "categories": []
  };

  public static get List(): CompendiumList {
    return Object.assign({}, this.list);
  }

  private static hasCategoryById(categoryId: number): boolean {
    if (this.CategoryIds.includes(categoryId)) {
      return true;
    }
    return false;
  }

  private static get CategoryNames(): string[] {
    let categories = [];
    for (let category of this.list.categories) {
      categories.push(category.name);
    }
    return categories;
  }

  public static get CategoryIdNameList(): CategoryIdNameList[] {
    let categories = [];
    for (let category of this.list.categories) {
      categories.push({
        "name": category.name,
        "id": category.id
      });
    }
    return categories;
  }

  private static get CategoryIds(): number[] {
    let categories = [];
    for (let category of this.list.categories) {
      categories.push(category.id);
    }
    return categories;
  }

  private static hasEntityById(entityId: number): boolean {
    if (this.EntityIds.includes(entityId)) {
      return true;
    }
    return false;
  }

  private static get EntityIds(): number[] {
    let entities = [];

    for (let category of this.list.categories) {
      for (let entry of category.entries) {
        entities.push(entry.id);
      }
    }
    return entities;
  }

  public static getEntryDataById(categoryId: number, entityId: number): iEntryData {
    if (this.hasCategoryById(categoryId)) {
      if (this.hasEntityById(entityId)) {
        let result = this.getCategoryById(categoryId).entries.find((item) => {
          return item.id === entityId;
        });
        return result;
      } else {
        throw new EntryNonexistsError();
      }
    } else {
      throw new CategoryNonexistsError();
    }
  }

  private static get NextCategoryId(): number {
    return this.list.nextCategoryId++;
  }

  private static get NextEntryId(): number {
    return this.list.nextEntryId++;
  }

  // import and export
  public static import(input: CompendiumList): void {
    try {
      this.list = input;
    } catch (ex) {
      throw new ImportError(ex);
    }
  }

  public static export(): string {
    return JSON.stringify(this.list);
  }

  // category methods
  private static sortCategories(): void {
    this.list.categories.sort((a: iCategory, b: iCategory) => {
      // we don't care about letter case
      return a.name[l10n.currentLocale].toLowerCase().localeCompare(b.name[l10n.currentLocale].toLowerCase());
    });
  }

  public static deleteCategory(name: string): void {
    if (this.list.categories[name]) {
      delete this.list.categories[name];
    } else {
      throw new CategoryNonexistsError();
    }
  }

  public static addCategory(name: string, description: string): void {
    // TODO sort the categories
    if (this.CategoryNames.includes(name)) {
      throw new CategoryExistsError();
    } else {
      this.list.categories.push({
        "id": this.NextCategoryId,
        "name": {
          "en": name
        },
        "description": {
          "en": description
        },
        "entries": []
      });

      this.sortCategories();
    }
  }

  public static renameCategory(categoryId: number, newName: string, locale: string): void {
    if (this.hasCategoryById(categoryId)) {
      if (this.list.categories[newName]) {
        throw new CategoryExistsError();
      } else {
        if (l10n.hasLocale(locale)) {
          this.getCategoryById(categoryId).name[locale] = newName;
          this.sortCategories();
        } else {
          throw new LocaleNonexistsError();
        }
      }
    } else {
      throw new CategoryNonexistsError();
    }
  }

  public static getCategoryById(categoryId: number): iCategory {
    let result = this.list.categories.find((item) => {
      return item.id === categoryId;
    });

    if (result) {
      return result;
    } else {
      throw new CategoryNonexistsError();
    }
  }

  public static updateDescription(categoryId: number, description: string, locale: string): void {
    if (this.hasCategoryById(categoryId)) {
      if (l10n.hasLocale(locale)) {
        this.getCategoryById(categoryId).description[locale] = description;
      } else {
        throw new LocaleNonexistsError();
      }
    } else {
      throw new CategoryNonexistsError();
    }
  }

  // entry methods
  public static organizeList(): iSortedCategory[] {
  let sortedList: iSortedCategory[] = [];

  const categories = this.list.categories;

  for (let category of categories) {
    let sortedCategory: iSortedCategory = {
      "category": category,
      "entries": new Map()
    };

    // grouping by first letter
    for (let entry of category.entries) {
      let firstLetter = entry.name.charAt(0).toUpperCase();

      if (!(/[A-Z]/i).test(firstLetter)) {
        // no l10n here, it will be done elsewhere
        firstLetter = "OTHERS";
      }
      if (!sortedCategory[firstLetter]) {
        sortedCategory.entries[firstLetter.toUpperCase()] = [];
      }
      sortedCategory.entries[firstLetter].push(entry);
    }
    sortedList.push(sortedCategory);
  }
  return sortedList;
}

  private static sortEntries(categoryId: number): void {
    // just sort given categoryId
    if (this.hasCategoryById(categoryId)) {
      this.getCategoryById(categoryId).entries.sort((a: iEntryData, b: iEntryData) => {
        // we don't care about letter case
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    } else {
      throw new CategoryNonexistsError();
    }
  }

  public static addEntry(categoryId: number, name: string, nameLink: string, author: string, authorLink: string, modes: eModes): void {
    if (this.hasCategoryById(categoryId)) {
      this.getCategoryById(categoryId).entries.push({
        "id": this.NextEntryId,
        name,
        nameLink,
        author,
        authorLink,
        modes
      });

      this.sortEntries(categoryId);
    } else {
      throw new CategoryNonexistsError();
    }
  }

  public static updateEntry(oldCategoryId: number, newCategoryId: number, entryId: number, name: string, nameLink: string, author: string, authorLink: string, modes: eModes): void {
    if (this.hasCategoryById(oldCategoryId)) {
      if (this.hasEntityById(entryId)) {
        this.getCategoryById(oldCategoryId).entries[entryId] = {
          "id": entryId,
          name,
          nameLink,
          author,
          authorLink,
          modes
        }

        if (newCategoryId !== oldCategoryId) {
          this.getCategoryById(newCategoryId).entries.push(Object.assign({}, this.getCategoryById(oldCategoryId).entries[entryId]));

          let index = this.getCategoryById(oldCategoryId).entries.findIndex((item) => {
            return item.id === entryId;
          });
          this.getCategoryById(oldCategoryId).entries.splice(index, 1);
          this.sortEntries(newCategoryId);
        }
        this.sortEntries(oldCategoryId);
      } else {
        throw new EntryNonexistsError();
      }
    } else {
      throw new CategoryNonexistsError();
    }
  }

  public static booleansToModes(s: boolean, t: boolean, c: boolean, m: boolean): eModes {
    let modes: eModes = eModes.None;

    if (s) {
      modes |= eModes.Standard;
    }

    if (t) {
      modes |= eModes.Taiko;
    }

    if (c) {
      modes |= eModes.Catch;
    }

    if (m) {
      modes |= eModes.Mania;
    }

    return modes;
  }
  // TODO modesToString

  // display methods
  // TODO need a better method name
  public static getDisplay(): HTMLDivElement {
    const $container: HTMLDivElement = document.createElement("div");
    $container.classList.add("display-category");

    for (let category of this.list.categories) {
      // group
      const $group: HTMLDivElement = document.createElement("div");
      $group.dataset.categoryId = category.id.toString();
      $group.classList.add("display-category-group");
      $container.insertAdjacentElement("beforeend", $group);

      // name
      const $category: HTMLDivElement = document.createElement("div");
      $category.classList.add("display-category-head");
      $group.insertAdjacentElement("beforeend", $category);

      const $nameGroup: HTMLDivElement = document.createElement("div");
      $nameGroup.classList.add("display-category-namegroup");
      $category.insertAdjacentElement("beforeend", $nameGroup);

      const $name: HTMLSpanElement = document.createElement("span");
      $name.classList.add("display-category-name");

      let name = category.name[l10n.currentLocale];
      if (!name) {
        // use English if selected locale doesn't have one
        name = category.name["en"];
      }
      $name.textContent = name;
      $nameGroup.insertAdjacentElement("beforeend", $name);

      // name -> edit
      const $nameEdit: HTMLSpanElement = document.createElement("span");
      $nameEdit.classList.add("display-category-editname", "button");
      if (l10n.currentLocale !== "en") {
        $nameEdit.textContent = `edit (in ${l10n.currentLocale.toUpperCase()})`;
      } else {
        $nameEdit.textContent = "edit";
      }
      $nameGroup.insertAdjacentElement("beforeend", $nameEdit);

      // name -> delete
      const $delete: HTMLSpanElement = document.createElement("span");
      $delete.classList.add("display-category-delete", "button-alt");
      $delete.textContent = "delete";
      $nameGroup.insertAdjacentElement("beforeend", $delete);

      // name -> delete -> confirm
      const $deleteConfirm: HTMLSpanElement = document.createElement("span");
      $deleteConfirm.classList.add("display-category-delete-confirm");
      $deleteConfirm.dataset.hidden = "";
      $deleteConfirm.textContent = "Really (irreversible)?";
      $nameGroup.insertAdjacentElement("beforeend", $deleteConfirm);

      const $deleteNo: HTMLSpanElement = document.createElement("span");
      $deleteNo.classList.add("display-category-delete-no", "button");
      $deleteNo.textContent = "No, whoops";
      $deleteConfirm.insertAdjacentElement("beforeend", $deleteNo);

      const $deleteYes: HTMLSpanElement = document.createElement("span");
      $deleteYes.classList.add("display-category-delete-yes", "button-alt");
      $deleteYes.textContent = "Yes, delete";
      $deleteConfirm.insertAdjacentElement("beforeend", $deleteYes);

      // description
      const $descriptionGroup: HTMLDivElement = document.createElement("div");
      $descriptionGroup.classList.add("display-category-descriptiongroup");
      $category.insertAdjacentElement("beforeend", $descriptionGroup);

      const $description: HTMLSpanElement = document.createElement("span");
      $description.classList.add("display-category-description");

      let description = category.description[l10n.currentLocale];
      if (!description) {
        // use English if selected locale doesn't have one
        description = category.description["en"];
      }
      $description.textContent = description;
      $descriptionGroup.insertAdjacentElement("beforeend", $description);

      // description -> edit
      const $descriptionEdit: HTMLSpanElement = document.createElement("span");
      $descriptionEdit.classList.add("display-category-editdescription", "button");
      if (l10n.currentLocale !== "en") {
        $descriptionEdit.textContent = `edit (in ${l10n.currentLocale.toUpperCase()})`;
      } else {
        $descriptionEdit.textContent = "edit";
      }
      $descriptionGroup.insertAdjacentElement("beforeend", $descriptionEdit);

      // entries
      const $entries: HTMLUListElement = document.createElement("ul");
      $entries.classList.add("category-entry");
      $group.insertAdjacentElement("beforeend", $entries);

      const $addEntry: HTMLDivElement = document.createElement("div");
      $addEntry.classList.add("display-category-add_entry", "button");
      $addEntry.textContent = "Add Entry";
      $addEntry.dataset.categoryName = category.name[l10n.currentLocale];
      $group.insertAdjacentElement("beforeend", $addEntry);

      for (let entry of category.entries) {
        // display the entry
        const $entry: HTMLLIElement = document.createElement("li");
        $entry.dataset.id = entry.id.toString();

        const $name: HTMLAnchorElement = document.createElement("a");
        $name.href = `https://osu.ppy.sh/community/forums/topics/${entry.nameLink}`;
        $name.textContent = entry.name;
        $name.target = "_blank";

        const $author: HTMLAnchorElement = document.createElement("a");
        $author.href = `https://osu.ppy.sh/users/${entry.authorLink}`;
        $author.textContent = entry.author;
        $author.target = "_blank";

        let modes: string[] = [];

        if (entry.modes & eModes.Standard) {
          modes.push("S");
        }
        if (entry.modes & eModes.Taiko) {
          modes.push("T");
        }
        if (entry.modes & eModes.Catch) {
          modes.push("C");
        }
        if (entry.modes & eModes.Mania) {
          modes.push("M");
        }

        const $modes: HTMLSpanElement = document.createElement("span");
        $modes.textContent = modes.join(" ");

        $entry.insertAdjacentElement("beforeend", $name);
        $entry.insertAdjacentText("beforeend", ` ${l10n.getString("by")} `);
        $entry.insertAdjacentElement("beforeend", $author);
        if (modes.length > 0) {
          $entry.insertAdjacentText("beforeend", " - ");
          $entry.insertAdjacentElement("beforeend", $modes);
        }

        // edit button
        const $edit: HTMLSpanElement = document.createElement("span");
        $edit.classList.add("entry-edit", "button");
        $edit.textContent = "edit";
        $entry.insertAdjacentElement("beforeend", $edit);

        // delete button
        const $delete: HTMLSpanElement = document.createElement("span");
        $delete.classList.add("entry-delete", "button-alt");
        $delete.textContent = "delete";
        $entry.insertAdjacentElement("beforeend", $delete);

        $entries.insertAdjacentElement("beforeend", $entry);
      }
    }
    return $container;
  }
}

export default CompendiumMan;
