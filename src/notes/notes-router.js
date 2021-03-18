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

//ROUTER FOR NOTE ID '/api/:noteId'
