import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import PublicLayout from '../../../../src/components/layouts/public'
import RoundsPanel from '../../../../src/components/rounds/panel'
import { get, post } from '../../../../src/requests/client'
import generateStandings from '../../../../src/helpers/standings'
import RoundsTable from '../../../../src/components/rounds/table'

export default function SeasonSerieShow ({ locale, seasonSlug, serieSlug }) {
  const { t } = useTranslation()
  const [season, setSeason] = React.useState(null)
  const [serie, setSerie] = React.useState(null)
  const [roundMatches, setRoundMatches] = React.useState({})
  const [players, setPlayers] = React.useState({})
  const [playerNames, setPlayerNames] = React.useState({})
  const [currentRound, setCurrentRound] = React.useState(0)
  const [lastRound, setLastRound] = React.useState(null)
  const [standings, setStandings] = React.useState(null)
  const [breakpoints, setBreakpoints] = React.useState([])

  React.useEffect(getSeasonAndSerie, [])
  React.useEffect(() => {
    if (serie) {
      Promise.all(
        [getParticipations(), getRound(), getSwissStandings(), getBreakpoints()]
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

  async function getSwissStandings () {
    const table = await get('standings', { season_id: season.id, serie_id: serie.id })
    setStandings(generateStandings(table))
  }

  async function getBreakpoints () {
    setBreakpoints(await get(`seasons/${season.id}/series/${serie.id}/breakpoints`))
  }

  async function handleBack () {
    setCurrentRound(currentRound - 1)
    await getRound(currentRound - 1)
  }

  async function handleForward () {
    setCurrentRound(currentRound + 1)
    await getRound(currentRound + 1)
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
              onBack={handleBack}
              onForward={handleForward}
              players={playerNames}
              round={currentRound}
            />
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
