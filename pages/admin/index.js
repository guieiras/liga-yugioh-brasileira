import React from 'react'

import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ShieldIcon from '@mui/icons-material/Shield'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import NextLink from 'next/link'
import { deserialize, serialize } from 'superjson'
import AdminLayout from '../../src/components/layouts/admin'
import { authenticate } from '../../src/middlewares/session'
import Link from '../../src/components/Link'
import { fetchCurrentSeason } from '../../src/repositories/seasons'

export default function Index ({ locale, series: json }) {
  const series = deserialize(json)
  const { data: session } = useSession()
  const { t } = useTranslation()

  function Card ({ title, description, href, children }) {
    return <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <Typography variant="body2" gutterBottom>{description}</Typography>

      { href && <Link href={href}>{t('admin.cards.link')}</Link> }
      {children}
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
        {
          series && <Card title={t('seasons.current')} description={t('admin.cards.seasons.current')}>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              { series.map((serie) => (
                <NextLink passHref href={`/admin/seasons/${serie.season_id}/series/${serie.serie_id}`} key={serie.serie_id}>
                  <Button startIcon={<ShieldIcon sx={{ color: serie.color }} />} variant="outlined">
                    { serie[`name_${locale}`]}
                  </Button>
                </NextLink>
              )) }
            </Stack>
          </Card>
        }
        <Card title={t('players')} description={t('admin.cards.players')} href="admin/players" />
        <Card title={t('seasons')} description={t('admin.cards.seasons')} href="admin/seasons" />
      </Stack>
    </AdminLayout>
  )
}

export async function getServerSideProps (context) {
  return authenticate(async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale)),
        locale,
        series: serialize(await fetchCurrentSeason())
      }
    }
  })(context)
}
