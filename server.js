// //Express is for building the Rest apis
const express = require("express");

// //body-parser helps to parse the request and create the req.body object
const bodyParser = require("body-parser");

//cors provides Express middleware to enable CORS with various options
const cors = require("cors");

// initialise app
const app = express();

// var corsOptions = {
//   origin: [/(https?:\/\/localhost:\d+\/?)/g, "https://powagile.netlify.app/", "http://powagile.netlify.app/"],
// };
// in case we need to change below app.use(cors(corsOptions));

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
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
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "https://powagile.netlify.app",
    ],
    methods: ["GET", "POST"],
  },
});

// MongoDB shit goes here
function checkMeeting() {}
function updateMeeting() {}
// app.post("/sockets", (req, res) => {
//   // Update participants
//   if (req.body.participants) {
//     io.emit("participants", req.body.participants);
//     console.log(`HIT - Participants`);
//     console.log(req.body.participants);
//     res.sendStatus(200);
//   }

//   // Update meeting
//   if (req.body.meeting) {
//     io.emit("meeting", req.body.meeting);
//     console.log(`HIT - Meeting`);
//     console.log(req.body.meeting);
//     res.sendStatus(200);
//   }
// });

// 💾 Store a list of the active meetings and participants
var activeMeetings = {};
var activeParticipants = {};
//// This is hopefully where I'll put my replay feature:
//// var activeMeetingStates = {};

io.on("connection", (socket) => {
  const {
    roomId,
    name = "Anonymous",
    isFacilitator = false,
    avatar = "null",
  } = socket.handshake.query;

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

  console.log(`${name} is a facilitator: ${isFacilitator}`);

  ////// 👨‍👨‍👦‍👦 PARTICIPANTS LOGIC 👨‍👨‍👦‍👦
  // Does the participants list exist for this meeting?
  // No?
  if (!(roomId in activeParticipants)) {
    // Create it...
    activeParticipants[roomId] = [];
    // ...and add the participant
    const newParticipant = [socket.id, socket.name];
    activeParticipants[roomId].push(newParticipant);
  }
  // Yes?
  if (roomId in activeParticipants) {
    // Only add the participant
    const newParticipant = [socket.id, socket.name];
    activeParticipants[roomId].push(newParticipant);
  }

  ////// 📊 MEETING LOGIC 📊
  // Facilitator & new meeting? Take the meeting info and store it
  if (isFacilitator === true && !(roomId in activeMeetings)) {
    activeMeetings.roomId = {};
    console.log(`Blank state added - meeting id ${roomId}`);
  }
  // Store first meeting state
  socket.on("startMeeting", (meeeting) => {
    delete meeeting.icon;
    activeMeetings[roomId] = { ...meeeting };
    console.log(`Initial state added - meeting id ${roomId}`);
    console.log(activeMeetings[roomId]);
  });
  // Participant? Give them the meeting info
  if (isFacilitator === false) {
    console.log(`AAAAAAAAAAAAAAAAAAAAAAAAA INIT FOR ${name}`);
    socket.emit("initialise_meeting", {
      meeting: { ...activeMeetings.roomId },
    });
  }

  ////// 📒 NOTES LOGIC
  socket.on("addCard", (card) => {
    socket.broadcast.emit("addCard", card);
    // TODO: Store in object
    console.log("Add card");
  });

  socket.on("deleteCard", (id) => {
    socket.broadcast.emit("deleteCard", id);
    // TODO: Store in object
    console.log("Delete card");
  });

  socket.on("updateCardText", (card) => {
    socket.broadcast.emit("updateCardText", card);
    // TODO: Store in object
    console.log("Update card");
  });

  socket.on("updateCardVotes", (card) => {
    socket.broadcast.emit("updateCardVotes", card);
    // TODO: Store in object
    console.log(
      card.thumb === "thumbsUp"
        ? "Update card votes - thumbs up"
        : "Update card votes - thumbs down"
    );
  });

  socket.on("moveCard", (card) => {
    socket.broadcast.emit("moveCard", card);
    // TODO: Store in object
    console.log("Move card");
  });

  socket.on("endMeeting", (req) => {
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
