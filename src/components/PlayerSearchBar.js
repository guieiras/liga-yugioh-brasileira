import Paper from '@mui/material/Paper'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'

export default function PlayerSearchBar ({ value, onChange, onSelect, onDelete, players, ...props }) {
  function handleSelect () {
    onSelect && onSelect(this)
  }

  return (
    <>
      <TextField
        fullWidth
        size="small"
        variant="outlined"
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            onDelete && value && <InputAdornment position="end">
              <IconButton onClick={onDelete} size="small">
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </InputAdornment>
          )
        }}
        {...props}
      />
      { players?.length > 0 && <Paper variant="outlined" square>
        <List>
          {
            players.map((player) => <ListItem dense key={player.id}>
              <ListItemButton onClick={handleSelect.bind(player)}>
                {player.name}
              </ListItemButton>
            </ListItem>)
          }
        </List>
      </Paper> }
    </>
  )
}
