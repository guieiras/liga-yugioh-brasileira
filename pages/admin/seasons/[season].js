import React from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession } from 'next-auth/react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import PeopleIcon from '@mui/icons-material/People'
import { deserialize, serialize } from 'superjson'
import AdminLayout from '../../../src/components/layouts/admin'
import Button from '../../../src/components/Button'
import { authenticate } from '../../../src/middlewares/session'
import { getSeries } from '../../../src/repositories/series'
import { getSeasonBySlug } from '../../../src/repositories/seasons'

export default function AdminSeasonShow ({ data: json }) {
  const { t } = useTranslation()
  const { locale, season, series } = deserialize(json)
  const { data: session } = useSession()

  return (
    <AdminLayout title={season.name} session={session}>
      <Typography variant="h5" component="h1">{season.name}</Typography>
      {
        series.map((serie) => <Card sx={{ mt: 3 }} key={serie.id}>
          <CardContent>
            <Typography variant="h6" component="h2" sx={{ color: serie.color }}>
              {serie[`name_${locale}`]}
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
              <Button
                color='info'
                href={`/admin/seasons/${season.slug}/series/${serie.slug}`}
                startIcon={<AccountTreeIcon />}
                variant='outlined'
              >
                { t('matches') }
              </Button>
              <Button
                color='info'
                href={`/admin/seasons/${season.slug}/series/${serie.slug}/participations`}
                startIcon={<PeopleIcon />}
                variant='outlined'
              >
                { t('participations') }
              </Button>
            </Stack>
          </CardContent>
        </Card>)
      }
    </AdminLayout>
  )
}

export async function getServerSideProps (context) {
  return authenticate(async ({ query, locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale)),
        data: serialize({
          locale,
          series: await getSeries(),
          season: await getSeasonBySlug(query.season)
        })
      }
    }
  })(context)
}
