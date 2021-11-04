import Container from '@mui/material/Container'
import CircularProgress from '@mui/material/CircularProgress'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function AdminSignIn () {
  const { t } = useTranslation()
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const { replace } = useRouter()

  const login = () => {
    signIn('auth0')

    return null
  }

  const redirectToDashboard = () => {
    replace('/admin')
    return null
  }

  return <>
    <Head>
      <title>{t('admin.home')}</title>
    </Head>

    { (loading || !session) && <Container align='center' sx={{
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
    </Container> }

    { session && redirectToDashboard() }
  </>
}

export async function getStaticProps ({ locale }) {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale))
    }
  }
}
