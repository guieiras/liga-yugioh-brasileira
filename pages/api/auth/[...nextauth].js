import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'

export default NextAuth({
  providers: [
    Auth0Provider({
      issuer: `https://${process.env.AUTH0_DOMAIN}`,
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET
    })
  ],
  secret: process.env.AUTH_SECRET
})
