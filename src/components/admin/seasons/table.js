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
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import AddIcon from '@mui/icons-material/Add'
import StarIcon from '@mui/icons-material/Star'
import StarOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteIcon from '@mui/icons-material/Delete'
import { useTranslation } from 'next-i18next'
import useLocalization from '../../../useLocalization'

export default function AdminSeasonsTable ({
  onCreate, onDelete, onShow, onSetCurrent, seasons, ...props
}) {
  const { t } = useTranslation()
  const { l } = useLocalization()

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const [name, setName] = React.useState('')

  function submit (e) {
    e.preventDefault()

    if (name) {
      onCreate({ name }).then(() => { setName('') })
    }
  }

  function handleShow () {
    onShow && onShow(this.id)
  }

  function handleDelete () {
    onDelete && onDelete(this.id)
  }

  function handleSetCurrent () {
    onSetCurrent && onSetCurrent(this.id)
  }

  return (
    <TableContainer component={Paper} {...props}>
      <Table aria-label={t('seasons')}>
        <TableHead>
          <TableRow>
            <TableCell>{t('seasons.name')}</TableCell>
            <TableCell>{t('createdAt')}</TableCell>
            <TableCell>{t('actions')}</TableCell>
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
                  aria-label={t('seasons.show')}
                  component="span"
                  onClick={handleShow.bind(season)}
                  title={t('seasons.show')}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  aria-label={t('seasons.current')}
                  component="span"
                  disabled={season.current}
                  onClick={handleSetCurrent.bind(season)}
                  title={t('seasons.current')}
                >
                  {season.current ? <StarIcon /> : <StarOutlinedIcon />}
                </IconButton>
                <IconButton
                  aria-label={t('delete')}
                  color="error"
                  component="span"
                  onClick={handleDelete.bind(season)}
                  title={t('delete')}
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
                      label={t('seasons.new')}
                      variant="standard"
                      value={name}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {
                      isDesktop
                        ? (
                        <Button startIcon={<AddIcon />} type='submit'>{t('add')}</Button>
                          )
                        : (
                        <IconButton aria-label={t('add')} title={t('add')}>
                          <AddIcon />
                        </IconButton>
                          )
                    }
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
