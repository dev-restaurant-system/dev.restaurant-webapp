import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Box, Paper, TextField, Button,
    CircularProgress, Alert, Snackbar, Input,
    FormControlLabel, Switch
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getRestaurantDetails, updateRestaurantDetails, uploadRestaurantImage } from '../api/adminApi.jsx';
const updateStateFromResponse = (response, setState, setPreview) => {
    const { data } = response;
    if (data && data.id) {
        setState({
            id: data.id,
            name: data.name || '',
            address: data.address || '',
            phone: data.phone || '',
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            openingTime: data.openingTime || '',
            open: data.open === true,
        });
        if (setPreview) {
            setPreview(data.imageUrl);
        }
    }
};

const RestaurantPage = () => {
    const [restaurantData, setRestaurantData] = useState({
        name: '',
        address: '',
        phone: '',
        description: '',
        imageUrl: '',
        open: true,
        openingTime: '',
    });

    // ... (other state declarations remain the same) ...
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, []);

    const fetchRestaurantDetails = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getRestaurantDetails();
            updateStateFromResponse(response, setRestaurantData, setImagePreview);
        } catch (err) {
            console.error('Error fetching restaurant details:', err);
            showSnackbar('Failed to load restaurant details.', 'error');
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchRestaurantDetails();
    }, [fetchRestaurantDetails]);

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRestaurantData(prev => ({ ...prev, [name]: value }));
    };

    // --- FIX: This handler now correctly updates the 'open' state property ---
    const handleStatusChange = (event) => {
        setRestaurantData(prev => ({ ...prev, open: event.target.checked }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        let finalImageUrl = restaurantData.imageUrl;

        if (selectedFile) {
            setUploading(true);
            try {
                const imgResponse = await uploadRestaurantImage(selectedFile);
                finalImageUrl = imgResponse.data.imageUrl;
            } catch (error) {
                console.error('Error uploading image:', error);
                showSnackbar('Failed to upload image.', 'error');
                setUploading(false); setLoading(false);
                return;
            }
            setUploading(false);
        }

        try {
            const dataToSave = { ...restaurantData, imageUrl: finalImageUrl };
            
            const response = await updateRestaurantDetails(dataToSave);
            
            updateStateFromResponse(response, setRestaurantData, setImagePreview);
            setSelectedFile(null);
            showSnackbar('Restaurant details updated successfully!', 'success');
        } catch (err) {
            console.error('Error updating restaurant details:', err);
            showSnackbar('Failed to update details.', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !restaurantData.id) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Restaurant Information
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField label="Restaurant Name" name="name" value={restaurantData.name || ''} onChange={handleChange} fullWidth required disabled={loading || uploading} />
                    <TextField label="Address" name="address" value={restaurantData.address || ''} onChange={handleChange} fullWidth multiline rows={3} disabled={loading || uploading} />
                    <TextField label="Phone Number" name="phone" value={restaurantData.phone || ''} onChange={handleChange} fullWidth disabled={loading || uploading} />
                    <TextField label="Description" name="description" value={restaurantData.description || ''} onChange={handleChange} fullWidth multiline rows={4} disabled={loading || uploading} />

                    <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                        <Typography variant="h6" gutterBottom>Restaurant Status</Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={restaurantData.open}
                                    onChange={handleStatusChange}
                                    name="open" 
                                    color="success"
                                />
                            }
                            label={restaurantData.open ? "Open for Orders" : "Closed for Orders"}
                        />
                        {!restaurantData.open && (
                            <TextField
                                label="Re-opening Message"
                                name="openingTime"
                                value={restaurantData.openingTime || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                                helperText="e.g., Opens tomorrow at 11 AM"
                            />
                        )}
                    </Paper>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                        <label htmlFor="restaurant-image-upload-button">
                            <Input
                                type="file" id="restaurant-image-upload-button"
                                inputProps={{ accept: 'image/*' }} style={{ display: 'none' }}
                                onChange={handleFileChange} disabled={loading || uploading}
                            />
                            <Button variant="outlined" component="span" startIcon={<PhotoCamera />} disabled={loading || uploading}>
                                {selectedFile ? 'Image Selected' : 'Change Image'}
                            </Button>
                        </label>
                        {imagePreview && (
                            <img src={imagePreview} alt="Restaurant Preview" style={{ maxWidth: 100, maxHeight: 100, objectFit: 'cover', border: '1px solid #ccc', borderRadius: '4px' }} />
                        )}
                    </Box>

                    <Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />} disabled={loading || uploading} sx={{ mt: 2, py: 1.5 }}>
                        {loading || uploading ? <CircularProgress size={24} color="inherit" /> : 'Save Details'}
                    </Button>
                </Box>
            </Paper>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default RestaurantPage;
