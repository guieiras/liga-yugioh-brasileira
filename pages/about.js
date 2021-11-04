import React from 'react'
import Image from 'next/image'
import PublicLayout from '../src/components/layouts/public'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export default function About () {
  const { t } = useTranslation()

  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <PublicLayout index="about" title={t('about.title')}>
      <Typography variant="h5" component="h1">
        {t('title', { ns: 'about' })}
      </Typography>

      <Typography sx={{ mt: 2 }}>{t('intro.paragraph1', { ns: 'about' })}</Typography>
      <Typography sx={{ mt: 2 }}>{t('intro.paragraph2', { ns: 'about' })}</Typography>

      <iframe src='https://www.youtube.com/embed/c4MzZ0MxxJg'
        frameBorder='0'
        allow='autoplay; encrypted-media'
        allowFullScreen
        title='video'
        style={{ marginTop: 10, height: isDesktop ? 360 : 240, width: isDesktop ? 640 : 426 }}
      />

      <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
        {t('follow', { ns: 'about' })}
      </Typography>

      <Typography sx={{ mt: 2 }}>
        {t('follow.paragraph', { ns: 'about' })}
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        <Button
          color="secondary"
          component="a"
          target="_blank"
          href={'https://www.twitch.tv/prrjygo'}
          startIcon={<Image alt="" src={'/img/twitch.png'} height={24} width={24} />}
          sx={{ borderColor: 'purple', color: 'purple' }}
          variant="outlined"
        >
          { t('twitch.channel', { ns: 'about', channel: 'PRRJYgo' }) }
        </Button>
        <Button
          color="secondary"
          component="a"
          target="_blank"
          href={'https://www.twitch.tv/tcgnetworkoficial'}
          startIcon={<Image alt="" src={'/img/twitch.png'} height={24} width={24} />}
          sx={{ borderColor: 'purple', color: 'purple' }}
          variant="outlined"
        >
          { t('twitch.channel', { ns: 'about', channel: 'TCGNetwork' }) }
        </Button>
      </Stack>
    </PublicLayout>
  )
}

export async function getStaticProps ({ locale }) {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'about']))
    }
  }
}
