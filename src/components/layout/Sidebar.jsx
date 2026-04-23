import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import HistoryIcon from '@mui/icons-material/History';
import {
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  RestaurantMenu as RestaurantMenuIcon
} from '@mui/icons-material';

const Sidebar = ({ drawerWidth, mobileOpen, onClose }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const drawerContent = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {/* Dashboard */}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/dashboard" selected={isActive('/dashboard')} onClick={onClose}>
              <ListItemIcon><DashboardIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          {/* Menu Items */}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/menu-items" selected={isActive('/menu-items')} onClick={onClose}>
              <ListItemIcon><MenuBookIcon /></ListItemIcon>
              <ListItemText primary="Menu Items" />
            </ListItemButton>
          </ListItem>


          {/* Orders */}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/orders" selected={isActive('/orders')} onClick={onClose}>
              <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItemButton>
          </ListItem>

          {/* Customers */}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/customers" selected={isActive('/customers')} onClick={onClose}>
              <ListItemIcon><PeopleIcon /></ListItemIcon>
              <ListItemText primary="Customers" />
            </ListItemButton>
          </ListItem>

          {/* Restaurant Info */}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/restaurant" selected={isActive('/restaurant')} onClick={onClose}>
              <ListItemIcon><RestaurantIcon /></ListItemIcon>
              <ListItemText primary="Restaurant Info" />
            </ListItemButton>
          </ListItem>

          {/* Slider Images */}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/slider-images" selected={isActive('/slider-images')} onClick={onClose}>
              <ListItemIcon><PhotoLibraryIcon /></ListItemIcon>
              <ListItemText primary="Slider Images" />
            </ListItemButton>
          </ListItem>

          {/* Delivery Staff */}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/delivery-people" selected={isActive('/delivery-people')} onClick={onClose}>
              <ListItemIcon><DeliveryDiningIcon /></ListItemIcon>
              <ListItemText primary="Delivery Staff" />
            </ListItemButton>
          </ListItem>

          {/* Order History */}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/order-history" selected={isActive('/order-history')} onClick={onClose}>
              <ListItemIcon><HistoryIcon /></ListItemIcon>
              <ListItemText primary="Order History" />
            </ListItemButton>
          </ListItem>

          {/* Dining Billing */}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/dining-billing" selected={isActive('/dining-billing')} onClick={onClose}>
              <ListItemIcon>
                <RestaurantMenuIcon />
              </ListItemIcon>
              <ListItemText primary="Dining Billing" />
            </ListItemButton>
          </ListItem>

          {/* Analytics */}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/analytics" selected={isActive('/analytics')} onClick={onClose}>
              <ListItemIcon><TrendingDownIcon /></ListItemIcon>
              <ListItemText primary="Analytics" />
            </ListItemButton>
          </ListItem>

          {/* Payments */}
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/payments" selected={isActive('/payments')} onClick={onClose}>
              <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
              <ListItemText primary="Payments" />
            </ListItemButton>
          </ListItem>

        </List>
        <Divider />
      </Box>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="main navigation"
    >
      {/* Temporary Drawer for Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Permanent Drawer for Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
