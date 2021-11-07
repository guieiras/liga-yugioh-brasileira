import db from '../database'

export async function getBreakpoints ({ seasonId, serieId }) {
  return db('seasons_series_breakpoints')
    .select('caption', 'color', 'initial_rank', 'final_rank')
    .where('season_id', seasonId)
    .where('serie_id', serieId)
}
