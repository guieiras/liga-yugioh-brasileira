import React from 'react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'
import { useSession } from 'next-auth/react'
import { deserialize, serialize } from 'superjson'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ShieldIcon from '@mui/icons-material/Shield'
import AdminLayout from '../../../../../src/components/layouts/admin'
import { ROUNDS } from '../../../../../src/components/playoffs/constants'
import RoundsForm from '../../../../../src/components/rounds/form'
import RoundsPanel from '../../../../../src/components/rounds/panel'
import PlayoffsPanel from '../../../../../src/components/playoffs/panel'
import { authenticate } from '../../../../../src/middlewares/session'
import { get, post, put } from '../../../../../src/requests/client'
import { getSeasonBySlug } from '../../../../../src/repositories/seasons'
import { getSerieBySlug, getSeries } from '../../../../../src/repositories/series'

export default function AdminSeasonMatches ({ data: json }) {
  const { t } = useTranslation()
  const { locale, season, serie, series: initialSeries } = deserialize(json)
  const { data: session } = useSession()
  const [series, setSeries] = React.useState(initialSeries.filter((initialSerie) => initialSerie.id !== serie.id))
  const [roundMatches, setRoundMatches] = React.useState({})
  const [playoffMatches, setPlayoffMatches] = React.useState({})
  const [players, setPlayers] = React.useState({})
  const [currentRound, setCurrentRound] = React.useState(null)
  const [currentStep, setCurrentStep] = React.useState(null)
  const [lastRound, setLastRound] = React.useState(null)
  const [playoffSteps, setPlayoffSteps] = React.useState([])
  const [editableRound, setEditableRound] = React.useState(null)
  const [editablePlayoff, setEditablePlayoff] = React.useState(null)

  React.useEffect(() => {
    Promise.all([getParticipations(serie), getRound(), getPlayoffSteps()])
  }, [])

  function handleNewRound () {
    setEditableRound(lastRound + 1)
  }

  async function handleRound () {
    setCurrentRound(currentRound + this)
    await getRound(currentRound + this)
  }

  async function handlePlayoff () {
    setCurrentStep(currentStep + this)
    await getPlayoffMatches(playoffSteps[currentStep + this])
  }

  function handleEdit () {
    setEditableRound(currentRound)
  }

  async function addSerie () {
    const serieToFetch = this
    await getParticipations(serieToFetch)
    setSeries(series.filter((s) => s.id !== serieToFetch.id))
  }

  async function getParticipations (serieToFetch) {
    const results = await post(
      'seasons_participations/search',
      { participations: [{ serie_id: serieToFetch.id, season_id: season.id }] }
    )

    setPlayers({ ...players, ...Object.fromEntries(results.map((result) => [result.id, result.name])) })
  }

  async function getPlayoffSteps (currentRound) {
    let selectedStep = 0
    const playoffs = await get('playoffs', { season_id: season.id, serie_id: serie.id })
    const steps = ROUNDS.filter(round => round.steps.find(step => playoffs.includes(step.index)))

    if (currentRound) {
      selectedStep = steps.findIndex(
        round => round.steps.find(step => step.index === currentRound.index)
      )
    } else {
      setPlayoffSteps(steps.map(step => ({ ...step, loaded: false })))
    }

    if (steps.length) {
      await getPlayoffMatches(steps[selectedStep], steps)
      setCurrentStep(selectedStep)
    } else {
      setCurrentStep(null)
    }
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

  async function getPlayoffMatches (round, baseSteps) {
    if (round.loaded) return

    const steps = round.steps
    const matches = steps.reduce((memo, step) => ({ ...memo, [step.index]: [] }), { ...playoffMatches })
    setPlayoffMatches(matches)

    const results = await get('matches', {
      season_id: season.id, serie_id: serie.id, playoffs: steps.map(step => step.index)
    })

    setPlayoffSteps(
      (baseSteps || playoffSteps)
        .map((step) => step.name === round.name ? { ...step, loaded: true } : step)
    )
    setPlayoffMatches(results.reduce((memo, match) => (
      { ...memo, [match.playoff]: [...(memo[match.playoff] || []), match] }
    ), matches))
  }

  function cancelRound () {
    setEditableRound(null)
  }

  function cancelPlayoff () {
    setEditablePlayoff(null)
  }

  async function handleUpdate (match) {
    const { analysisUrl, replayUrl, winner } = match

    const result = await put(
      `admin/matches/${match.id}`,
      { analysis_url: analysisUrl, replay_url: replayUrl, winner }
    )

    if (result.round) updateRoundMatches(result)
    if (result.playoff) updatePlayoffMatches(result)
  }

  function updateRoundMatches (newMatch) {
    setRoundMatches({
      ...roundMatches,
      [newMatch.round]: roundMatches[newMatch.round].map((oldMatch) => (
        newMatch.id === oldMatch.id ? newMatch : oldMatch
      ))
    })
  }

  function updatePlayoffMatches (newMatch) {
    setPlayoffMatches({
      ...playoffMatches,
      [newMatch.playoff]: playoffMatches[newMatch.playoff].map((oldMatch) => (
        newMatch.id === oldMatch.id ? newMatch : oldMatch
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

  async function savePlayoff (matches) {
    await post(
      'admin/matches',
      { season_id: season.id, serie_id: serie.id, playoff: editablePlayoff.index, matches }
    )

    setPlayoffMatches({ ...playoffMatches, [editablePlayoff.index]: [] })
    setPlayoffSteps(
      playoffSteps.map(step => step.index === editablePlayoff.index ? { ...step, loaded: false } : step)
    )
    getPlayoffSteps(editablePlayoff)
    setEditablePlayoff(null)
  }

  return (
    <AdminLayout
      title={`${season.name} (${serie[`name_${locale}`]})`}
      session={session}
    >
      <Typography variant="h5" component="h1">{season.name} | {serie[`name_${locale}`]}</Typography>

      {
        Object.keys(players).length === 0
          ? <Alert
            action={
              <Button
              color="inherit"
              href={`/admin/seasons/${season.slug}/series/${serie.slug}/participations`}
              size="small"
              >
                {t('add')}
              </Button>
            }
            severity="warning"
            sx={{ mt: 2 }}
          >
            {t('participations.none')}
          </Alert>
          : <>
          <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
            {t('rounds')}
          </Typography>

          { Object.keys(roundMatches).length === 0 && currentRound !== 0
            ? <Paper sx={{ mt: 2, p: 2, textAlign: 'center' }}>
            <CircularProgress />
          </Paper>
            : editableRound !== null
              ? <RoundsForm
              onCancel={cancelRound}
              onSubmit={saveRound}
              matches={roundMatches[editableRound]}
              matchCount={Math.floor(Object.keys(players).length / 2)}
              players={players}
              title={t('currentRound', { round: editableRound })}
              sx={{ mt: 2 }}
            />
              : <RoundsPanel
              lastRound={lastRound}
              loading={!roundMatches[currentRound]}
              matches={roundMatches[currentRound] || []}
              onBack={handleRound.bind(-1)}
              onEdit={handleEdit}
              onForward={handleRound.bind(1)}
              onGameUpdate={handleUpdate}
              onNewRound={handleNewRound}
              players={players}
              round={currentRound}
              sx={{ mt: 2 }}
            /> }

            <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
              {t('playoffs')}
            </Typography>

            { editablePlayoff === null
              ? <PlayoffsPanel
              matches={Object.fromEntries(
                (playoffSteps[currentStep]?.steps || []).map(step => (
                  [step.index, playoffMatches[step.index]]
                ), [])
              ) }
              onGameUpdate={handleUpdate}
              onNewRound={(step) => setEditablePlayoff(step)}
              onBack={handlePlayoff.bind(-1)}
              onForward={handlePlayoff.bind(1)}
              players={players}
              currentStep={playoffSteps[currentStep]}
              stepIndex={currentStep}
              lastStep={playoffSteps.length - 1}
              sx={{ mt: 2 }} />
              : <RoundsForm
                onCancel={cancelPlayoff}
                onSubmit={savePlayoff}
                matches={roundMatches[editableRound]}
                matchCount={editablePlayoff.games}
                players={players}
                title={t(`playoffs.${editablePlayoff.name}`)}
                sx={{ mt: 2 }}
              >
                <Stack sx={{ flexDirection: 'row', flexWrap: 'wrap', mt: 2 }}>
                  <Typography sx={{ lineHeight: 2.5 }} variant="caption">{t('players.otherSeries')}</Typography>
                  {
                    series.map((potentialSerie) => (
                      <Button
                        color="info"
                        key={potentialSerie.id}
                        onClick={addSerie.bind(potentialSerie)}
                        size='small'
                        startIcon={<ShieldIcon
                        sx={{ color: potentialSerie.color }} />}
                      >
                        {potentialSerie[`name_${locale}`]}
                      </Button>
                    ))
                  }
                </Stack>
              </RoundsForm> }
          </>
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
          serie: await getSerieBySlug(query.serie),
          season: await getSeasonBySlug(query.season)
        })
      }
    }
  })(context)
}
