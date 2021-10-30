import withAuthentication from '../../../../src/middlewares/withAuthentication'
import { deleteSeason } from '../../../../src/repositories/seasons'

export default withAuthentication((req, res) => {
  if (req.method === 'DELETE') { return destroy(req, res) }

  return res.status(404).send({ error: 'Route not found' })
})

async function destroy (req, res) {
  try {
    await deleteSeason(req.query.id)
    res.status(204).send('')
  } catch {
    res.status(404).json({ error: 'Not Found' })
  }
}
