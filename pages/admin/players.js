import React from 'react';
import AdminLayout from '../../src/components/layouts/admin';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Index() {
  return (
    <AdminLayout index='players'>
    </AdminLayout>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    }
  }
}
