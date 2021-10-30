import withAuthentication from '../../../../src/middlewares/withAuthentication'
import { deletePlayer } from '../../../../src/repositories/players'

export default withAuthentication((req, res) => {
  if (req.method === 'DELETE') { return destroy(req, res) }

  return res.status(404).send({ error: 'Route not found' })
})

async function destroy (req, res) {
  try {
    await deletePlayer(req.query.id)
    res.status(204).send('')
  } catch {
    res.status(404).json({ error: 'Not Found' })
  }
}
