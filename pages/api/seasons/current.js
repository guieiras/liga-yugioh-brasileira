import { fetchCurrentSeason } from '../../../src/repositories/seasons'

export default async (req, res) => {
  if (req.method !== 'GET') { return res.status(404).send({ error: 'Route not found' }) }

  res.send(await fetchCurrentSeason())
}
