import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function AdminSignIn () {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const { push } = useRouter()

  const login = () => {
    signIn('auth0')

    return null
  }

  const redirectToDashboard = () => {
    push('/admin/players')

    return null
  }

  if (loading || !session) {
    return <Container align='center' sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      justifyContent: 'center',
      textAlign: 'center'
    }}>
        <div>
          { (!loading && !session) ? login() : null }
          <CircularProgress />
        </div>
    </Container>
  }

  if (session) { return redirectToDashboard() }
}
