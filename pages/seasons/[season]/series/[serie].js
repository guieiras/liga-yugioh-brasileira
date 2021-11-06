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

export default function SeasonSerieShow ({ seasonSlug, serieSlug }) {
  const { t } = useTranslation()
  const [season, setSeason] = React.useState(null)
  const [serie, setSerie] = React.useState(null)
  const [roundMatches, setRoundMatches] = React.useState({})
  const [players, setPlayers] = React.useState({})
  const [currentRound, setCurrentRound] = React.useState(0)
  const [lastRound, setLastRound] = React.useState(0)

  React.useEffect(getSeasonAndSerie, [])
  React.useEffect(() => {
    if (serie) { Promise.all([getParticipations(), getRound()]) }
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

  async function handleBack () {
    setCurrentRound(currentRound - 1)
    await getRound(currentRound - 1)
  }

  async function handleForward () {
    setCurrentRound(currentRound + 1)
    await getRound(currentRound + 1)
  }

  return (
    <PublicLayout title={'Rodada'}>
      {
        loading
          ? <Stack direction="row" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Stack>
          : <>
        <Typography variant="h5" component="h1">
          {t('title')}
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={6}>

          </Grid>
          <Grid item xs={12} lg={6}>
            <RoundsPanel
              lastRound={lastRound}
              loading={!roundMatches[currentRound]}
              linkSize="small"
              matches={roundMatches[currentRound] || []}
              onBack={handleBack}
              onForward={handleForward}
              players={players}
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
