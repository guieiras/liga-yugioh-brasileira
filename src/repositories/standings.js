import db from '../database'

export async function getSwissStandings ({ seasonId, serieId }) {
  const { rows } = await db.raw(`
    SELECT sp.player_id player_id,
      string_agg(
        CASE WHEN (sp.player_id = m.home_player_id AND m.winner = 1) THEN m.away_player_id::character varying
             WHEN (sp.player_id = m.away_player_id AND m.winner = 2) THEN m.home_player_id::character varying
             ELSE NULL
             end, ','
      ) wins,
      string_agg(
        CASE WHEN (sp.player_id = m.home_player_id AND m.winner = 0) THEN m.away_player_id::character varying
             WHEN (sp.player_id = m.away_player_id AND m.winner = 0) THEN m.home_player_id::character varying
             ELSE NULL
             end, ','
      ) draws,
      string_agg(
        CASE WHEN (sp.player_id = m.home_player_id AND m.winner = 2) THEN m.away_player_id::character varying
             WHEN (sp.player_id = m.away_player_id AND m.winner = 1) THEN m.home_player_id::character varying
             ELSE NULL
             end, ','
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
    rows.map(({ player_id: playerId, wins, draws, losses }) => ([
      playerId,
      {
        wins: wins?.split(',').map((n) => parseInt(n)) || [],
        draws: draws?.split(',').map((n) => parseInt(n)) || [],
        losses: losses?.split(',').map((n) => parseInt(n)) || []
      }
    ]))
  )
}
