import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos'
import ClearIcon from '@mui/icons-material/Clear'
import { useTranslation } from 'next-i18next'

export default function MatchesPanel ({
  onNewRound, matches, players, onBack, onForward, round, lastRound, sx, ...props
}) {
  const { t } = useTranslation()

  if (round === 0) {
    return <Paper {...props} sx={{ p: 3, textAlign: 'center', ...(sx || {}) }}>
      { onNewRound
        ? <Button onClick={onNewRound}>{t('rounds.new')}</Button>
        : <Typography>{t('rounds.none')}</Typography>
      }
    </Paper>
  }

  return (
    <Paper {...props} sx={{ p: 3, ...(sx || {}) }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <IconButton disabled={round === 1} onClick={onBack}><ArrowBackIcon /></IconButton>
        <Typography variant="button">{t('currentRound', { round })}</Typography>
        {
          round < lastRound ? (
            <IconButton onClick={onForward}><ArrowForwardIcon /></IconButton>
          ) : (
            <IconButton onClick={onNewRound}><AddIcon /></IconButton>
          )
        }
      </Box>

      <List>
        {
          matches.map((match) => (
            <ListItem key={match.id}>
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
            </ListItem>
          ))
        }
      </List>
    </Paper>
  )
}
