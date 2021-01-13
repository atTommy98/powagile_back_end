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
  res.json({ message: "Welcome to Your POW! application." });
});

require("./routes/meeting.routes")(app);
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
    content: `${name} has connected! (${socket.id})`,
  });

  // On startMeeting - store participant, store/emit meeting state
  socket.on("startMeeting", (meeeting) => {
    // Participant Logic:
    // Create participant list (if it doesn't exist) and add participant
    if (isFacilitator && !(roomId in activeParticipants)) {
      activeParticipants[roomId] = [];
      activeParticipants[roomId].push([socket.id, name]);
    }
    // Add to participant list
    if (roomId in activeParticipants) {
      activeParticipants[roomId].push([socket.id, name]);
    }
    if (!isFacilitator) {
      console.log(`${name} fetched meeting info`);
      const meeting = activeMeetings[roomId];
      socket.emit("updateMeeting", meeting);
    }

    // Meeting Logic:
    // Get rid of unused keys
    delete meeeting.icon;
    // Facilitator & new meeting? Take the meeting info and store it
    if (isFacilitator && !(roomId in activeMeetings)) {
      activeMeetings[roomId] = { ...meeeting };
      // Show the state of the active meeting
      console.log(activeMeetings[roomId]);
    }
  });

  ////// 📒 NOTES LOGIC
  // ✅✅✅
  socket.on("addCard", (newCard) => {
    // Add the card
    activeMeetings[roomId] = {
      ...activeMeetings[roomId],
      cards: [...activeMeetings[roomId].cards, newCard],
    };

    // Emit new meeting state
    socket.emit("updateMeeting", activeMeetings[roomId]);
    socket.broadcast.emit("updateMeeting", activeMeetings[roomId]);
    console.log(`${name} added a card`);
  });

  // ✅✅✅❔❔❔
  socket.on("deleteCard", (id) => {
    // "Delete" the card
    const newCards = [...activeMeetings[roomId].cards];
    const index = newCards.findIndex((card) => card.id === id);
    newCards[index].isDeleted = true;

    // Emit new meeting state
    socket.emit("updateMeeting", activeMeetings[roomId]);
    socket.broadcast.emit("updateMeeting", activeMeetings[roomId]);
    console.log(`${name} deleted a card`);
  });

  // ✅✅✅❔❔❔
  socket.on("updateCardText", ({ id, content }) => {
    // Update the card
    const newCards = [...activeMeetings[roomId].cards];
    const index = newCards.findIndex((card) => card.id === id);
    newCards[index].content = content;
    activeMeetings[roomId] = {
      ...activeMeetings[roomId],
      cards: newCards,
    };

    // Emit new meeting state
    socket.emit("updateMeeting", activeMeetings[roomId]);
    socket.broadcast.emit("updateMeeting", activeMeetings[roomId]);
    console.log(`${name} updated acard`);
  });

  // ✅✅✅❔❔❔
  socket.on("updateCardVotes", ({ id, thumb }) => {
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
  });

  // ✅✅✅❔❔❔
  socket.on("moveCard", ({ id, direction }) => {
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
  });

  socket.on("endMeeting", () => {
    socket.emit("endMeeting");
    socket.broadcast.emit("endMeeting");
    delete activeParticipants.roomId;
    console.log(`Ending meeting ${roomId}...`);
  });

  socket.on("disconnect", (req) => {
    console.log(`${name} has disconnected! (${socket.id})`);
    socket.broadcast.emit("notification", {
      type: "user_disconnected",
      content: `${name} has disconnected!`,
    });
    // remove from list of active participants
  });
});
