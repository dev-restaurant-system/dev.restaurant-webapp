import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Button, Box, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Alert, Dialog, DialogContent, Snackbar,
    FormControlLabel, Switch
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem } from '../api/adminApi.jsx';
import MenuItemForm from '../components/forms/MenuItemForm.jsx';
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx';

const MenuItemsPage = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentMenuItem, setCurrentMenuItem] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [itemToDeleteId, setItemToDeleteId] = useState(null);
    const handleOpenAddDialog = () => {
        setCurrentMenuItem(null);
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (item) => {
        setCurrentMenuItem(item);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentMenuItem(null);
    };
    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, []);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Function to fetch all menu items from the backend
    const fetchMenuItems = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getMenuItems();
            setMenuItems(response.data);
        } catch (err) {
            console.error('Error fetching menu items:', err);
            setError('Failed to load menu items.');
            const backendError = err.response?.data?.message || err.message;
            showSnackbar(`Failed to load menu items: ${backendError}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);
    useEffect(() => {
        fetchMenuItems();
    }, [fetchMenuItems]);
    const handleFormSubmit = async (formData) => {
        setLoading(true);
        try {
            if (currentMenuItem) {
                await updateMenuItem(currentMenuItem.id, formData);
                showSnackbar('Menu item updated successfully!', 'success');
            } else {
                await createMenuItem(formData);
                showSnackbar('Menu item added successfully!', 'success');
            }
            handleCloseDialog();
            fetchMenuItems();
        } catch (err) {
            console.error('Error saving menu item:', err);
            const backendError = err.response?.data?.message || err.message;
            showSnackbar(`Failed to save menu item: ${backendError}`, 'error');
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteMenuItem = (id) => {
        setItemToDeleteId(id);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDeleteId) return;
        setLoading(true);
        try {
            await deleteMenuItem(itemToDeleteId);
            showSnackbar('Menu item deleted successfully!', 'success');
            fetchMenuItems();
        } catch (err) {
            console.error('Error deleting menu item:', err);
            const backendError = err.response?.data?.message || err.message;
            showSnackbar(`Failed to delete menu item: ${backendError}`, 'error');
        } finally {
            setLoading(false);
            setConfirmDialogOpen(false);
            setItemToDeleteId(null);
        }
    };

    // --- THIS IS THE CORRECTED AND PROPERLY DEFINED FUNCTION ---
    const handleToggleAvailability = async (item) => {
        const updatedItem = { ...item, available: !item.available };
        
        // Optimistically update UI
        setMenuItems(prevItems =>
            prevItems.map(prevItem =>
                prevItem.id === item.id ? updatedItem : prevItem
            )
        );

        try {
            await updateMenuItem(item.id, updatedItem);
            showSnackbar(`"${item.name}" is now ${updatedItem.available ? 'In Stock' : 'Out of Stock'}.`, 'success');
        } catch (err) {
            console.error('Error updating availability status:', err);
            const backendError = err.response?.data?.message || err.message;
            showSnackbar(`Failed to update status: ${backendError}`, 'error');
            setMenuItems(prevItems =>
                prevItems.map(prevItem =>
                    prevItem.id === item.id ? item : prevItem
                )
            );
        }
    };
    if (loading && !menuItems.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        Manage Menu Items
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddDialog}
                        sx={{ borderRadius: 2, boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)' }}
                    >
                        Add New Item
                    </Button>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

                <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="menu items table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Image</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Stock Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menuItems.length === 0 && !loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No menu items found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                menuItems.map((item) => (
                                    <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                                        <TableCell>{item.category}</TableCell>
                                        <TableCell align="center">
                                            {item.imageUrl ? (
                                                <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">No Image</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={item.available}
                                                        onChange={() => handleToggleAvailability(item)}
                                                        color="success"
                                                    />
                                                }
                                                label={item.available ? "In Stock" : "Out of Stock"}
                                                labelPlacement="bottom"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<EditIcon />}
                                                sx={{ mr: 1, borderRadius: 2 }}
                                                onClick={() => handleOpenEditDialog(item)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteMenuItem(item.id)}
                                                sx={{ borderRadius: 2 }}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                            {loading && menuItems.length > 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 2 }}>
                                        <CircularProgress size={24} sx={{ verticalAlign: 'middle', mr: 1 }} /> Loading...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={openDialog} onClose={handleCloseDialog} PaperProps={{ sx: { borderRadius: 4 } }}>
                <DialogContent>
                    <MenuItemForm
                        initialData={currentMenuItem}
                        onSubmit={handleFormSubmit}
                        onClose={handleCloseDialog}
                        isEditMode={!!currentMenuItem}
                        showSnackbar={showSnackbar}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this menu item? This action cannot be undone."
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

export default MenuItemsPage;
