require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const { NODE_ENV } = require("./config");
const { default: knex } = require("knex");

const foldersRouter = require("./folders/folders-router");
const notesRouter = require("./notes/notes-router");

const app = express();
const morganOption = NODE_ENV === "production";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use("/api/folders", foldersRouter);
app.use("/api/notes", notesRouter);

//GET root page, send back 'Hello, world!' on web page
// app.get("/", (req, res) => {
//   res.send("Hello, world!");
// });

// app.get("/api/folders", (req, res) => {
//   console.log(res.send("Retrieved folders"));
// });

// app.get("/api/notes", (req, res) => {
//   console.log(res.send("Retrieved notes"));
// });

//Hide error message from users and outsiders
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }

  res.status(500).json(response);
});

module.exports = app;
