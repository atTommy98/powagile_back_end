module.exports = (app) => {
  const meeting = require("../controllers/meeting.controller.js");

  var router = require("express").Router();

  // Create a new Entry
  router.post("/", meeting.create);

  // Retrieve all Entries
  router.get("/", meeting.findAll);

  // Retrieve all Entries which has had their turn
  router.get("/hasHadTurn", meeting.findAllHASHadTurn);

  // Retrieve a single Entry with id
  router.get("/:id", meeting.findOne);

  // Update a Entry with id
  router.put("/:id", meeting.update);

  // Delete a Entry with id
  router.delete("/:id", meeting.delete);

  // Create a new Entry
  router.delete("/", meeting.deleteAll);

  app.use("/meeting", router);
};
