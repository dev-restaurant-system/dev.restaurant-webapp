import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Alert, Button, Snackbar
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { getCustomers, blockCustomer, unblockCustomer } from '../api/adminApi.jsx'; // Corrected path/casing
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx'; // Import the new component

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [customerAction, setCustomerAction] = useState(null);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);

    const showSnackbar = React.useCallback((message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, []);
    const fetchCustomers = React.useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getCustomers();
            setCustomers(response.data);
        } catch (err) {
            console.error('Error fetching customers:', err);
            setError('Failed to load customer data.');
            showSnackbar('Failed to load customer data.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const openConfirmationDialog = (id, action) => {
        setSelectedCustomerId(id);
        setCustomerAction(action);
        setConfirmDialogOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedCustomerId || !customerAction) return;

        setLoading(true);
        try {
            if (customerAction === 'block') {
                await blockCustomer(selectedCustomerId);
                showSnackbar('Customer blocked successfully!', 'success');
            } else if (customerAction === 'unblock') {
                await unblockCustomer(selectedCustomerId);
                showSnackbar('Customer unblocked successfully!', 'success');
            }
            fetchCustomers();
        } catch (err) {
            const actionText = customerAction === 'block' ? 'block' : 'unblock';
            console.error(`Error ${actionText}ing customer:`, err);
            setError(`Failed to ${actionText} customer.`);
            showSnackbar(`Failed to ${actionText} customer.`, 'error');
        } finally {
            setLoading(false);
            setConfirmDialogOpen(false);
            setSelectedCustomerId(null);
            setCustomerAction(null);
        }
    };

    const getDialogMessage = () => {
        if (customerAction === 'block') {
            return 'Are you sure you want to BLOCK this customer? They will not be able to log in or place orders.';
        }
        if (customerAction === 'unblock') {
            return 'Are you sure you want to UNBLOCK this customer? They will regain access to the app.';
        }
        return '';
    };
    if (loading && !customers.length) {
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
                    Manage Customers
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TableContainer component={Paper} elevation={1}>
                    <Table sx={{ minWidth: 700 }} aria-label="customers table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {customers.length === 0 && !loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No customers found.</TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow
                                        key={customer.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{customer.id}</TableCell>
                                        <TableCell>{customer.name}</TableCell>
                                        <TableCell>{customer.email}</TableCell>
                                        <TableCell>{customer.phone}</TableCell>
                                        <TableCell>{customer.address}</TableCell>
                                        <TableCell align="center">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: customer.status === 'BLOCKED' ? 'error.main' : 'success.main'
                                                }}
                                            >
                                                {customer.status}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            {customer.status === 'ACTIVE' ? (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="error"
                                                    startIcon={<BlockIcon />}
                                                    onClick={() => openConfirmationDialog(customer.id, 'block')}
                                                >
                                                    Block
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    color="success"
                                                    startIcon={<CheckCircleIcon />}
                                                    onClick={() => openConfirmationDialog(customer.id, 'unblock')}
                                                >
                                                    Unblock
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                            {loading && customers.length > 0 && ( 
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <CircularProgress size={20} sx={{ verticalAlign: 'middle', mr: 1 }} /> Loading...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Reusable Confirmation Dialog */}
            <ConfirmationDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmAction}
                title={`Confirm Customer ${customerAction === 'block' ? 'Blocking' : 'Unblocking'}`}
                message={getDialogMessage()}
            />
            {/* Snackbar for notifications */}
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

export default CustomersPage;
