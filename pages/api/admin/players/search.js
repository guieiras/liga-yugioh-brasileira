import withAuthentication from '../../../../src/middlewares/withAuthentication'
import { searchPlayers } from '../../../../src/repositories/players'

export default withAuthentication((req, res) => {
  if (req.method === 'POST') { return search(req, res) }

  return res.status(404).send({ error: 'Route not found' })
})

async function search (req, res) {
  const { name, id, nid } = req.body

  return res.json(await (searchPlayers({ name, id, nid })))
}
