import withAuthentication from '../../../../src/middlewares/withAuthentication'
import { searchMatches } from '../../../../src/repositories/matches'

export default withAuthentication(async (req, res) => {
  if (req.method !== 'GET') { return res.status(404).send({ error: 'Route not found' }) }

  res.send(await searchMatches({
    seasonId: req.query.season_id,
    serieId: req.query.serie_id,
    round: req.query.round
  }))
})
