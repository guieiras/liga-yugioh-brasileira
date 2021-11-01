import withAuthentication from '../../../src/middlewares/withAuthentication'
import { createBatchMatches } from '../../../src/repositories/matches'

export default withAuthentication(async (req, res) => {
  if (req.method !== 'POST') { return res.status(404).send({ error: 'Route not found' }) }

  const matches = await createBatchMatches({
    seasonId: req.body.season_id,
    serieId: req.body.serie_id,
    round: req.body.round,
    playoff: req.body.playoff,
    matches: req.body.matches
  })
  console.log(matches)

  res.send(matches)
})
