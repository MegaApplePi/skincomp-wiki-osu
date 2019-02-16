// TODO organize the methods better
import CategoryExistsError from "./Error/CategoryExistsError.js";
import CategoryNonexistsError from "./Error/CategoryNonexistsError.js";
import EntryNonexistsError from "./Error/EntryNonexistsError.js";
import ImportError from "./Error/ImportError.js";
import LocaleNonexistsError from "./Error/LocaleNonexistsError.js";
import l10n from "./l10n.js";
import eModes from "./eModes.js";
import iEntry from "./iEntry.js";
import iCompendiumList from "./iCompendiumList.js";
import iCategory from "./iCategory.js";
import iSortedCategory from "./iSortedCategory.js";
import Import from "./Import.js";

interface CategoryIdNameList {
  "name": string;
  "id": number;
}

abstract class CompendiumMan {
  private static list: iCompendiumList = {
    "categories": [],
    "entries": [],
    "_version": Import.version,
    "nextEntryId": 0,
    "nextCategoryId": 0
  };

  public static get List(): iCompendiumList {
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
    let entries = [];

    for (let entry of this.list.entries) {
      entries.push(entry.id);
    }
    return entries;
  }

  public static getEntriesByCategoryId(categoryId: number): iEntry[] {
    throw new Error("NOT IMPLEMENTED");
  }

  public static getEntryById(entityId: number): iEntry {
    if (this.hasEntityById(entityId)) {
      let result = this.list.entries.find((item) => {
        return item.id === entityId;
      });
      return result;
    } else {
      throw new EntryNonexistsError();
    }
  }

  private static get NextCategoryId(): number {
    return this.list.nextCategoryId++;
  }

  private static get NextEntryId(): number {
    return this.list.nextEntryId++;
  }

  // import and export
  public static import(data: string): void {
    try {
      this.list = Import.readData(data);
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

  public static deleteCategory(categoryId: number): void {
    if (this.hasCategoryById(categoryId)) {
      let index = this.list.categories.findIndex((item) => {
        return item.id === categoryId;
      });
      this.list.categories.splice(index, 1);
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
        }
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

    // sort the list before looping
    this.sortEntries();

    const categories = this.list.categories;

    for (let category of categories) {
      let sortedCategory: iSortedCategory = {
        "category": category,
        "entries": new Map()
      };

      let others: iEntry[] = []; // temporary placeholder for OTHERS
      // grouping by first letter

      for (let entry of this.list.entries) {
        if (!entry.categories.includes(category.id)) {
          continue;
        }
        let firstLetter = entry.name.charAt(0).toUpperCase();

        if (!(/[A-Z]/i).test(firstLetter)) {
          // no l10n here, it will be done elsewhere
          firstLetter = "OTHERS";
          others.push(entry);
          continue;
        }
        if (!sortedCategory.entries[firstLetter]) {
          sortedCategory.entries[firstLetter.toUpperCase()] = [];
        }
        sortedCategory.entries[firstLetter].push(entry);
      }
      if (others.length > 0) {
        sortedCategory.entries["OTHERS"] = [...others];
      }
      sortedList.push(sortedCategory);
    }
    return sortedList;
  }

  private static sortEntries(): void {
    this.list.entries.sort((a: iEntry, b: iEntry) => {
      // we don't care about letter case
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }

  public static addEntry(categoryIds: number[], name: string, nameLink: string, author: string, authorLink: string, modes: eModes): void {
    for (let id of categoryIds) {
      if (!this.hasCategoryById(id)) {
        throw new CategoryNonexistsError();
      }
    }
    this.list.entries.push({
      "id": this.NextEntryId,
      "categories": categoryIds,
      name,
      nameLink,
      author,
      authorLink,
      modes
    });

    this.sortEntries();
  }

  public static deleteEntry(entryId: number) {
    if (this.hasEntityById(entryId)) {
      let index = this.list.entries.findIndex((entry) => {
        return entry.id === entryId;
      });
      delete this.list.entries[index];
    } else {
      throw new EntryNonexistsError();
    }
  }

  public static updateEntry(entryId: number, categoryIds: number[], name: string, nameLink: string, author: string, authorLink: string, modes: eModes): void {
    for (let id of categoryIds) {
      if (!this.hasCategoryById(id)) {
        throw new CategoryNonexistsError();
      }
    }

    if (this.hasEntityById(entryId)) {
      let index = this.list.entries.findIndex((entry) => {
        return entry.id === entryId;
      });
      this.list.entries[index] = {
        "id": entryId,
        "categories": categoryIds,
        name,
        nameLink,
        author,
        authorLink,
        modes
      };

      this.sortEntries();
    } else {
      throw new EntryNonexistsError();
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
      $deleteConfirm.textContent = "Confirm:";
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
      const $table: HTMLTableElement = document.createElement("table");
      $table.classList.add("category-entry");
      $group.insertAdjacentElement("beforeend", $table);

      const $trHeading: HTMLTableRowElement = document.createElement("tr");
      $table.insertAdjacentElement("beforeend", $trHeading);

      const $thEntry: HTMLTableHeaderCellElement = document.createElement("th");
      $trHeading.insertAdjacentElement("beforeend", $thEntry);

      const $thModes: HTMLTableHeaderCellElement = document.createElement("th");
      $thModes.textContent = l10n.getString("Modes");
      $trHeading.insertAdjacentElement("beforeend", $thModes);

      const $thActions: HTMLTableHeaderCellElement = document.createElement("th");
      $thActions.textContent = "Actions";
      $trHeading.insertAdjacentElement("beforeend", $thActions);

      for (let entry of this.list.entries) {
        if (!entry.categories.includes(category.id)) {
          continue;
        }
        // display the entry
        const $tr: HTMLTableRowElement = document.createElement("tr");
        $tr.dataset.id = entry.id.toString();
        $table.insertAdjacentElement("beforeend", $tr);

        const $tdEntry: HTMLTableDataCellElement = document.createElement("td");
        $tr.insertAdjacentElement("beforeend", $tdEntry);

        const $tdMode: HTMLTableDataCellElement = document.createElement("td");
        $tr.insertAdjacentElement("beforeend", $tdMode);

        const $tdActions: HTMLTableDataCellElement = document.createElement("td");
        $tr.insertAdjacentElement("beforeend", $tdActions);

        const $name: HTMLAnchorElement = document.createElement("a");
        $name.href = `https://osu.ppy.sh/community/forums/topics/${entry.nameLink}`;
        $name.textContent = entry.name;
        $name.target = "_blank";

        $tdEntry.insertAdjacentElement("beforeend", $name);
        $tdEntry.insertAdjacentText("beforeend", ` ${l10n.getString("by")} `);

        const $author: HTMLAnchorElement = document.createElement("a");
        $author.href = `https://osu.ppy.sh/users/${entry.authorLink}`;
        $author.textContent = entry.author;
        $author.target = "_blank";
        $tdEntry.insertAdjacentElement("beforeend", $author);

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
        $tdMode.insertAdjacentElement("beforeend", $modes);

        // edit button
        const $edit: HTMLSpanElement = document.createElement("span");
        $edit.classList.add("entry-edit", "button");
        $edit.textContent = "edit";
        $tdActions.insertAdjacentElement("beforeend", $edit);

        // delete button
        const $delete: HTMLSpanElement = document.createElement("span");
        $delete.classList.add("entry-delete", "button-alt");
        $delete.textContent = "delete";
        $tdActions.insertAdjacentElement("beforeend", $delete);

        // delete -> confirm
        const $deleteConfirm: HTMLSpanElement = document.createElement("span");
        $deleteConfirm.classList.add("entry-delete-confirm");
        $deleteConfirm.dataset.hidden = "";
        $deleteConfirm.textContent = "Confirm:";
        $tdActions.insertAdjacentElement("beforeend", $deleteConfirm);
  
        const $deleteNo: HTMLSpanElement = document.createElement("span");
        $deleteNo.classList.add("entry-delete-no", "button");
        $deleteNo.textContent = "No, whoops";
        $deleteConfirm.insertAdjacentElement("beforeend", $deleteNo);
  
        const $deleteYes: HTMLSpanElement = document.createElement("span");
        $deleteYes.classList.add("entry-delete-yes", "button-alt");
        $deleteYes.textContent = "Yes, delete";
        $deleteConfirm.insertAdjacentElement("beforeend", $deleteYes);
      }
    }
    return $container;
  }
}

export default CompendiumMan;
