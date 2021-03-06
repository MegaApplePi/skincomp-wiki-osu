// TODO organize the methods better
import CategoryExistsError from "./Error/CategoryExistsError.js";
import CategoryNonexistsError from "./Error/CategoryNonexistsError.js";
import EntryNonexistsError from "./Error/EntryNonexistsError.js";
import ImportError from "./Error/ImportError.js";
import LocaleNonexistsError from "./Error/LocaleNonexistsError.js";
import l10n from "./l10n.js";
import eModes from "./eModes.js";
import Import from "./Import.js";
class CompendiumMan {
    static get List() {
        return Object.assign({}, this.list);
    }
    static hasCategoryById(categoryId) {
        if (this.CategoryIds.includes(categoryId)) {
            return true;
        }
        return false;
    }
    static get CategoryNames() {
        let categories = [];
        for (let category of this.list.categories) {
            categories.push(category.name);
        }
        return categories;
    }
    static get CategoryIdNameList() {
        let categories = [];
        for (let category of this.list.categories) {
            categories.push({
                "name": category.name,
                "id": category.id
            });
        }
        return categories;
    }
    static get CategoryIds() {
        let categories = [];
        for (let category of this.list.categories) {
            categories.push(category.id);
        }
        return categories;
    }
    static hasEntityById(entityId) {
        if (this.EntityIds.includes(entityId)) {
            return true;
        }
        return false;
    }
    static get EntityIds() {
        let entries = [];
        for (let entry of this.list.entries) {
            entries.push(entry.id);
        }
        return entries;
    }
    static getEntriesByCategoryId(categoryId) {
        throw new Error("NOT IMPLEMENTED");
    }
    static getEntryById(entityId) {
        if (this.hasEntityById(entityId)) {
            let result = this.list.entries.find((item) => {
                return item.id === entityId;
            });
            return result;
        }
        else {
            throw new EntryNonexistsError();
        }
    }
    static get NextCategoryId() {
        return this.list.nextCategoryId++;
    }
    static get NextEntryId() {
        return this.list.nextEntryId++;
    }
    // import and export
    static import(data) {
        try {
            this.list = Import.readData(data);
        }
        catch (ex) {
            throw new ImportError(ex);
        }
    }
    static export() {
        return JSON.stringify(this.list);
    }
    // category methods
    static sortCategories() {
        this.list.categories.sort((a, b) => {
            // we don't care about letter case
            return a.name[l10n.currentLocale].toLowerCase().localeCompare(b.name[l10n.currentLocale].toLowerCase());
        });
    }
    static deleteCategory(categoryId) {
        if (this.hasCategoryById(categoryId)) {
            let index = this.list.categories.findIndex((item) => {
                return item.id === categoryId;
            });
            this.list.categories.splice(index, 1);
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    static addCategory(name, description) {
        // TODO sort the categories
        if (this.CategoryNames.includes(name)) {
            throw new CategoryExistsError();
        }
        else {
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
    static renameCategory(categoryId, newName, locale) {
        if (this.hasCategoryById(categoryId)) {
            if (this.list.categories[newName]) {
                throw new CategoryExistsError();
            }
            else {
                if (l10n.hasLocale(locale)) {
                    this.getCategoryById(categoryId).name[locale] = newName;
                    this.sortCategories();
                }
                else {
                    throw new LocaleNonexistsError();
                }
            }
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    static getCategoryById(categoryId) {
        let result = this.list.categories.find((item) => {
            return item.id === categoryId;
        });
        if (result) {
            return result;
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    static updateDescription(categoryId, description, locale) {
        if (this.hasCategoryById(categoryId)) {
            if (l10n.hasLocale(locale)) {
                this.getCategoryById(categoryId).description[locale] = description;
            }
            else {
                throw new LocaleNonexistsError();
            }
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    // entry methods
    static organizeList() {
        let sortedList = [];
        // sort the list before looping
        this.sortEntries();
        const categories = this.list.categories;
        for (let category of categories) {
            let sortedCategory = {
                "category": category,
                "entries": new Map()
            };
            let others = []; // temporary placeholder for OTHERS
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
    static sortEntries() {
        this.list.entries.sort((a, b) => {
            // we don't care about letter case
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        });
    }
    static addEntry(categoryIds, name, nameLink, author, authorLink, modes) {
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
    static deleteEntry(entryId) {
        if (this.hasEntityById(entryId)) {
            let index = this.list.entries.findIndex((entry) => {
                return entry.id === entryId;
            });
            delete this.list.entries[index];
        }
        else {
            throw new EntryNonexistsError();
        }
    }
    static updateEntry(entryId, categoryIds, name, nameLink, author, authorLink, modes) {
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
        }
        else {
            throw new EntryNonexistsError();
        }
    }
    static booleansToModes(s, t, c, m) {
        let modes = eModes.None;
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
    static getDisplay() {
        const $container = document.createElement("div");
        $container.classList.add("display-category");
        for (let category of this.list.categories) {
            // group
            const $group = document.createElement("div");
            $group.dataset.categoryId = category.id.toString();
            $group.classList.add("display-category-group");
            $container.insertAdjacentElement("beforeend", $group);
            // name
            const $category = document.createElement("div");
            $category.classList.add("display-category-head");
            $group.insertAdjacentElement("beforeend", $category);
            const $nameGroup = document.createElement("div");
            $nameGroup.classList.add("display-category-namegroup");
            $category.insertAdjacentElement("beforeend", $nameGroup);
            const $name = document.createElement("span");
            $name.classList.add("display-category-name");
            let name = category.name[l10n.currentLocale];
            if (!name) {
                // use English if selected locale doesn't have one
                name = category.name["en"];
            }
            $name.textContent = name;
            $nameGroup.insertAdjacentElement("beforeend", $name);
            // name -> edit
            const $nameEdit = document.createElement("span");
            $nameEdit.classList.add("display-category-editname", "button");
            if (l10n.currentLocale !== "en") {
                $nameEdit.textContent = `edit (in ${l10n.currentLocale.toUpperCase()})`;
            }
            else {
                $nameEdit.textContent = "edit";
            }
            $nameGroup.insertAdjacentElement("beforeend", $nameEdit);
            // name -> delete
            const $delete = document.createElement("span");
            $delete.classList.add("display-category-delete", "button-alt");
            $delete.textContent = "delete";
            $nameGroup.insertAdjacentElement("beforeend", $delete);
            // name -> delete -> confirm
            const $deleteConfirm = document.createElement("span");
            $deleteConfirm.classList.add("display-category-delete-confirm");
            $deleteConfirm.dataset.hidden = "";
            $deleteConfirm.textContent = "Confirm:";
            $nameGroup.insertAdjacentElement("beforeend", $deleteConfirm);
            const $deleteNo = document.createElement("span");
            $deleteNo.classList.add("display-category-delete-no", "button");
            $deleteNo.textContent = "No, whoops";
            $deleteConfirm.insertAdjacentElement("beforeend", $deleteNo);
            const $deleteYes = document.createElement("span");
            $deleteYes.classList.add("display-category-delete-yes", "button-alt");
            $deleteYes.textContent = "Yes, delete";
            $deleteConfirm.insertAdjacentElement("beforeend", $deleteYes);
            // description
            const $descriptionGroup = document.createElement("div");
            $descriptionGroup.classList.add("display-category-descriptiongroup");
            $category.insertAdjacentElement("beforeend", $descriptionGroup);
            const $description = document.createElement("span");
            $description.classList.add("display-category-description");
            let description = category.description[l10n.currentLocale];
            if (!description) {
                // use English if selected locale doesn't have one
                description = category.description["en"];
            }
            $description.textContent = description;
            $descriptionGroup.insertAdjacentElement("beforeend", $description);
            // description -> edit
            const $descriptionEdit = document.createElement("span");
            $descriptionEdit.classList.add("display-category-editdescription", "button");
            if (l10n.currentLocale !== "en") {
                $descriptionEdit.textContent = `edit (in ${l10n.currentLocale.toUpperCase()})`;
            }
            else {
                $descriptionEdit.textContent = "edit";
            }
            $descriptionGroup.insertAdjacentElement("beforeend", $descriptionEdit);
            // entries
            const $table = document.createElement("table");
            $table.classList.add("category-entry");
            $group.insertAdjacentElement("beforeend", $table);
            const $trHeading = document.createElement("tr");
            $table.insertAdjacentElement("beforeend", $trHeading);
            const $thEntry = document.createElement("th");
            $trHeading.insertAdjacentElement("beforeend", $thEntry);
            const $thModes = document.createElement("th");
            $thModes.textContent = l10n.getString("Modes");
            $trHeading.insertAdjacentElement("beforeend", $thModes);
            const $thActions = document.createElement("th");
            $thActions.textContent = "Actions";
            $trHeading.insertAdjacentElement("beforeend", $thActions);
            for (let entry of this.list.entries) {
                if (!entry.categories.includes(category.id)) {
                    continue;
                }
                // display the entry
                const $tr = document.createElement("tr");
                $tr.dataset.id = entry.id.toString();
                $table.insertAdjacentElement("beforeend", $tr);
                const $tdEntry = document.createElement("td");
                $tr.insertAdjacentElement("beforeend", $tdEntry);
                const $tdMode = document.createElement("td");
                $tr.insertAdjacentElement("beforeend", $tdMode);
                const $tdActions = document.createElement("td");
                $tr.insertAdjacentElement("beforeend", $tdActions);
                const $name = document.createElement("a");
                $name.href = `https://osu.ppy.sh/community/forums/topics/${entry.nameLink}`;
                $name.textContent = entry.name;
                $name.target = "_blank";
                $tdEntry.insertAdjacentElement("beforeend", $name);
                $tdEntry.insertAdjacentText("beforeend", ` ${l10n.getString("by")} `);
                const $author = document.createElement("a");
                $author.href = `https://osu.ppy.sh/users/${entry.authorLink}`;
                $author.textContent = entry.author;
                $author.target = "_blank";
                $tdEntry.insertAdjacentElement("beforeend", $author);
                let modes = [];
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
                const $modes = document.createElement("span");
                $modes.textContent = modes.join(" ");
                $tdMode.insertAdjacentElement("beforeend", $modes);
                // edit button
                const $edit = document.createElement("span");
                $edit.classList.add("entry-edit", "button");
                $edit.textContent = "edit";
                $tdActions.insertAdjacentElement("beforeend", $edit);
                // delete button
                const $delete = document.createElement("span");
                $delete.classList.add("entry-delete", "button-alt");
                $delete.textContent = "delete";
                $tdActions.insertAdjacentElement("beforeend", $delete);
                // delete -> confirm
                const $deleteConfirm = document.createElement("span");
                $deleteConfirm.classList.add("entry-delete-confirm");
                $deleteConfirm.dataset.hidden = "";
                $deleteConfirm.textContent = "Confirm:";
                $tdActions.insertAdjacentElement("beforeend", $deleteConfirm);
                const $deleteNo = document.createElement("span");
                $deleteNo.classList.add("entry-delete-no", "button");
                $deleteNo.textContent = "No, whoops";
                $deleteConfirm.insertAdjacentElement("beforeend", $deleteNo);
                const $deleteYes = document.createElement("span");
                $deleteYes.classList.add("entry-delete-yes", "button-alt");
                $deleteYes.textContent = "Yes, delete";
                $deleteConfirm.insertAdjacentElement("beforeend", $deleteYes);
            }
        }
        return $container;
    }
}
CompendiumMan.list = {
    "categories": [],
    "entries": [],
    "_version": Import.version,
    "nextEntryId": 0,
    "nextCategoryId": 0
};
export default CompendiumMan;
//# sourceMappingURL=CompendiumMan.js.map