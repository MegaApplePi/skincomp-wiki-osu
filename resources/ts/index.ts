import CategoryExistsError from "./Error/CategoryExistsError.js";
import CategoryNonexistsError from "./Error/CategoryNonexistsError.js";
import EntryNonexistsError from "./Error/EntryNonexistsError.js";
import ImportError from "./Error/ImportError.js";
import ParseMd from "./l10n.js";
import l10n from "./l10n.js";

/* DOM elements */

// containers
const $newEntry: HTMLDivElement = document.querySelector(".new_entry");
const $editEntry: HTMLDivElement = document.querySelector(".edit_entry");
const $import: HTMLDivElement = document.querySelector(".import");
const $export: HTMLDivElement = document.querySelector(".export");
const $parse: HTMLDivElement = document.querySelector(".parse");
const $display: HTMLDivElement = document.querySelector(".display");

// controls
const $controlNewCategory: HTMLDivElement = document.querySelector(".control-new_category");
const $controlImport: HTMLDivElement = document.querySelector(".control-import");
const $controlLocale: HTMLSelectElement = document.querySelector("#control-locale");
const $controlParseMd: HTMLDivElement = document.querySelector(".control-parse-md");
const $controlParseBb: HTMLDivElement = document.querySelector(".control-parse-bb");
const $controlExport: HTMLDivElement = document.querySelector(".control-export");

// category
const $newCategory: HTMLDivElement = document.querySelector(".new_category");
const $newCategoryName: HTMLFormElement = document.querySelector("#new_category-name");
const $newCategoryDescription: HTMLFormElement = document.querySelector("#new_category-description");
const $newCategorySubmit: HTMLDivElement = document.querySelector(".new_category-submit");
const $newCategoryCancel: HTMLDivElement = document.querySelector(".new_category-cancel");
const $newCategoryStatus: HTMLDivElement = document.querySelector(".new_category-status");

// new entry
const $newEntryTo: HTMLFormElement = document.querySelector(".new_entry-to");
const $newEntryName: HTMLFormElement = document.querySelector("#new_entry-name");
const $newEntryNameLink: HTMLFormElement = document.querySelector("#new_entry-name_link");
const $newEntryAuthor: HTMLFormElement = document.querySelector("#new_entry-author");
const $newEntryAuthorLink: HTMLFormElement = document.querySelector("#new_entry-author_link");
const $newEntryStandard: HTMLFormElement = document.querySelector("#new_entry-standard");
const $newEntryTaiko: HTMLFormElement = document.querySelector("#new_entry-taiko");
const $newEntryCatch: HTMLFormElement = document.querySelector("#new_entry-catch");
const $newEntryMania: HTMLFormElement = document.querySelector("#new_entry-mania");
const $newEntrySubmit: HTMLDivElement = document.querySelector(".new_entry-submit");
const $newEntryCancel: HTMLDivElement = document.querySelector(".new_entry-cancel");

// edit entry
const $editEntryCategory: HTMLSelectElement = document.querySelector("#edit_entry-category");
const $editEntryName: HTMLInputElement = document.querySelector("#edit_entry-name");
const $editEntryNameLink: HTMLInputElement = document.querySelector("#edit_entry-name_link");
const $editEntryAuthor: HTMLInputElement = document.querySelector("#edit_entry-author");
const $editEntryAuthorLink: HTMLInputElement = document.querySelector("#edit_entry-author_link");
const $editEntryStandard: HTMLInputElement = document.querySelector("#edit_entry-standard");
const $editEntryTaiko: HTMLInputElement = document.querySelector("#edit_entry-taiko");
const $editEntryCatch: HTMLInputElement = document.querySelector("#edit_entry-catch");
const $editEntryMania: HTMLInputElement = document.querySelector("#edit_entry-mania");
const $editEntrySubmit: HTMLDivElement = document.querySelector(".edit_entry-submit");
const $editEntryReset: HTMLDivElement = document.querySelector(".edit_entry-reset");
const $editEntryCancel: HTMLDivElement = document.querySelector(".edit_entry-cancel");

// import
const $importInput: HTMLInputElement = document.querySelector("#import-input");
const $importSubmit: HTMLInputElement = document.querySelector(".import-submit");
const $importCancel: HTMLInputElement = document.querySelector(".import-cancel");
const $importStatus: HTMLInputElement = document.querySelector(".import-status");

// export
const $exportOutput: HTMLInputElement = document.querySelector("#export-output");
const $exportSaveLink: HTMLAnchorElement = document.querySelector(".export-save-link");
const $exportCopy: HTMLDivElement = document.querySelector(".export-copy");
const $exportClose: HTMLDivElement = document.querySelector(".export-close");
const $exportStatus: HTMLDivElement = document.querySelector(".export-status");

// parse
const $parseOutput: HTMLTextAreaElement = document.querySelector("#parse-output");
const $parseCopy: HTMLDivElement = document.querySelector(".parse-copy");
const $parseClose: HTMLDivElement = document.querySelector(".parse-close");
const $parseNav: HTMLDivElement = document.querySelector(".parse-nav");
const $parsePrev: HTMLDivElement = document.querySelector(".parse-prev");
const $parseNext: HTMLDivElement = document.querySelector(".parse-next");
const $parseStatus: HTMLDivElement = document.querySelector(".parse-status");

/* classes */
enum Modes {
  None = 0,
  Standard = 1 << 0,
  Taiko = 1 << 1,
  Catch = 1 << 2,
  Mania = 1 << 3
}

interface CompendiumList {
  "nextId": number;
  "categories": object;
  "descriptions": object;
}
interface EntryData {
  "id": number;
  "name": string;
  "nameLink": string;
  "author": string;
  "authorLink": string;
  "modes": Modes;
}
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
      this.updateDisplay();
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
      this.updateDisplay();
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

    this.updateDisplay();
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

  public static updateDescription(key: string, description: string): void {
    if (this.list.descriptions[key]) {
      this.list.descriptions[key] = description;
    } else {
      throw new CategoryNonexistsError();
    }
  }

  // entry methods
  public static addEntry(category: string, name: string, nameLink: string, author: string, authorLink: string, modes: Modes): void {
    // TOFIX need to validate nameLink and authorLink (extract ID if link then check if it is an integer);
    if (this.list.categories[category]) {
      this.list.categories[category][this.getNextId()] = {
        name,
        nameLink,
        author,
        authorLink,
        modes
      };

      this.updateDisplay();
    } else {
      throw new CategoryNonexistsError();
    }
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

        this.updateDisplay();
      } else {
        throw new EntryNonexistsError();
      }
    } else {
      throw new CategoryNonexistsError();
    }
  }

  // display methods
  public static updateDisplay(): void {
    while ($display.firstChild) {
      $display.firstChild.remove();
    }

    for (let category in this.list.categories) {
      if (this.list.categories.hasOwnProperty(category)) {
        // new category container
        const $div: HTMLDivElement = document.createElement("div");
        $div.classList.add("display-category");

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

        $div.insertAdjacentElement("beforeend", $category);
        $div.insertAdjacentElement("beforeend", $entries);
        $div.insertAdjacentElement("beforeend", $addEntry);
        $display.insertAdjacentElement("beforeend", $div);

        for (let entry in this.list.categories[category]) {
          if (this.list.categories[category].hasOwnProperty(entry)) {
            const entryData: EntryData = this.list.categories[category][entry];

            // display the entry
            const $entry: HTMLLIElement = document.createElement("li");
            $entry.dataset.id = entry;

            const $name: HTMLAnchorElement = document.createElement("a");
            $name.href = entryData.nameLink;
            $name.textContent = entryData.name;
            $name.target = "_blank";

            const $author: HTMLAnchorElement = document.createElement("a");
            $author.href = entryData.authorLink;
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
      }
    }
  }
}

/* events */

// new entries
function $newEntrySubmit_click(): void {
  let hasErrors: boolean = false;

  if ($newEntryName.value.trim() === "") {
    $newEntryName.dataset.invalid = "";
    hasErrors = true;
  } else {
    delete $newEntryName.dataset.invalid;
  }
  
  if ($newEntryNameLink.value.trim() === "") {
    $newEntryNameLink.dataset.invalid = "";
    hasErrors = true;
  } else {
    delete $newEntryNameLink.dataset.invalid;
  }

  if ($newEntryAuthor.value.trim() === "") {
    $newEntryAuthor.dataset.invalid = "";
    hasErrors = true;
  } else {
    delete $newEntryAuthor.dataset.invalid;
  }
  
  if ($newEntryAuthorLink.value.trim() === "") {
    $newEntryAuthorLink.dataset.invalid = "";
    hasErrors = true;
  } else {
    delete $newEntryAuthorLink.dataset.invalid;
  }

  if (!hasErrors) {
    $newEntry.dataset.hidden = "";

    let modes: Modes = Modes.None;
    // TODO make this part of CompendiumMan
    if ($newEntryStandard.checked) {
      modes |= Modes.Standard;
    }
    if ($newEntryTaiko.checked) {
      modes |= Modes.Taiko;
    }
    if ($newEntryCatch.checked) {
      modes |= Modes.Catch;
    }
    if ($newEntryMania.checked) {
      modes |= Modes.Mania;
    }

    CompendiumMan.addEntry($newEntry.dataset.categoryName, $newEntryName.value, $newEntryNameLink.value, $newEntryAuthor.value, $newEntryAuthorLink.value, modes);

    $newEntryName.value = "";
    $newEntryNameLink.value = "";
    $newEntryAuthor.value = "";
    $newEntryAuthorLink.value = "";
    $newEntryStandard.checked = false;
    $newEntryTaiko.checked = false;
    $newEntryCatch.checked = false;
    $newEntryMania.checked = false;
  }
}
$newEntrySubmit.addEventListener("click", $newEntrySubmit_click);

function $newEntryCancel_click(): void {
  $newEntry.dataset.hidden = "";

  $newEntryName.value = "";
  $newEntryAuthor.value = "";
  $newEntryNameLink.value = "";
  $newEntryStandard.checked = false;
  $newEntryTaiko.checked = false;
  $newEntryCatch.checked = false;
  $newEntryMania.checked = false;

  delete $newEntryName.dataset.invalid;
  delete $newEntryNameLink.dataset.invalid;
  delete $newEntryAuthor.dataset.invalid;
  delete $newEntryAuthorLink.dataset.invalid;
}
$newEntryCancel.addEventListener("click", $newEntryCancel_click);

function $controlNewCategory_click(): void {
  delete $newCategory.dataset.hidden;
}
$controlNewCategory.addEventListener("click", $controlNewCategory_click);

// new categories
function $newCategorySubmit_click(): void {
  let hasErrors: boolean = false;
  if ($newCategoryName.value.trim() === "") {
    hasErrors = true;
    $newCategoryName.dataset.invalid = "";
  }
  if ($newCategoryDescription.value.trim() === "") {
    hasErrors = true;
    $newCategoryDescription.dataset.invalid = "";
  }

  if (!hasErrors) {
    try {
      CompendiumMan.addCategory($newCategoryName.value.trim(), $newCategoryDescription.value.trim());
      $newCategory.dataset.hidden = "";
      $newCategoryName.value = "";
      $newCategoryDescription.value = "";
      delete $newCategoryName.dataset.invalid;
      delete $newCategoryDescription.dataset.invalid;
    } catch (ex) {
      $newCategoryName.dataset.invalid = "";
      $newCategoryStatus.textContent = `Category already exists: ${ex}`;
    }
  }
}
$newCategorySubmit.addEventListener("click", $newCategorySubmit_click);

function $newCategoryCancel_click(): void {
  $newCategory.dataset.hidden = "";
  $newCategoryName.value = "";
  delete $newCategoryName.dataset.invalid;
}
$newCategoryCancel.addEventListener("click", $newCategoryCancel_click);

function resetEditEntry(): void {
  $editEntryName.value = "";
  $editEntryNameLink.value = "";
  $editEntryAuthor.value = "";
  $editEntryAuthorLink.value = "";
  $editEntryStandard.checked = false;
  $editEntryTaiko.checked = false;
  $editEntryCatch.checked = false;
  $editEntryMania.checked = false;
}

function $editEntrySubmit_click(): void {
  let modes: Modes = Modes.None;
  if ($editEntryStandard.checked) {
    modes |= Modes.Standard;
  }
  if ($editEntryTaiko.checked) {
    modes |= Modes.Taiko;
  }
  if ($editEntryCatch.checked) {
    modes |= Modes.Catch;
  }
  if ($editEntryMania.checked) {
    modes |= Modes.Mania;
  }

  CompendiumMan.updateEntry($editEntry.dataset.categoryName, $editEntryCategory.value, $editEntry.dataset.entryId, $editEntryName.value, $editEntryNameLink.value, $editEntryAuthor.value, $editEntryAuthorLink.value, modes);

  resetEditEntry();
  $editEntry.dataset.hidden = "";
}
$editEntrySubmit.addEventListener("click", $editEntrySubmit_click);

function $editEntryReset_click(): void {
  $editEntryName.value = $editEntryName.dataset.value;
  $editEntryNameLink.value = $editEntryNameLink.dataset.value;
  $editEntryAuthor.value = $editEntryAuthor.dataset.value;
  $editEntryAuthorLink.value = $editEntryAuthorLink.dataset.value;
  $editEntryStandard.checked = ($editEntryStandard.dataset.value === "true") ? true : false;
  $editEntryTaiko.checked = ($editEntryTaiko.dataset.value === "true") ? true : false;
  $editEntryCatch.checked = ($editEntryCatch.dataset.value === "true") ? true : false;
  $editEntryMania.checked = ($editEntryMania.dataset.value === "true") ? true : false;
}
$editEntryReset.addEventListener("click", $editEntryReset_click);

function $editEntryCancel_click(): void {
  $editEntry.dataset.hidden = "";
  resetEditEntry();
}
$editEntryCancel.addEventListener("click", $editEntryCancel_click);

// display
function $display_click (event: Event): void {
  let target: HTMLElement = <HTMLElement>event.target;

  if (target.classList.contains("display-category-editname") && !target.hasAttribute("data-disabled")) {
    (<HTMLElement>target.nextElementSibling).dataset.hidden = "";

    const $input: HTMLInputElement = document.createElement("input");
    const $name: HTMLSpanElement = <HTMLSpanElement>target.parentElement.firstElementChild;

    const $divActions: HTMLDivElement = document.createElement("div");
    $divActions.classList.add("display-category-action");

    const $spanOk: HTMLSpanElement = document.createElement("span");
    $spanOk.classList.add("display-category-nameaction-ok", "button");
    $spanOk.textContent = "OK";
    $divActions.insertAdjacentElement("beforeend", $spanOk);

    const $spanCancel: HTMLSpanElement = document.createElement("span");
    $spanCancel.classList.add("display-category-nameaction-cancel", "button-alt");
    $spanCancel.textContent = "Cancel";
    $divActions.insertAdjacentElement("beforeend", $spanCancel);

    $input.value = $name.textContent;
    $input.dataset.original = $name.textContent;

    $name.replaceWith($input);
    target.replaceWith($divActions);
  } else if (target.classList.contains("display-category-nameaction-ok")) {
    delete (<HTMLElement>target.parentElement.nextElementSibling).dataset.hidden;

    const $input: HTMLInputElement = <HTMLInputElement>target.parentElement.parentElement.firstElementChild;
    const $name: HTMLSpanElement = document.createElement("span");
    $name.classList.add("display-category-name");

    const $spanEdit: HTMLSpanElement = document.createElement("span");
    $spanEdit.classList.add("display-category-editname", "button");
    $spanEdit.textContent = "edit";

    $name.textContent = $input.value;
    if ($input.dataset.original !== $input.value.trim()) {
      CompendiumMan.renameCategory($input.dataset.original, $input.value);
    }

    $input.replaceWith($name);
    target.parentElement.replaceWith($spanEdit);
  } else if (target.classList.contains("display-category-nameaction-cancel")) {
    delete (<HTMLElement>target.parentElement.nextElementSibling).dataset.hidden;

    const $input: HTMLInputElement = <HTMLInputElement>target.parentElement.parentElement.firstElementChild;
    const $name: HTMLSpanElement = document.createElement("span");
    $name.classList.add("display-category-name");

    const $spanEdit: HTMLSpanElement = document.createElement("span");
    $spanEdit.classList.add("display-category-editname", "button");
    $spanEdit.textContent = "edit";

    $name.textContent = $input.dataset.original;

    $input.replaceWith($name);
    target.parentElement.replaceWith($spanEdit);
  } else if (target.classList.contains("display-category-editdescription")) {
    const $input: HTMLInputElement = document.createElement("input");
    const $name: HTMLSpanElement = <HTMLSpanElement>target.parentElement.firstElementChild;

    const $divActions: HTMLDivElement = document.createElement("div");
    $divActions.classList.add("display-category-action");

    const $spanOk: HTMLSpanElement = document.createElement("span");
    $spanOk.classList.add("display-category-descriptionaction-ok", "button");
    $spanOk.textContent = "OK";
    $divActions.insertAdjacentElement("beforeend", $spanOk);

    const $spanCancel: HTMLSpanElement = document.createElement("span");
    $spanCancel.classList.add("display-category-descriptionaction-cancel", "button-alt");
    $spanCancel.textContent = "Cancel";
    $divActions.insertAdjacentElement("beforeend", $spanCancel);

    $input.value = $name.textContent;
    $input.dataset.original = $name.textContent;

    $name.replaceWith($input);
    target.replaceWith($divActions);
  } else if (target.classList.contains("display-category-descriptionaction-ok")) {
    const $category: HTMLInputElement = <HTMLInputElement>target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
    const $input: HTMLInputElement = <HTMLInputElement>target.parentElement.parentElement.firstElementChild;
    const $description: HTMLSpanElement = document.createElement("span");
    $description.classList.add("display-category-description");

    const $spanEdit: HTMLSpanElement = document.createElement("span");
    $spanEdit.classList.add("display-category-editdescription", "button");
    $spanEdit.textContent = "edit";

    $description.textContent = $input.value;
    if ($input.dataset.original !== $input.value.trim()) {
      CompendiumMan.updateDescription($category.textContent, $input.value);
    }

    $input.replaceWith($description);
    target.parentElement.replaceWith($spanEdit);
  } else if (target.classList.contains("display-category-delete") && !target.hasAttribute("data-disabled")) {
    target.dataset.disabled = "";
    (<HTMLElement>target.previousElementSibling).dataset.disabled = "";
    delete (<HTMLElement>target.nextElementSibling).dataset.hidden;
  } else if (target.classList.contains("display-category-delete-no")) {
    delete (<HTMLElement>target.parentElement.previousElementSibling).dataset.disabled;
    delete (<HTMLElement>target.parentElement.previousElementSibling.previousElementSibling).dataset.disabled;
    target.parentElement.dataset.hidden = "";
  } else if (target.classList.contains("display-category-delete-yes")) {
    try {
      CompendiumMan.deleteCategory((<HTMLElement>target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling).textContent);
    } catch (ex) {
      // TODO display error
      console.error("Failed to delete (did you modify the document?)");
    }
  } else if (target.classList.contains("display-category-add_entry")) {
    delete $newEntry.dataset.hidden;

    $newEntryTo.textContent = `Adding to: ${target.dataset.categoryName}`;
    $newEntry.dataset.categoryName = target.dataset.categoryName;
  
    $newEntryName.value = "";
    $newEntryAuthor.value = "";
    $newEntryNameLink.value = "";
    $newEntryStandard.checked = false;
    $newEntryTaiko.checked = false;
    $newEntryCatch.checked = false;
    $newEntryMania.checked = false;
  } else if (target.classList.contains("entry-edit")) {
    $editEntry.dataset.categoryName = (<HTMLElement>target.parentElement.parentElement.previousElementSibling.firstElementChild).textContent;

    $editEntry.dataset.entryId = target.parentElement.dataset.id;

    const categories = CompendiumMan.getCategories();

    const entryData: EntryData = CompendiumMan.getEntryData($editEntry.dataset.categoryName, $editEntry.dataset.entryId);
    $editEntryName.value = entryData.name;
    $editEntryNameLink.value = entryData.nameLink;
    $editEntryAuthor.value = entryData.author;
    $editEntryAuthorLink.value = entryData.authorLink;
    $editEntryStandard.checked = (Modes.Standard & entryData.modes) ? true : false;
    $editEntryTaiko.checked = (Modes.Taiko & entryData.modes) ? true : false;
    $editEntryCatch.checked = (Modes.Catch & entryData.modes) ? true : false;
    $editEntryMania.checked = (Modes.Mania & entryData.modes) ? true : false;
    $editEntryName.dataset.value = entryData.name;
    $editEntryNameLink.dataset.value = entryData.nameLink;
    $editEntryAuthor.dataset.value = entryData.author;
    $editEntryAuthorLink.dataset.value = entryData.authorLink;
    $editEntryStandard.dataset.value = (Modes.Standard & entryData.modes) ? "true" : "false";
    $editEntryTaiko.dataset.value = (Modes.Taiko & entryData.modes) ? "true" : "false";
    $editEntryCatch.dataset.value = (Modes.Catch & entryData.modes) ? "true" : "false";
    $editEntryMania.dataset.value = (Modes.Mania & entryData.modes) ? "true" : "false";

    while ($editEntryCategory.firstChild) {
      $editEntryCategory.firstChild.remove();
    }

    for (let category of categories) {
      const $option: HTMLOptionElement = document.createElement("option");
      $option.value = category;
      $option.textContent = category;

      if ($editEntry.dataset.categoryName === category) {
        $option.selected = true;
      }

      $editEntryCategory.insertAdjacentElement("beforeend", $option);
    }

    delete $editEntry.dataset.hidden;
  }
}
$display.addEventListener("click", $display_click);

// import events
function $controlImport_click(): void {
  delete $import.dataset.hidden;
}
$controlImport.addEventListener("click", $controlImport_click);

const importReader: FileReader = new FileReader();
function importReader_load(event: Event) {
  try {
    let result = JSON.parse(importReader.result.toString());
    CompendiumMan.import(result);
  } catch {
    // TODO error message for this
    console.error("failed");
  }
}
importReader.addEventListener("load", importReader_load);

function $importSubmit_click(): void {
  if ($importInput.files[0]) {
    if ($importInput.files[0].type === "application/json") {
      $import.dataset.hidden = "";
      importReader.readAsText($importInput.files[0]);
      $importInput.value = "";
    } else {
      $importStatus.textContent = "Invalid file type.";
      $importInput.value = "";
    }
  } else {
    $importStatus.textContent = "Choose a file to import.";
    $importInput.value = "";
  }
}
$importSubmit.addEventListener("click", $importSubmit_click);

function $importCancel_click(): void {
  $import.dataset.hidden = "";
  $importStatus.textContent = "";
  $importInput.value = "";
  // TODO drop file while import is opened
  // document.body.removeEventListner("drop", body_drop);
}
$importCancel.addEventListener("click", $importCancel_click);

// export events
function $controlExport_click(): void {
  delete $export.dataset.hidden;
  $exportOutput.value = CompendiumMan.export();
  delete $exportCopy.dataset.disabled;
  delete $exportStatus.dataset.state;
  $exportStatus.textContent = "";
}
$controlExport.addEventListener("click", $controlExport_click);

function $exportSave_click(): void {
  let blob = new Blob([JSON.stringify(CompendiumMan.getList())], {"type": "application/json"});
  $exportSaveLink.href = URL.createObjectURL(blob);
}
$exportSaveLink.addEventListener("click", $exportSave_click);

function $exportCopy_click(): void {
  if ("clipboard" in navigator) {
    navigator.clipboard.writeText($exportOutput.value)
      .then(() => {
        $exportCopy.dataset.disabled = "";
        $exportStatus.textContent = "Copied.";
      })
      .catch(() => {
        $exportCopy.dataset.disabled = "";
        $exportStatus.textContent = "Failed to copy (please manually copy from above).";
        $exportStatus.dataset.state = "error";
      });
  } else {
    try {
      $exportOutput.select();
      document.execCommand("copy");
      $exportCopy.dataset.disabled = "";
      $exportStatus.textContent = "Copied.";
    } catch {
      $exportCopy.dataset.disabled = "";
      $exportStatus.textContent = "Failed to copy (please manually copy from above).";
      $exportStatus.dataset.state = "error";
    }
  }
}
$exportCopy.addEventListener("click", $exportCopy_click);

function $exportClose_click(): void {
  $export.dataset.hidden = "";
}
$exportClose.addEventListener("click", $exportClose_click);

// parse to events
function sortList(): object {
  let sortedList: object = {};

  const categories: string[] = CompendiumMan.getCategories();
  const list: CompendiumList = CompendiumMan.getList();

  for (let category of categories) {
    sortedList[category] = {};
    let items: object = list.categories[category];

    // group and sort alphabetically
    for (let item in items) {
      if (items.hasOwnProperty(item)) {
        let firstLetter = items[item].name.charAt(0).toUpperCase();

        if (!(/[A-Z]/i).test(firstLetter)) {
          firstLetter = l10n.getString("Others");
        }
        if (!sortedList[category][firstLetter]) {
          sortedList[category][firstLetter] = [];
        }
        sortedList[category][firstLetter].push(items[item]);
      }
    }
    for (let letter in sortedList[category]) {
      sortedList[category][letter].sort((a: EntryData, b: EntryData) => {
        // we don't care about letter case
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      });
    }
    sortedList[category].sortedCategories = Object.keys(sortedList[category]);
    sortedList[category].sortedCategories.sort((a: string, b: string) => {
        // we don't care about letter case
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });
  }
  return sortedList;
}

interface ParseOutput {
  "category": string;
  "text": string
}
function $controlParseMd_click() {
  delete $parse.dataset.hidden;

  let files: Array<ParseOutput> = [];

  let sortedList = sortList();

  let listIndex: number = -1;
  for (let category in sortedList) {
    if (sortedList.hasOwnProperty(category)) {
      listIndex++;
      files.push({"category": category, "text": `[o!s]: /wiki/shared/mode/osu.png "osu!standard"\n[o!t]: /wiki/shared/mode/taiko.png "osu!taiko"\n[o!c]: /wiki/shared/mode/catch.png "osu!catch"\n[o!m]: /wiki/shared/mode/mania.png "osu!mania"\n\n# ${category}\n`});

      for (let categoryKey of sortedList[category].sortedCategories) {
        files[listIndex].text += `\n## ${categoryKey}\n\n| Modes |  |\n|---|---|\n`;
        for (let item in sortedList[category][categoryKey]) {
          if (sortedList[category][categoryKey].hasOwnProperty(item)) {
            let entryData: EntryData = sortedList[category][categoryKey][item];
            let modes: Array<string> = [];

            if (entryData.modes & Modes.Standard) {
              modes.push("![][o!s]");
            }
            if (entryData.modes & Modes.Taiko) {
              modes.push("![][o!t]");
            }
            if (entryData.modes & Modes.Catch) {
              modes.push("![][o!c]");
            }
            if (entryData.modes & Modes.Mania) {
              modes.push("![][o!m]");
            }

            files[listIndex].text += `| ${modes.join(" ")} | [${entryData.name}](/community/forums/topics/${entryData.nameLink}) ${l10n.getString("by")} [${entryData.author}](/users/${entryData.authorLink}) |\n`;
          }
        }
      }
    }
  }
  $parseOutput.textContent = files[0].text;
}
$controlParseMd.addEventListener("click", $controlParseMd_click);

function $controlParseBb_click() {
  delete $parse.dataset.hidden;

  let files: Array<ParseOutput> = [];
  const list: CompendiumList = CompendiumMan.getList();

  let sortedList = sortList();

  let listIndex: number = -1;
  for (let category in sortedList) {
    if (sortedList.hasOwnProperty(category)) {
      listIndex++;
      // TODO category descriptions
      files.push({"category": category, "text": `[list][*][img]https://osu.ppy.sh/forum/images/icons/misc/osu.gif[/img] means the skin contains osu!standard elements\n[*][img]https://osu.ppy.sh/forum/images/icons/misc/taiko.gif[/img] means the skin contains osu!taiko elements\n[*][img]https://osu.ppy.sh/forum/images/icons/misc/ctb.gif[/img] means the skin contains osu!catch elements\n[*][img]https://osu.ppy.sh/forum/images/icons/misc/mania.gif[/img] means the skin contains osu!mania elements[/list]`});
      let items: object = list.categories[category];
      let groupedItems: object = {};

      // TODO sort when adding to CompendiumMan (and use an array)
      // group and sort alphabetically
      for (let item in items) {
        if (items.hasOwnProperty(item)) {
          let firstLetter = items[item].name.charAt(0).toUpperCase();

          if (!(/[A-Z]/i).test(firstLetter)) {
            firstLetter = "Others";
          }
          if (!groupedItems[firstLetter]) {
            groupedItems[firstLetter] = [];
          }
          groupedItems[firstLetter].push(items[item]);
        }
      }

      let keys: Array<string> = Object.keys(groupedItems);
      keys = keys.sort();
      for (let key of keys) {
        files[listIndex].text += "[notice]";
        for (let item in groupedItems[key]) {
          if (groupedItems[key].hasOwnProperty(item)) {
            let entryData: EntryData = groupedItems[key][item];
            let modes: Array<string> = [];

            if (entryData.modes & Modes.Standard) {
              modes.push("[img]https://osu.ppy.sh/forum/images/icons/misc/osu.gif[/img]");
            }
            if (entryData.modes & Modes.Taiko) {
              modes.push("[img]https://osu.ppy.sh/forum/images/icons/misc/taiko.gif[/img]");
            }
            if (entryData.modes & Modes.Catch) {
              modes.push("[img]https://osu.ppy.sh/forum/images/icons/misc/ctb.gif[/img]");
            }
            if (entryData.modes & Modes.Mania) {
              modes.push("[img]https://osu.ppy.sh/forum/images/icons/misc/mania.gif[/img]");
            }

            files[listIndex].text += `[url=https://osu.ppy.sh/users/${entryData.nameLink}]${entryData.name}[/url] ${l10n.getString("by")} [url=https://osu.ppy.sh/community/forums/topics/${entryData.authorLink}]${entryData.author}[/url] ${modes.join(" ")}\n`;
          }
        }
        files[listIndex].text += "[/notice]";
      }
    }
  }
  $parseOutput.textContent = files[0].text;

  if (files.length > 1) {
    delete $parseNav.dataset.hidden;
  }
}
$controlParseBb.addEventListener("click", $controlParseBb_click);

// parse window events
function $parseCopy_click() {
  // TODO
}
$parseCopy.addEventListener("click", $parseCopy_click);

function $parseClose_click() {
  $parse.dataset.hidden = "";
  $parseStatus.textContent = "";
}
$parseClose.addEventListener("click", $parseClose_click);

function $parsePrev_click() {
  // TODO
}
$parsePrev.addEventListener("click", $parsePrev_click);

function $parseNext_click() {
  // TODO
}
$parseNext.addEventListener("click", $parseNext_click);

function $controlLocale_change() {
  try {
    l10n.setLocale($controlLocale.value);
    CompendiumMan.updateDisplay();
  } catch (ex) {
    $controlLocale.value = "en";
  }
}
$controlLocale.addEventListener("change", $controlLocale_change);
