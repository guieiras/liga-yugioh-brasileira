import db from '../database'

export async function searchMatches ({ seasonId, serieId, round }) {
  const query = db('matches')
  if (seasonId) { query.where('season_id', seasonId) }
  if (serieId) { query.where('serie_id', serieId) }
  if (round === 'last') {
    const lastRound = (await query.clone().max('round', { as: 'round' }))[0].round
    query.where('round', lastRound || 1)
  } else if (round) {
    query.where('round', round)
  }

  return query.orderBy('table')
}

export async function createBatchMatches ({ seasonId, serieId, round, playoff, matches }) {
  if (!seasonId || !serieId || !matches) { return [] }
  if ((round && playoff) || (!round && !playoff)) { return [] }

  const fields = {
    season_id: seasonId,
    serie_id: serieId,
    ...(round ? { round } : { playoff })
  }

  try {
    const savedResults = []

    await db.transaction(async (transaction) => {
      await transaction('matches').where(fields).del()

      await Promise.all(matches.map(async (match, i) => {
        const matchAttributes = {
          home_player_id: match[0],
          away_player_id: match[1],
          ...fields,
          table: i + 1,
          created_at: new Date(),
          updated_at: new Date()
        }
        const [id] = await transaction('matches').returning('id').insert(matchAttributes)

        savedResults.push({ id, ...matchAttributes })
      }))
    })

    return savedResults
  } catch (error) {
    return []
  }
}

export async function updateMatch ({ id, winner, analysisUrl, replayUrl }) {
  const query = db('matches').where('id', id)

  const updateParams = {}
  if (winner) updateParams.winner = parseInt(winner)
  if (analysisUrl) updateParams.prrj_youtube_video_url = analysisUrl
  if (replayUrl) updateParams.dueling_book_replay_url = replayUrl

  const returnedValues = await query.clone().update(updateParams)
  if (returnedValues > 0) { return (await query.select('*'))[0] }
}
