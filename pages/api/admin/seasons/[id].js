import withAuthentication from '../../../../src/middlewares/withAuthentication'
import { deleteSeason, updateSeason } from '../../../../src/repositories/seasons'

export default withAuthentication((req, res) => {
  if (req.method === 'DELETE') { return destroy(req, res) }
  if (req.method === 'PUT') { return update(req, res) }

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

async function update (req, res) {
  try {
    const permittedParams = { current: req.body.current }
    const season = await updateSeason(req.query.id, permittedParams)
    if (!season) { throw new Error() }

    res.status(200).send(season)
  } catch {
    res.status(404).json({ error: 'Not Found' })
  }
}
