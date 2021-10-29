import React from 'react'

import Typography from '@mui/material/Typography'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { deserialize, serialize } from 'superjson'
import AdminLayout from '../../src/components/layouts/admin'
import AdminSeasonsTable from '../../src/components/admin/seasons/table'
import { getSeasons } from '../../src/repositories/seasons'
import { del, post } from '../../src/requests/client'

export default function SeasonsIndex ({ seasons: json }) {
  const { t } = useTranslation()
  const [seasons, setSeasons] = React.useState(deserialize(json))

  async function saveSeason (season) {
    return post('admin/seasons', season)
      .then((season) => {
        setSeasons([...seasons, { ...season, created_at: Date.parse(season.created_at) }])
      })
  }

  async function deleteSeason (seasonId) {
    return del(`admin/seasons/${seasonId}`)
      .then(() => {
        setSeasons(seasons.filter((season) => season.id !== seasonId))
      })
  }

  return (
    <AdminLayout index='seasons'>
      <Typography variant="h5" component="h2">
        {t('admin.seasons')}
      </Typography>

      <AdminSeasonsTable
        seasons={seasons}
        sx={{ mt: 2 }}
        onDelete={deleteSeason}
        onCreate={saveSeason}
      />
    </AdminLayout>
  )
}

export async function getServerSideProps ({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      seasons: serialize(await getSeasons())
    }
  }
}
