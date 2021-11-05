import db from '../database'

export async function getSeries () {
  return db('series').select('*').orderBy('position')
}

export async function getSerie (serieId) {
  return (await db('series').where('id', serieId).limit(1))[0]
}

export async function getSerieBySlug (serieSlug) {
  return (await db('series').where('slug', serieSlug).limit(1))[0]
}
