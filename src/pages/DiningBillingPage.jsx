import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Paper, Grid, TextField, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Autocomplete, Snackbar, Alert, Divider, FormControl, InputLabel,
    Select, MenuItem, InputAdornment, Checkbox, FormControlLabel
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import HistoryIcon from '@mui/icons-material/History';
import { getMenuItems, getAvailableDeliveryPeople, createOrder } from '../api/adminApi';
import ThermalPrintManager from '../components/printing/ThermalPrintManager.jsx';

const DiningBillingPage = () => {
    const navigate = useNavigate();
    const [assignForDelivery, setAssignForDelivery] = useState(false);
    const [deliveryPeople, setDeliveryPeople] = useState([]);
    const [selectedDeliveryPersonId, setSelectedDeliveryPersonId] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [billItems, setBillItems] = useState([]);
    const [gstRate, setGstRate] = useState('0');
    const [customGst, setCustomGst] = useState('');
    const [specialCharge, setSpecialCharge] = useState({ name: '', amount: '' });
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loadingMenu, setLoadingMenu] = useState(true);
    const [thermalPrintOpen, setThermalPrintOpen] = useState(false);
    const [billDetails, setBillDetails] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const menuResponse = await getMenuItems();
                setMenuItems(menuResponse.data.filter(item => item.available));
                const deliveryResponse = await getAvailableDeliveryPeople();
                setDeliveryPeople(deliveryResponse.data);
            } catch (error) {
                setSnackbar({ open: true, message: `Failed to load initial data: ${error.message}`, severity: 'error' });
            } finally {
                setLoadingMenu(false);
            }
        };
        fetchInitialData();
    }, []);
    
    const resetForm = () => {
        setBillItems([]);
        setCustomerName('');
        setCustomerPhone('');
        setCustomerAddress('');
        setGstRate('0');
        setCustomGst('');
        setSpecialCharge({ name: '', amount: '' });
        setAssignForDelivery(false);
        setSelectedDeliveryPersonId('');
    };

    const addItemToBill = () => {
        if (!selectedItem) return;
        const existingItem = billItems.find(item => item.id === selectedItem.id);
        if (existingItem) {
            updateItemQuantity(selectedItem.id, existingItem.quantity + 1);
        } else {
            setBillItems([...billItems, { ...selectedItem, quantity: 1 }]);
        }
        setSelectedItem(null);
    };

    const updateItemQuantity = (id, quantity) => {
        if (quantity < 1) removeItemFromBill(id);
        else setBillItems(billItems.map(item => item.id === id ? { ...item, quantity } : item));
    };

    const removeItemFromBill = (id) => setBillItems(billItems.filter(item => item.id !== id));

    const subtotal = billItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const finalGstRate = gstRate === 'custom' ? (parseFloat(customGst) || 0) : (parseFloat(gstRate) || 0);
    const gstAmount = subtotal * (finalGstRate / 100);
    const specialChargeAmount = parseFloat(specialCharge.amount) || 0;
    const grandTotal = subtotal + gstAmount + specialChargeAmount;

    // Helper function to save orders to local storage
    const saveToLocalHistory = (orderData) => {
        const storedOrders = JSON.parse(localStorage.getItem('diningBillHistory') || '[]');
        storedOrders.push(orderData);
        localStorage.setItem('diningBillHistory', JSON.stringify(storedOrders));
    };

    const handleSaveAndPrint = async () => {
        if (billItems.length === 0) {
            setSnackbar({ open: true, message: 'Cannot create an empty order.', severity: 'warning' });
            return;
        }

        // Create the base local order object first, this will be used in both cases.
        const localOrder = {
            id: `local-${Date.now()}`,
            customerName: customerName || 'Dine-in Customer', // Use real name or default
            items: billItems.map(item => ({
                menuItemName: item.name,
                quantity: item.quantity,
                priceAtOrder: item.price
            })),
            totalAmount: grandTotal,
            orderDate: new Date().toISOString(),
            subtotal,
            gstAmount: gstAmount > 0 ? gstAmount : undefined,
            specialChargeName: specialChargeAmount !== 0 ? (specialCharge.name || 'Adjustment') : undefined,
            specialChargeAmount: specialChargeAmount !== 0 ? specialChargeAmount : undefined,
            orderType: assignForDelivery ? 'OFFLINE_DELIVERY' : 'DINE_IN',
            deliveryPersonName: assignForDelivery ? (deliveryPeople.find(p => p.id === selectedDeliveryPersonId)?.name || '') : undefined
        };

        if (assignForDelivery) {
            // --- Case 1: OFFLINE DELIVERY ---
            if (!selectedDeliveryPersonId || !customerName || !customerAddress) {
                setSnackbar({ open: true, message: 'Customer name, address, and delivery person are required for delivery.', severity: 'warning' });
                return;
            }

            const orderPayload = {
                customerName,
                deliveryAddress: customerAddress,
                customerPhone: customerPhone,
                items: billItems.map(item => ({ menuItemId: item.id, quantity: item.quantity })),
                totalAmount: grandTotal,
                orderType: 'OFFLINE_DELIVERY',
                paymentMethod: 'In-House',
                paymentStatus: 'PAID',
                deliveryPersonId: selectedDeliveryPersonId,
                subtotal,
                gstAmount: gstAmount > 0 ? gstAmount : undefined,
                specialChargeName: specialChargeAmount !== 0 ? (specialCharge.name || 'Adjustment') : undefined,
                specialChargeAmount: specialChargeAmount !== 0 ? specialChargeAmount : undefined,
            };

            try {
                // 1. Save to main database
                const response = await createOrder(orderPayload);
                setSnackbar({ open: true, message: `Order #${response.data.id} created and assigned!`, severity: 'success' });
                
                // 2. ALSO save to local history
                saveToLocalHistory(localOrder);

                setBillDetails(response.data);
                setThermalPrintOpen(true);
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Failed to create order.';
                setSnackbar({ open: true, message: errorMessage, severity: 'error' });
            }

        } else {
            // --- Case 2: DINE-IN ---
            // Only save to local history
            saveToLocalHistory(localOrder);
            setSnackbar({ open: true, message: 'Dine-in bill saved to local history.', severity: 'success' });
            
            setBillDetails(localOrder);
            setThermalPrintOpen(true);
        }
    };

    const handlePrinterClose = () => {
        setThermalPrintOpen(false);
        resetForm();
    };

    const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

    return (
        <>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h4" component="h1">Create Bill</Typography>
                    <Button variant="outlined" startIcon={<HistoryIcon />} onClick={() => navigate('/dining-history')}>View History</Button>
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={7} lg={8}>
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6">Add Items</Typography>
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={8}><Autocomplete fullWidth options={menuItems} getOptionLabel={option => `${option.name} - ₹${(option.price || 0).toFixed(2)}`} value={selectedItem} onChange={(e, val) => setSelectedItem(val)} renderInput={(params) => <TextField {...params} label="Search Menu Item" />} loading={loadingMenu}/></Grid>
                                <Grid item xs={12} sm={4}><Button fullWidth variant="contained" onClick={addItemToBill} startIcon={<AddCircleOutlineIcon />} sx={{ height: '100%' }} disabled={!selectedItem}>Add</Button></Grid>
                            </Grid>
                            <Typography variant="h6">Current Bill</Typography>
                            <TableContainer><Table><TableHead><TableRow><TableCell>Item</TableCell><TableCell align="right">Price</TableCell><TableCell align="center">Quantity</TableCell><TableCell align="right">Total</TableCell><TableCell align="center">Actions</TableCell></TableRow></TableHead><TableBody>{billItems.length === 0 ? <TableRow><TableCell colSpan={5} align="center">No items added.</TableCell></TableRow> : billItems.map(item => <TableRow key={item.id}><TableCell>{item.name}</TableCell><TableCell align="right">₹{(item.price || 0).toFixed(2)}</TableCell><TableCell align="center"><Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconButton size="small" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}><RemoveCircleOutlineIcon/></IconButton><Typography>{item.quantity}</Typography><IconButton size="small" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}><AddCircleOutlineIcon/></IconButton></Box></TableCell><TableCell align="right">₹{((item.price || 0) * item.quantity).toFixed(2)}</TableCell><TableCell align="center"><IconButton color="error" onClick={() => removeItemFromBill(item.id)}><DeleteIcon/></IconButton></TableCell></TableRow>)}</TableBody></Table></TableContainer>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={5} lg={4}>
                        <Box sx={{ position: 'sticky', top: '20px' }}>
                            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                                <FormControlLabel control={<Checkbox checked={assignForDelivery} onChange={e => setAssignForDelivery(e.target.checked)} />} label="Assign for Offline Delivery"/>
                                {assignForDelivery && <Grid container spacing={2} sx={{ mt: 1 }}><Grid item xs={12}><TextField fullWidth label="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} required /></Grid><Grid item xs={12}><TextField fullWidth label="Customer Phone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} /></Grid><Grid item xs={12}><TextField fullWidth label="Customer Address" multiline rows={2} value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} required /></Grid><Grid item xs={12}><FormControl fullWidth><InputLabel>Delivery Person</InputLabel><Select value={selectedDeliveryPersonId} label="Delivery Person" onChange={e => setSelectedDeliveryPersonId(e.target.value)} required>{deliveryPeople.map(person => <MenuItem key={person.id} value={person.id}>{person.name}</MenuItem>)}</Select></FormControl></Grid></Grid>}
                            </Paper>
                            <Paper elevation={3} sx={{ p: 3 }}>
                                <Typography variant="h6">Bill Summary</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1.5 }}><Typography>Subtotal</Typography><Typography>₹{subtotal.toFixed(2)}</Typography></Box>
                                <Divider sx={{ my: 1 }} />
                                <Grid container spacing={2} alignItems="center" sx={{ my: 1 }}><Grid item xs={6}><FormControl fullWidth size="small"><InputLabel>GST</InputLabel><Select value={gstRate} label="GST" onChange={e => setGstRate(e.target.value)}><MenuItem value="0">0%</MenuItem><MenuItem value="5">5%</MenuItem><MenuItem value="12">12%</MenuItem><MenuItem value="18">18%</MenuItem><MenuItem value="custom">Custom</MenuItem></Select></FormControl></Grid><Grid item xs={6}>{gstRate === 'custom' ? <TextField fullWidth size="small" label="Custom GST" type="number" value={customGst} onChange={e => setCustomGst(e.target.value)} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} /> : <Typography align="right">₹{gstAmount.toFixed(2)}</Typography>}</Grid><Grid item xs={6}><TextField fullWidth size="small" label="Special Charge/Discount" value={specialCharge.name} onChange={e => setSpecialCharge({ ...specialCharge, name: e.target.value })} /></Grid><Grid item xs={6}><TextField fullWidth size="small" label="Amount" type="number" value={specialCharge.amount} onChange={e => setSpecialCharge({ ...specialCharge, amount: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }} /></Grid></Grid>
                                <Divider sx={{ mt: 2, mb: 1.5 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="h5">Grand Total</Typography><Typography variant="h5">₹{grandTotal.toFixed(2)}</Typography></Box>
                                <Button fullWidth variant="contained" color="primary" startIcon={<PrintIcon />} onClick={handleSaveAndPrint} disabled={billItems.length === 0} sx={{ mt: 3 }}>Save & Print Bill</Button>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            
            {billDetails && <ThermalPrintManager open={thermalPrintOpen} onClose={handlePrinterClose} order={billDetails} />}

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>
        </>
    );
};

export default DiningBillingPage;
