import Image from 'next/image'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useTranslation } from 'next-i18next'
import states from '../states'

export default function RoundsTable ({ players, table }) {
  const { t } = useTranslation()

  return <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell aria-label={t('rounds.position')}></TableCell>
          <TableCell>{t('player')}</TableCell>
          <TableCell align="right">{t('rounds.points')}</TableCell>
          <TableCell align="right">{t('rounds.tiebreak')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {table.map((row, index) => (
          <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell>{!index || row.tiebreak !== table[index - 1].tiebreak ? index + 1 : null}</TableCell>
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
