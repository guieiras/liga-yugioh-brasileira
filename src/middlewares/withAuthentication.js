import { getSession } from 'next-auth/react'

export default function withAuthentication (handler) {
  return async (req, res) => {
    const session = await getSession({ req })

    if (!session) { return res.status(401).send({ error: 'Unauthorized' }) }

    return handler({ ...req, session }, res)
  }
}
