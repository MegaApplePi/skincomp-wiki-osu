import CategoryExistsError from "./Error/CategoryExistsError.js";
import CategoryNonexistsError from "./Error/CategoryNonexistsError.js";
import EntryNonexistsError from "./Error/EntryNonexistsError.js";
import ImportError from "./Error/ImportError.js";
import l10n from "./l10n.js";
import Modes from "./eModes.js";
class CompendiumMan {
    static getList() {
        return this.list;
    }
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
            this.list = input;
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
            delete this.list.descriptions[name];
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    static addCategory(name, description) {
        if (this.list.categories[name]) {
            throw new CategoryExistsError();
        }
        else {
            this.list.descriptions[name] = description;
            this.list.categories[name] = {};
        }
    }
    static renameCategory(oldName, newName) {
        if (this.list.categories[oldName]) {
            if (this.list.categories[newName]) {
                throw new CategoryExistsError();
            }
            else {
                this.list.categories[newName] = Object.assign({}, this.list.categories[oldName]);
                this.list.descriptions[newName] = this.list.descriptions[oldName];
                delete this.list.categories[oldName];
                delete this.list.descriptions[oldName];
            }
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    static getDescription(category) {
        if (this.list.descriptions[category]) {
            return this.list.descriptions[category];
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    // TODO add locale code (when creating a category, the title and description added will be in English... the user then needs to change the locale and edit the name to set the description in locale)
    static updateDescription(key, description, locale) {
        if (this.list.descriptions[key]) {
            this.list.descriptions[key] = description;
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    // entry methods
    static addEntry(category, name, nameLink, author, authorLink, modes) {
        if (this.list.categories[category]) {
            this.list.categories[category][this.getNextId()] = {
                name,
                nameLink,
                author,
                authorLink,
                modes
            };
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
    static getDisplay() {
        for (let category in this.list.categories) {
            if (this.list.categories.hasOwnProperty(category)) {
                // new category container
                const $container = document.createElement("div");
                $container.classList.add("display-category");
                // name
                const $category = document.createElement("div");
                $category.classList.add("display-category-head");
                const $nameGroup = document.createElement("div");
                $nameGroup.classList.add("display-category-group");
                $category.insertAdjacentElement("beforeend", $nameGroup);
                const $name = document.createElement("span");
                $name.classList.add("display-category-name");
                $name.textContent = category;
                $nameGroup.insertAdjacentElement("beforeend", $name);
                // name -> edit
                const $nameEdit = document.createElement("span");
                $nameEdit.classList.add("display-category-editname", "button");
                $nameEdit.textContent = "edit";
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
                $deleteConfirm.textContent = "Really (irreversible)?";
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
                $descriptionGroup.classList.add("display-category-group");
                $category.insertAdjacentElement("beforeend", $descriptionGroup);
                const $description = document.createElement("span");
                $description.classList.add("display-category-description");
                $description.textContent = this.list.descriptions[category];
                $descriptionGroup.insertAdjacentElement("beforeend", $description);
                // description -> edit
                const $descriptionEdit = document.createElement("span");
                $descriptionEdit.classList.add("display-category-editdescription", "button");
                $descriptionEdit.textContent = "edit";
                $descriptionGroup.insertAdjacentElement("beforeend", $descriptionEdit);
                // entries
                const $entries = document.createElement("ul");
                $entries.classList.add("category-entry");
                const $addEntry = document.createElement("div");
                $addEntry.classList.add("display-category-add_entry", "button");
                $addEntry.textContent = "Add Entry";
                $addEntry.dataset.categoryName = category;
                $container.insertAdjacentElement("beforeend", $category);
                $container.insertAdjacentElement("beforeend", $entries);
                $container.insertAdjacentElement("beforeend", $addEntry);
                for (let entry in this.list.categories[category]) {
                    if (this.list.categories[category].hasOwnProperty(entry)) {
                        const entryData = this.list.categories[category][entry];
                        // display the entry
                        const $entry = document.createElement("li");
                        $entry.dataset.id = entry;
                        const $name = document.createElement("a");
                        $name.href = `https://osu.ppy.sh/community/forums/topics/${entryData.nameLink}`;
                        $name.textContent = entryData.name;
                        $name.target = "_blank";
                        const $author = document.createElement("a");
                        $author.href = `https://osu.ppy.sh/users/${entryData.authorLink}`;
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
                        $entry.insertAdjacentText("beforeend", ` ${l10n.getString("by")} `);
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
                return $container;
            }
        }
    }
}
CompendiumMan.list = {
    "nextId": 0,
    "categories": {},
    "descriptions": {}
};
export default CompendiumMan;
//# sourceMappingURL=CompendiumMan.js.map