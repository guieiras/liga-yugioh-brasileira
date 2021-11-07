import React from 'react'

import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import HelpIcon from '@mui/icons-material/Help'
import TableChartIcon from '@mui/icons-material/TableChart'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const drawerWidth = 240

const items = [
  { name: 'home', icon: TableChartIcon, route: '/' },
  { name: 'about', icon: HelpIcon, route: '/about' }
]

export default function AdminDrawer ({ isDesktop, open, onClose }) {
  const { t } = useTranslation()
  const router = useRouter()
  const { data: session } = useSession()
  const menuItems = [
    ...items,
    session ? { name: 'admin', icon: AdminPanelSettingsIcon, route: '/admin' } : null
  ].filter((item) => !!item)

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
      <List component="nav">
        <ListSubheader>
          { t('drawer.title') }
        </ListSubheader>
        {
          menuItems.map(({ name, icon: Icon, route }) => (
            <Link passHref href={route} key={name}>
              <ListItemButton
              component='a'
              onClick={() => router.push(route)}
              selected={router.pathname === route}
              >
                <ListItemIcon><Icon /></ListItemIcon>
                <ListItemText primary={t(`public.drawer.${name}`)} />
              </ListItemButton>
            </Link>
          ))
        }
      </List>
    </Box>
  </Drawer>
}
