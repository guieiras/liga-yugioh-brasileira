import withAuthentication from '../../../../../../src/middlewares/withAuthentication'
import { deleteSeasonParticipation } from '../../../../../../src/repositories/seasons'

export default withAuthentication((req, res) => {
  if (req.method === 'DELETE') { return destroy(req, res) }

  return res.status(404).send({ error: 'Route not found' })
})

async function destroy (req, res) {
  res.send(await deleteSeasonParticipation({
    playerId: req.query.player, seasonId: req.query.id
  }))
}
