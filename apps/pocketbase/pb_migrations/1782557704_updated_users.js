/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(26, new Field({
    "help": "",
    "hidden": false,
    "id": "select1318505897",
    "maxSelect": 1,
    "name": "maritalStatus",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Single",
      "Married",
      "Divorced",
      "Widowed"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(26, new Field({
    "help": "",
    "hidden": false,
    "id": "select1318505897",
    "maxSelect": 1,
    "name": "maritalStatus",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "single",
      "married",
      "divorced",
      "widowed",
      "separated"
    ]
  }))

  return app.save(collection)
})
