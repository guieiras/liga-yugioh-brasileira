import db from '../database';

export async function getPlayers() {
  return db('players').select('*').orderBy('name');
}

export async function createPlayer({ name, state, konamiId }) {
  const player = {
    name,
    state,
    konami_id: konamiId,
    created_at: new Date(),
    updated_at: new Date()
  }

  const [id] = await db('players').insert(player);

  return { id, ...player };
}
