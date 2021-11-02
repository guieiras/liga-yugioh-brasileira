import React from 'react'

import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'next-i18next'

export default function RoundsEdit({ match, onCancel, onSubmit, homePlayer, awayPlayer }) {
  const { t } = useTranslation()
  const [winner, setWinner] = React.useState(typeof match.winner === 'number' ? match.winner  : '')
  const [analysisUrl, setAnalysisUrl] = React.useState(match.prrj_youtube_video_url || '')
  const [replayUrl, setReplayUrl] = React.useState(match.dueling_book_replay_url || '')

  function isValidToSubmit() {
    return winner !== ''
  }

  function handleSubmit() {
    onSubmit({ winner, analysisUrl, replayUrl })
  }

  return (
    <Grid container columns={3} p={2} spacing={2}>
      <Grid item xs={3} lg={1}>
        <FormControl fullWidth>
          <InputLabel
            id={`matches-${match.id}-form-winner`}
            sx={{ '&[data-shrink="false"]': { marginTop: '-7px' } }}
          >
            {t('matches.winner')}
          </InputLabel>
          <Select
            labelId={`matches-${match.id}-form-winner`}
            label={t('matches.winner')}
            onChange={(e) => { setWinner(e.target.value) }}
            size="small"
            value={winner}
          >
            <MenuItem value=""><em>{t('blankOption')}</em></MenuItem>
            <MenuItem value="1">{homePlayer}</MenuItem>
            <MenuItem value="2">{awayPlayer}</MenuItem>
            <MenuItem value="0">{t('draw')}</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={3} lg={1}>
        <TextField
          fullWidth
          onChange={(e) => { setReplayUrl(e.target.value) }}
          label={t('matches.replay_url')}
          size="small"
          variant="outlined"
          value={replayUrl}
        />
      </Grid>

      <Grid item xs={3} lg={1}>
        <TextField
          fullWidth
          onChange={(e) => { setAnalysisUrl(e.target.value) }}
          label={t('matches.analysis_url')}
          size="small"
          variant="outlined"
          value={analysisUrl}
        />
      </Grid>

      <Grid item xs={3} lg={3} sx={{ textAlign: 'right' }}>
        <Button variant="secondary" onClick={onCancel}>{t('cancel')}</Button>
        <Button disabled={!isValidToSubmit()} onClick={handleSubmit}>{t('save')}</Button>
      </Grid>
    </Grid>
  )
}
