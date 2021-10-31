import React from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos'
import { useTranslation } from 'next-i18next'

export default function MatchesPanel ({ onNewRound, matches, round, lastRound, sx, ...props }) {
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
        { round > 1 ? <ArrowBackIcon /> : <span /> }
        <Typography variant="button">{t('currentRound', { round })}</Typography>
        <ArrowForwardIcon />
      </Box>
      <List>
      </List>
    </Paper>
  )
}
