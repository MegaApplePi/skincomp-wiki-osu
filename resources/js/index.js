import CategoryExistsError from "./Error/CategoryExistsError.js";
import CategoryNonexistsError from "./Error/CategoryNonexistsError.js";
import EntryNonexistsError from "./Error/EntryNonexistsError.js";
import ImportError from "./ImportError.js";
/* DOM elements */
// containers
const $newEntry = document.querySelector(".new_entry");
const $editEntry = document.querySelector(".edit_entry");
const $import = document.querySelector(".import");
const $export = document.querySelector(".export");
const $display = document.querySelector(".display");
// controls
const $controlNewCategory = document.querySelector(".control-new_category");
const $controlImport = document.querySelector(".control-import");
const $controlExport = document.querySelector(".control-export");
// category
const $newCategory = document.querySelector(".new_category");
const $newCategoryName = document.querySelector("#new_category-name");
const $newCategorySubmit = document.querySelector(".new_category-submit");
const $newCategoryCancel = document.querySelector(".new_category-cancel");
// new entry
const $newEntryTo = document.querySelector(".new_entry-to");
const $newEntryName = document.querySelector("#new_entry-name");
const $newEntryNameLink = document.querySelector("#new_entry-name_link");
const $newEntryAuthor = document.querySelector("#new_entry-author");
const $newEntryAuthorLink = document.querySelector("#new_entry-author_link");
const $newEntryStandard = document.querySelector("#new_entry-standard");
const $newEntryTaiko = document.querySelector("#new_entry-taiko");
const $newEntryCatch = document.querySelector("#new_entry-catch");
const $newEntryMania = document.querySelector("#new_entry-mania");
const $newEntrySubmit = document.querySelector(".new_entry-submit");
const $newEntryCancel = document.querySelector(".new_entry-cancel");
// edit entry
const $editEntryCategory = document.querySelector("#edit_entry-category");
const $editEntryName = document.querySelector("#edit_entry-name");
const $editEntryNameLink = document.querySelector("#edit_entry-name_link");
const $editEntryAuthor = document.querySelector("#edit_entry-author");
const $editEntryAuthorLink = document.querySelector("#edit_entry-author_link");
const $editEntryStandard = document.querySelector("#edit_entry-standard");
const $editEntryTaiko = document.querySelector("#edit_entry-taiko");
const $editEntryCatch = document.querySelector("#edit_entry-catch");
const $editEntryMania = document.querySelector("#edit_entry-mania");
const $editEntrySubmit = document.querySelector(".edit_entry-submit");
const $editEntryReset = document.querySelector(".edit_entry-reset");
const $editEntryCancel = document.querySelector(".edit_entry-cancel");
// import
// export
const $exportOutput = document.querySelector("#export-output");
/* classes */
var Modes;
(function (Modes) {
    Modes[Modes["None"] = 0] = "None";
    Modes[Modes["Standard"] = 1] = "Standard";
    Modes[Modes["Taiko"] = 2] = "Taiko";
    Modes[Modes["Catch"] = 4] = "Catch";
    Modes[Modes["Mania"] = 8] = "Mania";
})(Modes || (Modes = {}));
class CompendiumMan {
    static getEntryData(categoryName, key) {
        if (this.list.categories[categoryName]) {
            if (this.list.categories[categoryName][key]) {
                return this.list.categories[categoryName][key];
            }
            else {
                throw new EntryNonexistsError();
            }
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    static getCategories() {
        return Object.keys(this.list.categories).sort();
    }
    static getNextId() {
        return this.list.nextId++;
    }
    static import(input) {
        try {
            this.list = JSON.parse(input);
        }
        catch (ex) {
            throw new ImportError(ex);
        }
    }
    static export() {
        return JSON.stringify(this.list);
    }
    // category methods
    static deleteCategory(name) {
        if (this.list.categories[name]) {
            delete this.list.categories[name];
            this.updateDisplay();
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    static addCategory(name) {
        if (this.list.categories[name]) {
            throw new CategoryExistsError();
        }
        else {
            this.list.categories[name] = {};
        }
        this.updateDisplay();
    }
    static renameCategory(oldName, newName) {
        if (this.list.categories[oldName]) {
            if (this.list.categories[newName]) {
                throw new CategoryExistsError();
            }
            else {
                this.list.categories[newName] = Object.assign({}, this.list.categories[oldName]);
                delete this.list.categories[oldName];
            }
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    // entry methods
    static addEntry(category, name, nameLink, author, authorLink, modes) {
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
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    static updateEntry(oldCategory, newCategory, id, name, nameLink, author, authorLink, modes) {
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
            }
            else {
                throw new EntryNonexistsError();
            }
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    // display methods
    static updateDisplay() {
        while ($display.firstChild) {
            $display.firstChild.remove();
        }
        for (let category in this.list.categories) {
            if (this.list.categories.hasOwnProperty(category)) {
                // new category container
                const $div = document.createElement("div");
                $div.classList.add("display-category");
                // heading
                const $category = document.createElement("div");
                $category.classList.add("display-category-head");
                const $name = document.createElement("span");
                $name.classList.add("display-category-name");
                $name.textContent = category;
                $category.insertAdjacentElement("beforeend", $name);
                // heading -> edit
                const $edit = document.createElement("span");
                $edit.classList.add("display-category-edit", "button");
                $edit.textContent = "edit";
                $category.insertAdjacentElement("beforeend", $edit);
                // heading -> delete
                const $delete = document.createElement("span");
                $delete.classList.add("display-category-delete", "button-alt");
                $delete.textContent = "delete";
                $category.insertAdjacentElement("beforeend", $delete);
                // heading -> delete -> confirm
                const $deleteConfirm = document.createElement("span");
                $deleteConfirm.classList.add("display-category-delete-confirm");
                $deleteConfirm.dataset.hidden = "";
                $deleteConfirm.textContent = "Really (irreversible)?";
                $category.insertAdjacentElement("beforeend", $deleteConfirm);
                const $deleteNo = document.createElement("span");
                $deleteNo.classList.add("display-category-delete-no", "button");
                $deleteNo.textContent = "No, whoops";
                $deleteConfirm.insertAdjacentElement("beforeend", $deleteNo);
                const $deleteYes = document.createElement("span");
                $deleteYes.classList.add("display-category-delete-yes", "button-alt");
                $deleteYes.textContent = "Yes, delete";
                $deleteConfirm.insertAdjacentElement("beforeend", $deleteYes);
                const $entries = document.createElement("ul");
                $entries.classList.add("category-entry");
                const $addEntry = document.createElement("div");
                $addEntry.classList.add("display-category-add_entry", "button");
                $addEntry.textContent = "Add Entry";
                $addEntry.dataset.categoryName = category;
                $div.insertAdjacentElement("beforeend", $category);
                $div.insertAdjacentElement("beforeend", $entries);
                $div.insertAdjacentElement("beforeend", $addEntry);
                $display.insertAdjacentElement("beforeend", $div);
                for (let entry in this.list.categories[category]) {
                    if (this.list.categories[category].hasOwnProperty(entry)) {
                        const entryData = this.list.categories[category][entry];
                        // display the entry
                        const $entry = document.createElement("li");
                        $entry.dataset.id = entry;
                        const $name = document.createElement("a");
                        $name.href = entryData.nameLink;
                        $name.textContent = entryData.name;
                        $name.target = "_blank";
                        const $author = document.createElement("a");
                        $author.href = entryData.authorLink;
                        $author.textContent = entryData.author;
                        $author.target = "_blank";
                        let modes = [];
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
                        const $modes = document.createElement("span");
                        $modes.textContent = modes.join(" ");
                        $entry.insertAdjacentElement("beforeend", $name);
                        $entry.insertAdjacentText("beforeend", " by ");
                        $entry.insertAdjacentElement("beforeend", $author);
                        if (modes.length > 0) {
                            $entry.insertAdjacentText("beforeend", " - ");
                            $entry.insertAdjacentElement("beforeend", $modes);
                        }
                        // edit button
                        const $edit = document.createElement("span");
                        $edit.classList.add("entry-edit", "button");
                        $edit.textContent = "edit";
                        $entry.insertAdjacentElement("beforeend", $edit);
                        // delete button
                        const $delete = document.createElement("span");
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
CompendiumMan.list = {
    "nextId": 0,
    "categories": {},
    "entryLookup": {}
};
/* events */
// new entries
function $newEntrySubmit_click() {
    let hasErrors = false;
    if ($newEntryName.value.trim() === "") {
        $newEntryName.dataset.invalid = "";
        hasErrors = true;
    }
    else {
        delete $newEntryName.dataset.invalid;
    }
    if ($newEntryNameLink.value.trim() === "") {
        $newEntryNameLink.dataset.invalid = "";
        hasErrors = true;
    }
    else {
        delete $newEntryNameLink.dataset.invalid;
    }
    if ($newEntryAuthor.value.trim() === "") {
        $newEntryAuthor.dataset.invalid = "";
        hasErrors = true;
    }
    else {
        delete $newEntryAuthor.dataset.invalid;
    }
    if ($newEntryAuthorLink.value.trim() === "") {
        $newEntryAuthorLink.dataset.invalid = "";
        hasErrors = true;
    }
    else {
        delete $newEntryAuthorLink.dataset.invalid;
    }
    if (!hasErrors) {
        $newEntry.dataset.hidden = "";
        let modes = Modes.None;
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
function $newEntryCancel_click() {
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
function $controlNewCategory_click() {
    delete $newCategory.dataset.hidden;
}
$controlNewCategory.addEventListener("click", $controlNewCategory_click);
// new categories
function $newCategorySubmit_click() {
    if ($newCategoryName.value.trim() !== "") {
        $newCategory.dataset.hidden = "";
        try {
            CompendiumMan.addCategory($newCategoryName.value.trim());
            $newCategoryName.value = "";
            delete $newCategoryName.dataset.invalid;
        }
        catch (ex) {
            $newCategoryName.dataset.invalid = "";
        }
    }
    else {
        $newCategoryName.dataset.invalid = "";
    }
}
$newCategorySubmit.addEventListener("click", $newCategorySubmit_click);
function $newCategoryCancel_click() {
    $newCategory.dataset.hidden = "";
    $newCategoryName.value = "";
    delete $newCategoryName.dataset.invalid;
}
$newCategoryCancel.addEventListener("click", $newCategoryCancel_click);
function resetEditEntry() {
    $editEntryName.value = "";
    $editEntryNameLink.value = "";
    $editEntryAuthor.value = "";
    $editEntryAuthorLink.value = "";
    $editEntryStandard.checked = false;
    $editEntryTaiko.checked = false;
    $editEntryCatch.checked = false;
    $editEntryMania.checked = false;
}
function $editEntrySubmit_click() {
    let modes = Modes.None;
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
function $editEntryReset_click() {
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
function $editEntryCancel_click() {
    $editEntry.dataset.hidden = "";
    resetEditEntry();
}
$editEntryCancel.addEventListener("click", $editEntryCancel_click);
// display
function $display_click(event) {
    let target = event.target;
    if (target.classList.contains("display-category-edit") && !target.hasAttribute("data-disabled")) {
        target.nextElementSibling.dataset.hidden = "";
        const $input = document.createElement("input");
        const $name = target.parentElement.firstElementChild;
        const $divActions = document.createElement("div");
        $divActions.classList.add("display-category-action");
        const $spanOk = document.createElement("span");
        $spanOk.classList.add("display-category-action-ok", "button");
        $spanOk.textContent = "OK";
        $divActions.insertAdjacentElement("beforeend", $spanOk);
        const $spanCancel = document.createElement("span");
        $spanCancel.classList.add("display-category-action-cancel", "button-alt");
        $spanCancel.textContent = "Cancel";
        $divActions.insertAdjacentElement("beforeend", $spanCancel);
        $input.value = $name.textContent;
        $input.dataset.original = $name.textContent;
        $name.replaceWith($input);
        target.replaceWith($divActions);
    }
    else if (target.classList.contains("display-category-action-ok")) {
        delete target.parentElement.nextElementSibling.dataset.hidden;
        const $input = target.parentElement.parentElement.firstElementChild;
        const $name = document.createElement("span");
        $name.classList.add("display-category-name");
        const $spanEdit = document.createElement("span");
        $spanEdit.classList.add("display-category-edit", "button");
        $spanEdit.textContent = "edit";
        $name.textContent = $input.value;
        if ($input.dataset.original !== $input.value.trim()) {
            CompendiumMan.renameCategory($input.dataset.original, $input.value);
        }
        $input.replaceWith($name);
        target.parentElement.replaceWith($spanEdit);
    }
    else if (target.classList.contains("display-category-action-cancel")) {
        delete target.parentElement.nextElementSibling.dataset.hidden;
        const $input = target.parentElement.parentElement.firstElementChild;
        const $name = document.createElement("span");
        $name.classList.add("display-category-name");
        const $spanEdit = document.createElement("span");
        $spanEdit.classList.add("display-category-edit", "button");
        $spanEdit.textContent = "edit";
        $name.textContent = $input.dataset.original;
        $input.replaceWith($name);
        target.parentElement.replaceWith($spanEdit);
    }
    else if (target.classList.contains("display-category-delete") && !target.hasAttribute("data-disabled")) {
        target.dataset.disabled = "";
        target.previousElementSibling.dataset.disabled = "";
        delete target.nextElementSibling.dataset.hidden;
    }
    else if (target.classList.contains("display-category-delete-no")) {
        delete target.parentElement.previousElementSibling.dataset.disabled;
        delete target.parentElement.previousElementSibling.previousElementSibling.dataset.disabled;
        target.parentElement.dataset.hidden = "";
    }
    else if (target.classList.contains("display-category-delete-yes")) {
        try {
            CompendiumMan.deleteCategory(target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
        }
        catch (ex) {
            // TODO display error
            console.error("Failed to delete (did you modify the document?)");
        }
    }
    else if (target.classList.contains("display-category-add_entry")) {
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
    }
    else if (target.classList.contains("entry-edit")) {
        $editEntry.dataset.categoryName = target.parentElement.parentElement.previousElementSibling.firstElementChild.textContent;
        $editEntry.dataset.entryId = target.parentElement.dataset.id;
        const categories = CompendiumMan.getCategories();
        const entryData = CompendiumMan.getEntryData($editEntry.dataset.categoryName, $editEntry.dataset.entryId);
        console.log(entryData);
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
            const $option = document.createElement("option");
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
function $controlImport_click() {
    delete $import.dataset.hidden;
}
$controlImport.addEventListener("click", $controlImport_click);
function $controlExport_click() {
    delete $export.dataset.hidden;
    $exportOutput.value = CompendiumMan.export();
}
$controlExport.addEventListener("click", $controlExport_click);
//# sourceMappingURL=index.js.map