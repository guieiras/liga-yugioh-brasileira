import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos'
import EditIcon from '@mui/icons-material/Edit'
import { useTranslation } from 'next-i18next'
import MatchesEdit from '../matches/edit'
import MatchesItem from '../matches/item'

export default function RoundsPanel ({
  onNewRound, matches, players, onEdit, onBack, onGameUpdate, onForward, round, lastRound, sx,
  controls, loading, linkSize, ...props
}) {
  const { t } = useTranslation()
  const [editableGame, setEditableGame] = React.useState(null)

  async function handleGameUpdate (match, form) {
    await onGameUpdate({ id: match.id, ...form })
    setEditableGame(null)
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
    <Paper {...props} sx={{ p: 2, ...(sx || {}) }}>
      {
        (typeof controls === 'undefined' || controls)
          ? <Stack direction='row' justifyContent='space-between'>
          <IconButton
            disabled={round === 1}
            onClick={onBack}
            sx={{ visibility: round === 1 ? 'hidden' : '' }}
            title={t('rounds.previous')}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="button">{t('currentRound', { round })}</Typography>
          {
            round < lastRound
              ? (
              <IconButton onClick={onForward} title={t('rounds.next')}><ArrowForwardIcon /></IconButton>
                )
              : (
                <IconButton
                  disabled={!onNewRound}
                  onClick={onNewRound}
                  sx={{ visibility: !onNewRound ? 'hidden' : '' }}
                  title={t('rounds.new')}
                >
                  <AddIcon />
                </IconButton>
                )
          }
        </Stack>
          : <Typography variant="button">{t('currentRound', { round })}</Typography>
      }
      {
        loading
          ? <Stack alignItems="center" sx={{ p: 2 }}>
            <CircularProgress />
          </Stack>
          : <List>
        {
          matches.map((match) => (
            <MatchesItem
              key={match.id}
              homePlayer={players[match.home_player_id]}
              awayPlayer={players[match.away_player_id]}
              match={match}
              onEdit={onGameUpdate && (() => { setEditableGame(match.id) })}
            >
              { editableGame === match.id &&
                <MatchesEdit
                  homePlayer={players[match.home_player_id]}
                  awayPlayer={players[match.away_player_id]}
                  match={match}
                  onCancel={() => setEditableGame(null)}
                  onSubmit={(form) => handleGameUpdate(match, form)}
                /> }
            </MatchesItem>
          ))
        }
      </List>
      }
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
