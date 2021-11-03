exports.up = async function (knex) {
  await knex.schema.table('seasons', function (table) {
    table.boolean('current')
    table.boolean('hidden')
  })

  await knex('seasons').update({ current: false, hidden: false })

  await knex.schema.table('seasons', function (table) {
    table.boolean('current').notNullable().alter()
    table.boolean('hidden').notNullable().alter()
  })
}

exports.down = async function (knex) {
  await knex.schema.table('seasons', function (table) {
    table.dropColumn('current')
    table.dropColumn('hidden')
  })
}
