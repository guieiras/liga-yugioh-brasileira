import db from '../database'

export async function getSeries () {
  return db('series').select('*').orderBy('position')
}
