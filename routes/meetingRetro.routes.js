module.exports = (app) => {
  const meetingRetro = require("../controllers/meetingRetro.controller.js");

  var router = require("express").Router();

  // Create a new Entry
  router.post("/", meetingRetro.create);

  // Retrieve all Entries
  router.get("/getAll", meetingRetro.findAll);

  // Retreive all StandUp meetings by date
  router.get("/getByDate", meetingRetro.getMeetingByDate);

  // Retrieve a single Entry with id
  router.get("/id", meetingRetro.findOne);

  // Update a meetingStandUp by id
  router.put("/id", meetingRetro.update);

  // Delete a Entry with id
  router.delete("/id", meetingRetro.delete);

  app.use("/meetingRetro", router);
};
