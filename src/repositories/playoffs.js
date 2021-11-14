import db from '../database'

export async function getPlayoffs ({ seasonId, serieId }) {
  const query = db('matches')
  if (seasonId) { query.where('season_id', seasonId) }
  if (serieId) { query.where('serie_id', serieId) }
  query.whereNotNull('playoff')

  return (await query.distinct('playoff')).map((row) => row.playoff)
}
