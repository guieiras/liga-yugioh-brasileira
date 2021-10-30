import React from 'react'

import Typography from '@mui/material/Typography'
import { useSession } from 'next-auth/react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { deserialize, serialize } from 'superjson'
import AdminLayout from '../../src/components/layouts/admin'
import AdminPlayersTable from '../../src/components/admin/players/table'
import AdminPlayersForm from '../../src/components/admin/players/form'
import { getPlayers } from '../../src/repositories/players'
import { del, post } from '../../src/requests/client'
import { authenticate } from '../../src/middlewares/session'

export default function Index ({ players: json }) {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const [players, setPlayers] = React.useState(deserialize(json))

  async function savePlayer (player) {
    return post('admin/players', player)
      .then((player) => {
        setPlayers([...players, { ...player, created_at: Date.parse(player.created_at) }])
      })
  }

  async function deletePlayer (playerId) {
    return del(`admin/players/${playerId}`)
      .then(() => {
        setPlayers(players.filter((player) => player.id !== playerId))
      })
  }

  return (
    <AdminLayout index='players' session={session}>
      <Typography variant="h5" component="h2">
        {t('admin.players')}
      </Typography>

      <AdminPlayersTable players={players} sx={{ mt: 2 }} onDelete={deletePlayer} />

      <Typography variant="h6" component="h3" mt={3}>
        {t('admin.players.form.title')}
      </Typography>

      <AdminPlayersForm sx={{ mt: 4 }} onSubmit={savePlayer} />
    </AdminLayout>
  )
}

export async function getServerSideProps (context) {
  return authenticate(async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale)),
        players: serialize(await getPlayers())
      }
    }
  })(context)
}
