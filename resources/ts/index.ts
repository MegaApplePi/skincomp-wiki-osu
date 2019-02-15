// TODO clean this up
import CompendiumMan from "./CompendiumMan.js";
import l10n from "./l10n.js";
import eModes from "./eModes.js";
import iEntry from "./iEntry.js";

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
const $controlNewEntry: HTMLDivElement = document.querySelector(".control-new_entry");
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
const $newEntryCategory: HTMLFieldSetElement = document.querySelector(".new_entry-category");
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
const $newEntryStatus: HTMLDivElement = document.querySelector(".new_entry-status");

// edit entry
const $editEntryCategory: HTMLSelectElement = document.querySelector(".edit_entry-category");
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
const $editEntryStatus: HTMLDivElement = document.querySelector(".edit_entry-status");

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
const $parseSaveto: HTMLTextAreaElement = document.querySelector(".parse-saveto");
const $parseOutput: HTMLTextAreaElement = document.querySelector("#parse-output");
const $parseCopy: HTMLDivElement = document.querySelector(".parse-copy");
const $parseClose: HTMLDivElement = document.querySelector(".parse-close");
const $parseNav: HTMLDivElement = document.querySelector(".parse-nav");
const $parsePrev: HTMLDivElement = document.querySelector(".parse-prev");
const $parseNext: HTMLDivElement = document.querySelector(".parse-next");
const $parseStatus: HTMLDivElement = document.querySelector(".parse-status");


function updateDisplay(): void {
  while ($display.firstChild) {
    $display.firstChild.remove();
  }
  $display.insertAdjacentElement("beforeend", CompendiumMan.getDisplay());

  if ($display.firstChild.firstChild) {
    delete $controlNewEntry.dataset.disabled;
  } else {
    $controlNewEntry.dataset.disabled = "";
  }
}
/* events */

function booleanToCatIds(checkboxes: HTMLInputElement[]): number[] {
  const categoryIds: number[] = [];
  for (let checkbox of checkboxes) {
    if (checkbox.checked) {
      categoryIds.push(parseInt(checkbox.value, 10));
    }
  }

  return categoryIds;
}

// new entries
function $newEntrySubmit_click(): void {
  let hasErrors: boolean = false;

  if ($newEntryName.value.trim() === "") {
    $newEntryName.dataset.invalid = "";
    hasErrors = true;
  } else {
    delete $newEntryName.dataset.invalid;
  }

  // ACCEPT https://osu.ppy.sh/community/forums/topics/#, /community/forums/topics/#, /forum/t/#, or #
  let nameLink = $newEntryNameLink.value.match(/^(?:(?:https?:\/\/osu\.ppy\.sh)?\/(?:community\/)?forums?\/t(?:opics)?\/)?(\d+)$/);
  if (nameLink) {
    delete $newEntryNameLink.dataset.invalid;

    // the second item is the thing we want
    nameLink = nameLink[1];
  } else {
    $newEntryNameLink.dataset.invalid = "";
    hasErrors = true;
  }
  
  if ($newEntryAuthor.value.trim() === "") {
    $newEntryAuthor.dataset.invalid = "";
    hasErrors = true;
  } else {
    delete $newEntryAuthor.dataset.invalid;
  }

  // ACCEPT https://osu.ppy.sh/users/#, /users/#, /u/#, or #
  let authorLink = $newEntryAuthorLink.value.match(/^(?:(?:https?:\/\/osu\.ppy\.sh)?\/u(?:sers)?\/)?(\d+)$/);
  if (authorLink) {
    delete $newEntryAuthorLink.dataset.invalid;

    // the second item is the thing we want
    authorLink = authorLink[1];
  } else {
    $newEntryAuthorLink.dataset.invalid = "";
    hasErrors = true;
  }

  if (hasErrors) {
    $editEntryStatus.textContent = "Fix errors in red.";
  }

  const categoryIds = booleanToCatIds(Array.from($newEntryCategory.querySelectorAll("input[type=checkbox]")));

  if (categoryIds.length === 0) {
    $newEntryStatus.dataset.error = "";
    $newEntryStatus.textContent = "Fix errors in red (if any) and select a category.";
    hasErrors = true;
  }

  if (!hasErrors) {
    $newEntry.dataset.hidden = "";

    let modes: eModes = CompendiumMan.booleansToModes($newEntryStandard.checked, $newEntryTaiko.checked, $newEntryCatch.checked, $newEntryMania.checked);

    CompendiumMan.addEntry(categoryIds, $newEntryName.value, nameLink, $newEntryAuthor.value, authorLink, modes);
    updateDisplay();

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
      updateDisplay();

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
  $newCategoryDescription.value = "";
  delete $newCategoryName.dataset.invalid;

  $editEntryStatus.textContent = "";
  delete $editEntryStatus.dataset.error;
}
$newCategoryCancel.addEventListener("click", $newCategoryCancel_click);

function resetEditEntry(): void {
  // TODO need to reset for categories
  $editEntryName.value = "";
  $editEntryNameLink.value = "";
  $editEntryAuthor.value = "";
  $editEntryAuthorLink.value = "";
  $editEntryStandard.checked = false;
  $editEntryTaiko.checked = false;
  $editEntryCatch.checked = false;
  $editEntryMania.checked = false;

  $editEntryStatus.textContent = "";
  delete $editEntryStatus.dataset.error;
}

function $editEntrySubmit_click(): void {
  let hasErrors: boolean = false;

  if ($editEntryName.value.trim() === "") {
    $editEntryName.dataset.invalid = "";
    hasErrors = true;
  } else {
    delete $editEntryName.dataset.invalid;
  }

  // ACCEPT https://osu.ppy.sh/community/forums/topics/#, /community/forums/topics/#, /forum/t/#, or #
  let nameLink = $editEntryNameLink.value.match(/^(?:(?:https?:\/\/osu\.ppy\.sh)?\/(?:community\/)?forums?\/t(?:opics)?\/)?(\d+)$/);
  if (nameLink) {
    delete $editEntryNameLink.dataset.invalid;

    // the second item is the thing we want
    nameLink = nameLink[1];
  } else {
    $editEntryNameLink.dataset.invalid = "";
    hasErrors = true;
  }
  
  if ($editEntryAuthor.value.trim() === "") {
    $editEntryAuthor.dataset.invalid = "";
    hasErrors = true;
  } else {
    delete $editEntryAuthor.dataset.invalid;
  }

  // ACCEPT https://osu.ppy.sh/users/#, /users/#, /u/#, or #
  let authorLink = $editEntryAuthorLink.value.match(/^(?:(?:https?:\/\/osu\.ppy\.sh)?\/u(?:sers)?\/)?(\d+)$/);
  if (authorLink) {
    delete $editEntryAuthorLink.dataset.invalid;

    // the second item is the thing we want
    authorLink = authorLink[1];
  } else {
    $editEntryAuthorLink.dataset.invalid = "";
    hasErrors = true;
  }

  const categoryIds = booleanToCatIds(Array.from($editEntryCategory.querySelectorAll("input[type=checkbox]")));

  if (hasErrors) {
    $editEntryStatus.textContent = "Fix errors in red.";
  }

  if (categoryIds.length === 0) {
    $editEntryStatus.dataset.error = "";
    $editEntryStatus.textContent = "Fix errors in red (if any) and select a category.";
    hasErrors = true;
  }

  if (!hasErrors) {
    let modes: eModes = CompendiumMan.booleansToModes($editEntryStandard.checked, $editEntryTaiko.checked, $editEntryCatch.checked, $editEntryMania.checked);

    $editEntryStatus.textContent = "";
    delete $editEntryStatus.dataset.error;

    let entryId = parseInt($editEntry.dataset.entryId, 10);
  
    CompendiumMan.updateEntry(entryId, categoryIds, $editEntryName.value, $editEntryNameLink.value, $editEntryAuthor.value, $editEntryAuthorLink.value, modes);
    updateDisplay();
  
    resetEditEntry();
    $editEntry.dataset.hidden = "";
  }
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
    if (l10n.currentLocale !== "en") {
      $spanEdit.textContent = `edit (in ${l10n.currentLocale.toUpperCase()})`;
    } else {
      $spanEdit.textContent = "edit";
    }

    $name.textContent = $input.value;
    if ($input.dataset.original !== $input.value.trim()) {
      let categoryId = parseInt((<HTMLInputElement>target.parentElement.parentElement.parentElement.parentElement).dataset.categoryId, 10);
      CompendiumMan.renameCategory(categoryId, $input.value, l10n.currentLocale);
      updateDisplay();
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
    const $input: HTMLInputElement = <HTMLInputElement>target.parentElement.parentElement.firstElementChild;
    const $description: HTMLSpanElement = document.createElement("span");
    $description.classList.add("display-category-description");

    const $spanEdit: HTMLSpanElement = document.createElement("span");
    $spanEdit.classList.add("display-category-editdescription", "button");
    if (l10n.currentLocale !== "en") {
      $spanEdit.textContent = `edit (in ${l10n.currentLocale.toUpperCase()})`;
    } else {
      $spanEdit.textContent = "edit";
    }

    $description.textContent = $input.value;
    if ($input.dataset.original !== $input.value.trim()) {
      let categoryId = parseInt((<HTMLInputElement>target.parentElement.parentElement.parentElement.parentElement).dataset.categoryId, 10);
      CompendiumMan.updateDescription(categoryId, $input.value, l10n.currentLocale);
      updateDisplay();
    }

    $input.replaceWith($description);
    target.parentElement.replaceWith($spanEdit);
  } else if (target.classList.contains("display-category-descriptionaction-cancel")) {
    const $input: HTMLInputElement = <HTMLInputElement>target.parentElement.parentElement.firstElementChild;
    const $name: HTMLSpanElement = document.createElement("span");
    $name.classList.add("display-category-description");

    const $spanEdit: HTMLSpanElement = document.createElement("span");
    $spanEdit.classList.add("display-category-editdescription", "button");
    $spanEdit.textContent = "edit";

    $name.textContent = $input.dataset.original;

    $input.replaceWith($name);
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
      let categoryId = parseInt((<HTMLElement>target.parentElement.parentElement.parentElement.parentElement).dataset.categoryId, 10);
      CompendiumMan.deleteCategory(categoryId);
      updateDisplay();
    } catch (ex) {
      // TODO make this a better message
      window.alert(`Failed to delete: ${ex}`);
    }
  } else if (target.classList.contains("entry-edit")) {
    $editEntry.dataset.entryId = target.parentElement.parentElement.dataset.id;

    const categories = CompendiumMan.CategoryIdNameList;

    const entryData: iEntry = CompendiumMan.getEntryById(parseInt($editEntry.dataset.entryId, 10));
    $editEntryName.value = entryData.name;
    $editEntryNameLink.value = entryData.nameLink;
    $editEntryAuthor.value = entryData.author;
    $editEntryAuthorLink.value = entryData.authorLink;
    $editEntryStandard.checked = (eModes.Standard & entryData.modes) ? true : false;
    $editEntryTaiko.checked = (eModes.Taiko & entryData.modes) ? true : false;
    $editEntryCatch.checked = (eModes.Catch & entryData.modes) ? true : false;
    $editEntryMania.checked = (eModes.Mania & entryData.modes) ? true : false;

    // original values for reset button
    $editEntryName.dataset.value = entryData.name;
    $editEntryNameLink.dataset.value = entryData.nameLink;
    $editEntryAuthor.dataset.value = entryData.author;
    $editEntryAuthorLink.dataset.value = entryData.authorLink;
    $editEntryStandard.dataset.value = (eModes.Standard & entryData.modes) ? "true" : "false";
    $editEntryTaiko.dataset.value = (eModes.Taiko & entryData.modes) ? "true" : "false";
    $editEntryCatch.dataset.value = (eModes.Catch & entryData.modes) ? "true" : "false";
    $editEntryMania.dataset.value = (eModes.Mania & entryData.modes) ? "true" : "false";

    while ($editEntryCategory.firstElementChild.nextElementSibling) {
      $editEntryCategory.firstElementChild.nextElementSibling.remove();
    }

    for (let category of CompendiumMan.List.categories) {
      const $container: HTMLDivElement = document.createElement("div");
      $editEntryCategory.insertAdjacentElement("beforeend", $container);
      
      const $checkbox: HTMLInputElement = document.createElement("input");
      $checkbox.type = "checkbox";
      $checkbox.value = category.id.toString();
      $checkbox.setAttribute("id", `edit-category-${category.id}`);
      $container.insertAdjacentElement("beforeend", $checkbox);
      
      const $label: HTMLLabelElement = document.createElement("label");
      $label.textContent = category.name[l10n.currentLocale];
      $label.setAttribute("for", `edit-category-${category.id}`);
      $container.insertAdjacentElement("beforeend", $label);

      if (entryData.categories.includes(category.id)) {
        $checkbox.checked = true;
      }
    }

    delete $editEntry.dataset.hidden;
  } else if (target.classList.contains("entry-delete")) {
    target.dataset.disabled = "";
    (<HTMLElement>target.previousElementSibling).dataset.disabled = "";
    delete (<HTMLElement>target.nextElementSibling).dataset.hidden;
  } else if (target.classList.contains("entry-delete-no")) {
    delete (<HTMLElement>target.parentElement.previousElementSibling).dataset.disabled;
    delete (<HTMLElement>target.parentElement.previousElementSibling.previousElementSibling).dataset.disabled;
    target.parentElement.dataset.hidden = "";
  } else if (target.classList.contains("entry-delete-yes")) {
    try {
      let entryId = parseInt((<HTMLElement>target.parentElement.parentElement).dataset.id, 10);
      CompendiumMan.deleteEntry(entryId);
      updateDisplay();
    } catch (ex) {
      // TODO make this a better message
      window.alert(`Failed to delete: ${ex}`);
    }
  }
}
$display.addEventListener("click", $display_click);

// import events
function $controlImport_click(): void {
  delete $import.dataset.hidden;
}
$controlImport.addEventListener("click", $controlImport_click);

const importReader: FileReader = new FileReader();
function importReader_load() {
  try {
    CompendiumMan.import(importReader.result.toString());
    updateDisplay();

    $import.dataset.hidden = "";
    $importInput.value = "";
  } catch (ex) {
    $importStatus.textContent = `Import error: ${ex.message}`;
  }
}
importReader.addEventListener("load", importReader_load);

function $importSubmit_click(): void {
  if ($importInput.files[0]) {
    if ($importInput.files[0].type === "application/json") {
      importReader.readAsText($importInput.files[0]);
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
  $exportOutput.value = CompendiumMan.export();
  delete $export.dataset.hidden;
  delete $exportCopy.dataset.disabled;
  delete $exportStatus.dataset.state;
  $exportStatus.textContent = "";
}
$controlExport.addEventListener("click", $controlExport_click);

function $exportSave_click(): void {
  let blob = new Blob([JSON.stringify(CompendiumMan.List)], {"type": "application/json"});
  $exportSaveLink.href = URL.createObjectURL(blob);
}
$exportSaveLink.addEventListener("click", $exportSave_click);

function $exportCopy_click(): void {
  if (!$exportCopy.hasAttribute("data-hidden")) {
    if ("clipboard" in navigator) {
      // @ts-ignore feature detection in use
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
}
$exportCopy.addEventListener("click", $exportCopy_click);

function $exportClose_click(): void {
  $export.dataset.hidden = "";
}
$exportClose.addEventListener("click", $exportClose_click);

// parse to events
enum eOutputType {
  Markdown,
  BBCode
}

interface parsedOutput {
  "category": string;
  "text": string;
}
// TODO make these two varibles one
let files: parsedOutput[] = [];
let filesCurrentIndex: number = 0;
function parseList(kind: eOutputType) {
  delete $parse.dataset.hidden;

  files = [];
  filesCurrentIndex = 0;

  const sortedList = CompendiumMan.organizeList();

  for (let item of sortedList) {
    let name = item.category.name[l10n.currentLocale];
    if (!name) {
      name = item.category.name["en"];
    }
    let description = item.category.description[l10n.currentLocale];
    if (!description) {
      description = item.category.description["en"];
    }

    let parsedFile: parsedOutput = {
      "category": name,
      "text": ""
    };

    if (kind === eOutputType.Markdown) {
      parsedFile.text += `[o!s]: /wiki/shared/mode/osu.png "osu!standard"\n[o!t]: /wiki/shared/mode/taiko.png "osu!taiko"\n[o!c]: /wiki/shared/mode/catch.png "osu!catch"\n[o!m]: /wiki/shared/mode/mania.png "osu!mania"\n\n# ${name}\n\n${description}\n`;
    } else {
      parsedFile.text += `${description}\n\n[list][*][img]https://osu.ppy.sh/forum/images/icons/misc/osu.gif[/img] ${l10n.getString("means the skin contains osu!standard elements")}\n[*][img]https://osu.ppy.sh/forum/images/icons/misc/taiko.gif[/img] ${l10n.getString("means the skin contains osu!taiko elements")}\n[*][img]https://osu.ppy.sh/forum/images/icons/misc/ctb.gif[/img] ${l10n.getString("means the skin contains osu!catch elements")}\n[*][img]https://osu.ppy.sh/forum/images/icons/misc/mania.gif[/img] ${l10n.getString("means the skin contains osu!mania elements")}[/list]`;
    }

    for (let section of Object.keys(item.entries)) {
      if (kind === eOutputType.Markdown) {
        if (section === "OTHERS") {
          parsedFile.text += `\n## ${l10n.getString("Others")}\n\n| ${l10n.getString("Modes")} |  |\n|---|---|\n`;
        } else {
          parsedFile.text += `\n## ${section}\n\n| ${l10n.getString("Modes")} |  |\n|---|---|\n`;
        }
      } else {
        parsedFile.text += "[notice]";
      }

      for (let entry of item.entries[section]) {
        let entryData: iEntry = entry;
        let modes: Array<string> = [];

        if (kind === eOutputType.Markdown) {
          if (entryData.modes & eModes.Standard) {
            modes.push("![][o!s]");
          }
          if (entryData.modes & eModes.Taiko) {
            modes.push("![][o!t]");
          }
          if (entryData.modes & eModes.Catch) {
            modes.push("![][o!c]");
          }
          if (entryData.modes & eModes.Mania) {
            modes.push("![][o!m]");
          }
          parsedFile.text += `| ${modes.join(" ")} | [${entryData.name}](/community/forums/topics/${entryData.nameLink}) ${l10n.getString("by")} [${entryData.author}](/users/${entryData.authorLink}) |\n`;
        } else {
          if (entryData.modes & eModes.Standard) {
            modes.push("[img]https://osu.ppy.sh/forum/images/icons/misc/osu.gif[/img]");
          }
          if (entryData.modes & eModes.Taiko) {
            modes.push("[img]https://osu.ppy.sh/forum/images/icons/misc/taiko.gif[/img]");
          }
          if (entryData.modes & eModes.Catch) {
            modes.push("[img]https://osu.ppy.sh/forum/images/icons/misc/ctb.gif[/img]");
          }
          if (entryData.modes & eModes.Mania) {
            modes.push("[img]https://osu.ppy.sh/forum/images/icons/misc/mania.gif[/img]");
          }
          parsedFile.text += `[url=https://osu.ppy.sh/community/forums/topics/${entryData.nameLink}]${entryData.name}[/url] ${l10n.getString("by")} [url=https://osu.ppy.sh/users/${entryData.authorLink}]${entryData.author}[/url] ${modes.join(" ")}\n`;  
        }
      }
      if (kind === eOutputType.BBCode) {
        parsedFile.text += "[/notice]";
      }
    }
    files.push(parsedFile);
  }
  if (files[0]) {
    $parseSaveto.textContent = files[0].category;
    $parseOutput.textContent = files[0].text;
  }
  if (files.length > 1) {
    delete $parseNav.dataset.hidden;
    $parsePrev.textContent = "Last";
    $parseNext.textContent = "Next";
  }
}
function $controlParseMd_click() {
  parseList(eOutputType.Markdown);
}
$controlParseMd.addEventListener("click", $controlParseMd_click);

function $controlParseBb_click() {
  parseList(eOutputType.BBCode);
}
$controlParseBb.addEventListener("click", $controlParseBb_click);

// parse window events
function $parseCopy_click() {
  if (!$parseCopy.hasAttribute("data-disabled")) {
    if ("clipboard" in navigator) {
      // @ts-ignore feature detection in use
      navigator.clipboard.writeText($parseOutput.value)
      .then(() => {
        $parseCopy.dataset.disabled = "";
        $parseStatus.textContent = "Copied.";
      })
      .catch(() => {
        $parseCopy.dataset.disabled = "";
        $parseStatus.textContent = "Failed to copy (please manually copy from above).";
        $parseStatus.dataset.state = "error";
      });
    } else {
      try {
        $parseOutput.select();
        document.execCommand("copy");
        $parseCopy.dataset.disabled = "";
        $parseStatus.textContent = "Copied.";
      } catch {
        $parseCopy.dataset.disabled = "";
        $parseStatus.textContent = "Failed to copy (please manually copy from above).";
        $parseStatus.dataset.state = "error";
      }
    }
  }
}
$parseCopy.addEventListener("click", $parseCopy_click);

function $parseClose_click() {
  $parse.dataset.hidden = "";
  $parseStatus.textContent = "";
  delete $parseCopy.dataset.disabled;
  delete $parseStatus.dataset.state;
}
$parseClose.addEventListener("click", $parseClose_click);

function navUpdate() {
  $parseSaveto.textContent = files[filesCurrentIndex].category;
  if (!files[filesCurrentIndex - 1]) {
    $parsePrev.textContent = "Last";
  } else {
    $parsePrev.textContent = "Previous";
  }
  if (!files[filesCurrentIndex + 1]) {
    $parseNext.textContent = "First";
  } else {
    $parseNext.textContent = "Next";
  }
  delete $parseCopy.dataset.disabled;
  $parseStatus.textContent = "";
}

function $parsePrev_click() {
  if (files[filesCurrentIndex - 1]) {
    $parseOutput.textContent = files[--filesCurrentIndex].text;
  } else {
    filesCurrentIndex = files.length - 1;
    $parseOutput.textContent = files[filesCurrentIndex].text;
  }
  navUpdate();
}
$parsePrev.addEventListener("click", $parsePrev_click);

function $parseNext_click() {
  if (files[filesCurrentIndex + 1]) {
    $parseOutput.textContent = files[++filesCurrentIndex].text;
  } else {
    filesCurrentIndex = 0;
    $parseOutput.textContent = files[filesCurrentIndex].text;
  }
  navUpdate();
}
$parseNext.addEventListener("click", $parseNext_click);

function $controlLocale_change() {
  try {
    l10n.setLocale($controlLocale.value);
    updateDisplay();
  } catch (ex) {
    $controlLocale.value = "en";
  }
}
$controlLocale.addEventListener("change", $controlLocale_change);

function $controlNewEntry_click() {
  if (!$controlNewEntry.hasAttribute("data-disabled")) {
    delete $newEntry.dataset.hidden;

    $newEntryName.value = "";
    $newEntryAuthor.value = "";
    $newEntryNameLink.value = "";
    $newEntryAuthorLink.value = "";
    $newEntryStandard.checked = false;
    $newEntryTaiko.checked = false;
    $newEntryCatch.checked = false;
    $newEntryMania.checked = false;

    while ($newEntryCategory.firstElementChild.nextElementSibling) {
      $newEntryCategory.firstElementChild.nextElementSibling.remove();
    }

    for (let category of CompendiumMan.List.categories) {
      const $container: HTMLDivElement = document.createElement("div");
      $newEntryCategory.insertAdjacentElement("beforeend", $container);
      
      const $checkbox: HTMLInputElement = document.createElement("input");
      $checkbox.type = "checkbox";
      $checkbox.value = category.id.toString();
      $checkbox.setAttribute("id", `new-category-${category.id}`);
      $container.insertAdjacentElement("beforeend", $checkbox);
      
      const $label: HTMLLabelElement = document.createElement("label");
      $label.textContent = category.name[l10n.currentLocale];
      $label.setAttribute("for", `new-category-${category.id}`);
      $container.insertAdjacentElement("beforeend", $label);
    }
  }
}
$controlNewEntry.addEventListener("click", $controlNewEntry_click);

function window_beforeunload(event: Event) {
  event.preventDefault();
  // @ts-ignore required by chrome
  event.returnValue = '';
}
window.addEventListener("beforeunload", window_beforeunload);
