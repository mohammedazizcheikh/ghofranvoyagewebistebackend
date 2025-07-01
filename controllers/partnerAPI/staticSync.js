const apiClient = require("../../config/partnerAPI/apiClient");
const City = require("../../models/partnerAPI/City");
const Tag = require("../../models/partnerAPI/Tag");
const {Category} = require("../../models")


// Generic sync helper: accepts api fetch function and Mongoose model
async function syncData(fetchFn, Model, options = {}) {
  try {
    const data = await fetchFn();

    // Validate options.array and check if data[options.array] is an array
    if (options.array) {
      if (!Array.isArray(data[options.array])) {
        throw new Error(`Expected data.${options.array} to be an array`);
      }
    }

    // Determine records array from data
    const records = options.array ? data[options.array] : data;

    if (options.deleteBeforeInsert) {
      // Clear collection before insert
      await Model.deleteMany({});
      await Model.insertMany(records);
      console.log(
        `Synced ${records.length} records to ${Model.collection.name} (replaced all)`
      );
    } else if (options.upsertBy) {
      // Upsert each item by given field(s)
      const bulkOps = records.map((item) => ({
        updateOne: {
          filter: { [options.upsertBy]: item[options.upsertBy] },
          update: item,
          upsert: true,
        },
      }));

      if (bulkOps.length > 0) {
        const bulkWriteResult = await Model.bulkWrite(bulkOps);
        console.log(
          `Synced ${records.length} records to ${Model.collection.name} (upserted)`,
          bulkWriteResult
        );
      }
    } else {
      // Default: replace all (delete + insert)
      await Model.deleteMany({});
      await Model.insertMany(records);
      console.log(
        `Synced ${records.length} records to ${Model.collection.name}`
      );
    }
  } catch (error) {
    console.error(`Error syncing records for ${Model.collection.name}:`, error);
    throw error;
  }
}

async function syncCities() {
  return syncData(apiClient.listCity, City, {
    deleteBeforeInsert: true,
    array: "ListCity",
  });
  console.log(apiClient.password)
}

async function syncTags() {
  return syncData(apiClient.listTag, Tag, {
    deleteBeforeInsert: true,
    array: "ListTag",
  });
}
async function syncCategory() {
  return syncData(apiClient.ListCategorie, Category, {
    deleteBeforeInsert: true,
    array: "ListCategorie",
  });
}

module.exports = { syncCities, syncTags,syncCategory, syncData };
