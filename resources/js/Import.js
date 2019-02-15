import ImportError from "./Error/ImportError.js";
class Import {
    // Ensures that the input data matches the current format.
    static updateData(data) {
        let updatedList;
        if (data._version === 1) {
            /*
            version 1 -> 2 changes
            - iCompendiumList.categories no longer contains "entries"
            + iCompendiumList.entries now exists to contain
            + An entry will contain a list of categories it belongs too
            + duplicate entries will merge, if they have matching topic ids and names -- some skins use the same topic ID
            */
            updatedList = {
                "categories": [],
                "entries": [],
                "nextCategoryId": data.nextCategoryId,
                "nextEntryId": data.nextEntryId,
                "_version": 2
            };
            for (let category of data.categories) {
                for (let entry of category.entries) {
                    let result = updatedList.entries.find((item) => {
                        return (item.nameLink === entry.nameLink) && (item.name === entry.name);
                    });
                    if (result) {
                        result.categories.push(category.id);
                        continue;
                    }
                    entry.categories = [];
                    entry.categories.push(category.id);
                    updatedList.entries.push(entry);
                }
                delete category.entries;
                updatedList.categories.push(category);
            }
        }
        // NOTE If the list formatting changes, add the updating stuff here
        return updatedList;
    }
    static readData(json) {
        let list;
        try {
            list = JSON.parse(json);
        }
        catch (_a) {
            throw new ImportError("Invalid JSON. (Did you modify the file?)");
        }
        if (!Number.isInteger(list._version) && list._version <= this.version) {
            throw new ImportError("Invalid version number. (Did you modify the file?)");
        }
        if (list._version === this.version) {
            // a bit redundant but filters out unwanted keys
            list = {
                "_version": list._version,
                "categories": list.categories,
                "entries": list.entries,
                "nextCategoryId": list.nextCategoryId,
                "nextEntryId": list.nextEntryId
            };
        }
        else {
            list = this.updateData(list);
        }
        return list;
    }
}
Import.version = 2;
export default Import;
//# sourceMappingURL=Import.js.map