const path = require("path");
const express = require("express");
const xss = require("xss");
const NotesService = require("./notes-service");

const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNote = (note) => ({
  id: note.id,
  note_name: xss(note.note_name),
  date_modified: note.date_modified,
  content: xss(note.content),
  folder_id: note.folder_id,
});

notesRouter
  .route("/")
  .get((req, res, next) => {
    const db = req.app.get("db");
    NotesService.getAllNotes(db)
      .then((notes) => res.json(notes.map(serializeNote)))
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name, content, folder_id } = req.body;
    const newNote = { note_name, content, folder_id };
    const db = req.app.get("db");

    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing ${key} in request body` },
        });
      }
    }

    NotesService.insertNote(db, newNote)
      .then((note) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/notes/${note.Id}`))
          .json(serializeNote(note));
      })
      .catch(next);
  });

notesRouter
  .route("/:note_id")
  .all((req, res, next) => {
    const db = req.app.get("db");
    const id = req.params.note_id;

    NotesService.getNoteById(db, id)
      .then((note) => {
        if (!note) {
          return res
            .status(404)
            .json({ error: { message: `Note doesn't exist` } });
        }
        res.note = note;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note));
  })
  .delete((req, res, next) => {
    const db = req.app.get("db");
    const id = req.params.note_id;

    NotesService.deleteNote(db, id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { text, date_noted } = req.body;
    const noteToUpdate = { text, date_noted };

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body must contain either text or date_noted'`,
        },
      });
    }

    const db = req.app.get("db");
    const id = req.params.note_id;

    NotesService.updateNote(db, id, noteToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = notesRouter;
