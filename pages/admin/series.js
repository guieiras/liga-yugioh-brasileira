import Typography from '@mui/material/Typography'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession } from 'next-auth/react'
import { deserialize, serialize } from 'superjson'
import AdminLayout from '../../src/components/layouts/admin'
import AdminSeriesTable from '../../src/components/admin/series/table'
import { authenticate } from '../../src/middlewares/session'
import { getSeries } from '../../src/repositories/series'

export default function SeriesIndex ({ series: json }) {
  const { t } = useTranslation()
  const series = deserialize(json)
  const { data: session } = useSession()

  return (
    <AdminLayout index='series' session={session}>
      <Typography variant="h5" component="h1">
        { t('series') }
      </Typography>

      <AdminSeriesTable series={series} sx={{ mt: 2 }} />
    </AdminLayout>
  )
}

export async function getServerSideProps (context) {
  return authenticate(async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale)),
        series: serialize(await getSeries())
      }
    }
  })(context)
}
