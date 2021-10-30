exports.up = async function (knex) {
  await knex.schema.createTable('seasons_participations', function (table) {
    table.integer('player_id')
      .unsigned()
      .notNullable()
      .index()
      .references('id')
      .inTable('players')

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

    table.unique(['player_id', 'season_id'])
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('seasons_participations')
}
