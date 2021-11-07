import React from 'react'

import Image from 'next/image'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { green, grey, red, yellow } from '@mui/material/colors'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos'
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone'
import ClearIcon from '@mui/icons-material/Clear'
import EditIcon from '@mui/icons-material/Edit'
import ReplayIcon from '@mui/icons-material/Replay'
import { useTranslation } from 'next-i18next'
import RoundsEdit from './edit'

export default function RoundsPanel ({
  onNewRound, matches, players, onEdit, onBack, onGameUpdate, onForward, round, lastRound, sx,
  controls, loading, linkSize, ...props
}) {
  const { t } = useTranslation()
  const [editableGame, setEditableGame] = React.useState(null)
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const isSmallLink = linkSize === 'small' || !isDesktop

  async function handleGameUpdate (match, form) {
    await onGameUpdate({ id: match.id, ...form })
    setEditableGame(null)
  }

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

  function MatchItem ({ match, children }) {
    if (!onGameUpdate) {
      return <>
        {children}
        <MatchLinks match={match} />
      </>
    }

    if (editableGame === match.id) {
      return <Paper sx={{ display: 'flex', flexDirection: 'column', width: '100%', ...(sx || {}) }}>
        {children}
        <RoundsEdit
          awayPlayer={players[match.away_player_id]}
          homePlayer={players[match.home_player_id]}
          match={match}
          onCancel={() => setEditableGame(null)}
          onSubmit={(form) => handleGameUpdate(match, form)}
        />
      </Paper>
    }

    return <>
      <ListItemButton
        title={t('matches.edit')}
        onClick={setEditableGame.bind(this, match.id)}
        sx={{ width: '100%' }}
      >
        { children }
      </ListItemButton>
      <MatchLinks match={match} />
    </>
  }

  if (round === 0) {
    return <Paper {...props} sx={{ p: 3, textAlign: 'center', ...(sx || {}) }}>
      { onNewRound
        ? <Button onClick={onNewRound}>{t('rounds.first')}</Button>
        : <Typography>{t('rounds.none')}</Typography>
      }
    </Paper>
  }

  return (
    <Paper {...props} sx={{ p: 2, ...(sx || {}) }}>
      {
        (typeof controls === 'undefined' || controls)
          ? <Stack direction='row' justifyContent='space-between'>
          <IconButton disabled={round === 1} onClick={onBack} title={t('rounds.previous')}><ArrowBackIcon /></IconButton>
          <Typography variant="button">{t('currentRound', { round })}</Typography>
          {
            round < lastRound
              ? (
              <IconButton onClick={onForward} title={t('rounds.next')}><ArrowForwardIcon /></IconButton>
                )
              : (
                <IconButton disabled={!onNewRound} onClick={onNewRound} title={t('rounds.new')} sx={{ visibility: !onNewRound ? 'hidden' : '' }}>
                  <AddIcon />
                </IconButton>
                )
          }
        </Stack>
          : <Typography variant="button">{t('currentRound', { round })}</Typography>
      }

      {
        loading
          ? <Stack alignItems="center" sx={{ p: 2 }}>
            <CircularProgress />
          </Stack>
          : <List>
        {
          matches.map((match) => (
            <ListItem key={match.id} sx={{ display: 'flex', flexDirection: 'column' }}>
              <MatchItem match={match}>
                <Grid container>
                  <Grid item xs={4} sx={{ display: 'table', textAlign: isDesktop ? 'right' : 'left' }}>
                    <Typography style={{ display: 'table-cell', paddingRight: 4, verticalAlign: 'middle' }} variant={isDesktop ? 'body1' : 'caption'}>
                      {players[match.home_player_id]}
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
                      {players[match.away_player_id]}
                    </Typography>
                  </Grid>
                </Grid>
              </MatchItem>
            </ListItem>
          ))
        }
      </List>
      }
      {
        onEdit && !editableGame && <Box sx={{ textAlign: 'right' }}>
          <IconButton role="button" onClick={onEdit} title={t('matches.manage')}>
            <EditIcon />
          </IconButton>
        </Box>
      }
    </Paper>
  )
}
