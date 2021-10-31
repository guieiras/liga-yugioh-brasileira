import db from '../database'

export async function searchMatches ({ seasonId, serieId, round }) {
  const query = db('matches')
  if (seasonId) { query.where('season_id', seasonId) }
  if (serieId) { query.where('serie_id', serieId) }
  if (round === 'last') {
    const lastRound = (await db('matches').max('round', { as: 'round' }))[0].round
    query.where('round', lastRound || 1)
  } else if (round) {
    query.where('round', round)
  }

  return query.orderBy('table')
}
