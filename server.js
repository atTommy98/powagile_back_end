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

// store a list of the active meetings and participants
var activeMeetings = {};
var activeParticipants = {};

io.on("connection", (socket) => {
  const {
    roomId,
    name = "Anonymous",
    isFacilitator = false,
    avatar = "null",
  } = socket.handshake.query;

  // Give the socket a nickname (the name of the user)
  socket.name = name;
  socket.join(roomId);

  // Say they've connected
  socket.broadcast.emit("connection_notification", `${name} has connected!`);

  // Does the participants list exist for this meeting?

  if (!activeParticipants[roomId]) {
    activeParticipants[roomId] = [];
  }
  activeParticipants[roomId].push([socket.id, socket.name]);
  console.log(activeParticipants[roomId]);

  socket.on("startMeeting", (req) => {
    // Started tracking meeting id "idhere"
  });

  socket.on("addCard", (card) => {
    socket.broadcast.emit("addCard", card);
    // more logic to store / amend meeting object here
    console.log("Add card");
  });

  socket.on("deleteCard", (id) => {
    socket.broadcast.emit(card);
    console.log(id);
  });

  socket.on("updateCardText", (card) => {
    socket.broadcast.emit(card);
    console.log(card);
  });

  socket.on("updateCardVotes", (card) => {
    socket.broadcast.emit(card);
    console.log(card);
  });

  socket.on("moveCard", (card) => {
    socket.broadcast.emit(card);
    console.log(card);
  });

  socket.on("endMeeting", (req) => {
    delete activeParticipants.roomId;
    console.log(`Deleting meeting ${roomId}`);
  });

  // handle disconnects
  // socket.on("disconnect", (req) => {
  //   socket.broadcast.emit(
  //     "connection_notification",
  //     `${name} has disconnected`
  //   );
  //   // find index by socket id
  // });
});
