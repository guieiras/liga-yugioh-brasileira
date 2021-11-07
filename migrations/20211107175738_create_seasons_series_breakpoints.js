exports.up = async function (knex) {
  await knex.schema.createTable('seasons_series_breakpoints', function (table) {
    table.integer('season_id')
      .unsigned()
      .notNullable()
      .index()
      .references('id')
      .inTable('seasons')

    table.integer('serie_id')
      .unsigned()
      .notNullable()
      .index()
      .references('id')
      .inTable('series')

    table.string('caption').notNullable()
    table.string('color').notNullable()
    table.integer('initial_rank').notNullable()
    table.integer('final_rank').notNullable()
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('seasons_series_breakpoints')
}
