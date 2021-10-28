import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { deserialize, serialize } from 'superjson';

import AdminLayout from '../../src/components/layouts/admin';
import { getPlayers } from '../../src/repositories/players';
import useLocalization from '../../src/useLocalization';

export default function Index({ players: json }) {
  const { t } = useTranslation()
  const { l } = useLocalization()
  const players = deserialize(json)

  return (
    <AdminLayout index='players'>
      <Typography variant="h5" component="h2">
        {t('admin.players.title')}
      </Typography>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table aria-label={t('admin.players.table.title')}>
          <TableHead>
            <TableRow>
              <TableCell>{t('admin.players.table.name')}</TableCell>
              <TableCell>{t('admin.players.table.state')}</TableCell>
              <TableCell>{t('admin.players.table.konamiId')}</TableCell>
              <TableCell>{t('admin.players.table.createdAt')}</TableCell>
              <TableCell>{t('admin.players.table.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => (
              <TableRow
                key={player.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">{player.name}</TableCell>
                <TableCell>{player.state}</TableCell>
                <TableCell>{player.konami_id}</TableCell>
                <TableCell>{l(player.created_at)}</TableCell>
                <TableCell>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminLayout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      players: serialize(await getPlayers())
    }
  }
}
