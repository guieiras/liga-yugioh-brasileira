import * as React from 'react'
import PublicLayout from '../src/components/layouts/public'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function Index () {
  const { t } = useTranslation()

  return (
    <PublicLayout index="home" title={t('title')}>
    </PublicLayout>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
    }
  }
}
