import React from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession } from 'next-auth/react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useRouter } from 'next/router'
import { deserialize, serialize } from 'superjson'
import PlayerSearchBar from '../../../src/components/PlayerSearchBar'
import AdminLayout from '../../../src/components/layouts/admin'
import { authenticate } from '../../../src/middlewares/session'
import { getSeries } from '../../../src/repositories/series'
import { getSeasonBySlug } from '../../../src/repositories/seasons'
import { del, get, post } from '../../../src/requests/client'

export default function AdminSeasonShow ({ data: json }) {
  const { push } = useRouter()
  const { t } = useTranslation()
  const { locale, season, series } = deserialize(json)
  const { data: session } = useSession()
  const [searches, setSearches] = React.useState(Object.fromEntries(series.map(serie => [serie.id, ''])))
  const [results, setResults] = React.useState(Object.fromEntries(series.map(serie => [serie.id, []])))
  const [players, setPlayers] = React.useState({})
  const [participants, setParticipants] = React.useState({})

  React.useEffect(() => {
    get(`admin/seasons/${season.id}/participations`).then((json) => {
      setParticipants(json.reduce((memo, participant) => {
        return {
          ...memo,
          [participant.serie_id]: [...(memo[participant.serie_id] || []), participant.player_id]
        }
      }, {}))
    })
  }, [])

  React.useEffect(() => {
    const playerIds = Object.values(participants).flat()
    searchPlayers({ id: playerIds })
  }, [participants])

  function searchPlayers ({ id, name }) {
    if ((id && id.length > 0) || name) {
      post(
        'admin/players/search',
        { id: id, name, nid: Object.keys(players) }
      ).then((json) => {
        setPlayers({
          ...players,
          ...Object.fromEntries(
            json.map((player) => [player.id, player])
          )
        })
      })
    }
  }

  function handleCleanSearch () {
    setResults({})
  }

  function handleSearch (serieId) {
    return async (e) => {
      const searchTerm = e.target.value
      setSearches({ ...searches, [serieId]: searchTerm })

      if (searchTerm.length > 1) {
        searchPlayers({ name: searchTerm })
        setResults({
          [serieId]: Object.values(players).filter((player) => {
            return !Object.values(participants).flat().includes(player.id) &&
              player.name.toLowerCase().includes(searchTerm.toLowerCase())
          })
        })
      } else {
        setResults({})
      }
    }
  }

  function handleSelect (serieId) {
    return async (e) => {
      await post(
        `admin/seasons/${season.id}/participations`,
        { playerId: e.id, serieId }
      )

      setParticipants({
        ...participants,
        [serieId]: [
          ...participants[serieId] || [],
          e.id
        ]
      })
      setSearches({ ...searches, [serieId]: '' })
      setResults({})
    }
  }

  async function handleDelete (serie, player) {
    await del(
      `admin/seasons/${season.id}/participations/${player}`
    )

    setParticipants({
      ...participants,
      [serie.id]: participants[serie.id].filter((playerId) => playerId !== player)
    })
  }

  return (
    <AdminLayout title={season.name} session={session}>
      <Typography variant="h5" component="h1">{season.name}</Typography>
      {
        series.map((serie) => <Card sx={{ mt: 3 }} key={serie.id}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" component="h2" sx={{ color: serie.color }}>
                {serie[`name_${locale}`]}
              </Typography>
              {
                participants[serie.id]?.length && <IconButton
                  aria-label={t('matches.manage')}
                  onClick={() => { push(`/admin/seasons/${season.slug}/series/${serie.slug}`) }}
                  title={t('matches.manage')}
                >
                  <VisibilityIcon />
                </IconButton>
              }
            </Stack>

            <PlayerSearchBar
              onChange={handleSearch(serie.id)}
              onDelete={handleCleanSearch}
              onSelect={handleSelect(serie.id)}
              players={results[serie.id]}
              sx={{ mt: 1 }}
              value={searches[serie.id]}
            />
            <List>
              {
                (participants[serie.id] || []).map((participant) => (
                  players[participant] && <ListItem
                    key={participant}
                    secondaryAction={
                      <IconButton
                        aria-label={t('delete')}
                        color="error"
                        edge="end"
                        onClick={handleDelete.bind(season, serie, participant)}
                        title={t('delete')}
                      >
                        <CloseIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={players[participant].name} />
                  </ListItem>
                ))
              }
            </List>
          </CardContent>
        </Card>)
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
          season: await getSeasonBySlug(query.season)
        })
      }
    }
  })(context)
}
