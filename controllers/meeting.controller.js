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
  const meeting = new Meeting(req.body);

  // Save newEntry in the database
  meeting
    .save(meeting)
    .then((data) => {
      res.status(200).send({ data });
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
  const id = req.query.id;

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
  const id = req.query.id;

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

// GET Meeting with specific date
exports.getMeetingByDate = async (req, res) => {
  try {
    // Get date
    let startTimeTimestamp = req.query.meetingStartTime;
    startTimeTimestamp = Number(startTimeTimestamp);

    console.log({ startTimeTimestamp });

    //1. check that date is not empty
    if (startTimeTimestamp === "") {
      return res.status(400).json({
        status: "Failure",
        message: "Please ensure you pick a valid date",
      });
    }

    // Define "from" and "to" time
    const from = new Date(
      new Date(startTimeTimestamp).setHours(00, 00, 00)
    ).toString();
    const to = new Date(
      new Date(startTimeTimestamp).setHours(23, 59, 59)
    ).toString();
    console.log({ from, to });

    // Meeting.find({ $where: 'meetingStartTime == "2020"' });

    //3. Query database using Mongoose
    //Mind the curly braces
    const meetings = await Meeting.find({
      meetingStartTime: {
        $gte: from,
        $lt: to,
      },
    });

    //4. Handle responses
    if (!meetings) {
      return res.status(404).json({
        status: "failure",
        message: "Could not retrieve meetings",
      });
    }

    res.status(200).json({
      status: "success",
      data: meetings,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failure",
      error: error.message,
    });
  }
};
