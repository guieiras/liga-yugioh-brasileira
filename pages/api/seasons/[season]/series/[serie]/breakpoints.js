import { getBreakpoints } from '../../../../../../src/repositories/breakpoints'

export default async function handler (req, res) {
  if (req.method !== 'GET') { return res.status(404).send({ error: 'Route not found' }) }

  res.send(await getBreakpoints({ seasonId: req.query.season, serieId: req.query.serie }))
}
