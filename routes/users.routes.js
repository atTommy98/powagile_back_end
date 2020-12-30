module.exports = (app) => {
  const users = require("../controllers/users.controller.js");

  var router = require("express").Router();

  // Create a new Entry
  router.post("/", users.create);

  // Retrieve all Entries
  router.get("/", users.findAll);

  // Retrieve all Entries which has had their turn
  router.get("/hasHadTurn", users.findAllHASHadTurn);

  // Retrieve a single Entry with id
  router.get("/:id", users.findOne);

  // Update a Entry with id
  router.put("/:id", users.update);

  // Delete a Entry with id
  router.delete("/:id", users.delete);

  // Create a new Entry
  router.delete("/", users.deleteAll);

  app.use("/api/users", router);
};
