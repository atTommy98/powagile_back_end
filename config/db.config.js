// environment variables
require("dotenv").config();

module.exports = {
  url: process.env.DB_CONNECTION_URI,
};
