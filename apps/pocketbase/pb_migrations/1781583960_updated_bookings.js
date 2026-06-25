/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_986407980")

  // add field
  collection.fields.addAt(17, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text4144244378",
    "max": 0,
    "min": 0,
    "name": "calBookingUid",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(18, new Field({
    "help": "",
    "hidden": false,
    "id": "number3263366100",
    "max": null,
    "min": null,
    "name": "rescheduledCount",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(19, new Field({
    "help": "",
    "hidden": false,
    "id": "date3262469075",
    "max": "",
    "min": "",
    "name": "rescheduledAt",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(20, new Field({
    "help": "",
    "hidden": false,
    "id": "date1368549534",
    "max": "",
    "min": "",
    "name": "rescheduledFrom",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text3167079835",
    "max": 0,
    "min": 0,
    "name": "reschedulingReason",
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
  collection.fields.removeById("text4144244378")

  // remove field
  collection.fields.removeById("number3263366100")

  // remove field
  collection.fields.removeById("date3262469075")

  // remove field
  collection.fields.removeById("date1368549534")

  // remove field
  collection.fields.removeById("text3167079835")

  return app.save(collection)
})
