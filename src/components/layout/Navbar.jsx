import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          button
          onClick={() => {
            document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <ListItemText primary="Gallery" />
        </ListItem>
        <ListItem button component={Link} to="/admin-login">
          <ListItemText primary="Admin Login" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
          transition: 'background-color 0.3s',
        }}
        elevation={0}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            maxWidth: '1200px',
            mx: 'auto',
            width: '100%',
            minHeight: { xs: 50, sm: 56 },
          }}
        >
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              textDecoration: 'none',
              minWidth: 0,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="RitaFoodland Logo"
              sx={{
                height: 40,
                width: 'auto',
                display: 'block',
                mr: 0,
              }}
              draggable={false}
              loading="lazy"
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontFamily: "'Poppins', 'Quicksand', 'Playfair Display', serif",
                letterSpacing: '0.005em',
                textTransform: 'none',
                marginTop: 1.0,
                fontSize: { xs: '1.9rem', sm: '1.5rem' },
                lineHeight: 1.0,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 0.1,
              }}
              component="span"
            >
              <Box component="span" sx={{ color: '#6FCF4B' }}>
                ita
              </Box>
              <Box component="span" sx={{ color: '#FA8900' }}>
                Food
              </Box>
              <Box component="span" sx={{ color: '#6FCF4B' }}>
                land
              </Box>
            </Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            <Button
              component={Link}
              to="/"
              sx={{
                color: '#333',
                fontWeight: 600,
                fontFamily: "'Roboto', sans-serif",
                '&:hover': { color: '#2E7D32' },
              }}
            >
              Home
            </Button>
            <Button
              onClick={() =>
                document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' })
              }
              sx={{
                color: '#333',
                fontWeight: 600,
                fontFamily: "'Roboto', sans-serif",
                '&:hover': { color: '#2E7D32' },
              }}
            >
              Gallery
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="/admin-login"
              sx={{
                backgroundColor: '#4CAF50',
                fontWeight: 600,
                fontFamily: "'Roboto', sans-serif",
                borderRadius: '20px',
                boxShadow: 'none',
                '&:hover': { backgroundColor: '#388E3C' },
              }}
            >
              Admin Login
            </Button>
          </Box>

          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              sx={{ color: '#333' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
