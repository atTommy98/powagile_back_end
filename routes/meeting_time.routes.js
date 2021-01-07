module.exports = (app) => {
  const meeting = require("../controllers/meeting.controller.js");

  var router = require("express").Router();

  // TODO: :meetingStartTime&:meetingEndTime"
  router.get("/", meeting.getMeetingByDate);

  app.use("/meetingtime", router);
};
