import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import ClearIcon from '@mui/icons-material/Clear'
import { useTranslation } from 'next-i18next'

export default function RoundsForm ({
  children, onCancel, onSubmit, matches, matchCount, players, sx, title, ...props
}) {
  const { t } = useTranslation()
  const [selectedPlayers, setSelectedPlayers] = React.useState([])
  const [options, setOptions] = React.useState([])
  const count = matchCount || matches.count

  React.useEffect(() => {
    setOptions(Object.keys(players).sort((a, b) => (
      players[a] > players[b] ? 1 : players[a] < players[b] ? -1 : 0
    )))
  }, [players])

  React.useEffect(() => {
    if (matches) {
      setSelectedPlayers(
        matches.flatMap((match) => [match.home_player_id.toString(), match.away_player_id.toString()])
      )
    }
  }, [matches])

  function PlayersSelect ({ index }) {
    return <Select
      fullWidth
      size="small"
      value={selectedPlayers[index] || ''}
      onChange={handleChange.bind(this, index)}
    >
      <MenuItem value=""><em>{t('blankOption')}</em></MenuItem>
      {
        remainingPlayers(index).map((option) => (
          <MenuItem key={option} value={option}>
            { players[option] }
          </MenuItem>
        ))
      }
    </Select>
  }

  function remainingPlayers (index) {
    return options.filter((player) => !selectedPlayers.includes(player) || selectedPlayers[index] === player)
  }

  function handleChange (index, event) {
    const clone = [...selectedPlayers]
    clone[index] = event.target.value

    setSelectedPlayers(clone)
  }

  function handleSubmit () {
    const tables = new Array(Math.floor(selectedPlayers.length / 2)).fill().map((_, i) => (
      [selectedPlayers[2 * i], selectedPlayers[2 * i + 1]]
    ))
    onSubmit && onSubmit(tables)
  }

  function handleCancel () {
    onCancel && onCancel()
  }

  function readyToSubmit () {
    return 2 * count - selectedPlayers.filter((v) => v).length === 0
  }

  return (
    <Paper component='form' {...props} sx={{ p: 3, ...(sx || {}) }}>
      <Typography variant="button" component="p" sx={{ textAlign: 'center' }}>
        {title}
      </Typography>
      { children }
      <List>
        {
          new Array(count).fill().map((_, i) => (
            <ListItem key={i}>
              <Grid container spacing={2}>
                <Grid item xs={5}>
                  <PlayersSelect index={i * 2} />
                </Grid>
                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                  <ClearIcon sx={{ height: '100%' }} />
                </Grid>
                <Grid item xs={5}>
                  <PlayersSelect index={i * 2 + 1} />
                </Grid>
              </Grid>
            </ListItem>
          ))
        }
      </List>
      <Box sx={{ textAlign: 'center' }}>
        <Button onClick={handleCancel} variant="secondary">
          { t('cancel') }
        </Button>
        <Button onClick={handleSubmit} disabled={!readyToSubmit()}>
          { t('save') }
        </Button>
      </Box>
    </Paper>
  )
}
