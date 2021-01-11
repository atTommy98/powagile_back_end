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

  ////// 📊 MEETING LOGIC 📊
  // Facilitator & new meeting? Take the meeting info and store it
  // FIXME: I never get to this part of the code???
  if (isFacilitator && !(roomId in activeMeetings)) {
    activeMeetings.roomId = {};
    console.log(`Blank state added - meeting id ${roomId}`);
  }
  // Store first meeting state
  socket.on("startMeeting", (meeeting) => {
    delete meeeting.icon;

    ////// 👨‍👨‍👦‍👦 PARTICIPANTS LOGIC 👨‍👨‍👦‍👦
    // Does the participants list exist for this meeting?
    // No?
    if (!(roomId in activeParticipants)) {
      activeParticipants[roomId] = [];
      const newParticipant = [socket.id, socket.name];
      activeParticipants[roomId].push(newParticipant);
    }
    // Yes?
    if (roomId in activeParticipants) {
      const newParticipant = [socket.id, socket.name];
      activeParticipants[roomId].push(newParticipant);
    }

    activeMeetings[roomId] = { ...meeeting };
    console.log(`Initial state added - meeting id ${roomId}`);
    console.log(activeMeetings[roomId]);
  });
  // FIXME: I never get to this part of the code???
  // Participant? Give them the meeting info
  if (isFacilitator == false) {
    console.log(`AAAAAAAAAAAAAAAAAAAAAAAAA ${name} gets a meeting!`);
    socket.emit("initialise_meeting", {
      meeting: { ...activeMeetings.roomId },
    });
  }

  ////// 📒 NOTES LOGIC
  socket.on("addCard", (card) => {
    socket.broadcast.emit("addCard", card);
    // TODO: Store in object
    console.log(`${name} added a card`);
  });

  socket.on("deleteCard", (id) => {
    socket.broadcast.emit("deleteCard", id);
    // TODO: Store in object
    console.log(`${name} deleted a card`);
  });

  socket.on("updateCardText", (card) => {
    socket.broadcast.emit("updateCardText", card);
    // TODO: Store in object
    console.log(`${name} updated acard`);
  });

  socket.on("updateCardVotes", (card) => {
    socket.broadcast.emit("updateCardVotes", card);
    // TODO: Store in object
    console.log(
      card.thumb === "thumbsUp"
        ? `${name} voted a card up`
        : `${name} voted a card down`
    );
  });

  socket.on("moveCard", (card) => {
    socket.broadcast.emit("moveCard", card);
    // TODO: Store in object
    console.log(`${name} moved a card`);
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
