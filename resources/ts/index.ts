import CategoryExistsError from "./CategoryExistsError.js";
import CategoryNonexistsError from "./CategoryNonexistsError.js";
import ImportError from "./ImportError.js";

/* DOM elements */

// containers
const $newEntry: HTMLDivElement = document.querySelector(".new_entry");
const $display: HTMLDivElement = document.querySelector(".display");

// controls
const $controlNewCategory: HTMLDivElement = document.querySelector(".control-new_category");
const $controlImport: HTMLDivElement = document.querySelector(".control-import");
const $controlExport: HTMLDivElement = document.querySelector(".control-export");

// category
const $newCategory: HTMLDivElement = document.querySelector(".new_category");
const $newCategoryName: HTMLFormElement = document.querySelector("#new_category-name");
const $newCategorySubmit: HTMLDivElement = document.querySelector(".new_category-submit");
const $newCategoryCancel: HTMLDivElement = document.querySelector(".new_category-cancel");

// entry
const $newEntryTo: HTMLFormElement = document.querySelector(".new_entry-to");
const $newEntryName: HTMLFormElement = document.querySelector("#new_entry-name");
const $newEntryAuthor: HTMLFormElement = document.querySelector("#new_entry-author");
const $newEntryLink: HTMLFormElement = document.querySelector("#new_entry-link");
const $newEntryStandard: HTMLFormElement = document.querySelector("#new_entry-standard");
const $newEntryTaiko: HTMLFormElement = document.querySelector("#new_entry-taiko");
const $newEntryCatch: HTMLFormElement = document.querySelector("#new_entry-catch");
const $newEntryMania: HTMLFormElement = document.querySelector("#new_entry-mania");
const $newEntrySubmit: HTMLDivElement = document.querySelector(".new_entry-submit");
const $newEntryCancel: HTMLDivElement = document.querySelector(".new_entry-cancel");

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
}
interface EntryData {
  "id": number;
  "name": string;
  "link": string;
  "author": string;
  // TODO might need to add author_link or something
  "modes": Modes;
}
abstract class CompendiumMan {
   private static list: CompendiumList = {
    "nextId": 0,
    "categories": {},
   };

  private static getNextId() {
    return this.list.nextId++;
  }

  public static import(input: string) {
    try {
      this.list = JSON.parse(input);
    } catch (ex) {
      throw new ImportError(ex);
    }
  }

  public static export() {
    // TODO display output (or save)
    const json = JSON.stringify(this.list);
    console.log(json);
  }

  // category methods
  public static deleteCategory(name: string) {
    if (this.list.categories[name]) {
      delete this.list.categories[name];
    } else {
      throw new CategoryNonexistsError();
    }
  }

  public static addCategory(name: string) {
    if (this.list.categories[name]) {
      throw new CategoryExistsError();
    } else {
      this.list.categories[name] = {};
    }

    this.updateDisplay();
  }

  public static renameCategory(oldName: string, newName: string) {
    if (this.list.categories[oldName]) {
      if (this.list.categories[newName]) {
        throw new CategoryExistsError();
      } else {
        this.list.categories[newName] = Object.assign({}, this.list.categories[oldName]);
        delete this.list.categories[oldName];
      }
    } else {
      throw new CategoryNonexistsError();
    }
  }

  // entry methods
  public static addEntry(category: string, name: string, link: string, author: string, modes: Modes) {
    console.log(category);
    this.list.categories[category][this.getNextId()] = {
      "name": name,
      "link": link,
      "author": author,
      "modes": modes
    };

    this.updateDisplay();
  }

  private static updateDisplay() {
    while ($display.firstChild) {
      $display.firstChild.remove();
    }

    for (let category in this.list.categories) {
      if (this.list.categories.hasOwnProperty(category)) {
        console.log(this.list);
        const $div: HTMLDivElement = document.createElement("div");
        $div.classList.add("display-category");

        const $h2: HTMLHeadingElement = document.createElement("h2");
        $h2.classList.add("display-category-head");

        const $h2Name: HTMLSpanElement = document.createElement("span");
        $h2Name.classList.add("display-category-name");
        $h2Name.textContent = category;
        $h2.insertAdjacentElement("beforeend", $h2Name);

        const $h2Edit: HTMLSpanElement = document.createElement("span");
        $h2Edit.classList.add("display-category-edit");
        $h2Edit.textContent = "[edit]";
        $h2.insertAdjacentElement("beforeend", $h2Edit);

        const $list: HTMLUListElement = document.createElement("ul");

        const $addEntry: HTMLDivElement = document.createElement("div");
        $addEntry.classList.add("display-category-add_entry", "button");
        $addEntry.textContent = "Add Entry";
        $addEntry.dataset.categoryName = category;

        $div.insertAdjacentElement("beforeend", $h2);
        $div.insertAdjacentElement("beforeend", $list);
        $div.insertAdjacentElement("beforeend", $addEntry);
        $display.insertAdjacentElement("beforeend", $div);

        for (let entry in this.list.categories[category]) {
          if (this.list.categories[category].hasOwnProperty(entry)) {
            const entryData: EntryData = this.list.categories[category][entry];
            const $entry: HTMLLIElement = document.createElement("li");
            $entry.dataset.id = entry;
            $entry.textContent = `<a href="${entryData.link}">${entryData.name}</a> by ${entryData.author}- ${entryData.modes}`;

            $list.insertAdjacentElement("beforeend", $entry);
          }
        }
      }
    }
  }
}

/* events */

// new entries
function $newEntrySubmit_click() {
  $newEntry.dataset.hidden = "";

  let modes: Modes = Modes.None;
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

  CompendiumMan.addEntry($newEntry.dataset.categoryName, $newEntryName.value, $newEntryLink.value, $newEntryAuthor.value, modes);

  $newEntryName.value = "";
  $newEntryAuthor.value = "";
  $newEntryLink.value = "";
  $newEntryStandard.checked = false;
  $newEntryTaiko.checked = false;
  $newEntryCatch.checked = false;
  $newEntryMania.checked = false;
}

$newEntrySubmit.addEventListener("click", $newEntrySubmit_click);

function $newEntryCancel_click() {
  $newEntry.dataset.hidden = "";

  $newEntryName.value = "";
  $newEntryAuthor.value = "";
  $newEntryLink.value = "";
  $newEntryStandard.checked = false;
  $newEntryTaiko.checked = false;
  $newEntryCatch.checked = false;
  $newEntryMania.checked = false;
}
$newEntryCancel.addEventListener("click", $newEntryCancel_click);

function $controlNewCategory_click() {
  delete $newCategory.dataset.hidden;
}

$controlNewCategory.addEventListener("click", $controlNewCategory_click);

// new categories
function $newCategorySubmit_click() {
  if ($newCategoryName.value.trim() !== "") {
    $newCategory.dataset.hidden = "";
    CompendiumMan.addCategory($newCategoryName.value.trim());
    $newCategoryName.value = "";
  } else {
    // TODO display form error
  }
}
$newCategorySubmit.addEventListener("click", $newCategorySubmit_click);

function $newCategoryCancel_click() {
  $newCategory.dataset.hidden = "";
  $newCategoryName.value = "";
}
$newCategoryCancel.addEventListener("click", $newCategoryCancel_click);

// display
function $display_click (event: Event) {
  let target: HTMLElement = <HTMLElement>event.target;
  if (target.classList.contains("display-category-edit")) {
    const $input: HTMLInputElement = document.createElement("input");
    const $name: HTMLSpanElement = <HTMLSpanElement>target.parentElement.firstElementChild;

    const $divActions: HTMLDivElement = document.createElement("div");
    $divActions.classList.add("display-category-action");

    const $spanOk: HTMLSpanElement = document.createElement("span");
    $spanOk.classList.add("display-category-action-ok");
    $spanOk.textContent = "[OK]";
    $divActions.insertAdjacentElement("beforeend", $spanOk);

    const $spanCancel: HTMLSpanElement = document.createElement("span");
    $spanCancel.classList.add("display-category-action-cancel");
    $spanCancel.textContent = "[Cancel]";
    $divActions.insertAdjacentElement("beforeend", $spanCancel);

    $input.value = $name.textContent;
    $input.dataset.original = $name.textContent;

    $name.replaceWith($input);
    target.replaceWith($divActions);
  } else if (target.classList.contains("display-category-action-ok")) {
    const $input: HTMLInputElement = <HTMLInputElement>target.parentElement.parentElement.firstElementChild;
    const $name: HTMLSpanElement = document.createElement("span");

    const $spanEdit: HTMLSpanElement = document.createElement("span");
    $spanEdit.classList.add("display-category-edit");
    $spanEdit.textContent = "[edit]";

    $name.textContent = $input.value;
    if ($input.dataset.original !== $input.value.trim()) {
      CompendiumMan.renameCategory($input.dataset.original, $input.value);
    }

    $input.replaceWith($name);
    target.parentElement.replaceWith($spanEdit);
  } else if (target.classList.contains("display-category-action-cancel")) {
    const $input: HTMLInputElement = <HTMLInputElement>target.parentElement.parentElement.firstElementChild;
    const $name: HTMLSpanElement = document.createElement("span");

    const $spanEdit: HTMLSpanElement = document.createElement("span");
    $spanEdit.classList.add("display-category-edit");
    $spanEdit.textContent = "[edit]";

    $name.textContent = $input.dataset.original;

    $input.replaceWith($name);
    target.parentElement.replaceWith($spanEdit);
  } else if (target.classList.contains("display-category-add_entry")) {
    delete $newEntry.dataset.hidden;

    $newEntryTo.textContent = `Adding to: ${target.dataset.categoryName}`;
    $newEntry.dataset.categoryName = target.dataset.categoryName;
  
    $newEntryName.value = "";
    $newEntryAuthor.value = "";
    $newEntryLink.value = "";
    $newEntryStandard.checked = false;
    $newEntryTaiko.checked = false;
    $newEntryCatch.checked = false;
    $newEntryMania.checked = false;
  }
}
$display.addEventListener("click", $display_click);
