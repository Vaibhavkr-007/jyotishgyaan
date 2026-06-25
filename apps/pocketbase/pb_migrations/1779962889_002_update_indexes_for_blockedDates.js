/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("blockedDates");
  collection.indexes.push("CREATE INDEX idx_blockedDates_date ON blockedDates (date)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("blockedDates");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_blockedDates_date"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
