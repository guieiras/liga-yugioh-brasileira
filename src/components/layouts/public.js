import React from 'react'
import Head from 'next/head'
import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { useTheme } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import MenuIcon from '@mui/icons-material/Menu'
import { useTranslation } from 'next-i18next'
import PublicDrawer from './public/drawer'
import Link from '../Link'

export default function PublicLayout ({ children, index, title }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Stack direction="row">
      <Head>
        <title>{title || t(`public.drawer.${index}`)}</title>
      </Head>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {!isDesktop && <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <MenuIcon />
          </IconButton>}
          <Link href="/" variant="h6" underline="none" sx={{ color: 'white' }}>
            {t('title')}
          </Link>
        </Toolbar>
      </AppBar>
      <PublicDrawer open={isOpen} onClose={() => setIsOpen(false)} isDesktop={isDesktop} />
      <Container sx={{ mt: 3, mb: 3 }}>
        <Toolbar />
        {children}
      </Container>
    </Stack>
  )
}
