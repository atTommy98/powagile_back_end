const db = require("../models");
const Meeting = db.meeting;

// CRUD _ Create and Save a new entry
exports.create = (req, res) => {
  // Validate request
  if (!req.body.type) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a new entry
  const meeting = new Meeting({
    type: req.body.type,
    cards: req.body.cards,
    userName: req.body.userName,
    hasHadTurn: req.body.hasHadTurn ? req.body.hasHadTurn : false,
    totalMeetingTime: req.body.totalMeetingTime,
  });

  // Save newEntry in the database
  meeting
    .save(meeting)
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

  Meeting.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving entries.",
      });
    });
};

// Find a single entry with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Meeting.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found entry with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error retrieving entry with id=" + id });
    });
};

// Update an entry by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  Meeting.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Meeting with id=${id}. Maybe Meeting was not found!`,
        });
      } else res.send({ message: "Meeting was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Meeting with id=" + id,
      });
    });
};

// Delete an entry with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Meeting.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete meeting with id=${id}. Maybe meeting was not found!`,
        });
      } else {
        res.send({
          message: "Meeting was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Meeting with id=" + id,
      });
    });
};

// Delete all entries from the database.
exports.deleteAll = (req, res) => {
  Meeting.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Entries were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all entries.",
      });
    });
};

// Find all published Tutorials with published = true:

exports.findAllHASHadTurn = (req, res) => {
  Meeting.find({ hasHadTurn: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving entries.",
      });
    });
};
