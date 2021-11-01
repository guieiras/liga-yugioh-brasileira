import withAuthentication from '../../../../src/middlewares/withAuthentication'
import { updateMatch } from '../../../../src/repositories/matches'

export default withAuthentication((req, res) => {
  if (req.method === 'PUT') { return update(req, res) }

  return res.status(404).send({ error: 'Route not found' })
})

async function update(req, res) {
  try {
    const match = await updateMatch({
      id: req.query.id,
      winner: req.body.winner,
      analysisUrl: req.body.analysis_url,
      replayUrl: req.body.replay_url
    })

    res.status(200).send(match)
  } catch (e) {
    res.status(404).json({ error: 'Not Found' })
  }
}
