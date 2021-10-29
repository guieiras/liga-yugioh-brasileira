import Typography from '@mui/material/Typography'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { deserialize, serialize } from 'superjson'
import AdminLayout from '../../src/components/layouts/admin'
import AdminSeriesTable from '../../src/components/admin/series/table'
import { getSeries } from '../../src/repositories/series'

export default function SeriesIndex ({ series: json }) {
  const { t } = useTranslation()
  const series = deserialize(json)

  return (
    <AdminLayout index='series'>
      <Typography variant="h5" component="h2">
        { t('admin.series') }
      </Typography>

      <AdminSeriesTable series={series} sx={{ mt: 2 }} />
    </AdminLayout>
  )
}

export async function getServerSideProps ({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      series: serialize(await getSeries())
    }
  }
}
