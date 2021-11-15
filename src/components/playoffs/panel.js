import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos'
import { useTranslation } from 'next-i18next'
import MatchesEdit from '../matches/edit'
import MatchesItem from '../matches/item'

export default function PlayoffsPanel ({
  loading, players, matches, onNewRound, onGameUpdate, sx, currentStep, stepIndex, lastStep, onBack, onForward
}) {
  const [editableGame, setEditableGame] = React.useState(null)
  const { t } = useTranslation()

  async function handleGameUpdate (match, form) {
    await onGameUpdate({ id: match.id, ...form })
    setEditableGame(null)
  }

  if (!currentStep) {
    return <Paper sx={{ p: 3, textAlign: 'center', ...(sx || {}) }}>
      { onNewRound
        ? <Button onClick={onNewRound}>{t('rounds.first')}</Button>
        : <Typography>{t('playoffs.none')}</Typography>
      }
    </Paper>
  }

  return (
    <Paper sx={{ p: 2, ...(sx || {}) }}>
      {
        loading
          ? <CircularProgress sx={{ p: 2 }} />
          : <Stack alignItems="center" sx={{ mt: 2 }}>
            <Stack direction='row' justifyContent='space-between' sx={{ width: '100%' }}>
              <IconButton
                disabled={stepIndex === 0}
                onClick={onBack}
                sx={{ visibility: stepIndex === 0 ? 'hidden' : '' }}
                title={t('rounds.previous')}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="button">
                {t(`playoffs.${currentStep.name}`)}
              </Typography>
              <IconButton
                disabled={stepIndex === lastStep}
                onClick={onForward}
                sx={{ visibility: stepIndex === lastStep ? 'hidden' : '' }}
                title={t('rounds.next')}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Stack>
        {
          currentStep.steps.map((step) => (
            <Box key={step.index} sx={{ mt: 2, width: '100%' }}>
              {
                (onNewRound || matches[step.index].length > 0) &&
                  <Typography component='p' variant="overline" sx={{ textAlign: 'center' }}>
                    {t(`playoffs.${step.name}`)}
                  </Typography>
              }
              {
                matches[step.index].length > 0
                  ? matches[step.index].map(match => (
                  <MatchesItem
                    key={match.id}
                    homePlayer={players[match.home_player_id]}
                    awayPlayer={players[match.away_player_id]}
                    match={match}
                    onEdit={setEditableGame.bind(null, match.id)}
                  >
                    {editableGame === match.id &&
                      <MatchesEdit
                        onCancel={setEditableGame.bind(null, null)}
                        onSubmit={(form) => handleGameUpdate(match, form)}
                        homePlayer={players[match.home_player_id]}
                        awayPlayer={players[match.away_player_id]}
                        match={match}
                      />}
                  </MatchesItem>
                  ))
                  : onNewRound && <Typography component='p' variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                  {t('playoffs.none')}
                </Typography>
              }
            </Box>
          ))
        }
      </Stack>
      }
    </Paper>
  )
}
