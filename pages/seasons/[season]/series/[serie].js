import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ROUNDS } from '../../../../src/components/playoffs/constants'
import PublicLayout from '../../../../src/components/layouts/public'
import PlayoffsPanel from '../../../../src/components/playoffs/panel'
import RoundsPanel from '../../../../src/components/rounds/panel'
import { get, post } from '../../../../src/requests/client'
import generateStandings from '../../../../src/helpers/standings'
import RoundsTable from '../../../../src/components/rounds/table'

export default function SeasonSerieShow ({ locale, seasonSlug, serieSlug }) {
  const { t } = useTranslation()
  const [season, setSeason] = React.useState(null)
  const [serie, setSerie] = React.useState(null)
  const [roundMatches, setRoundMatches] = React.useState({})
  const [playoffMatches, setPlayoffMatches] = React.useState({})
  const [players, setPlayers] = React.useState({})
  const [playerNames, setPlayerNames] = React.useState({})
  const [currentRound, setCurrentRound] = React.useState(0)
  const [lastRound, setLastRound] = React.useState(null)
  const [standings, setStandings] = React.useState(null)
  const [breakpoints, setBreakpoints] = React.useState([])
  const [currentStep, setCurrentStep] = React.useState(null)
  const [playoffSteps, setPlayoffSteps] = React.useState([])

  React.useEffect(getSeasonAndSerie, [])
  React.useEffect(() => {
    if (serie) {
      Promise.all(
        [getParticipations(), getRound(), getSwissStandings(), getBreakpoints(), getPlayoffSteps()]
      )
    }
  }, [serie])

  async function getSeasonAndSerie () {
    const result = await get(`seasons/${seasonSlug}/series/${serieSlug}`)
    setSeason(result.season)
    setSerie(result.serie)
  }

  async function getParticipations () {
    const results = await post(
      'seasons_participations/search',
      { participations: [{ serie_id: serie.id, season_id: season.id }] }
    )

    setPlayerNames(Object.fromEntries(results.map((result) => [result.id, result.name])))
    setPlayers(Object.fromEntries(results.map((result) => [result.id, result])))
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

  async function getPlayoffSteps () {
    const playoffs = await get('playoffs', { season_id: season.id, serie_id: serie.id })
    const steps = ROUNDS.filter(round => round.steps.find(step => playoffs.includes(step.index)))
    setPlayoffSteps(steps.map(step => ({ ...step, loaded: false })))

    if (steps.length) {
      await getPlayoffMatches(steps[0], steps)
      setCurrentStep(0)
    } else {
      setCurrentStep(null)
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

  async function getSwissStandings () {
    const table = await get('standings', { season_id: season.id, serie_id: serie.id })
    setStandings(generateStandings(table))
  }

  async function getBreakpoints () {
    setBreakpoints(await get(`seasons/${season.id}/series/${serie.id}/breakpoints`))
  }

  async function handleRound () {
    setCurrentRound(currentRound + this)
    await getRound(currentRound + this)
  }

  async function handlePlayoff () {
    setCurrentStep(currentStep + this)
    await getPlayoffMatches(playoffSteps[currentStep + this])
  }

  return (
    <PublicLayout title={season && serie ? `${season.name} (${serie[`name_${locale}`]})` : t('seasons.name') }>
      {
        Object.keys(roundMatches).length === 0 && lastRound !== 0
          ? <Stack direction="row" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
          : <>
        <Typography variant="h5" component="h1">
          {season.name} | {serie[`name_${locale}`]}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={6}>
            { standings
              ? <RoundsTable players={players} table={standings} breakpoints={breakpoints} />
              : <CircularProgress /> }
          </Grid>
          <Grid item xs={12} lg={6}>
            <RoundsPanel
              lastRound={lastRound}
              loading={!roundMatches[currentRound]}
              linkSize="small"
              matches={roundMatches[currentRound] || []}
              onBack={handleRound.bind(-1)}
              onForward={handleRound.bind(1)}
              players={playerNames}
              round={currentRound}
            />
            <PlayoffsPanel
              currentStep={playoffSteps[currentStep]}
              lastStep={playoffSteps.length - 1}
              matches={Object.fromEntries(
                (playoffSteps[currentStep]?.steps || []).map(step => (
                  [step.index, playoffMatches[step.index]]
                ), [])
              ) }
              onBack={handlePlayoff.bind(-1)}
              onForward={handlePlayoff.bind(1)}
              players={playerNames}
              stepIndex={currentStep}
              sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </>
      }
    </PublicLayout>
  )
}

export async function getServerSideProps ({ query, locale }) {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale)),
      seasonSlug: query.season,
      serieSlug: query.serie
    }
  }
}
