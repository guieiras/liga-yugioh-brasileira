import Image from 'next/image'
import Box from '@mui/material/Box'
import { blue, green, orange, red } from '@mui/material/colors'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useTranslation } from 'next-i18next'
import states from '../states'

export default function RoundsTable ({ breakpoints, players, table }) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const { t } = useTranslation()
  const breakpointColors = {
    default: 'white',
    blue: blue[400],
    green: green[400],
    orange: orange[400],
    red: red[400]
  }

  function breakpoint (index) {
    const breakpoint = breakpoints.filter((bp) => (
      index >= bp.initial_rank && index <= bp.final_rank
    ))[0]

    return {
      style: { borderLeft: `8px solid ${breakpointColors[breakpoint?.color || 'default']}` },
      title: breakpoint ? t(`breakpoints.${breakpoint.caption}`) : null
    }
  }

  return <TableContainer component={Paper}>
    <Table size={isDesktop ? '' : 'small'}>
      <TableHead>
        <TableRow>
          <TableCell aria-label={t('rounds.position')}></TableCell>
          <TableCell>{t('player')}</TableCell>
          <TableCell align="right">{isDesktop ? t('rounds.points') : t('rounds.points.xs')}</TableCell>
          <TableCell align="right">{t('rounds.tiebreak')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {table.map((row, index) => (
          <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell {...breakpoint(index)}>
              {!index || row.tiebreak !== table[index - 1].tiebreak ? index + 1 : null}
            </TableCell>
            <TableCell component="th" scope="row">
              <Box component='span' sx={{ mr: 1 }} title={states[players[row.id].state]}>
                <Image alt="" src={`/img/flags/${players[row.id].state.toUpperCase()}.png`} height={11} width={17} />
              </Box>
              {players[row.id].name}
            </TableCell>
            <TableCell align="right">{row.points}</TableCell>
            <TableCell align="right">{row.tiebreak}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
}
