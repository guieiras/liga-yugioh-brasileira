import React from 'react'

import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession } from 'next-auth/react'
import { deserialize, serialize } from 'superjson'
import AdminLayout from '../../src/components/layouts/admin'
import AdminSeasonsTable from '../../src/components/admin/seasons/table'
import { authenticate } from '../../src/middlewares/session'
import { getSeasons } from '../../src/repositories/seasons'
import { del, post, put } from '../../src/requests/client'

export default function SeasonsIndex ({ seasons: json }) {
  const { push } = useRouter()
  const { t } = useTranslation()
  const { data: session } = useSession()
  const [seasons, setSeasons] = React.useState(deserialize(json))

  async function saveSeason (season) {
    return post('admin/seasons', season)
      .then((season) => {
        setSeasons([...seasons, { ...season, created_at: Date.parse(season.created_at) }])
      })
  }

  async function showSeason ({ slug }) {
    push(`/admin/seasons/${slug}`)
  }

  async function deleteSeason (seasonId) {
    return del(`admin/seasons/${seasonId}`)
      .then(() => {
        setSeasons(seasons.filter((season) => season.id !== seasonId))
      })
  }

  async function setCurrent (seasonId) {
    return put(`admin/seasons/${seasonId}`, { current: true })
      .then(() => {
        setSeasons(seasons.map((season) => ({ ...season, current: season.id === seasonId })))
      })
  }

  return (
    <AdminLayout index='seasons' session={session}>
      <Typography variant="h5" component="h1">
        {t('seasons')}
      </Typography>

      <AdminSeasonsTable
        seasons={seasons}
        sx={{ mt: 2 }}
        onDelete={deleteSeason}
        onCreate={saveSeason}
        onShow={showSeason}
        onSetCurrent={setCurrent}
      />
    </AdminLayout>
  )
}

export async function getServerSideProps (context) {
  return authenticate(async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale)),
        seasons: serialize(await getSeasons())
      }
    }
  })(context)
}
