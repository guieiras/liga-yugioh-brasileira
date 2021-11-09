import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import HomeIcon from '@mui/icons-material/Home'
import PeopleIcon from '@mui/icons-material/People'
import PublicIcon from '@mui/icons-material/Public'
import ShieldIcon from '@mui/icons-material/Shield'
import TodayIcon from '@mui/icons-material/Today'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { logout } from '../../../requests/auth0'

const drawerWidth = 240

const items = [
  { name: 'home', icon: HomeIcon, route: '/admin' },
  { name: 'players', icon: PeopleIcon, route: '/admin/players' },
  { name: 'seasons', icon: TodayIcon, route: '/admin/seasons' },
  { name: 'series', icon: ShieldIcon, route: '/admin/series' },
  { name: 'public', icon: PublicIcon, route: '/' }
]

async function exit () {
  await signOut({ redirect: false })
  logout('/admin/sign_in')
}

export default function AdminDrawer ({ isDesktop, open, onClose }) {
  const { t } = useTranslation()
  const { pathname } = useRouter()
  const { data: session } = useSession()

  return <Drawer
    variant={isDesktop ? 'permanent' : 'temporary'}
    open={open}
    onClose={onClose}
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
    }}
  >
    <Toolbar />
    <Box sx={{ overflow: 'auto' }}>
      { session && <Stack p={2}>
        <Typography variant="button" component="p">{session.user.name}</Typography>
        <Button size='small' startIcon={<ExitToAppIcon />} variant='outlined' sx={{ mt: 1 }} onClick={exit}>
          { t('signOut') }
        </Button>
      </Stack> }
      <List component="nav">
        <ListSubheader>
          { t('drawer.title') }
        </ListSubheader>
        {
          items.map(({ name, icon: Icon, route }) => (
            <Link passHref href={route} key={name}>
              <ListItemButton component='a' selected={pathname === route}>
                <ListItemIcon><Icon /></ListItemIcon>
                <ListItemText primary={t(`admin.drawer.${name}`)} />
              </ListItemButton>
            </Link>
          ))
        }
      </List>
    </Box>
  </Drawer>
}
