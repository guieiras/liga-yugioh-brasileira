import React from 'react'

import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useTranslation } from 'next-i18next'
import states from '../../states'

export default function AdminPlayersForm ({ onSubmit, ...props }) {
  const { t } = useTranslation()

  const [name, setName] = React.useState('')
  const [state, setState] = React.useState('')
  const [konamiId, setKonamiId] = React.useState('')

  function handleKonamiId (input) {
    setKonamiId(input.replace(/[^0-9]/g, ''))
  }

  function submit (e) {
    e.preventDefault()

    if (onSubmit && name && state && konamiId) {
      onSubmit({ name, state, konamiId }).then(() => {
        setName('')
        setState('')
        setKonamiId('')
      })
    }
  }

  return (
    <Paper component="form" noValidate autoComplete="off" onSubmit={submit} {...props}>
      <Grid container spacing={2} p={2}>
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            label={t('admin.players.name')}
            required
            value={name}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
            <InputLabel>{t('admin.players.state')}</InputLabel>
            <Select
              label={t('admin.players.state')}
              onChange={(e) => setState(e.target.value)}
              value={state}
              required
            >
              <MenuItem value="" />
              { Object.keys(states).map((input) => <MenuItem key={input} value={input}>{states[input]}</MenuItem>) }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('admin.players.konamiId')}
            margin="normal"
            onChange={(e) => handleKonamiId(e.target.value)}
            value={konamiId}
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'right' }}>
          <Button type='submit'>
            {t('admin.players.submit')}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}
