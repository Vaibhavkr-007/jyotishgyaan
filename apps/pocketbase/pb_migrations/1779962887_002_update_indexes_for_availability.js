/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("availability");
  collection.indexes.push("CREATE INDEX idx_availability_date ON availability (date)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("availability");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_availability_date"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
