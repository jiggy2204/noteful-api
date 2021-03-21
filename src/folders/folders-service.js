const FoldersService = {
  getAllFolders(knex) {
    return knex.select("*").from("folders");
  },

  insertFolder(knex, newNote) {
    return knex
      .insert(newNote)
      .into("folders")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("folders").select("*").where("id", id).first();
  },

  deleteFolder(knex, id) {
    return knex("folders").where({ id }).delete();
  },

  updateFolder(knex, id, newNoteFields) {
    return knex("folders").where({ id }).update(newNoteFields);
  },
};

module.exports = FoldersService;
