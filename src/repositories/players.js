import db from '../database'

export async function getPlayers () {
  const playerFields = [
    'players.id', 'players.name', 'players.konami_id', 'players.state',
    'players.created_at', 'players.updated_at'
  ]

  return db('players')
    .select(...playerFields, db.raw('count(seasons_participations.season_id) = 0 as deletable'))
    .leftJoin('seasons_participations', 'players.id', 'seasons_participations.player_id')
    .groupBy(...playerFields)
    .orderBy('name')
}

export async function searchPlayers ({ name, id, nid }) {
  const query = db('players')
  if (name) { query.where('name', 'like', `%${name}%`) }
  if (id) { query.whereIn('id', Array.isArray(id) ? id : [id]) }
  if (nid) { query.whereNotIn('id', Array.isArray(nid) ? nid : [nid]) }

  return query
}

export async function searchPlayersByParticipation (participations) {
  const query =
    db('players')
      .join('seasons_participations', 'seasons_participations.player_id', 'players.id')
      .distinct('players.id', 'players.name', 'players.state')

  participations.forEach(participation => (
    query.orWhere({
      season_id: participation.season_id,
      serie_id: participation.serie_id
    })
  ))

  return query
}

export async function createPlayer ({ name, state, konamiId }) {
  const player = {
    name,
    state,
    konami_id: konamiId,
    created_at: new Date(),
    updated_at: new Date()
  }

  const [id] = await db('players').insert(player)

  return { id, ...player, deletable: true }
}

export async function deletePlayer (playerId) {
  const rows = await db('players').where('id', playerId).del()

  if (rows === 0) { throw new Error('Not Found') };
  return true
}
