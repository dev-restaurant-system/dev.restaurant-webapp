import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Box, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Alert, Button, Select, MenuItem, FormControl, InputLabel, Snackbar
} from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import OrderDetailsDialog from '../components/dialogs/OrderDetailsDialog.jsx';
import { getOrders, updateOrderStatus, assignOrderToPerson } from '../api/adminApi.jsx';
import AssignDeliveryDialog from '../components/AssignDeliveryDialog.jsx';
import { orderStatusColors } from '../utils/orderStatusColors.js';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [orderToAssign, setOrderToAssign] = useState(null);

    // ✅ ADD THIS HELPER FUNCTION - FORMATS TIME TO IST
    const formatOrderDateToIST = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setOpenDetailsDialog(true);
    };

    const handleCloseDetailsDialog = () => {
        setOpenDetailsDialog(false);
        setSelectedOrder(null);
    };

    const handleOpenAssignDialog = (order) => {
        setOrderToAssign(order);
        setAssignDialogOpen(true);
    };

    const handleAssign = async (orderId, personId) => {
        try {
            await assignOrderToPerson(orderId, personId);
            showSnackbar('Order assigned successfully!', 'success');
            setOrders(prevOrders => prevOrders.map(o =>
                o.id === orderId ? { ...o, deliveryPersonId: personId, status: 'ACCEPTED' } : o
            ));
        } catch (err) {
            showSnackbar(err.response?.data?.message || 'Failed to assign order.', 'error');
        } finally {
            setAssignDialogOpen(false);
            setOrderToAssign(null);
        }
    };

    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, []);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getOrders();
            const activeOrders = response.data.filter(order =>
                order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && order.status !== 'REJECTED'
            );
            setOrders(activeOrders);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load active orders.');
            showSnackbar('Failed to load active orders.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        const originalOrder = orders.find(o => o.id === orderId);
        if (!originalOrder) return;

        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );

        try {
            await updateOrderStatus(orderId, newStatus);
            showSnackbar(`Order #${orderId} status updated to ${newStatus.replace(/_/g, ' ')}.`, 'success');

            if (['DELIVERED', 'CANCELLED', 'REJECTED'].includes(newStatus)) {
                setTimeout(() => {
                    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
                }, 500);
            }
        } catch (err) {
            console.error('Error updating order status:', err);
            setError('Failed to update order status.');
            showSnackbar('Failed to update order status.', 'error');
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? originalOrder : order
                )
            );
        }
    };

    const adminAllowedStatuses = [
        'PENDING', 'ACCEPTED', 'CANCELLED'
    ];

    if (loading && !orders.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Manage Active Orders
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TableContainer component={Paper} elevation={1}>
                    <Table sx={{ minWidth: 800 }} aria-label="orders table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Order Date</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.length === 0 && !loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No active orders found.</TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => (
                                    <TableRow
                                        key={order.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">#{order.id}</TableCell>
                                        <TableCell>{order.customerName}</TableCell>
                                        {/* ✅ UPDATED THIS LINE - NOW SHOWS IST TIME */}
                                        <TableCell>
                                            {(() => {
                                                const utcDate = new Date(order.orderDate);
                                                const istOffset = 5.5 * 60 * 60 * 1000;
                                                const istDate = new Date(utcDate.getTime() + istOffset);
                                                return istDate.toLocaleString('en-IN', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                    hour12: true
                                                });
                                            })()}
                                        </TableCell>
                                        <TableCell align="right">₹{order.totalAmount.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                                                <InputLabel id={`status-label-${order.id}`}>Status</InputLabel>
                                                <Select
                                                    labelId={`status-label-${order.id}`}
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    label="Status"
                                                    sx={{
                                                        backgroundColor: orderStatusColors[order.status] || '#ccc',
                                                        color: ['PENDING', 'REJECTED'].includes(order.status) ? '#000' : 'white',
                                                        fontWeight: 'bold',
                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                                        },
                                                        '& .MuiSelect-icon': { color: ['PENDING', 'REJECTED'].includes(order.status) ? '#000' : 'white' }
                                                    }}
                                                >
                                                    {adminAllowedStatuses.map((status) => (
                                                        <MenuItem key={status} value={status}>
                                                            {status.replace(/_/g, ' ')}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<RemoveRedEyeIcon />}
                                                    onClick={() => handleViewDetails(order)}
                                                >
                                                    View Details
                                                </Button>
                                                {(order.status === 'ACCEPTED' || order.status === 'PREPARING') && !order.deliveryPersonId && (
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        size="small"
                                                        onClick={() => handleOpenAssignDialog(order)}
                                                    >
                                                        Assign
                                                    </Button>
                                                )}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                            {loading && orders.length > 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress size={20} sx={{ verticalAlign: 'middle', mr: 1 }} /> Loading...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <OrderDetailsDialog
                order={selectedOrder}
                open={openDetailsDialog}
                onClose={handleCloseDetailsDialog}
            />

            <AssignDeliveryDialog
                open={assignDialogOpen}
                onClose={() => setAssignDialogOpen(false)}
                onAssign={handleAssign}
                orderId={orderToAssign?.id}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default OrdersPage;
