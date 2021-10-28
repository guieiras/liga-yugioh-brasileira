import { createPlayer } from '../../../src/repositories/players';

export default function handler(req, res) {
  if (req.method === 'POST') { return create(req, res); }
}

async function create(req, res) {
  const player = await createPlayer({
    name: req.body.name,
    state: req.body.state,
    konamiId: req.body.konamiId
  });

  res.send(player);
}