import React from 'react'

import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TextField from '@mui/material/TextField'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslation } from 'next-i18next'
import useLocalization from '../../../useLocalization'

export default function AdminSeasonsTable ({ onCreate, onDelete, seasons, ...props }) {
  const { t } = useTranslation()
  const { l } = useLocalization()
  const [name, setName] = React.useState('')

  function submit (e) {
    e.preventDefault()

    if (name) {
      onCreate({ name }).then(() => { setName('') })
    }
  }

  function handleDelete () {
    onDelete && onDelete(this.id)
  }

  return (
    <TableContainer component={Paper} {...props}>
      <Table aria-label={t('admin.seasons')}>
        <TableHead>
          <TableRow>
            <TableCell>{t('admin.seasons.name')}</TableCell>
            <TableCell>{t('admin.seasons.createdAt')}</TableCell>
            <TableCell>{t('admin.seasons.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {seasons.map((season) => (
            <TableRow
              key={season.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{season.name}</TableCell>
              <TableCell>{l(season.created_at, 'month')}</TableCell>
              <TableCell>
                <IconButton
                  aria-label={t('admin.seasons.delete')}
                  color="error"
                  component="span"
                  onClick={handleDelete.bind(season)}
                  title={t('admin.seasons.delete')}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={3}>
              <form onSubmit={submit}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={10}>
                    <TextField
                      fullWidth
                      onChange={e => setName(e.target.value)}
                      label={t('admin.seasons.form')}
                      variant="standard"
                      value={name}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button startIcon={<AddIcon />} type='submit'>
                      {t('admin.seasons.submit')}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
