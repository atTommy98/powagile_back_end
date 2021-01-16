const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./users.model")(mongoose);
db.meetingStandUp = require("./meetingStandUp.model")(mongoose);
db.meetingRetro = require("./meetingRetro.model")(mongoose);
// db.sockets = require("./sockets.model")(mongoose);

module.exports = db;
