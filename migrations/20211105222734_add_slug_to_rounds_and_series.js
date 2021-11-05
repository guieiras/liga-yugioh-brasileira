exports.up = async function (knex) {
  await knex.schema.table('seasons', function (table) {
    table.string('slug')
  })

  await knex('seasons').update({ slug: knex.ref('name') })

  await knex.schema.alterTable('seasons', function (table) {
    table.string('slug').notNullable().alter()
    table.unique('slug')
  })

  await knex.schema.table('series', function (table) {
    table.string('slug')
  })

  await knex('series').update({ slug: knex.ref('name_en') })

  await knex.schema.alterTable('series', function (table) {
    table.string('slug').notNullable().alter()
    table.unique('slug')
  })
}

exports.down = async function (knex) {
  await knex.schema.alterTable('seasons', function (table) {
    table.dropColumn('slug')
  })
  await knex.schema.alterTable('series', function (table) {
    table.dropColumn('slug')
  })
}
