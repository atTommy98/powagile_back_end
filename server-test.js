require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;

// Replace process.env.DB_URL with your actual connection string
const connectionString = process.env.DATABASE_URL;

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("users");
    const quotesCollection = db.collection("quotes");

    // Middlewares
    // Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static("public"));

    // Routes
    // app.get("/", (req, res) => {
    //   res.sendFile(__dirname + "/index.html");
    // });

    // CRUD - READ
    app.get("/", (req, res) => {
      db.collection("quotes")
        .find()
        .toArray()
        .then((results) => {
          console.log(results);
        })
        .catch((error) => console.error(error));
    });

    // CRUD - CREATE
    app.post("/quotes", (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    //CRUD - UPDATE
    // app.put("/quotes", (req, res) => {
    //   console.log(req.body);
    // });

    app.put("/quotes", (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: "Yoda" },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => res.json("Success"))
        .catch((error) => console.error(error));
    });

    // CRUD - DELETE
    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json(`Deleted Darth Vadar's quote`);
        })
        .catch((error) => console.error(error));
    });

    //Listen to PORT
    app.listen(5000, function () {
      console.log("listening on 5000");
    });
  })
  .catch(console.error);
