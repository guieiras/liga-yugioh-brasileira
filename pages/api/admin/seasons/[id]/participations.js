import withAuthentication from '../../../../../src/middlewares/withAuthentication'
import { createSeasonParticipation, getParticipations } from '../../../../../src/repositories/seasons'

export default withAuthentication((req, res) => {
  if (req.method === 'GET') { return index(req, res) }
  if (req.method === 'POST') { return create(req, res) }

  return res.status(404).send({ error: 'Route not found' })
})

async function index (req, res) {
  const options = {}

  if (req.query.serie_id) { options.serieId = req.query.serie_id }

  res.send(await getParticipations(req.query.id, options))
}

async function create (req, res) {
  res.send(await createSeasonParticipation({
    playerId: req.body.playerId, seasonId: req.query.id, serieId: req.body.serieId
  }))
}
