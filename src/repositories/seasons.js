import db from '../database'

export async function getSeasons () {
  return db('seasons').select('*').orderBy('created_at')
}

export async function getSeason (seasonId) {
  const seasons = await db('seasons').select('*').where('id', seasonId).limit(1)

  return seasons[0]
}

export async function createSeason ({ name }) {
  const season = {
    name,
    created_at: new Date(),
    updated_at: new Date()
  }

  const [id] = await db('seasons').insert(season)

  return { id, ...season }
}

export async function deleteSeason (seasonId) {
  const rows = await db('seasons').where('id', seasonId).del()

  if (rows === 0) { throw new Error('Not Found') }
  return true
}

export async function getParticipations (seasonId) {
  return db('seasons_participations').where('season_id', seasonId)
}

export async function createSeasonParticipation ({ playerId, seasonId, serieId }) {
  const participation = {
    player_id: playerId,
    season_id: seasonId,
    serie_id: serieId
  }

  await db('seasons_participations').insert(participation)

  return participation
}

export async function deleteSeasonParticipation ({ playerId, seasonId }) {
  const rows = await db('seasons_participations')
    .where('season_id', seasonId)
    .where('player_id', playerId)
    .del()

  if (rows === 0) { throw new Error('Not Found') }
  return true
}
