import { getSession } from 'next-auth/react'

export function authenticate (fn) {
  return async (context) => {
    const session = await getSession(context)

    if (!session) {
      return {
        redirect: {
          destination: '/admin/sign_in',
          permanent: false
        }
      }
    }

    return fn(context)
  }
}
