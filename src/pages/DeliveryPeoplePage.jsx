import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Box, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, CircularProgress, Alert, Button, Snackbar
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete'; // Correctly import DeleteIcon
import { getDeliveryPeople, approveDeliveryPerson, deleteDeliveryPerson } from '../api/adminApi';
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx';

const DeliveryPeoplePage = () => {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
        const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [personToDelete, setPersonToDelete] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, []);

    const fetchPeople = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getDeliveryPeople();
            setPeople(response.data);
        } catch (err) {
            setError('Failed to load delivery staff.');
            showSnackbar('Failed to load delivery staff.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchPeople();
    }, [fetchPeople]);

    const handleApprove = async (id) => {
        try {
            await approveDeliveryPerson(id);
            showSnackbar('Delivery person approved!', 'success');
            fetchPeople();
        } catch (err) {
            showSnackbar('Failed to approve delivery person.', 'error');
        }
    };
    const handleDeleteClick = (person) => {
        setPersonToDelete(person);
        setConfirmDialogOpen(true);
    };

    // Handle the actual deletion after confirmation
    const handleConfirmDelete = async () => {
        if (!personToDelete) return;
        try {
            await deleteDeliveryPerson(personToDelete.id);
            showSnackbar(`Delivery person '${personToDelete.name}' removed successfully.`, 'success');
            fetchPeople(); 
        } catch (err) {
            showSnackbar('Failed to remove delivery person.', 'error');
        } finally {
            setConfirmDialogOpen(false);
            setPersonToDelete(null);
        }
    };
    
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>Manage Delivery Staff</Typography>
                {error && <Alert severity="error">{error}</Alert>}
                {loading && people.length === 0 ? <CircularProgress /> : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Phone</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="center">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {people.map((person) => (
                                    <TableRow key={person.id}>
                                        <TableCell>{person.id}</TableCell>
                                        <TableCell>{person.name}</TableCell>
                                        <TableCell>{person.phone}</TableCell>
                                        <TableCell>{person.status.replace(/_/g, ' ')}</TableCell>
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                {person.status === 'PENDING_APPROVAL' && (
                                                    <Button
                                                        variant="contained"
                                                        color="success"
                                                        size="small"
                                                        startIcon={<CheckCircleIcon />}
                                                        onClick={() => handleApprove(person.id)}
                                                    >
                                                        Approve
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => handleDeleteClick(person)}
                                                >
                                                    Remove
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
            <ConfirmationDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to remove ${personToDelete?.name}? This action cannot be undone.`}
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

export default DeliveryPeoplePage;
