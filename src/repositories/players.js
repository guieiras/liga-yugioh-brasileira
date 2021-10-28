import db from '../database';

export async function getPlayers() {
  return db('players').select('*').orderBy('name');
}
