import React from 'react';
import { Box, Typography, Container, Paper, Divider } from '@mui/material';
import useOrderNotifications from '../hooks/useOrderNotifications'; // This now returns a boolean
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    // 1. The hook now returns a simple true/false value.
    const hasNewOrder = useOrderNotifications();
    const navigate = useNavigate();

    // 2. This handler navigates to the main orders page.
    const handleGoToOrders = () => {
        navigate('/orders');
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#fafafa' }}>
                {/* --- Professional "Rita Foodland" Heading (Unchanged) --- */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography 
                        variant="h3" 
                        component="h1" 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: '#2c3e50',
                            fontFamily: "'Playfair Display', serif"
                        }}
                    >
                        Dev.
                        <Typography 
                            component="span" 
                            variant="h3" 
                            sx={{ 
                                color: '#c0392b', 
                                fontWeight: 'bold',
                                fontFamily: "'Playfair Display', serif"
                            }}
                        >
                            Restaurant
                        </Typography>
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Real-Time Order Management Dashboard
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />
                
                {/* --- 3. UPDATED Notification Section --- */}
                <Box>
                    {/* This title is now clickable and shows a simple status */}
                    <Box display="flex" alignItems="center" mb={2} onClick={handleGoToOrders} sx={{ cursor: 'pointer' }}>
                        <NotificationsActiveIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h5" sx={{ fontWeight: 500 }}>
                            New Incoming Orders {hasNewOrder ? '(Alert!)' : '(All Caught Up)'}
                        </Typography>
                    </Box>

                    {/* 4. The list of order cards is replaced with a simple status message */}
                    <Paper 
                        variant="outlined" 
                        sx={{ 
                            p: 3, 
                            textAlign: 'center', 
                            backgroundColor: '#fff',
                            borderStyle: 'dashed'
                        }}
                    >
                        <Typography variant="body1" color="text.secondary">
                            {hasNewOrder
                              ? 'You have new orders. Click the title above or the bell in the header to view them.'
                              : 'Waiting for new orders...'
                            }
                        </Typography>
                    </Paper>
                </Box>
            </Paper>
        </Container>
    );
};

export default DashboardPage;
