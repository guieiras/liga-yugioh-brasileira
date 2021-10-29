import { createSeason } from '../../../src/repositories/seasons'

export default function handler (req, res) {
  if (req.method === 'POST') { return create(req, res) }

  return res.status(404).send({ error: 'Route not found' })
}

async function create (req, res) {
  const season = await createSeason({ name: req.body.name })

  res.send(season)
}
