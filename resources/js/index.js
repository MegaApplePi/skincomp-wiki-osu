import CompendiumMan from "./CompendiumMan.js";
import l10n from "./l10n.js";
import eModes from "./eModes.js";
/* DOM elements */
// containers
const $newEntry = document.querySelector(".new_entry");
const $editEntry = document.querySelector(".edit_entry");
const $import = document.querySelector(".import");
const $export = document.querySelector(".export");
const $parse = document.querySelector(".parse");
const $display = document.querySelector(".display");
// controls
const $controlNewCategory = document.querySelector(".control-new_category");
const $controlImport = document.querySelector(".control-import");
const $controlLocale = document.querySelector("#control-locale");
const $controlParseMd = document.querySelector(".control-parse-md");
const $controlParseBb = document.querySelector(".control-parse-bb");
const $controlExport = document.querySelector(".control-export");
// category
const $newCategory = document.querySelector(".new_category");
const $newCategoryName = document.querySelector("#new_category-name");
const $newCategoryDescription = document.querySelector("#new_category-description");
const $newCategorySubmit = document.querySelector(".new_category-submit");
const $newCategoryCancel = document.querySelector(".new_category-cancel");
const $newCategoryStatus = document.querySelector(".new_category-status");
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
const $importInput = document.querySelector("#import-input");
const $importSubmit = document.querySelector(".import-submit");
const $importCancel = document.querySelector(".import-cancel");
const $importStatus = document.querySelector(".import-status");
// export
const $exportOutput = document.querySelector("#export-output");
const $exportSaveLink = document.querySelector(".export-save-link");
const $exportCopy = document.querySelector(".export-copy");
const $exportClose = document.querySelector(".export-close");
const $exportStatus = document.querySelector(".export-status");
// parse
const $parseOutput = document.querySelector("#parse-output");
const $parseCopy = document.querySelector(".parse-copy");
const $parseClose = document.querySelector(".parse-close");
const $parseNav = document.querySelector(".parse-nav");
const $parsePrev = document.querySelector(".parse-prev");
const $parseNext = document.querySelector(".parse-next");
const $parseStatus = document.querySelector(".parse-status");
function updateDisplay() {
    while ($display.firstChild) {
        $display.firstChild.remove();
    }
    $display.insertAdjacentElement("beforeend", CompendiumMan.getDisplay());
}
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
    // ACCEPT https://osu.ppy.sh/community/forums/topics/#, /community/forums/topics/#, /forum/t/#, or #
    let nameLink = $newEntryNameLink.value.match(/^(?:(?:https?:\/\/osu\.ppy\.sh)?\/(?:community\/)?forums?\/t(?:opics)?\/)?(\d+)$/);
    if (nameLink) {
        delete $newEntryNameLink.dataset.invalid;
        // the second item is the thing we want
        nameLink = nameLink[1];
    }
    else {
        $newEntryNameLink.dataset.invalid = "";
        hasErrors = true;
    }
    if ($newEntryAuthor.value.trim() === "") {
        $newEntryAuthor.dataset.invalid = "";
        hasErrors = true;
    }
    else {
        delete $newEntryAuthor.dataset.invalid;
    }
    // ACCEPT https://osu.ppy.sh/users/#, /users/#, /u/#, or #
    let authorLink = $newEntryNameLink.value.match(/^(?:(?:https?:\/\/osu\.ppy\.sh)?\/u(?:sers)?\/)?(\d+)$/);
    if (authorLink) {
        delete $newEntryAuthorLink.dataset.invalid;
        // the second item is the thing we want
        authorLink = authorLink[1];
    }
    else {
        $newEntryAuthorLink.dataset.invalid = "";
        hasErrors = true;
    }
    if (!hasErrors) {
        $newEntry.dataset.hidden = "";
        let modes = CompendiumMan.booleansToModes($newEntryStandard.checked, $newEntryTaiko.checked, $newEntryCatch.checked, $newEntryMania.checked);
        let categoryId = parseInt($newEntry.dataset.categoryId, 10);
        CompendiumMan.addEntry(categoryId, $newEntryName.value, nameLink, $newEntryAuthor.value, authorLink, modes);
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
    let hasErrors = false;
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
        }
        catch (ex) {
            $newCategoryName.dataset.invalid = "";
            $newCategoryStatus.textContent = `Category already exists: ${ex}`;
        }
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
    let modes = CompendiumMan.booleansToModes($editEntryStandard.checked, $editEntryTaiko.checked, $editEntryCatch.checked, $editEntryMania.checked);
    let oldCategoryId = parseInt($editEntry.dataset.categoryId, 10);
    let newCategoryId = parseInt($editEntryCategory.value, 10);
    let entryId = parseInt($editEntry.dataset.entryId, 10);
    console.log(oldCategoryId, newCategoryId, entryId);
    CompendiumMan.updateEntry(oldCategoryId, newCategoryId, entryId, $editEntryName.value, $editEntryNameLink.value, $editEntryAuthor.value, $editEntryAuthorLink.value, modes);
    updateDisplay();
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
    if (target.classList.contains("display-category-editname") && !target.hasAttribute("data-disabled")) {
        target.nextElementSibling.dataset.hidden = "";
        const $input = document.createElement("input");
        const $name = target.parentElement.firstElementChild;
        const $divActions = document.createElement("div");
        $divActions.classList.add("display-category-action");
        const $spanOk = document.createElement("span");
        $spanOk.classList.add("display-category-nameaction-ok", "button");
        $spanOk.textContent = "OK";
        $divActions.insertAdjacentElement("beforeend", $spanOk);
        const $spanCancel = document.createElement("span");
        $spanCancel.classList.add("display-category-nameaction-cancel", "button-alt");
        $spanCancel.textContent = "Cancel";
        $divActions.insertAdjacentElement("beforeend", $spanCancel);
        $input.value = $name.textContent;
        $input.dataset.original = $name.textContent;
        $name.replaceWith($input);
        target.replaceWith($divActions);
    }
    else if (target.classList.contains("display-category-nameaction-ok")) {
        delete target.parentElement.nextElementSibling.dataset.hidden;
        const $input = target.parentElement.parentElement.firstElementChild;
        const $name = document.createElement("span");
        $name.classList.add("display-category-name");
        const $spanEdit = document.createElement("span");
        $spanEdit.classList.add("display-category-editname", "button");
        if (l10n.currentLocale !== "en") {
            $spanEdit.textContent = `edit (in ${l10n.currentLocale.toUpperCase()})`;
        }
        else {
            $spanEdit.textContent = "edit";
        }
        $name.textContent = $input.value;
        if ($input.dataset.original !== $input.value.trim()) {
            let categoryId = parseInt(target.parentElement.parentElement.parentElement.parentElement.dataset.categoryId, 10);
            CompendiumMan.renameCategory(categoryId, $input.value, l10n.currentLocale);
            updateDisplay();
        }
        $input.replaceWith($name);
        target.parentElement.replaceWith($spanEdit);
    }
    else if (target.classList.contains("display-category-nameaction-cancel")) {
        delete target.parentElement.nextElementSibling.dataset.hidden;
        const $input = target.parentElement.parentElement.firstElementChild;
        const $name = document.createElement("span");
        $name.classList.add("display-category-name");
        const $spanEdit = document.createElement("span");
        $spanEdit.classList.add("display-category-editname", "button");
        $spanEdit.textContent = "edit";
        $name.textContent = $input.dataset.original;
        $input.replaceWith($name);
        target.parentElement.replaceWith($spanEdit);
    }
    else if (target.classList.contains("display-category-editdescription")) {
        const $input = document.createElement("input");
        const $name = target.parentElement.firstElementChild;
        const $divActions = document.createElement("div");
        $divActions.classList.add("display-category-action");
        const $spanOk = document.createElement("span");
        $spanOk.classList.add("display-category-descriptionaction-ok", "button");
        $spanOk.textContent = "OK";
        $divActions.insertAdjacentElement("beforeend", $spanOk);
        const $spanCancel = document.createElement("span");
        $spanCancel.classList.add("display-category-descriptionaction-cancel", "button-alt");
        $spanCancel.textContent = "Cancel";
        $divActions.insertAdjacentElement("beforeend", $spanCancel);
        $input.value = $name.textContent;
        $input.dataset.original = $name.textContent;
        $name.replaceWith($input);
        target.replaceWith($divActions);
    }
    else if (target.classList.contains("display-category-descriptionaction-ok")) {
        const $input = target.parentElement.parentElement.firstElementChild;
        const $description = document.createElement("span");
        $description.classList.add("display-category-description");
        const $spanEdit = document.createElement("span");
        $spanEdit.classList.add("display-category-editdescription", "button");
        if (l10n.currentLocale !== "en") {
            $spanEdit.textContent = `edit (in ${l10n.currentLocale.toUpperCase()})`;
        }
        else {
            $spanEdit.textContent = "edit";
        }
        $description.textContent = $input.value;
        if ($input.dataset.original !== $input.value.trim()) {
            let categoryId = parseInt(target.parentElement.parentElement.parentElement.parentElement.dataset.categoryId, 10);
            CompendiumMan.updateDescription(categoryId, $input.value, l10n.currentLocale);
            updateDisplay();
        }
        $input.replaceWith($description);
        target.parentElement.replaceWith($spanEdit);
    }
    else if (target.classList.contains("display-category-descriptionaction-cancel")) {
        const $input = target.parentElement.parentElement.firstElementChild;
        const $name = document.createElement("span");
        $name.classList.add("display-category-description");
        const $spanEdit = document.createElement("span");
        $spanEdit.classList.add("display-category-editdescription", "button");
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
            let categoryId = parseInt(target.parentElement.parentElement.parentElement.parentElement.dataset.categoryId, 10);
            console.log(categoryId);
            CompendiumMan.deleteCategory(categoryId);
            updateDisplay();
        }
        catch (ex) {
            // TODO make this a better message
            window.alert(`Failed to delete: ${ex}`);
        }
    }
    else if (target.classList.contains("display-category-add_entry")) {
        delete $newEntry.dataset.hidden;
        $newEntry.dataset.categoryId = target.parentElement.dataset.categoryId;
        $newEntryTo.textContent = `Adding to: ${target.dataset.categoryName}`;
        $newEntryName.value = "";
        $newEntryAuthor.value = "";
        $newEntryNameLink.value = "";
        $newEntryAuthorLink.value = "";
        $newEntryStandard.checked = false;
        $newEntryTaiko.checked = false;
        $newEntryCatch.checked = false;
        $newEntryMania.checked = false;
    }
    else if (target.classList.contains("entry-edit")) {
        $editEntry.dataset.categoryId = target.parentElement.parentElement.parentElement.dataset.categoryId;
        $editEntry.dataset.entryId = target.parentElement.dataset.id;
        const categories = CompendiumMan.CategoryIdNameList;
        const entryData = CompendiumMan.getEntryDataById(parseInt($editEntry.dataset.categoryId, 10), parseInt($editEntry.dataset.entryId, 10));
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
        while ($editEntryCategory.firstChild) {
            $editEntryCategory.firstChild.remove();
        }
        for (let category of categories) {
            const $option = document.createElement("option");
            $option.value = category.id.toString();
            $option.textContent = category.name[l10n.currentLocale];
            if ($editEntry.dataset.categoryId === category.id.toString()) {
                $option.selected = true;
            }
            $editEntryCategory.insertAdjacentElement("beforeend", $option);
        }
        delete $editEntry.dataset.hidden;
    }
    else if (target.classList.contains("entry-delete")) {
        target.dataset.disabled = "";
        target.previousElementSibling.dataset.disabled = "";
        delete target.nextElementSibling.dataset.hidden;
    }
    else if (target.classList.contains("entry-delete-no")) {
        delete target.parentElement.previousElementSibling.dataset.disabled;
        delete target.parentElement.previousElementSibling.previousElementSibling.dataset.disabled;
        target.parentElement.dataset.hidden = "";
    }
    else if (target.classList.contains("entry-delete-yes")) {
        try {
            let categoryId = parseInt(target.parentElement.parentElement.parentElement.parentElement.dataset.categoryId, 10);
            let entryId = parseInt(target.parentElement.parentElement.dataset.id, 10);
            CompendiumMan.deleteEntry(categoryId, entryId);
            updateDisplay();
        }
        catch (ex) {
            // TODO make this a better message
            window.alert(`Failed to delete: ${ex}`);
        }
    }
}
$display.addEventListener("click", $display_click);
// import events
function $controlImport_click() {
    delete $import.dataset.hidden;
}
$controlImport.addEventListener("click", $controlImport_click);
const importReader = new FileReader();
function importReader_load() {
    try {
        let result = JSON.parse(importReader.result.toString());
        CompendiumMan.import(result);
        updateDisplay();
        $import.dataset.hidden = "";
        $importInput.value = "";
    }
    catch (ex) {
        $importStatus.textContent = `Import error: ${ex.message}`;
    }
}
importReader.addEventListener("load", importReader_load);
function $importSubmit_click() {
    if ($importInput.files[0]) {
        if ($importInput.files[0].type === "application/json") {
            importReader.readAsText($importInput.files[0]);
        }
        else {
            $importStatus.textContent = "Invalid file type.";
            $importInput.value = "";
        }
    }
    else {
        $importStatus.textContent = "Choose a file to import.";
        $importInput.value = "";
    }
}
$importSubmit.addEventListener("click", $importSubmit_click);
function $importCancel_click() {
    $import.dataset.hidden = "";
    $importStatus.textContent = "";
    $importInput.value = "";
    // TODO drop file while import is opened
    // document.body.removeEventListner("drop", body_drop);
}
$importCancel.addEventListener("click", $importCancel_click);
// export events
function $controlExport_click() {
    $exportOutput.value = CompendiumMan.export();
    delete $export.dataset.hidden;
    delete $exportCopy.dataset.disabled;
    delete $exportStatus.dataset.state;
    $exportStatus.textContent = "";
}
$controlExport.addEventListener("click", $controlExport_click);
function $exportSave_click() {
    let blob = new Blob([JSON.stringify(CompendiumMan.List)], { "type": "application/json" });
    $exportSaveLink.href = URL.createObjectURL(blob);
}
$exportSaveLink.addEventListener("click", $exportSave_click);
function $exportCopy_click() {
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
        }
        else {
            try {
                $exportOutput.select();
                document.execCommand("copy");
                $exportCopy.dataset.disabled = "";
                $exportStatus.textContent = "Copied.";
            }
            catch (_a) {
                $exportCopy.dataset.disabled = "";
                $exportStatus.textContent = "Failed to copy (please manually copy from above).";
                $exportStatus.dataset.state = "error";
            }
        }
    }
}
$exportCopy.addEventListener("click", $exportCopy_click);
function $exportClose_click() {
    $export.dataset.hidden = "";
}
$exportClose.addEventListener("click", $exportClose_click);
// parse to events
var eOutputType;
(function (eOutputType) {
    eOutputType[eOutputType["Markdown"] = 0] = "Markdown";
    eOutputType[eOutputType["BBCode"] = 1] = "BBCode";
})(eOutputType || (eOutputType = {}));
function parseList(kind) {
    delete $parse.dataset.hidden;
    let files = [];
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
        let parsedFile = {
            "category": name,
            "text": ""
        };
        if (kind === eOutputType.Markdown) {
            parsedFile.text += `[o!s]: /wiki/shared/mode/osu.png "osu!standard"\n[o!t]: /wiki/shared/mode/taiko.png "osu!taiko"\n[o!c]: /wiki/shared/mode/catch.png "osu!catch"\n[o!m]: /wiki/shared/mode/mania.png "osu!mania"\n\n# ${name}\n\n${description}\n`;
        }
        else {
            parsedFile.text += `${description}\n\n[list][*][img]https://osu.ppy.sh/forum/images/icons/misc/osu.gif[/img] ${l10n.getString("means the skin contains osu!standard elements")}\n[*][img]https://osu.ppy.sh/forum/images/icons/misc/taiko.gif[/img] ${l10n.getString("means the skin contains osu!taiko elements")}\n[*][img]https://osu.ppy.sh/forum/images/icons/misc/ctb.gif[/img] ${l10n.getString("means the skin contains osu!catch elements")}\n[*][img]https://osu.ppy.sh/forum/images/icons/misc/mania.gif[/img] ${l10n.getString("means the skin contains osu!mania elements")}[/list]`;
        }
        for (let section of Object.keys(item.entries)) {
            if (kind === eOutputType.Markdown) {
                parsedFile.text += `\n## ${section}\n\n| ${l10n.getString("Modes")} |  |\n|---|---|\n`;
            }
            else {
                parsedFile.text += "[notice]";
            }
            for (let entry of item.entries[section]) {
                let entryData = entry;
                let modes = [];
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
                }
                else {
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
        $parseOutput.textContent = files[0].text;
    }
    if (files.length > 1) {
        delete $parseNav.dataset.hidden;
        // TODO parseNav
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
        }
        else {
            try {
                $parseOutput.select();
                document.execCommand("copy");
                $parseCopy.dataset.disabled = "";
                $parseStatus.textContent = "Copied.";
            }
            catch (_a) {
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
        updateDisplay();
    }
    catch (ex) {
        $controlLocale.value = "en";
    }
}
$controlLocale.addEventListener("change", $controlLocale_change);
function window_beforeunload(event) {
    event.preventDefault();
    // @ts-ignore required by chrome
    event.returnValue = '';
}
window.addEventListener("beforeunload", window_beforeunload);
//# sourceMappingURL=index.js.map