/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1570250199")

  // remove field
  collection.fields.removeById("text989355118")

  // add field
  collection.fields.addAt(9, new Field({
    "help": "",
    "hidden": false,
    "id": "bool989355118",
    "name": "completed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "help": "",
    "hidden": false,
    "id": "json3063671028",
    "maxSize": 0,
    "name": "calBookingResponse",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(11, new Field({
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
  collection.fields.addAt(12, new Field({
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
  collection.fields.addAt(13, new Field({
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
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text796837514",
    "max": 0,
    "min": 0,
    "name": "rescheduledFromUid",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text2063108101",
    "max": 0,
    "min": 0,
    "name": "rescheduledToUid",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(16, new Field({
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
  collection.fields.addAt(17, new Field({
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
  collection.fields.addAt(18, new Field({
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1570250199")

  // add field
  collection.fields.addAt(9, new Field({
    "autogeneratePattern": "",
    "help": "",
    "hidden": false,
    "id": "text989355118",
    "max": 0,
    "min": 0,
    "name": "completed",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("bool989355118")

  // remove field
  collection.fields.removeById("json3063671028")

  // remove field
  collection.fields.removeById("number3263366100")

  // remove field
  collection.fields.removeById("date3262469075")

  // remove field
  collection.fields.removeById("date1368549534")

  // remove field
  collection.fields.removeById("text796837514")

  // remove field
  collection.fields.removeById("text2063108101")

  // remove field
  collection.fields.removeById("date1359432310")

  // remove field
  collection.fields.removeById("text2757116735")

  // remove field
  collection.fields.removeById("text77292808")

  return app.save(collection)
})
