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
  const [slug, setSlug] = React.useState('')

  function submit (e) {
    e.preventDefault()

    if (name && slug) {
      onCreate({ name, slug }).then(() => {
        setName('')
        setSlug('')
      })
    }
  }

  function handleShow () {
    onShow && onShow(this)
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
            <TableCell>{t('seasons.slug')}</TableCell>
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
              <TableCell>/{season.slug}</TableCell>
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
                  aria-label={t('seasons.current.set')}
                  component="span"
                  disabled={!!season.current}
                  onClick={handleSetCurrent.bind(season)}
                  title={t('seasons.current.set')}
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
            <TableCell colSpan={4}>
              <form onSubmit={submit}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={5} sm={7} md={5} lg={6}>
                    <TextField
                      fullWidth
                      onChange={e => setName(e.target.value)}
                      label={t('seasons.new')}
                      variant="standard"
                      value={name}
                    />
                  </Grid>
                  <Grid item xs={5} sm={4} md={4} lg={4}>
                    <TextField
                      fullWidth
                      onChange={e => setSlug(e.target.value.replace(/[^0-9a-zA-Z-]/g, ''))}
                      label={t('seasons.slug')}
                      variant="standard"
                      value={slug}
                    />
                  </Grid>
                  <Grid item xs={2} sm={1} md={3} lg={2}>
                    {
                      isDesktop
                        ? (
                        <Button startIcon={<AddIcon />} type='submit'>{t('add')}</Button>
                          )
                        : (
                        <IconButton aria-label={t('add')} title={t('add')} type="submit">
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
