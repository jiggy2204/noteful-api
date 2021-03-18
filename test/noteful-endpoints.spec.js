const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe("Noteful Endpoints", function () {
  //GET TEST DATABASE
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE folders, notes RESTART IDENTITY CASCADE")
  );

  afterEach("clean the table", () =>
    db.raw("TRUNCATE folders, notes RESTART IDENTITY CASCADE")
  );
  //GET ALL ENDPOINTS
  //GET FOLDER ENDPOINT
  //GET FOLDER/:folderId ENDPOINT
  //GET NOTES ENDPOINT
  //GET NOTES/:noteId ENDPOINT
});
