exports.up = async function (knex) {
  await knex.schema.createTable('matches', function (table) {
    table.increments()

    table.integer('home_player_id')
      .unsigned()
      .notNullable()
      .index()
      .references('id')
      .inTable('players')

    table.integer('away_player_id')
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

    table.integer('round').index()
    table.integer('playoff').index()
    table.integer('winner')
    table.string('prrj_youtube_video_url')
    table.string('dueling_book_replay_url')
    table.timestamps()
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTable('matches')
}
