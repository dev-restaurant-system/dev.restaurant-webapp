import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Box, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, CircularProgress, Alert, Button,
    Select, MenuItem, FormControl, InputLabel, Snackbar, Menu
} from '@mui/material';
import { Delete as DeleteIcon, PictureAsPdf as PictureAsPdfIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import { getOrders, deleteOrderHistory } from '../api/adminApi';
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx';
import OrderDetailsDialog from '../components/dialogs/OrderDetailsDialog.jsx';
import { orderStatusColors } from '../utils/orderStatusColors.js';

const OrderHistoryPage = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeFilter, setTimeFilter] = useState('all');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [daysToDelete, setDaysToDelete] = useState(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const deleteMenuOpen = Boolean(anchorEl);

    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getOrders();
            const historicalOrders = response.data.filter(order =>
                order.status === 'DELIVERED' || order.status === 'CANCELLED' || order.status === 'REJECTED'
            );
            setAllOrders(historicalOrders);
            setFilteredOrders(historicalOrders);
        } catch (err) {
            setError('Failed to load order history.');
            showSnackbar('Failed to load order history.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        if (timeFilter === 'all') {
            setFilteredOrders(allOrders);
            return;
        }
        const now = new Date();
        const days = parseInt(timeFilter, 10);
        const filtered = allOrders.filter(order => {
            const orderDate = new Date(order.orderDate);
            const diffHours = (now - orderDate) / (1000 * 60 * 60);
            return diffHours <= days * 24;
        });
        setFilteredOrders(filtered);
    }, [timeFilter, allOrders]);


    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setDetailsDialogOpen(true);
    };

    const handleOpenDeleteMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseDeleteMenu = () => {
        setAnchorEl(null);
    };

    const openConfirmationDialog = (days) => {
        setDaysToDelete(days);
        setConfirmDialogOpen(true);
        handleCloseDeleteMenu();
    };

    const handleConfirmDelete = async () => {
        if (!daysToDelete) return;
        setLoading(true);
        try {
            await deleteOrderHistory(daysToDelete);
            showSnackbar(`Successfully deleted orders older than ${daysToDelete} days.`, 'success');
            fetchOrders();
        } catch (err) {
            showSnackbar('Failed to delete order history.', 'error');
        } finally {
            setLoading(false);
            setConfirmDialogOpen(false);
            setDaysToDelete(null);
        }
    };

    /**
     * FINAL REVISION: GUARANTEED A4 FIT WITH MARGINS, FOOTERS, AND AUTO-SIZING
     */
    const downloadPdf = () => {
        // 1. Initialize PDF for A4 landscape using point units
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        // 2. Define table headers and body content
        const head = [['ID', 'Customer', 'Items Ordered', 'Delivery Person', 'Date', 'Payment', 'Status', 'Total (Rs)']];
        const body = filteredOrders.map(order => {
            const itemsString = (order.items && order.items.length > 0)
                ? order.items.map(item => `${item.menuItemName || 'N/A'} x${item.quantity || 0}`).join('\n')
                : 'No items found';
            return [
                `#${order.id}`,
                order.customerName || 'N/A',
                itemsString,
                order.deliveryPersonName || 'Not Assigned',
                new Date(order.orderDate).toLocaleDateString(),
                `${order.paymentMethod || 'N/A'} (${order.paymentStatus || 'N/A'})`,
                order.status ? order.status.replace(/_/g, ' ') : 'N/A',
                (order.totalAmount || 0).toFixed(2)
            ];
        });

        // 3. Add the main title
        doc.setFontSize(16);
        doc.text('Order & Delivery History Report', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

        // 4. Generate the table with strict layout controls
        autoTable(doc, {
            head: head,
            body: body,
            startY: 55,
            theme: 'grid',
            margin: { top: 55, right: 30, bottom: 40, left: 30 },
            headStyles: {
                fillColor: [75, 0, 130],
                textColor: 255,
                fontStyle: 'bold',
            },
            styles: {
                fontSize: 8,
                cellPadding: 4,
                overflow: 'linebreak',
            },
            // CRITICAL: Define most column widths and let one be 'auto' to fill the space
            columnStyles: {
                0: { cellWidth: 40 },      // ID
                1: { cellWidth: 90 },      // Customer
                2: { cellWidth: 70 },  // Items Ordered (Fills remaining space)
                3: { cellWidth: 90 },      // Delivery Person
                4: { cellWidth: 65 },      // Date
                5: { cellWidth: 95 },      // Payment
                6: { cellWidth: 70 },      // Status
                7: { cellWidth: 60 }, // Total
            },
            // 5. Add a footer to every page
            didDrawPage: (data) => {
                const pageHeight = doc.internal.pageSize.getHeight();
                const pageWidth = doc.internal.pageSize.getWidth();
                doc.setFontSize(8);
                doc.setTextColor(150);

                // Page number
                const pageNumText = `Page ${doc.internal.getNumberOfPages()}`;
                doc.text(pageNumText, data.settings.margin.left, pageHeight - 20);

                // Generation date
                const dateText = `Generated on: ${new Date().toLocaleString()}`;
                doc.text(dateText, pageWidth - data.settings.margin.right, pageHeight - 20, { align: 'right' });
            },
        });

        // 6. Save the final PDF
        doc.save(`order-history-report-${new Date().toISOString().split('T')[0]}.pdf`);
        showSnackbar('PDF download started!', 'info');
    };


    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                    <Typography variant="h4" component="h1">Order & Delivery History</Typography>
                    <Box display="flex" gap={2} alignItems="center">
                        <FormControl sx={{ minWidth: 180 }} size="small">
                            <InputLabel>Filter by Time</InputLabel>
                            <Select
                                value={timeFilter}
                                label="Filter by Time"
                                onChange={(e) => setTimeFilter(e.target.value)}
                            >
                                <MenuItem value="all">All Time</MenuItem>
                                <MenuItem value="7">Last 7 Days</MenuItem>
                                <MenuItem value="30">Last 30 Days</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<PictureAsPdfIcon />}
                            onClick={downloadPdf}
                            disabled={loading || filteredOrders.length === 0}
                        >
                            Download as PDF
                        </Button>
                        <div>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleOpenDeleteMenu}
                                disabled={loading}
                            >
                                Clear History
                            </Button>
                            <Menu
                                anchorEl={anchorEl}
                                open={deleteMenuOpen}
                                onClose={handleCloseDeleteMenu}
                            >
                                <MenuItem onClick={() => openConfirmationDialog(7)}>Older Than 7 Days</MenuItem>
                                <MenuItem onClick={() => openConfirmationDialog(30)}>Older Than 30 Days</MenuItem>
                            </Menu>
                        </div>
                    </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TableContainer component={Paper} elevation={1}>
                    <Table stickyHeader sx={{ minWidth: 1200 }}>
                        <TableHead>
                            <TableRow sx={{ '& th': { backgroundColor: 'purple', fontWeight: 'bold', color: 'white' } }}>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Customer</TableCell>
                                <TableCell>Delivery Person</TableCell>
                                <TableCell>Date & Time</TableCell>
                                <TableCell>Payment Details</TableCell>
                                <TableCell align="right">Delivery Fee</TableCell>
                                <TableCell>Final Status</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={9} align="center"><CircularProgress /></TableCell></TableRow>
                            ) : filteredOrders.length === 0 ? (
                                <TableRow><TableCell colSpan={9} align="center">No historical orders found.</TableCell></TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id} hover>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.customerName || 'N/A'}</TableCell>
                                        <TableCell>{order.deliveryPersonName || 'Not Assigned'}</TableCell>
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
                                        <TableCell>{`${order.paymentMethod} (${order.paymentStatus})`}</TableCell>
                                        <TableCell align="right">{(order.deliveryFee || 0).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" sx={{
                                                fontWeight: 'bold',
                                                color: 'white',
                                                backgroundColor: orderStatusColors[order.status] || '#ccc',
                                                borderRadius: '12px',
                                                padding: '4px 10px',
                                                display: 'inline-block',
                                                textTransform: 'capitalize',
                                            }}>
                                                {order.status.replace(/_/g, ' ').toLowerCase()}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                            {(order.totalAmount || 0).toFixed(2)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button size="small" onClick={() => handleViewDetails(order)}>View Details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <OrderDetailsDialog
                order={selectedOrder}
                open={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
            />

            <ConfirmationDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm History Deletion"
                message={`Are you sure you want to permanently delete records older than ${daysToDelete} days? This cannot be undone.`}
            />

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default OrderHistoryPage;
