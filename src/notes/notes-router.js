const path = require("path");
const express = require("express");
const xss = require("xss");
const NotesService = require("./notes-service");

const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNote = (note) => ({
  id: note.id,
  name: xss(note.name),
  modified: note.modified,
  folderId: note.folderId,
  content: xss(note.content),
});

//ROUTER FOR BASE '/'

notesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");

    NotesService.getAllNotes(knexInstance)
      .then((notes) => {
        res.json(notes.map(serializeNote));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, content } = req.body;
    const newNote = { name, content };

    for (const [key, value] of Object.entries(newFolder)) {
      if (value === null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    NotesService.insertNote(req.app.get("db"), newNote)
      .then((note) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `api/notes/${note.id}`))
          .json(serializeNote(note));
      })
      .catch(next);
  });

//ROUTER FOR NOTE ID '/api/notes/:noteId'
notesRouter
  .route("/api/notes/:noteId")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");

    NotesService.getById(knexInstance, req.params.noteId)
      .then((note) => {
        if (!note) {
          return res.status(400).json({
            error: { message: `Folder does not exist` },
          });
        }
        res.json(serializeNote(note));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(req.app.get("db"), req.params.noteId)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, content } = req.body;
    const noteToUpdate = { name, content };

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;

    if (numberOfValues === 0) {
      return res.status(400).json({
        error: { message: `Request body must contain 'name' and 'content'.` },
      });
    }

    NotesService.updateNote(
      req.app.get("db"),
      req.params.folderId,
      noteToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;
