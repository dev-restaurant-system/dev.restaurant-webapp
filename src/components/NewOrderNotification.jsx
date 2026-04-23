import React from 'react';
import { Card, CardContent, Typography, Button, Box, Divider, Chip } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const NewOrderNotification = ({ order, onCheckout }) => {
    return (
        <Card 
            sx={{ 
                mb: 2, 
                borderLeft: '6px solid', 
                borderColor: '#c0392b', // A rich, deep red for the accent
                backgroundColor: '#fef5f5', // A very light, complementary red background
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                }
            }}
        >
            <CardContent sx={{ p: '16px !important' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* The Chip now uses the 'error' color for a consistent red theme */}
                    <Chip 
                        label={`NEW ORDER #${order.id}`}
                        color="error" // Use the theme's red color
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                    />
                    <Box display="flex" alignItems="center" color="text.secondary">
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">
                            {new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 1.5 }} />

                <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            Customer
                        </Typography>
                        <Typography variant="h6" component="div" sx={{ fontWeight: '500' }}>
                            {order.customerName}
                        </Typography>
                    </Box>
                    <Box textAlign="right">
                        <Typography variant="body2" color="text.secondary">
                            Total Amount
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                            ₹{order.totalAmount.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
                
                <Box mt={2.5} textAlign="right">
                    {/* The Button also uses the 'error' color for consistency */}
                    <Button
                        variant="contained"
                        color="error" 
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => onCheckout(order.id)}
                        sx={{
                           
                        }}
                    >
                        Process Order
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default NewOrderNotification;

