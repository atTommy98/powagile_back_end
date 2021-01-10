// module.exports = (app) => {
//   const retro = require("../controllers/retro.controller.js");

//   var router = require("express").Router();

//   // Create a new Entry
//   router.post("/", retro.create);

//   // Retrieve all Entries
//   router.get("/getAll", retro.findAll);

//   // Retreive retros by date
//   router.get("/getByDate", retro.getRetroByDate);

//   // Retrieve a single Entry with id
//   router.get("/id", retro.findOne);

//   // Update a Entry with id
//   router.put("/id", retro.update);

//   // Delete a Entry with id
//   router.delete("/id", retro.delete);

//   app.use("/retro", router);
// };
