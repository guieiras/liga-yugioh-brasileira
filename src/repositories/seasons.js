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

export async function updateSeason (id, { current }) {
  try {
    let returnedValue

    await db.transaction(async (transaction) => {
      const query = transaction('seasons').where('id', id)
      const season = (await query.clone().select('*'))[0]
      returnedValue = season

      if (!season) { return returnedValue = null }
      if (current) {
        await transaction('seasons').update({ current: false })
        await query.clone().update({ current: true })

        returnedValue.current = true
      }

      await query.clone().update({ updated_at: new Date() })
    })

    return returnedValue
  } catch {
    return null
  }
}

export async function deleteSeason (seasonId) {
  const rows = await db('seasons').where('id', seasonId).del()

  if (rows === 0) { throw new Error('Not Found') }
  return true
}

export async function getParticipations (seasonId, filters = {}) {
  const query = db('seasons_participations').where('season_id', seasonId)

  if (filters.serieId) { query.where('serie_id', filters.serieId) }

  return query
}

export async function fetchCurrentSeason () {
  const query = db('seasons')
    .join('seasons_participations', 'seasons_participations.season_id', 'seasons.id')
    .join('series', 'seasons_participations.serie_id', 'series.id')

  return query.distinct(
    'series.id as serie_id',
    'seasons.id as season_id',
    'series.name_pt',
    'series.name_en'
  ).where('seasons.current', true)
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
