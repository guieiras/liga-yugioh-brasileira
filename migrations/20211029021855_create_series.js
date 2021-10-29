exports.up = async function (knex) {
  await knex.schema.createTable('series', function (table) {
    table.increments()
    table.string('name_pt')
    table.string('name_en')
    table.string('color')
    table.integer('position')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('series')
}
