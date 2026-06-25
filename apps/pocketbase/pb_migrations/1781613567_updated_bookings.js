/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_986407980")

  // add field
  collection.fields.addAt(24, new Field({
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
  collection.fields.addAt(25, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2757116735",
    "max": 0,
    "min": 0,
    "name": "cancellationReason",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(26, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text77292808",
    "max": 0,
    "min": 0,
    "name": "cancelledBy",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(27, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text87882220",
    "max": 0,
    "min": 0,
    "name": "cancelledCalBookingUid",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_986407980")

  // remove field
  collection.fields.removeById("date1359432310")

  // remove field
  collection.fields.removeById("text2757116735")

  // remove field
  collection.fields.removeById("text77292808")

  // remove field
  collection.fields.removeById("text87882220")

  return app.save(collection)
})
