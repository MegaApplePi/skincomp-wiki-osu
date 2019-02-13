import CategoryExistsError from "./Error/CategoryExistsError.js";
import CategoryNonexistsError from "./Error/CategoryNonexistsError.js";
import EntryNonexistsError from "./Error/EntryNonexistsError.js";
import ImportError from "./Error/ImportError.js";
import LocaleNonexistsError from "./Error/LocaleNonexistsError.js";
import l10n from "./l10n.js";
import eModes from "./eModes.js";
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
        for (let item of this.list.categories) {
            categories.push(item.name);
        }
        return categories;
    }
    static get CategoryIds() {
        let categories = [];
        for (let item of this.list.categories) {
            categories.push(item.id);
        }
        return categories;
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
    static get NextCategoryId() {
        return this.list.nextCategoryId++;
    }
    static get NextEntryId() {
        return this.list.nextEntryId++;
    }
    // import and export
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
        }
        else {
            throw new CategoryNonexistsError();
        }
    }
    static addCategory(name, description) {
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
                },
                "entries": []
            });
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
    static addEntry(categoryId, name, nameLink, author, authorLink, modes) {
        if (this.hasCategoryById(categoryId)) {
            this.getCategoryById(categoryId).entries.push({
                "id": this.NextEntryId,
                name,
                nameLink,
                author,
                authorLink,
                modes
            });
        }
        else {
            throw new CategoryNonexistsError();
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
            const $entries = document.createElement("ul");
            $entries.classList.add("category-entry");
            $group.insertAdjacentElement("beforeend", $entries);
            const $addEntry = document.createElement("div");
            $addEntry.classList.add("display-category-add_entry", "button");
            $addEntry.textContent = "Add Entry";
            $addEntry.dataset.categoryName = category.name[l10n.currentLocale];
            $group.insertAdjacentElement("beforeend", $addEntry);
            for (let entry of category.entries) {
                // display the entry
                const $entry = document.createElement("li");
                $entry.dataset.id = entry.id.toString();
                const $name = document.createElement("a");
                $name.href = `https://osu.ppy.sh/community/forums/topics/${entry.nameLink}`;
                $name.textContent = entry.name;
                $name.target = "_blank";
                const $author = document.createElement("a");
                $author.href = `https://osu.ppy.sh/users/${entry.authorLink}`;
                $author.textContent = entry.author;
                $author.target = "_blank";
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
CompendiumMan.list = {
    "nextEntryId": 0,
    "nextCategoryId": 0,
    "categories": []
};
export default CompendiumMan;
//# sourceMappingURL=CompendiumMan.js.map