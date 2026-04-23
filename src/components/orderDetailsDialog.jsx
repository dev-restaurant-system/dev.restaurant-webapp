import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider, Chip
} from '@mui/material';
import { orderStatusColors } from '../utils/orderStatusColors.js';

const OrderDetailsDialog = ({ order, open, onClose }) => {
    if (!order) {
        return null;
    }
    const displayPaymentMethod = (method) => {
        if (method === 'COD') return 'Cash on Delivery';
        if (method === 'Online') return 'Online Payment';
        return method || 'N/A';
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Order Details - Order #{order.id}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* Customer & Delivery Info Section */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, height: '100%', borderLeft: '4px solid', borderColor: 'primary.main' }}>
                            <Typography variant="h6" gutterBottom>Customer & Delivery</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography><strong>Name:</strong> {order.customerName}</Typography>
                            <Typography><strong>Delivery Address:</strong> {order.deliveryAddress}</Typography>
                            <Typography sx={{ mt: 1 }}><strong>Assigned To:</strong> {order.deliveryPersonName || 'Not Assigned'}</Typography>
                        </Paper>
                    </Grid>

                    {/* Order Summary Section */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, height: '100%', borderLeft: '4px solid', borderColor: 'secondary.main' }}>
                            <Typography variant="h6" gutterBottom>Order Summary</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
                                <Typography><strong>Status:</strong></Typography>
                                <Chip
                                    label={order.status ? order.status.replace(/_/g, ' ') : 'UNKNOWN'}
                                    size="small"
                                    sx={{
                                        backgroundColor: orderStatusColors[order.status] || '#ccc',
                                        color: 'white',
                                        fontWeight: 'bold'
                                    }}
                                />
                            </Box>
                            <Typography><strong>Payment Method:</strong> {displayPaymentMethod(order.paymentMethod)}</Typography>
                            <Typography><strong>Payment Status:</strong> {order.paymentStatus}</Typography>
                        </Paper>
                    </Grid>

                    {/* Items Ordered Section */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Items Ordered</Typography>
                        <TableContainer component={Paper} elevation={2}>
                            <Table sx={{ minWidth: 650 }} aria-label="ordered items table">
                                <TableHead sx={{ backgroundColor: 'grey.200' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Item Name</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price per Item</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {order.items && order.items.length > 0 ? (
                                        order.items.map((item, index) => (
                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell component="th" scope="row">{item.menuItemName}</TableCell>
                                                <TableCell align="right">{item.quantity}</TableCell>
                                                <TableCell align="right">₹{item.priceAtOrder ? item.priceAtOrder.toFixed(2) : '0.00'}</TableCell>
                                                <TableCell align="right">₹{(item.priceAtOrder * item.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">No items found for this order.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    {/* Financial Summary Section */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Box sx={{ width: { xs: '100%', sm: '350px' }, p: 2, backgroundColor: 'grey.50', borderRadius: '8px' }}>
                                <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Subtotal:</span>
                                    <span>₹{order.subtotal ? order.subtotal.toFixed(2) : '0.00'}</span>
                                </Typography>
                                <Typography variant="body1" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Delivery Fee:</span>
                                    <span>₹{order.deliveryFee ? order.deliveryFee.toFixed(2) : '0.00'}</span>
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>Total Amount:</strong>
                                    <strong>₹{order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</strong>
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsDialog;
