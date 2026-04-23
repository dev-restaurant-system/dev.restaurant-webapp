import React, { useState, useEffect, useMemo } from 'react';
import {
    Container, Typography, Box, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Alert,
    FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemText, Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


const DiningHistoryPage = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [filter, setFilter] = useState('today');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);


    useEffect(() => {
        const storedOrders = JSON.parse(localStorage.getItem('diningBillHistory') || '[]');
        storedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setAllOrders(storedOrders);
    }, []);


    const filteredOrders = useMemo(() => {
        if (filter === 'all') return allOrders;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return allOrders.filter(order => {
            const orderDate = new Date(order.orderDate);
            const orderDay = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
            return today.getTime() === orderDay.getTime();
        });
    }, [allOrders, filter]);


    const filteredTotal = useMemo(() => {
        return filteredOrders.reduce((total, order) => total + (order.totalAmount || 0), 0);
    }, [filteredOrders]);


    const handleClearHistory = () => {
        localStorage.removeItem('diningBillHistory');
        setAllOrders([]);
        setConfirmDialogOpen(false);
    };

    // *** THIS IS THE FINAL, UPDATED PDF FUNCTION ***
    const handleDownloadPdf = () => {
        const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
        const reportTitle = `Dining Order History Report (${filter === 'today' ? 'Today' : 'All Time'})`;
        const fileName = `Dining_History_${new Date().toISOString().split('T')[0]}.pdf`;

        // --- PDF Header ---
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text("Rita FoodLand", doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(reportTitle, doc.internal.pageSize.getWidth() / 2, 60, { align: 'center' });

        // --- PDF Table Data ---
        const tableColumn = ["Date", "Customer", "Item", "Qty", "Price (Rs)"];
        const tableRows = [];

        filteredOrders.forEach(order => {
            if (order.items && order.items.length > 0) {
                order.items.forEach((item, index) => {
                    const rowData = [
                        index === 0 ? new Date(order.orderDate).toLocaleString() : '',
                        index === 0 ? order.customerName || 'N/A' : '',
                        item.menuItemName || 'Unknown Item',
                        item.quantity || 0,
                        ((item.priceAtOrder || 0) * (item.quantity || 0)).toFixed(2)
                    ];
                    tableRows.push(rowData);
                });
            }
             tableRows.push([{ content: '', colSpan: 5, styles: { fillColor: [240, 240, 240], minCellHeight: 3 } }]);
        });
        
        if (tableRows.length > 0) {
            tableRows.pop();
        }

        // --- Generate the PDF Table ---
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 80,
            theme: 'striped',
            styles: { fontSize: 9, cellPadding: 4, overflow: 'linebreak' },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            columnStyles: {
                0: { cellWidth: 100 },
                1: { cellWidth: 120 },
                2: { cellWidth: 'auto' },
                3: { cellWidth: 30, halign: 'center' }, // FIX: Made the Qty column smaller
                4: { cellWidth: 60, halign: 'right' }
            },
            didDrawPage: (data) => {
                doc.setFontSize(10);
                doc.text(`Page ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, doc.internal.pageSize.height - 15);
            }
        });

        // FIX: The bottom text for "Total Sales" and "Report generated on" has been removed.

        doc.save(fileName);
    };


    return (
        <>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>Dining Order History</Typography>
                        <Box display="flex" gap={2} alignItems="center">
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <InputLabel>Filter</InputLabel>
                                <Select value={filter} label="Filter" onChange={e => setFilter(e.target.value)}>
                                    <MenuItem value="today">Today</MenuItem>
                                    <MenuItem value="all">All Time</MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="secondary" startIcon={<PictureAsPdfIcon />} onClick={handleDownloadPdf} disabled={filteredOrders.length === 0}>Download PDF</Button>
                            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => setConfirmDialogOpen(true)} disabled={allOrders.length === 0}>Clear History</Button>
                        </Box>
                    </Box>

                    {filteredOrders.length === 0 ? (
                        <Alert severity="info" sx={{ mt: 3 }}>No dining orders found.</Alert>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 700 }} stickyHeader>
                                <TableHead><TableRow sx={{ '& .MuiTableCell-root': { bgcolor: 'grey.200', fontWeight: 'bold' } }}><TableCell>Date & Time</TableCell><TableCell>Customer</TableCell><TableCell>Items Ordered</TableCell><TableCell align="right">Total Amount</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id} hover>
                                            <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                                            <TableCell>{order.customerName || 'N/A'}</TableCell>
                                            <TableCell>
                                                <List dense disablePadding>
                                                    {order.items && order.items.map((item, index) => (
                                                        <ListItem key={index} disableGutters sx={{ p: 0 }}>
                                                            <ListItemText
                                                                primary={`${item.menuItemName || 'Unknown Item'} (x${item.quantity || 0})`}
                                                                secondary={`Price: ₹${((item.priceAtOrder || 0) * (item.quantity || 0)).toFixed(2)}`}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>₹{(order.totalAmount || 0).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{filter === 'today' ? "Today's Total Sales:" : 'Grand Total Sales:'}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', ml: 2, minWidth: '150px', textAlign: 'right' }}>₹{filteredTotal.toFixed(2)}</Typography>
                    </Box>
                </Paper>
            </Container>

            <ConfirmationDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleClearHistory}
                title="Confirm Clear History"
                message="Are you sure you want to permanently delete all dining order history? This action cannot be undone."
            />
        </>
    );
};

export default DiningHistoryPage;
