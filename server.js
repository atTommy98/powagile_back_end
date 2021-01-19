// Express is for building the Rest apis
const express = require("express");

// body-parser (parse the request and create the req.body object)
const bodyParser = require("body-parser");

// Express middleware to enable CORS with various options
const cors = require("cors");

// initialise app
const app = express();

// environment variables
require("dotenv").config();

// CORS
app.use(cors());

// Parse JSON
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("\x1b[32m", "Mongo DB - Connection Successful!", "\x1b[0m");
  })
  .catch((err) => {
    console.log("\x1b[31m", "Mongo DB - Error connecting:", err, "\x1b[0m");
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to POW!Agile." });
});

require("./routes/meetingStandUp.routes")(app);
require("./routes/meetingRetro.routes")(app);
require("./routes/users.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log("---Starting up...---");
  console.log("\x1b[32m", `Server is running on port ${PORT}`, "\x1b[0m");
});

// socket io
var io = require("socket.io")(server, {
  cors: {
    origin: process.env.SOCKET_IO_CORS_URLs.split(" "),
    methods: ["GET", "POST"],
  },
});

// TODO: MongoDB stuff will go
function checkMeeting() {}
function updateMeeting() {}

// 💾 Store a list of the active meetings and participants
var activeMeetings = {};
var activeParticipants = {};

//// This is (hopefully) where I'll put my replay feature:
//// var activeMeetingStates = {};

io.on("connection", (socket) => {
  let { roomId, name, isFacilitator, avatar } = socket.handshake.query;
  // Fix weird boolean/string bug
  if (isFacilitator == "false") {
    isFacilitator = false;
  }

  // Give the the name of the user
  socket.name = name;
  // Join the relevant session
  socket.join(roomId);

  // Say they've connected
  console.log(`${name} has connected! (${socket.id})`);
  socket.broadcast.emit("notification", {
    type: "user_connected",
    content: `${name} has joined the retro!`,
  });

  // On startMeeting - store participant, store/emit meeting state
  socket.on("startMeeting", (meeeting) => {
    try {
      // Participant Logic:
      // Add to participant list (if it exists)
      if (roomId in activeParticipants && !isFacilitator) {
        const participantList = activeParticipants[roomId];
        participantList.push({ name: name, id: socket.id, avatar });
        socket.emit("updateParticipants", participantList);
        socket.broadcast.emit("updateParticipants", participantList);
        console.log(`${name} fetched participant info`);
      }
      if (!isFacilitator) {
        console.log(`${name} fetched meeting info`);
        const meeting = activeMeetings[roomId];
        socket.emit("updateMeeting", meeting);
      }
      // Create participant list (if it doesn't exist) and add participant
      if (!(roomId in activeParticipants) && isFacilitator) {
        activeParticipants[roomId] = [];
        const participantList = activeParticipants[roomId];
        participantList.push({ name: name, id: socket.id, avatar });
        socket.emit("updateParticipants", participantList);
      }

      // Meeting Logic:
      // Get rid of unused keys
      delete meeeting.icon;
      // Facilitator & new meeting? Take the meeting info and store it
      if (isFacilitator && !(roomId in activeMeetings)) {
        activeMeetings[roomId] = { ...meeeting, meetingStartTime: Date.now() };
        // Show the state of the active meeting
        console.log(activeMeetings[roomId]);
      }
    } catch (err) {
      console.error(err);
    }
  });

  ////// 📒 NOTES LOGIC
  socket.on("addCard", (newCard) => {
    try {
      // Add the card
      activeMeetings[roomId] = {
        ...activeMeetings[roomId],
        cards: [...activeMeetings[roomId].cards, newCard],
      };

      // Emit new meeting state
      socket.emit("updateMeeting", activeMeetings[roomId]);
      socket.broadcast.emit("updateMeeting", activeMeetings[roomId]);
      console.log(`${name} added a card`);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("deleteCard", (id) => {
    try {
      // "Delete" the card
      const newCards = [...activeMeetings[roomId].cards];
      const index = newCards.findIndex((card) => card.id === id);
      newCards[index].isDeleted = true;

      // Emit new meeting state
      socket.emit("updateMeeting", activeMeetings[roomId]);
      socket.broadcast.emit("updateMeeting", activeMeetings[roomId]);
      console.log(`${name} deleted a card`);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("updateCardText", ({ id, content }) => {
    try {
      // Update the card
      const newCards = [...activeMeetings[roomId].cards];
      const index = newCards.findIndex((card) => card.id === id);
      newCards[index].content = content;
      activeMeetings[roomId] = {
        ...activeMeetings[roomId],
        cards: newCards,
      };

      // Emit new meeting state
      socket.broadcast.emit("updateMeeting", activeMeetings[roomId]);
      console.log(`${name} updated a card`);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("updateCardVotes", ({ id, thumb }) => {
    try {
      // Set the thumb
      const newCards = [...activeMeetings[roomId].cards];
      const index = newCards.findIndex((card) => card.id === id);
      newCards[index][thumb] += 1;
      activeMeetings[roomId] = {
        ...activeMeetings[roomId],
        cards: newCards,
      };

      // Emit new meeting state
      socket.emit("updateMeeting", activeMeetings[roomId]);
      socket.broadcast.emit("updateMeeting", activeMeetings[roomId]);
      console.log(
        thumb === "thumbsUp"
          ? `${name} voted a card up`
          : `${name} voted a card down`
      );
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("moveCard", ({ id, direction }) => {
    try {
      // Find the card
      const newCards = [...activeMeetings[roomId].cards];
      const index = newCards.findIndex((card) => card.id === id);
      // Move the card
      switch (direction) {
        case "left":
          newCards[index].columnIndex -= 1;
          break;
        case "right":
          newCards[index].columnIndex += 1;
          break;
        default:
          console.error(`Incorrect direction passed to "moveCard" function`);
          break;
      }
      activeMeetings[roomId] = {
        ...activeMeetings[roomId],
        cards: newCards,
      };

      socket.emit("updateMeeting", activeMeetings[roomId]);
      socket.broadcast.emit("updateMeeting", activeMeetings[roomId]);
      console.log(`${name} moved a card`);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("endMeeting", () => {
    if (!isFacilitator) {
      return;
    }
    try {
      const finalMeetingState = {
        ...activeMeetings[roomId],
        meetingFinished: true,
        meetingEndTime: Date.now(),
      };
      // Store in DB
      db.meetingRetro.create(
        { body: { ...finalMeetingState } },
        (err, success) => {
          if (err) {
            console.error(
              `Error POSTing meeting ${finalMeetingState.id} - ${err}`
            );
          } else {
            console.log(
              `Meeting ${finalMeetingState.id} successfully posted to database!`
            );
          }
        }
      );

      delete activeParticipants[roomId];
      console.log(`Ending meeting ${roomId}...`);
      socket.emit("endMeeting");
      socket.broadcast.emit("endMeeting");
    } catch (err) {
      console.error(err);
    }
  });

  socket.on("disconnect", () => {
    if (isFacilitator) {
      return;
    }
    try {
      console.log(`${name} has disconnected! (${socket.id})`);
      const newParticipantList = activeParticipants[roomId].filter(
        (el) => el.id !== socket.id
      );
      socket.broadcast.emit("updateParticipants", newParticipantList);
      socket.broadcast.emit("notification", {
        type: "user_disconnected",
        content: `${name} has left the retro!`,
      });
    } catch (err) {
      console.error(err);
    }
  });

  // FIXME: Not working
  // socket.on("kick", (id) => {
  //   if (isFacilitator) {
  //     io.to(id).emit("kick", id);
  //     return;
  //   }
  //   try {
  //     if (id == socket.id) {
  //       console.log(`${name} has been kicked! (${socket.id})`);
  //       const newParticipantList = activeParticipants[roomId].filter(
  //         (el) => el.id !== socket.id
  //       );
  //       socket.broadcast.emit("updateParticipants", newParticipantList);
  //       socket.broadcast.emit("notification", {
  //         type: "user_kicked",
  //         content: `${name} has been kicked by the host!`,
  //       });
  //       socket.disconnect();
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // });
});
