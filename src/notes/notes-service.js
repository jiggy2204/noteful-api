const xss = require("xss");

const NotesService = {
  getAllNotes(knex) {
    return knex.select("*").from("notes");
  },

  insertNote(knex, newNote) {
    return knex
      .insert(newNote)
      .into("notes")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getNoteById(knex, id) {
    return knex.from("notes").select("*").where("id", id).first();
  },

  deleteNote(knex, id) {
    return knex("note").where({ id }).delete();
  },

  updateNote(knex, id, newNoteFields) {
    return knex("note").where({ id }).update(newNoteFields);
  },
};

module.exports = NotesService;
