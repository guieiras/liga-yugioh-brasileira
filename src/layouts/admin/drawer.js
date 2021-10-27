import React from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import PeopleIcon from '@mui/icons-material/People';
import { useTranslation } from 'next-i18next';

const drawerWidth = 240

export default function AdminDrawer ({ isDesktop, open, onClose }) {
  const { t } = useTranslation()
  return <Drawer
    variant={isDesktop ? 'permanent' : 'temporary'}
    open={open}
    onClose={onClose}
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
    }}
  >
    <Toolbar />
    <Box sx={{ overflow: 'auto' }}>
      <List component="nav">
        <ListSubheader>
          { t('admin.drawer.title') }
        </ListSubheader>
      </List>
    </Box>
  </Drawer>
}
