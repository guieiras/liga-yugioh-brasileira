import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import { useTranslation } from 'next-i18next'
import RoundsEdit from './edit'

export default function RoundsPanel ({
  onNewRound, matches, players, onEdit, onBack, onGameUpdate, onForward, round, lastRound, sx, ...props
}) {
  const { t } = useTranslation()
  const [editableGame, setEditableGame] = React.useState(null)

  async function handleGameUpdate (match, form) {
    await onGameUpdate({ id: match.id, ...form })
    setEditableGame(null)
  }

  function MatchItem ({ match, children }) {
    if (!onGameUpdate) { return <>{children}</> }

    if (editableGame === match.id) {
      return <Paper sx={{ display: 'flex', flexDirection: 'column', width: '100%', ...(sx || {}) }}>
        {children}
        <RoundsEdit
          awayPlayer={players[match.away_player_id]}
          homePlayer={players[match.home_player_id]}
          match={match}
          onCancel={() => setEditableGame(null)}
          onSubmit={(form) => handleGameUpdate(match, form)}
        />
      </Paper>
    }

    return <ListItemButton
      title={t('matches.edit')}
      onClick={setEditableGame.bind(this, match.id)}
    >
      { children }
    </ListItemButton>
  }

  if (round === 0) {
    return <Paper {...props} sx={{ p: 3, textAlign: 'center', ...(sx || {}) }}>
      { onNewRound
        ? <Button onClick={onNewRound}>{t('rounds.first')}</Button>
        : <Typography>{t('rounds.none')}</Typography>
      }
    </Paper>
  }

  return (
    <Paper {...props} sx={{ p: 3, ...(sx || {}) }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <IconButton disabled={round === 1} onClick={onBack} title={t('rounds.previous')}><ArrowBackIcon /></IconButton>
        <Typography variant="button">{t('currentRound', { round })}</Typography>
        {
          round < lastRound
            ? (
            <IconButton onClick={onForward} title={t('rounds.next')}><ArrowForwardIcon /></IconButton>
              )
            : (
              <IconButton disabled={!onNewRound} onClick={onNewRound} title={t('rounds.new')} sx={{ visibility: !onNewRound ? 'hidden' : '' }}>
                <AddIcon />
              </IconButton>
              )
        }
      </Box>

      <List>
        {
          matches.map((match) => (
            <ListItem key={match.id}>
              <MatchItem match={match}>
                <Grid container>
                  <Grid item xs={5} sx={{ textAlign: 'right' }}>
                    <Typography sx={{ p: 1 }}>{players[match.home_player_id]}</Typography>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <ClearIcon sx={{ height: '100%' }} />
                  </Grid>
                  <Grid item xs={5} sx={{ textAlign: 'left' }}>
                    <Typography sx={{ p: 1 }}>{players[match.away_player_id]}</Typography>
                  </Grid>
                </Grid>
              </MatchItem>
            </ListItem>
          ))
        }
      </List>
      {
        onEdit && !editableGame && <Box sx={{ textAlign: 'right' }}>
          <IconButton role="button" onClick={onEdit} title={t('matches.manage')}>
            <EditIcon />
          </IconButton>
        </Box>
      }
    </Paper>
  )
}