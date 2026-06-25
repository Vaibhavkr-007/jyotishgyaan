/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_986407980")

  // add field
  collection.fields.addAt(28, new Field({
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
  collection.fields.addAt(29, new Field({
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
  collection.fields.addAt(30, new Field({
    "help": "",
    "hidden": false,
    "id": "number1992105851",
    "max": null,
    "min": null,
    "name": "refundAmount",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(31, new Field({
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
  const collection = app.findCollectionByNameOrId("pbc_986407980")

  // remove field
  collection.fields.removeById("text2199652901")

  // remove field
  collection.fields.removeById("text1107631103")

  // remove field
  collection.fields.removeById("number1992105851")

  // remove field
  collection.fields.removeById("date209108867")

  return app.save(collection)
})
