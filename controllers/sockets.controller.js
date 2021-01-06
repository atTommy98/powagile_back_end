const db = require("../models");
const Sockets = db.sockets;

// CRUD _ Create and Save a new entry
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name && !req.body.message) {
    res.status(400).send({ message: "Missing name or message..." });
    return;
  }

  // Create a new entry
  const socket = new Sockets(req.body);

  // Save newEntry in the database
  socket
    .save(socket)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the meeting.",
      });
    });
};

// READ - Retrieve all entries from the database.
// Retrieve all entries/ find by userName from the database:
exports.findAll = (req, res) => {
  const type = req.query.type;
  var condition = type
    ? { type: { $regex: new RegExp(type), $options: "i" } }
    : {};

  Sockets.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving entries.",
      });
    });
};
