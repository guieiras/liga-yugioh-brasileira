import React from 'react';

import Typography from '@mui/material/Typography';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { deserialize, serialize } from 'superjson';
import AdminLayout from '../../src/components/layouts/admin';
import AdminTable from '../../src/components/admin/players/table';
import AdminForm from '../../src/components/admin/players/form';
import { getPlayers } from '../../src/repositories/players';

export default function Index({ players: json }) {
  const { t } = useTranslation()
  const players = deserialize(json)

  return (
    <AdminLayout index='players'>
      <Typography variant="h5" component="h2">
        {t('admin.players')}
      </Typography>

      <AdminTable players={players} sx={{ mt: 2 }} />

      <Typography variant="h6" component="h3" mt={3}>
        {t('admin.players.form.title')}
      </Typography>

      <AdminForm sx={{ mt: 4 }} />
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
