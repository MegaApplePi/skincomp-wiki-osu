import CategoryExistsError from "./Error/CategoryExistsError.js";
import CategoryNonexistsError from "./Error/CategoryNonexistsError.js";
import EntryNonexistsError from "./Error/EntryNonexistsError.js";
import ImportError from "./Error/ImportError.js";
import l10n from "./l10n.js";
import Modes from "./eModes.js";
import EntryData from "./iEntryData.js";
import CompendiumList from "./iCompendiumList.js";

abstract class CompendiumMan {
  private static list: CompendiumList = {
    "nextId": 0,
    "categories": {},
    "descriptions": {}
  };

  public static getList(): CompendiumList {
    return this.list;
  }

  public static getEntryData(categoryName: string, key: string|number): EntryData {
    if (this.list.categories[categoryName]) {
      if (this.list.categories[categoryName][key]) {
        return this.list.categories[categoryName][key];
      } else {
        throw new EntryNonexistsError();
      }
    } else {
      throw new CategoryNonexistsError();
    }
  }

  public static getCategories(): Array<string> {
    return Object.keys(this.list.categories).sort();
  }

  private static getNextId(): number {
    return this.list.nextId++;
  }

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
  public static deleteCategory(name: string): void {
    if (this.list.categories[name]) {
      delete this.list.categories[name];
      delete this.list.descriptions[name];
    } else {
      throw new CategoryNonexistsError();
    }
  }

  public static addCategory(name: string, description: string): void {
    if (this.list.categories[name]) {
      throw new CategoryExistsError();
    } else {
      this.list.descriptions[name] = description;
      this.list.categories[name] = {};
    }
  }

  public static renameCategory(oldName: string, newName: string): void {
    if (this.list.categories[oldName]) {
      if (this.list.categories[newName]) {
        throw new CategoryExistsError();
      } else {
        this.list.categories[newName] = Object.assign({}, this.list.categories[oldName]);
        this.list.descriptions[newName] = this.list.descriptions[oldName];
        delete this.list.categories[oldName];
        delete this.list.descriptions[oldName];
      }
    } else {
      throw new CategoryNonexistsError();
    }
  }

  public static getDescription(category: string): string {
    if (this.list.descriptions[category]) {
      return this.list.descriptions[category];
    } else {
      throw new CategoryNonexistsError();
      
    }
  }

  // TODO add locale code (when creating a category, the title and description added will be in English... the user then needs to change the locale and edit the name to set the description in locale)
  public static updateDescription(key: string, description: string, locale?: string): void {
    if (this.list.descriptions[key]) {
      this.list.descriptions[key] = description;
    } else {
      throw new CategoryNonexistsError();
    }
  }

  // entry methods
  public static addEntry(category: string, name: string, nameLink: string, author: string, authorLink: string, modes: Modes): void {
    if (this.list.categories[category]) {
      this.list.categories[category][this.getNextId()] = {
        name,
        nameLink,
        author,
        authorLink,
        modes
      };
    } else {
      throw new CategoryNonexistsError();
    }
  }

  public static computeModes(s: boolean, t: boolean, c: boolean, m: boolean): Modes {
    let modes: Modes = Modes.None;

    if (s) {
      modes |= Modes.Standard;
    }

    if (t) {
      modes |= Modes.Taiko;
    }

    if (c) {
      modes |= Modes.Catch;
    }

    if (m) {
      modes |= Modes.Mania;
    }

    return modes;
  }

  public static updateEntry(oldCategory: string, newCategory: string, id: string|number, name: string, nameLink: string, author: string, authorLink: string, modes: Modes): void {
    if (this.list.categories[oldCategory]) {
      if (this.list.categories[oldCategory][id]) {
        this.list.categories[oldCategory][id] = {
          name,
          nameLink,
          author,
          authorLink,
          modes
        };

        if (newCategory !== oldCategory) {
          this.list.categories[newCategory][id] = Object.assign({}, this.list.categories[oldCategory][id]);
          delete this.list.categories[oldCategory][id];
        }
      } else {
        throw new EntryNonexistsError();
      }
    } else {
      throw new CategoryNonexistsError();
    }
  }

  // display methods
  public static getDisplay(): HTMLDivElement {
    for (let category in this.list.categories) {
      if (this.list.categories.hasOwnProperty(category)) {
        // new category container
        const $container: HTMLDivElement = document.createElement("div");
        $container.classList.add("display-category");

        // name
        const $category: HTMLDivElement = document.createElement("div");
        $category.classList.add("display-category-head");

        const $nameGroup: HTMLDivElement = document.createElement("div");
        $nameGroup.classList.add("display-category-group");
        $category.insertAdjacentElement("beforeend", $nameGroup);

        const $name: HTMLSpanElement = document.createElement("span");
        $name.classList.add("display-category-name");
        $name.textContent = category;
        $nameGroup.insertAdjacentElement("beforeend", $name);

        // name -> edit
        const $nameEdit: HTMLSpanElement = document.createElement("span");
        $nameEdit.classList.add("display-category-editname", "button");
        $nameEdit.textContent = "edit";
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
        $descriptionGroup.classList.add("display-category-group");
        $category.insertAdjacentElement("beforeend", $descriptionGroup);

        const $description: HTMLSpanElement = document.createElement("span");
        $description.classList.add("display-category-description");
        $description.textContent = this.list.descriptions[category];
        $descriptionGroup.insertAdjacentElement("beforeend", $description);

        // description -> edit
        const $descriptionEdit: HTMLSpanElement = document.createElement("span");
        $descriptionEdit.classList.add("display-category-editdescription", "button");
        $descriptionEdit.textContent = "edit";
        $descriptionGroup.insertAdjacentElement("beforeend", $descriptionEdit);

        // entries
        const $entries: HTMLUListElement = document.createElement("ul");
        $entries.classList.add("category-entry");

        const $addEntry: HTMLDivElement = document.createElement("div");
        $addEntry.classList.add("display-category-add_entry", "button");
        $addEntry.textContent = "Add Entry";
        $addEntry.dataset.categoryName = category;

        $container.insertAdjacentElement("beforeend", $category);
        $container.insertAdjacentElement("beforeend", $entries);
        $container.insertAdjacentElement("beforeend", $addEntry);

        for (let entry in this.list.categories[category]) {
          if (this.list.categories[category].hasOwnProperty(entry)) {
            const entryData: EntryData = this.list.categories[category][entry];

            // display the entry
            const $entry: HTMLLIElement = document.createElement("li");
            $entry.dataset.id = entry;

            const $name: HTMLAnchorElement = document.createElement("a");
            $name.href = `https://osu.ppy.sh/community/forums/topics/${entryData.nameLink}`;
            $name.textContent = entryData.name;
            $name.target = "_blank";

            const $author: HTMLAnchorElement = document.createElement("a");
            $author.href = `https://osu.ppy.sh/users/${entryData.authorLink}`;
            $author.textContent = entryData.author;
            $author.target = "_blank";

            let modes: Array<string> = [];

            if (entryData.modes & Modes.Standard) {
              modes.push("S");
            }
            if (entryData.modes & Modes.Taiko) {
              modes.push("T");
            }
            if (entryData.modes & Modes.Catch) {
              modes.push("C");
            }
            if (entryData.modes & Modes.Mania) {
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
  }
}

export default CompendiumMan;
