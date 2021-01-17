module.exports = (app) => {
  const meetingStandUp = require("../controllers/meetingStandUp.controller.js");

  var router = require("express").Router();

  // Create a new Entry
  router.post("/", meetingStandUp.create);

  // Retrieve all Entries
  router.get("/getAll", meetingStandUp.findAll);

  // Retreive all StandUp meetings by date
  router.get("/getByDate", meetingStandUp.getMeetingByDate);

  // Retrieve a single Entry with id
  router.get("/id", meetingStandUp.findOne);

  // Update a meetingStandUp by id
  router.put("/id", meetingStandUp.update);

  // Delete a Entry with id
  router.delete("/id", meetingStandUp.delete);

  app.use("/meetingStandUp", router);
};
