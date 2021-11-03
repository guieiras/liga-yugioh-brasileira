import React from 'react'
import PublicLayout from '../src/components/layouts/public'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { get, post } from '../src/requests/client'
import RoundsPanel from '../src/components/rounds/panel'

export default function Index ({ locale }) {
  const { t } = useTranslation()
  const [loading, setLoading] = React.useState(true)
  const [seasons, setSeasons] = React.useState([])
  const [players, setPlayers] = React.useState({})

  React.useEffect(async () => {
    const currentSeries = await get('seasons/current')
    const matchResults = await Promise.all(
      currentSeries.map((result) => (
        get('matches', { season_id: result.season_id, serie_id: result.serie_id, round: 'last' })
      ))
    )

    setCurrentMatches(currentSeries, matchResults)
    getPlayers(currentSeries, matchResults)
    setLoading(false)
  }, [])

  function setCurrentMatches (currentSeries, matchResults) {
    setSeasons(
      currentSeries.map((serie, index) => ({
        ...serie,
        matches: matchResults[index]
      }))
    )
  }

  function getPlayers (currentSeries) {
    post(
      'seasons_participations/search',
      { participations: currentSeries.map((serie) => ({ season_id: serie.season_id, serie_id: serie.serie_id })) }
    ).then((players) => setPlayers(players.reduce((memo, player) => ({ ...memo, [player.id]: player.name }), {})))
  }

  return (
    <PublicLayout index="home" title={t('title')}>
      {
        loading
          ? <Box sx={{ alignItems: 'center', display: 'flex', height: '100%', justifyContent: 'center', width: '100%' }}>
          <CircularProgress />
        </Box>
          : seasons.map((season) => (
          <Box sx={{ p: 2, mt: 2 }} key={`${season.season_id}.${season.serie_id}`}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h5" component="h2">
                { season[`name_${locale}`] }
              </Typography>
              {
                season.matches && season.matches.length > 0 &&
                  <Button>{t('series.show')}</Button>
              }
            </Box>
            {
              season.matches && (season.matches.length > 0
                ? <RoundsPanel
                  matches={season.matches}
                  players={players}
                  controls={false}
                  sx={{ mt: 2 }}
                  round={season.matches[0].round}
                  />
                : <Paper p={3} sx={{ mt: 2, p: 3 }}>
                    <Typography>{t('rounds.waiting')}</Typography>
                  </Paper>)
            }
          </Box>
          ))
      }
    </PublicLayout>
  )
}

export async function getStaticProps ({ locale }) {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale))
    }
  }
}
