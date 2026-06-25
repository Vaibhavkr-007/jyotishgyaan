/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3533380876")

  // add field
  collection.fields.addAt(14, new Field({
    "help": "",
    "hidden": false,
    "id": "date1359432310",
    "max": "",
    "min": "",
    "name": "cancelledAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2199652901",
    "max": 0,
    "min": 0,
    "name": "refundStatus",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text1107631103",
    "max": 0,
    "min": 0,
    "name": "refundId",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(17, new Field({
    "help": "",
    "hidden": false,
    "id": "date209108867",
    "max": "",
    "min": "",
    "name": "refundedAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3533380876")

  // remove field
  collection.fields.removeById("date1359432310")

  // remove field
  collection.fields.removeById("text2199652901")

  // remove field
  collection.fields.removeById("text1107631103")

  // remove field
  collection.fields.removeById("date209108867")

  return app.save(collection)
})
