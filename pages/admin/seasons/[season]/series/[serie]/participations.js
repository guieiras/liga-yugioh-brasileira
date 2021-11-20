import React from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useSession } from 'next-auth/react'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import { deserialize, serialize } from 'superjson'
import AdminLayout from '../../../../../../src/components/layouts/admin'
import PlayerSearchBar from '../../../../../../src/components/PlayerSearchBar'
import { authenticate } from '../../../../../../src/middlewares/session'
import { getSeasonBySlug } from '../../../../../../src/repositories/seasons'
import { getSerieBySlug } from '../../../../../../src/repositories/series'
import { del, get, post } from '../../../../../../src/requests/client'

export default function AdminSeasonSeriesParticipations ({ data: json }) {
  const { t } = useTranslation()
  const { locale, season, serie } = deserialize(json)
  const { data: session } = useSession()
  const [search, setSearch] = React.useState('')
  const [results, setResults] = React.useState([])
  const [players, setPlayers] = React.useState({})
  const [seasonParticipants, setSeasonParticipants] = React.useState([])
  const [participants, setParticipants] = React.useState([])

  React.useEffect(() => {
    get(`admin/seasons/${season.id}/participations`).then((json) => {
      searchPlayers({ id: json.map((participant) => participant.player_id) })
      setSeasonParticipants(
        json.reduce((memo, participant) => [...memo, participant.player_id], [])
      )
      setParticipants(
        json.reduce((memo, participant) => (
          participant.serie_id === serie.id ? [...memo, participant.player_id] : memo
        ), [])
      )
    })
  }, [])

  React.useEffect(() => {
    searchPlayers({ id: Object.values(participants) })
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
    setResults('')
  }

  async function handleSearch (e) {
    const searchTerm = e.target.value
    setSearch(searchTerm)

    if (searchTerm.length > 1) {
      searchPlayers({ name: searchTerm })
      setResults(
        Object.values(players).filter((player) => {
          return !seasonParticipants.includes(player.id) && !participants.includes(player.id) &&
            player.name.toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    } else {
      setResults([])
    }
  }

  async function handleSelect (e) {
    await post(
      `admin/seasons/${season.id}/participations`,
      { playerId: e.id, serieId: serie.id }
    )

    setParticipants([...participants, e.id])
    setSearch('')
    setResults([])
  }

  async function handleDelete (player) {
    await del(
      `admin/seasons/${season.id}/participations/${player}`
    )

    setParticipants(
      participants.filter((playerId) => playerId !== player)
    )
  }

  return (
    <AdminLayout title={season.name} session={session}>
      <Typography variant="h5" component="h1">
        {season.name} | {serie[`name_${locale}`]}
      </Typography>
      <PlayerSearchBar
        onChange={handleSearch}
        onDelete={handleCleanSearch}
        onSelect={handleSelect}
        players={results}
        sx={{ mt: 1 }}
        value={search}
      />
      <List>
        {
          participants.map((participant) => (
            players[participant] && <ListItem
              key={participant}
              secondaryAction={
                <IconButton
                  aria-label={t('delete')}
                  color="error"
                  edge="end"
                  onClick={handleDelete.bind(season, participant)}
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
