import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession } from 'next-auth/react'
import { deserialize, serialize } from 'superjson'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import AdminLayout from '../../../../../src/components/layouts/admin'
import { authenticate } from '../../../../../src/middlewares/session'
import { getSerie } from '../../../../../src/repositories/series'
import { getSeason } from '../../../../../src/repositories/seasons'
import { get, post } from '../../../../../src/requests/client'
import MatchesForm from '../../../../../src/components/matches/form'
import MatchesPanel from '../../../../../src/components/matches/panel'

export default function AdminSeasonMatches ({ data: json }) {
  const { locale, season, serie } = deserialize(json)
  const { data: session } = useSession()
  const [loading, setLoading] = React.useState(true)
  const [matches, setMatches] = React.useState({})
  const [players, setPlayers] = React.useState({})
  const [currentRound, setCurrentRound] = React.useState(0)
  const [lastRound, setLastRound] = React.useState(0)
  const [editableRound, setEditableRound] = React.useState(null)

  React.useEffect(() => {
    Promise.all([getParticipations(), getRound()]).then(() => { setLoading(false) })
  }, [])

  function handleNewRound () {
    setEditableRound(lastRound + 1)
  }

  function handleBack () {
    getRound(currentRound - 1)
    setCurrentRound(currentRound - 1)
  }

  function handleForward () {
    getRound(currentRound + 1)
    setCurrentRound(currentRound + 1)
  }

  function handleEdit () {
    setEditableRound(currentRound)
  }

  async function getParticipations () {
    const participations = await get(`admin/seasons/${season.id}/participations`, { serie_id: serie.id })
    const results = await post('admin/players/search', { id: participations.map((participation) => participation.player_id) })

    setPlayers(Object.fromEntries(results.map((result) => [result.id, result.name])))
  }

  async function getRound (round, force = false) {
    const roundParam = round || 'last'
    if (!matches[round] || force) {
      const results = await get('admin/matches/search', { season_id: season.id, serie_id: serie.id, round: roundParam })
      const fetchedRound = results[0]?.round

      if (results.length > 0) { setMatches({ ...matches, [fetchedRound]: results }) }
      if (!round) {
        setLastRound(fetchedRound || 0)
        setCurrentRound(fetchedRound || 0)
      }
    }

    if (round) { setCurrentRound(round) }
  }

  async function cancelRound () {
    setEditableRound(null)
  }

  async function saveRound (matches) {
    await post(
      'admin/matches',
      { season_id: season.id, serie_id: serie.id, round: editableRound, matches }
    )

    setMatches({ ...matches, [editableRound]: undefined })
    getRound(editableRound, true)
    setCurrentRound(editableRound)
    setEditableRound(null)
    setLastRound(Math.max(lastRound, editableRound))
  }

  return (
    <AdminLayout title={season.name} session={session}>
      <Typography variant="h5" component="h1">{season.name} | {serie[`name_${locale}`]}</Typography>

      {
        loading
          ? <Paper sx={{ mt: 2, p: 2, textAlign: 'center' }}>
            <CircularProgress />
          </Paper>
          : editableRound !== null
          ? <MatchesForm
              onCancel={cancelRound}
              onSubmit={saveRound}
              matches={matches[currentRound]}
              players={players}
              round={editableRound}
              sx={{ mt: 2 }}
            />
          : <MatchesPanel
              lastRound={lastRound}
              matches={matches[currentRound] || []}
              onBack={handleBack}
              onEdit={handleEdit}
              onForward={handleForward}
              onNewRound={handleNewRound}
              players={players}
              round={currentRound}
              sx={{ mt: 2 }}
            />
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
          serie: await getSerie(query.serie),
          season: await getSeason(query.season)
        })
      }
    }
  })(context)
}
