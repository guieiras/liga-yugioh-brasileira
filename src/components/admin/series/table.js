import React from 'react'

import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ShieldIcon from '@mui/icons-material/Shield'
import useLocalization from '../../../useLocalization'

export default function AdminSeriesTable ({ series, ...props }) {
  const { locale } = useLocalization()

  return (
    <Paper {...props}>
      <List>
        { series.map((serie) => (
          <ListItem key={serie.id}>
            <ListItemIcon>
              <ShieldIcon sx={{ color: serie.color }} />
            </ListItemIcon>
            <ListItemText primary={serie[`name_${locale.split('-')[0]}`]} />
          </ListItem>
        )) }
      </List>
    </Paper>
  )
}
