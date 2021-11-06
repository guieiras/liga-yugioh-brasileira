import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession } from 'next-auth/react'
import { deserialize, serialize } from 'superjson'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import AdminLayout from '../../../../../src/components/layouts/admin'
import { authenticate } from '../../../../../src/middlewares/session'
import { getSerieBySlug } from '../../../../../src/repositories/series'
import { getSeasonBySlug } from '../../../../../src/repositories/seasons'
import { get, post, put } from '../../../../../src/requests/client'
import RoundsForm from '../../../../../src/components/rounds/form'
import RoundsPanel from '../../../../../src/components/rounds/panel'

export default function AdminSeasonMatches ({ data: json }) {
  const { locale, season, serie } = deserialize(json)
  const { data: session } = useSession()
  const [roundMatches, setRoundMatches] = React.useState({})
  const [players, setPlayers] = React.useState({})
  const [currentRound, setCurrentRound] = React.useState(0)
  const [lastRound, setLastRound] = React.useState(0)
  const [editableRound, setEditableRound] = React.useState(null)

  React.useEffect(() => {
    Promise.all([getParticipations(), getRound()])
  }, [])

  function handleNewRound () {
    setEditableRound(lastRound + 1)
  }

  async function handleBack () {
    setCurrentRound(currentRound - 1)
    await getRound(currentRound - 1)
  }

  async function handleForward () {
    setCurrentRound(currentRound + 1)
    await getRound(currentRound + 1)
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
    if (!roundMatches[round] || force) {
      const results = await get('matches', { season_id: season.id, serie_id: serie.id, round: roundParam })
      const fetchedRound = results[0]?.round

      if (results.length > 0) { setRoundMatches({ ...roundMatches, [fetchedRound]: results }) }
      if (!round) {
        setLastRound(fetchedRound || 0)
        setCurrentRound(fetchedRound || 0)
      }
    }
  }

  function cancelRound () {
    setEditableRound(null)
  }

  async function handleUpdate (match) {
    const { analysisUrl, replayUrl, winner } = match

    const result = await put(
      `admin/matches/${match.id}`,
      { analysis_url: analysisUrl, replay_url: replayUrl, winner }
    )

    setRoundMatches({
      ...roundMatches,
      [result.round]: roundMatches[result.round].map((match) => (
        match.id === result.id ? result : match
      ))
    })
  }

  async function saveRound (matches) {
    await post(
      'admin/matches',
      { season_id: season.id, serie_id: serie.id, round: editableRound, matches }
    )

    setRoundMatches({ ...roundMatches, [editableRound]: undefined })
    getRound(editableRound, true)
    setCurrentRound(editableRound)
    setEditableRound(null)
    setLastRound(Math.max(lastRound, editableRound))
  }

  return (
    <AdminLayout
      title={`${season.name} (${serie[`name_${locale}`]})`}
      session={session}
    >
      <Typography variant="h5" component="h1">{season.name} | {serie[`name_${locale}`]}</Typography>

      {
        Object.keys(roundMatches).length === 0
          ? <Paper sx={{ mt: 2, p: 2, textAlign: 'center' }}>
            <CircularProgress />
          </Paper>
          : editableRound !== null
            ? <RoundsForm
              onCancel={cancelRound}
              onSubmit={saveRound}
              matches={roundMatches[editableRound]}
              players={players}
              round={editableRound}
              sx={{ mt: 2 }}
            />
            : <RoundsPanel
              lastRound={lastRound}
              loading={!roundMatches[currentRound]}
              matches={roundMatches[currentRound] || []}
              onBack={handleBack}
              onEdit={handleEdit}
              onForward={handleForward}
              onGameUpdate={handleUpdate}
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
          serie: await getSerieBySlug(query.serie),
          season: await getSeasonBySlug(query.season)
        })
      }
    }
  })(context)
}
