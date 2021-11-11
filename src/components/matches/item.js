import React from 'react'

import Image from 'next/image'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { green, grey, red, yellow } from '@mui/material/colors'
import Grid from '@mui/material/Grid'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'
import ClearIcon from '@mui/icons-material/Clear'
import ReplayIcon from '@mui/icons-material/Replay'
import { useTranslation } from 'next-i18next'

export default function MatchItem ({ match, homePlayer, awayPlayer, onEdit, linkSize, children }) {
  const { t } = useTranslation()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const isSmallLink = linkSize === 'small' || !isDesktop

  function matchWinner (match, winner) {
    if (match.winner === null) { return grey[500] }
    if (match.winner === 0) { return yellow[500] }

    return match.winner === winner ? green[500] : red[500]
  }

  function MatchLinks ({ match }) {
    return <Box>
      {
        match.dueling_book_replay_url && (
          !isSmallLink
            ? <Button
            component="a"
            color="info"
            target="_blank"
            href={match.dueling_book_replay_url}
            startIcon={<ReplayIcon />}
            sx={{ marginLeft: 1, marginRight: 1 }}
            variant="outlined"
          >
            {t('matches.replay')}
          </Button>
            : <IconButton
              component="a"
              target="_blank"
              href={match.dueling_book_replay_url}
              title={t('matches.replay')}
            >
              <ReplayIcon />
          </IconButton>
        )
      }
      {
        match.prrj_youtube_video_url && (
          !isSmallLink
            ? <Button
            component="a"
            color="info"
            target="_blank"
            href={match.prrj_youtube_video_url}
            startIcon={<Image alt="" src={'/img/prrj.jpg'} height={24} width={24} />}
            sx={{ '& img': { borderRadius: 50 }, marginLeft: 1, marginRight: 1 }}
            variant="outlined"
          >
            {t('matches.analysis')}
          </Button>
            : <IconButton
            component="a"
            target="_blank"
            href={match.prrj_youtube_video_url}
            title={t('matches.analysis')}
            sx={{ '& img': { borderRadius: 50 } }}
          >
            <Image alt="" src={'/img/prrj.jpg'} height={24} width={24} />
          </IconButton>
        )
      }
    </Box>
  }

  function MatchItem ({ match, content, children }) {
    if (!onEdit) {
      return <>
        {children}
        <MatchLinks match={match} />
      </>
    }

    if (content) {
      return <Paper sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {children}
        {content}
      </Paper>
    }

    return <>
      <ListItemButton
        title={t('matches.edit')}
        onClick={onEdit}
        sx={{ width: '100%' }}
      >
        { children }
      </ListItemButton>
      <MatchLinks match={match} />
    </>
  }

  return (
    <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
      <MatchItem match={match} content={children}>
        <Grid container sx={{ p: children && 2 }}>
          <Grid item xs={4} sx={{ display: 'table', textAlign: isDesktop ? 'right' : 'left' }}>
            <Typography style={{ display: 'table-cell', paddingRight: 4, verticalAlign: 'middle' }} variant={isDesktop ? 'body1' : 'caption'}>
              {homePlayer}
            </Typography>
          </Grid>
          <Grid item xs={1} sx={{ textAlign: 'right' }}>
            <CircleTwoToneIcon fontSize={ isDesktop ? 'medium' : 'small'} sx={{ color: matchWinner(match, 1), height: '100%' }} />
          </Grid>
          <Grid item xs={2} sx={{ textAlign: 'center' }}>
            <ClearIcon sx={{ height: '100%' }} />
          </Grid>
          <Grid item xs={1} sx={{ textAlign: 'left' }}>
            <CircleTwoToneIcon fontSize={ isDesktop ? 'medium' : 'small'} sx={{ color: matchWinner(match, 2), height: '100%' }} />
          </Grid>
          <Grid item xs={4} sx={{ display: 'table', textAlign: isDesktop ? 'left' : 'right' }}>
            <Typography style={{ display: 'table-cell', paddingLeft: 4, verticalAlign: 'middle' }} variant={isDesktop ? 'body1' : 'caption'}>
              {awayPlayer}
            </Typography>
          </Grid>
        </Grid>
      </MatchItem>
    </ListItem>
  )
}
