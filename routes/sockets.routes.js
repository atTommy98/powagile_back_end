module.exports = (app) => {
  const sockets = require("../controllers/sockets.controller.js");

  var router = require("express").Router();

  //   Create a new Entry
  // router.post("/", sockets.create);

  router.post("/", sockets.create);

  // Retrieve all Entries
  router.get("/", sockets.findAll);

  app.use("/sockets", router);
};
