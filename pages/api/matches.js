import { searchMatches } from '../../src/repositories/matches'

export default async function handler (req, res) {
  if (req.method !== 'GET') { return res.status(404).send({ error: 'Route not found' }) }

  res.send(await searchMatches({
    seasonId: req.query.season_id,
    serieId: req.query.serie_id,
    round: req.query.round,
    playoffs: req.query.playoffs?.split(',').map((query) => parseInt(query))
  }))
}
