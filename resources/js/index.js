import CategoryExistsError from "./CategoryExistsError.js";
import CategoryNonexistsError from "./CategoryNonexistsError.js";
import ImportError from "./ImportError.js";
/* DOM elements */
// containers
const $newEntry = document.querySelector(".new_entry");
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
// entry
const $newEntryTo = document.querySelector(".new_entry-to");
const $newEntryName = document.querySelector("#new_entry-name");
const $newEntryAuthor = document.querySelector("#new_entry-author");
const $newEntryLink = document.querySelector("#new_entry-link");
const $newEntryStandard = document.querySelector("#new_entry-standard");
const $newEntryTaiko = document.querySelector("#new_entry-taiko");
const $newEntryCatch = document.querySelector("#new_entry-catch");
const $newEntryMania = document.querySelector("#new_entry-mania");
const $newEntrySubmit = document.querySelector(".new_entry-submit");
const $newEntryCancel = document.querySelector(".new_entry-cancel");
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
        // TODO display output (or save)
        const json = JSON.stringify(this.list);
        console.log(json);
    }
    // category methods
    static deleteCategory(name) {
        if (this.list.categories[name]) {
            delete this.list.categories[name];
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
    static addEntry(category, name, link, author, modes) {
        console.log(category);
        this.list.categories[category][this.getNextId()] = {
            "name": name,
            "link": link,
            "author": author,
            "modes": modes
        };
        this.updateDisplay();
    }
    static updateDisplay() {
        while ($display.firstChild) {
            $display.firstChild.remove();
        }
        for (let category in this.list.categories) {
            if (this.list.categories.hasOwnProperty(category)) {
                console.log(this.list);
                const $div = document.createElement("div");
                $div.classList.add("display-category");
                const $h2 = document.createElement("h2");
                $h2.classList.add("display-category-head");
                const $h2Name = document.createElement("span");
                $h2Name.classList.add("display-category-name");
                $h2Name.textContent = category;
                $h2.insertAdjacentElement("beforeend", $h2Name);
                const $h2Edit = document.createElement("span");
                $h2Edit.classList.add("display-category-edit");
                $h2Edit.textContent = "[edit]";
                $h2.insertAdjacentElement("beforeend", $h2Edit);
                const $list = document.createElement("ul");
                const $addEntry = document.createElement("div");
                $addEntry.classList.add("display-category-add_entry", "button");
                $addEntry.textContent = "Add Entry";
                $addEntry.dataset.categoryName = category;
                $div.insertAdjacentElement("beforeend", $h2);
                $div.insertAdjacentElement("beforeend", $list);
                $div.insertAdjacentElement("beforeend", $addEntry);
                $display.insertAdjacentElement("beforeend", $div);
                for (let entry in this.list.categories[category]) {
                    if (this.list.categories[category].hasOwnProperty(entry)) {
                        const entryData = this.list.categories[category][entry];
                        const $entry = document.createElement("li");
                        $entry.dataset.id = entry;
                        $entry.textContent = `<a href="${entryData.link}">${entryData.name}</a> by ${entryData.author}- ${entryData.modes}`;
                        $list.insertAdjacentElement("beforeend", $entry);
                    }
                }
            }
        }
    }
}
CompendiumMan.list = {
    "nextId": 0,
    "categories": {},
};
/* events */
// new entries
function $newEntrySubmit_click() {
    $newEntry.dataset.hidden = "";
    let modes = Modes.None;
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
    }
    else {
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
function $display_click(event) {
    let target = event.target;
    if (target.classList.contains("display-category-edit")) {
        const $input = document.createElement("input");
        const $name = target.parentElement.firstElementChild;
        const $divActions = document.createElement("div");
        $divActions.classList.add("display-category-action");
        const $spanOk = document.createElement("span");
        $spanOk.classList.add("display-category-action-ok");
        $spanOk.textContent = "[OK]";
        $divActions.insertAdjacentElement("beforeend", $spanOk);
        const $spanCancel = document.createElement("span");
        $spanCancel.classList.add("display-category-action-cancel");
        $spanCancel.textContent = "[Cancel]";
        $divActions.insertAdjacentElement("beforeend", $spanCancel);
        $input.value = $name.textContent;
        $input.dataset.original = $name.textContent;
        $name.replaceWith($input);
        target.replaceWith($divActions);
    }
    else if (target.classList.contains("display-category-action-ok")) {
        const $input = target.parentElement.parentElement.firstElementChild;
        const $name = document.createElement("span");
        const $spanEdit = document.createElement("span");
        $spanEdit.classList.add("display-category-edit");
        $spanEdit.textContent = "[edit]";
        $name.textContent = $input.value;
        if ($input.dataset.original !== $input.value.trim()) {
            CompendiumMan.renameCategory($input.dataset.original, $input.value);
        }
        $input.replaceWith($name);
        target.parentElement.replaceWith($spanEdit);
    }
    else if (target.classList.contains("display-category-action-cancel")) {
        const $input = target.parentElement.parentElement.firstElementChild;
        const $name = document.createElement("span");
        const $spanEdit = document.createElement("span");
        $spanEdit.classList.add("display-category-edit");
        $spanEdit.textContent = "[edit]";
        $name.textContent = $input.dataset.original;
        $input.replaceWith($name);
        target.parentElement.replaceWith($spanEdit);
    }
    else if (target.classList.contains("display-category-add_entry")) {
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
//# sourceMappingURL=index.js.map