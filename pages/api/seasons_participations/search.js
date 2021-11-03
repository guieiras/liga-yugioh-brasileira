import { searchPlayersByParticipation } from '../../../src/repositories/players'

export default async function handler (req, res) {
  if (req.method !== 'POST') { return res.status(404).send({ error: 'Route not found' }) }

  const { participations } = req.body

  if (Array.isArray(participations) && participations.length < 5) {
    res.send(await searchPlayersByParticipation(participations))
  } else {
    res.status(400).send({ error: 'Participations is not valid' })
  }
}
