import React from 'react';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import states from '../../states';
import useLocalization from '../../../useLocalization';

export default function AdminTable({ players, ...props }) {
  const { t } = useTranslation()
  const { l } = useLocalization()

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <TableContainer component={Paper} {...props}>
      <Table aria-label={t('admin.players')}>
        <TableHead>
          <TableRow>
            <TableCell>{t('admin.players.name')}</TableCell>
            <TableCell>{t('admin.players.state')}</TableCell>
            { isDesktop && <TableCell>{t('admin.players.konamiId')}</TableCell> }
            { isDesktop && <TableCell>{t('admin.players.createdAt')}</TableCell> }
            <TableCell>{t('admin.players.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {players.map((player) => (
            <TableRow
              key={player.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">{player.name}</TableCell>
              <TableCell>
                { isDesktop ? <>
                  <Image src={`/img/flags/${player.state.toUpperCase()}.png`} height={17} width={26} />
                  <span style={{ marginLeft: 5 }}>{states[player.state]}</span>
                </> : player.state.toUpperCase() }
              </TableCell>
              { isDesktop && <TableCell>{player.konami_id}</TableCell> }
              { isDesktop && <TableCell>{l(player.created_at)}</TableCell> }
              <TableCell>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
