module.exports = (app) => {
  const meeting = require("../controllers/meeting.controller.js");

  var router = require("express").Router();

  // Create a new Entry
  router.post("/", meeting.create);

  // Retrieve all Entries
  router.get("/getAll", meeting.findAll);

  // Retreive meetings by date
  router.get("/getByDate", meeting.getMeetingByDate);

  // Retreive all entries by user id
  router.get("/userId", meeting.findOne);

  // Retrieve a single Entry with id
  router.get("/id", meeting.findOne);

  // Update a Entry with id
  router.put("/id", meeting.update);

  // Delete a Entry with id
  router.delete("/id", meeting.delete);

  app.use("/meeting", router);
};
