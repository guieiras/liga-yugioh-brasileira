import { getPlayoffs } from '../../src/repositories/playoffs'

export default async function handler (req, res) {
  if (req.method !== 'GET') { return res.status(404).send({ error: 'Route not found' }) }

  res.send(await getPlayoffs({
    seasonId: req.query.season_id,
    serieId: req.query.serie_id
  }))
}
