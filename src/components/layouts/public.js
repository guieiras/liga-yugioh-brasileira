import React from 'react'
import Head from 'next/head'
import PublicDrawer from './public/drawer'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import CssBaseline from '@mui/material/CssBaseline'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'

export default function PublicLayout ({ children, index, title }) {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = React.useState(false)
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <Box sx={{ display: 'flex' }}>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('title')}
          </Typography>
        </Toolbar>
      </AppBar>
      <PublicDrawer open={isOpen} onClose={() => setIsOpen(false)} isDesktop={isDesktop} />
      <Container sx={{ mt: 3, mb: 3 }}>
        <Toolbar />
        {children}
      </Container>
    </Box>
  )
}
