import { deletePlayer } from '../../../../src/repositories/players';

export default function handler(req, res) {
  if (req.method === 'DELETE') { return destroy(req, res); }
}

async function destroy(req, res) {
  try {
    await deletePlayer(req.query.id);
    res.status(204).send('');
  } catch {
    res.status(404).json({ error: 'Not Found' })
  }
}
