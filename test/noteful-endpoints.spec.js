const knex = require("knex");
const app = require("../src/app");

const foldersRouter = require("../src/folders/folders-router");
const FoldersService = require("../src/folders/folders-service");

const notesRouter = require("../src/notes/notes-router");
const NotesService = require("../src/notes/notes-service");

const { makeNotesArray, makeMaliciousNote } = require("./notes.fixtures");
const { makeFoldersArray, makeMaliciousFolder } = require("./folders.fixtures");
const supertest = require("supertest");

describe("Noteful Endpoints", function () {
  //GET TEST DATABASE
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE folders, notes RESTART IDENTITY CASCADE")
  );

  afterEach("clean the table", () =>
    db.raw("TRUNCATE folders, notes RESTART IDENTITY CASCADE")
  );

  //GET FOLDER ENDPOINT
  describe(`GET /api/folders`, () => {
    context(`Given no folders`, () => {
      it(`Responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/folders").expect(200, []);
      });
    });

    context(`Given there are folders in the database`, () => {
      const testFolders = makeFoldersArray();
      const testNotes = makeNotesArray();

      beforeEach(`insert folders`, () => {
        return db.into("folders").insert(testFolders);
      });

      it(`responds with 200 and all of the folders`, () => {
        return supertest(app).get("/api/folders").expect(200, testFolders);
      });
    });
  });

  //GET FOLDER/:id ENDPOINT

  describe(`GET /api/folders/:id`, () => {

    context(`Given no folders`, () => {
      const testFolders = makeFoldersArray();

      beforeEach(`insert folders`, () => {
        return db.into("folders").insert(testFolders);
      });

      it(`responds with 404`, () => {
        const folderId = 1234;


        return supertest(app)
          .get(`/api/folders/${folderId}`)
          .expect(404, {
            error: { message: "Folder does not exist" },
          });
      });
    });

    // context(`Given an XSS attack folder`, () => {
    //   const testFolders = makeFoldersArray();
    //   const { maliciousFolder, expectedFolder } = makeMaliciousFolder();
    // });
  });
  //GET NOTES ENDPOINT
  //GET NOTES/:noteId ENDPOINT
});
