import { getSeasonBySlug } from '../../../../../src/repositories/seasons'
import { getSerieBySlug } from '../../../../../src/repositories/series'

export default async function handler (req, res) {
  if (req.method !== 'GET') { return res.status(404).send({ error: 'Route not found' }) }

  res.send({
    season: await getSeasonBySlug(req.query.season),
    serie: await getSerieBySlug(req.query.serie)
  })
}
