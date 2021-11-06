import db from '../database'

export async function getSwissStandings ({ seasonId, serieId }) {
  const [result] = await db.raw(`
    SELECT sp.player_id player_id,
      GROUP_CONCAT(
        IF(sp.player_id = m.home_player_id AND m.winner = 1, m.away_player_id, IF(sp.player_id = m.away_player_id AND m.winner = 2, m.home_player_id, NULL))
      ) wins,
      GROUP_CONCAT(
        IF(sp.player_id = m.home_player_id AND m.winner = 0, m.away_player_id, IF(sp.player_id = m.away_player_id AND m.winner = 0, m.home_player_id, NULL))
      ) draws,
      GROUP_CONCAT(
        IF(sp.player_id = m.home_player_id AND m.winner = 2, m.away_player_id, IF(sp.player_id = m.away_player_id AND m.winner = 1, m.home_player_id, NULL))
      ) losses
    FROM seasons_participations sp
    LEFT JOIN matches m
    ON m.season_id = sp.season_id
      AND m.serie_id = sp.serie_id
      AND m.round IS NOT NULL
      AND m.winner IS NOT NULL
    AND(m.home_player_id = sp.player_id OR m.away_player_id = sp.player_id)
    WHERE sp.season_id = :seasonId AND sp.serie_id = :serieId
    GROUP BY sp.player_id
  `, { seasonId, serieId })

  return Object.fromEntries(
    result.map(({ player_id: playerId, wins, draws, losses }) => ([
      playerId,
      {
        wins: wins?.split(',').map((n) => parseInt(n)) || [],
        draws: draws?.split(',').map((n) => parseInt(n)) || [],
        losses: losses?.split(',').map((n) => parseInt(n)) || []
      }
    ]))
  )
}
