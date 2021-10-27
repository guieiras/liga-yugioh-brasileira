
exports.up = async function (knex) {
  await knex.schema.createTable('players', function (table) {
    table.increments();
    table.string('name');
    table.string('konami_id');
    table.string('state');
    table.timestamps();
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('players');
};
