import { WebAuth } from 'auth0-js'

const auth0Client = new WebAuth({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID
})

export const client = auth0Client
export function logout (returnTo) {
  auth0Client.logout({
    returnTo: `${window.location.origin}${returnTo}`,
    client_id: process.env.AUTH0_CLIENT_ID
  })
}
