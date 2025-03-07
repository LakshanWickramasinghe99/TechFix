import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';


const drawerWidth = 200;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function SidebarMenu() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
  <CssBaseline />
  {/* Open Drawer Button */}
  <IconButton
    color="inherit"
    aria-label="open drawer"
    onClick={handleDrawerOpen}
    sx={{
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 1200,
      color: '#2C3E50', // Dark Gray
      backgroundColor: '#F5F5F5', // Light Gray
      '&:hover': {
        backgroundColor: '#E0E0E0', // Slightly darker gray on hover
      },
    }}
  >
    <MenuIcon fontSize="medium" />
  </IconButton>

  {/* Drawer */}
  <Drawer
    sx={{
      width: drawerWidth,
      flexShrink: 0,
      '& .MuiDrawer-paper': {
        width: drawerWidth,
        boxSizing: 'border-box',
        backgroundColor: '#2C3E50', // Dark Gray
        color: '#FFFFFF', // White text
      },
    }}
    variant="persistent"
    anchor="left"
    open={open}
  >
    {/* Drawer Header */}
    <DrawerHeader>
      <IconButton
        onClick={handleDrawerClose}
        sx={{
          color: '#FFFFFF', // White
          '&:hover': {
            backgroundColor: '#394B5F', // Slightly lighter dark gray
          },
        }}
      >
        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>
    </DrawerHeader>

    {/* Drawer List */}
    <List>
      {[
        { text: 'Our Products', icon: <InventoryIcon />, link: '/techFixProducts' },
        { text: 'Suppliers', icon: <GroupIcon />, link: '/suppliers' },
        { text: 'Quotation Management', icon: <RequestQuoteIcon />, link: '/quotation' },
        { text: 'Suppliers Products', icon: <ManageSearchIcon />, link: '/product' },
        { text: 'Quotation Comparison', icon: <LogoutIcon />, link: '/compareQuotations' },
      ].map((item) => (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            component="a"
            href={item.link}
            sx={{
              '&:hover': {
                backgroundColor: '#394B5F', // Slightly lighter dark gray
              },
            }}
          >
            <ListItemIcon sx={{ color: '#FFFFFF' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  </Drawer>
</Box>
  );
}
