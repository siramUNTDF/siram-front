import { useState } from 'react'
import { useNavigate } from 'react-router'
import { IconButton, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export default function MenuAccionesCaso({ numero }) {
  const [ancla, setAncla] = useState(null)
  const navigate = useNavigate()

  return (
    <>
      <IconButton
        aria-label={`Acciones del caso ${numero}`}
        aria-haspopup="menu"
        onClick={(e) => setAncla(e.currentTarget)}
        sx={{
          width: 30,
          height: 30,
          color: 'text.tertiary',
          '&:hover': { bgcolor: 'neutral.soft', color: 'text.primary' },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={ancla}
        open={Boolean(ancla)}
        onClose={() => setAncla(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => navigate(`/casos/${numero}`)}>Ver caso</MenuItem>
      </Menu>
    </>
  )
}
