import React from 'react'

import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import AdminLayout from '../../src/components/layouts/admin'
import { authenticate } from '../../src/middlewares/session'
import Link from '../../src/components/Link'

export default function Index() {
  const { data: session } = useSession()
  const { t } = useTranslation()

  function Card ({ title, description, href }) {
    return <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>

      <Typography variant="body2" gutterBottom>{description}</Typography>
      <Link href={href}>{t('admin.cards.link')}</Link>
    </Paper>
  }

  return (
    <AdminLayout title={t('admin.home')} session={session}>
      <Typography variant="h5" component="h1" gutterBottom>
        {t('admin.home')}
      </Typography>

      <Typography gutterBottom>
        {t('admin.home.description')}
      </Typography>

      <Stack sx={{ mt: 1 }} spacing={2}>
        <Card title={t('seasons.current')} description={t('admin.cards.seasons.current')} href="admin/players" />
        <Card title={t('players')} description={t('admin.cards.players')} href="admin/players" />
        <Card title={t('seasons')} description={t('admin.cards.seasons')} href="admin/seasons" />
      </Stack>
    </AdminLayout>
  )
}

export async function getServerSideProps(context) {
  return authenticate(async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale))
      }
    }
  })(context)
}
