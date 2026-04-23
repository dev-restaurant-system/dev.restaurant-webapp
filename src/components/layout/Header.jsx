import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [anchorEl, setAnchorEl] = useState(null);
  const mobileMenuOpen = Boolean(anchorEl);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleMobileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setAnchorEl(null);
  };

  const isActive = (path) => location.pathname === path;
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/menu-items', label: 'Menu' },
    { path: '/orders', label: 'Orders' },
    { path: '/customers', label: 'Customers' },
    { path: '/restaurant', label: 'Restaurant' },
    { path: '/slider-images', label: 'Sliders' },
    { path: '/delivery-people', label: 'Delivery' },
    { path: '/order-history', label: 'History' },
    { path: '/dining-billing', label: 'For Dining' },
    { path: '/dining-history', label: 'Dining History' },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 }, py: 1 }}>
          {/* Brand/Logo Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, mr: 2 }}>
            <Typography
              variant="h4"
              component={Link}
              to="/dashboard"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.4rem', sm: '1.7rem' },
                letterSpacing: '-0.02em',
                fontFamily: '"Inter", "Roboto", sans-serif',
                textDecoration: 'none'
              }}
            >
              Dev.Restaurant
            </Typography>
          </Box>

          {/* Desktop Navigation Items */}
          {!isMobile && (
            <Box
              component="nav"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap', // FIX: Allow items to wrap
                gap: theme.spacing(0.5, 0.75), // FIX: Adjusted gap for better spacing
                flexGrow: 1, // Allow this container to grow
                flexShrink: 1, // Allow this container to shrink
                minWidth: 0, // CRITICAL: Allows flex items to shrink below their content size
              }}
            >
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    sx={{
                      color: active ? '#667eea' : '#64748b',
                      backgroundColor: active ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
                      borderRadius: '12px',
                      px: { lg: 1.5, xl: 2 }, // Adjusted padding
                      py: 1.2,
                      fontSize: { lg: '0.875rem', xl: '0.9rem' },
                      fontWeight: active ? 600 : 500,
                      textTransform: 'none',
                      minWidth: 'auto',
                      whiteSpace: 'nowrap',
                      position: 'relative',
                      fontFamily: '"Inter", "Roboto", sans-serif',
                      letterSpacing: '0.01em',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        width: active ? '80%' : '0%',
                        height: '2px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '2px',
                        transform: 'translateX(-50%)',
                        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      },
                      '&:hover': {
                        backgroundColor: active ? 'rgba(102, 126, 234, 0.12)' : 'rgba(102, 126, 234, 0.06)',
                        color: '#667eea',
                        transform: 'translateY(-1px)',
                        boxShadow: active ? '0 8px 25px rgba(102, 126, 234, 0.15)' : '0 4px 15px rgba(102, 126, 234, 0.1)',
                        '&::before': {
                          width: '80%',
                        }
                      },
                      '&:active': {
                        transform: 'translateY(0px)',
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}

          {/* Right Side - Mobile Menu + Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0, ml: 2 }}>
            {isMobile ? (
              <IconButton
                onClick={handleMobileMenuOpen}
                sx={{
                  color: '#64748b',
                  backgroundColor: 'rgba(102, 126, 234, 0.06)',
                  borderRadius: '10px',
                  p: 1.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.12)',
                    color: '#667eea',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)',
                  }
                }}
              >
                <MoreVertIcon />
              </IconButton>
            ) : (
                <Button
                    onClick={handleLogout}
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    sx={{
                        borderColor: '#ef4444',
                        color: '#ef4444',
                        borderRadius: '12px',
                        px: { xs: 2, sm: 3 },
                        py: 1.2,
                        fontSize: { xs: '0.875rem', sm: '0.9rem' },
                        fontWeight: 500,
                        textTransform: 'none',
                        fontFamily: '"Inter", "Roboto", sans-serif',
                        borderWidth: '1.5px',
                        whiteSpace: 'nowrap', // Prevent logout text from wrapping
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            backgroundColor: '#ef4444',
                            color: 'white',
                            borderColor: '#ef4444',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.25)',
                            borderWidth: '1.5px',
                        },
                        '&:active': {
                            transform: 'translateY(0px)',
                        }
                    }}
                >
                    Logout
                </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Menu */}
      <Menu
        anchorEl={anchorEl}
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.06)',
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }
        }}
      >
        {navItems.map((item, index) => {
          const active = isActive(item.path);
          return (
            <MenuItem
              key={item.path}
              component={Link}
              to={item.path}
              onClick={handleMobileMenuClose}
              sx={{
                py: 1.8,
                px: 3,
                mx: 1,
                my: index === 0 ? 1 : 0.5,
                borderRadius: '12px',
                backgroundColor: active ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
                color: active ? '#667eea' : '#64748b',
                fontWeight: active ? 600 : 500,
                fontSize: '0.95rem',
                fontFamily: '"Inter", "Roboto", sans-serif',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&::before': active ? {
                  content: '""',
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  width: '3px',
                  height: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '2px',
                  transform: 'translateY(-50%)',
                } : {},
                '&:hover': {
                  backgroundColor: active ? 'rgba(102, 126, 234, 0.12)' : 'rgba(102, 126, 234, 0.06)',
                  color: '#667eea',
                  transform: 'translateX(4px)',
                }
              }}
            >
              {item.label}
            </MenuItem>
          );
        })}
        <MenuItem
          onClick={() => {
            handleMobileMenuClose();
            handleLogout();
          }}
          sx={{
            py: 1.8,
            px: 3,
            mx: 1,
            my: 0.5,
            borderRadius: '12px',
            color: '#ef4444',
            fontWeight: 600,
            fontSize: '0.95rem',
            fontFamily: '"Inter", "Roboto", sans-serif',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(239, 68, 68, 0.06)',
              transform: 'translateX(4px)',
            }
          }}
        >
          <LogoutIcon sx={{ mr: 1.5 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;
