import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Button, Box, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Alert, Dialog, DialogContent, Snackbar 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// PhotoCamera is only used in SliderImageForm, move its import there.

import { // These are used directly in SliderImagesPage for fetching/deleting/updating
    getSliderImagesAdmin, deleteSliderImage,
    // These are used by SliderImageForm, so we'll pass them as props explicitly
    createSliderImage, uploadSliderImage, updateSliderImage
} from '../api/adminApi.jsx';
import ConfirmationDialog from '../components/common/ConfirmationDialog.jsx';

// --- SUB-COMPONENT: SliderImageForm ---
// This component should NOT be the default export.
const SliderImageForm = ({ initialData = null, onSubmit, onClose, isEditMode = false, showSnackbar }) => {
    // Import MUI components used ONLY within this sub-component here
    const { TextField, DialogActions, Input } = require('@mui/material'); // Removed CircularProgress from here as it's passed via props from main page
    const PhotoCameraIcon = require('@mui/icons-material/PhotoCamera').default; // Specific icon import for PhotoCamera

    const itemToInitialize = initialData || {};
    const { displayOrder: initialDisplayOrder, ...restOfItemToInitialize } = itemToInitialize;
    const [formData, setFormData] = useState({
        imageUrl: '',
        title: '',
        actionUrl: '',
        ...restOfItemToInitialize,
        displayOrder: initialDisplayOrder ? String(initialDisplayOrder) : '',
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false); // Local loading state for form submission

    useEffect(() => {
        const updatedItemToInitialize = initialData || {};
        const { displayOrder: updatedDisplayOrder, ...restOfUpdatedItem } = updatedItemToInitialize;
        setFormData({
            imageUrl: '',
            title: '',
            actionUrl: '',
            ...restOfUpdatedItem,
            displayOrder: updatedDisplayOrder ? String(updatedDisplayOrder) : '',
        });
        setImagePreview(updatedItemToInitialize.imageUrl || null);
        setSelectedFile(null);
        setUploading(false);
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
            setImagePreview(formData.imageUrl || null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.displayOrder || isNaN(parseInt(formData.displayOrder))) {
            showSnackbar('Please enter a valid display order (number).', 'warning');
            return;
        }

        if (!isEditMode && !selectedFile) {
            showSnackbar('Please select an image file for the new slider.', 'warning');
            return;
        }

        setUploading(true);

        try {
            if (isEditMode) {
                let finalImageUrl = formData.imageUrl;
                if (selectedFile) {
                    const uploadResponse = await uploadSliderImage(selectedFile);
                    finalImageUrl = uploadResponse.data.imageUrl;
                }
                
                await updateSliderImage(formData.id, {
                    ...formData,
                    imageUrl: finalImageUrl,
                    displayOrder: parseInt(formData.displayOrder),
                });
                showSnackbar('Slider image updated successfully!', 'success');

            } else { 
                await createSliderImage(
                    selectedFile,
                    formData.title,
                    parseInt(formData.displayOrder),
                    formData.actionUrl
                );
                showSnackbar('Slider image added successfully!', 'success');
            }
            onClose();
            onSubmit(true);

        } catch (error) {
            console.error('Error saving slider image:', error);
            const backendErrorMsg = error.response?.data?.message || error.message;
            showSnackbar(`Failed to save slider image: ${backendErrorMsg}`, 'error');
            onSubmit(false);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                padding: 3,
                minWidth: 400
            }}
        >
            <Typography variant="h6" component="h2" gutterBottom>
                {isEditMode ? 'Edit Slider Image' : 'Add New Slider Image'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Input
                    type="file"
                    id="slider-image-upload-button"
                    inputProps={{ accept: 'image/*' }}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    disabled={uploading}
                />
                <label htmlFor="slider-image-upload-button">
                    <Button
                        variant="outlined"
                        component="span"
                        startIcon={<PhotoCameraIcon />}
                        disabled={uploading}
                    >
                        {selectedFile ? selectedFile.name : (formData.imageUrl ? 'Change Image' : 'Upload Image')}
                    </Button>
                </label>
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Slider preview"
                        style={{ maxWidth: 100, maxHeight: 100, objectFit: 'contain', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                )}
                {uploading && <CircularProgress size={24} />}
            </Box>
            {isEditMode && !selectedFile && formData.imageUrl && (
                 <TextField
                    label="Existing Image URL"
                    name="imageUrl"
                    value={formData.imageUrl}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    helperText="Upload new image to change."
                 />
            )}

            <TextField
                label="Display Order"
                name="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={handleChange}
                required
                fullWidth
                disabled={uploading}
                helperText="Images are sorted by this number (lower numbers appear first)."
            />
            <TextField
                label="Title (Optional)"
                name="title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                disabled={uploading}
            />
            <TextField
                label="Action URL (Optional)"
                name="actionUrl"
                value={formData.actionUrl}
                onChange={handleChange}
                fullWidth
                disabled={uploading}
                helperText="Link when user clicks image (e.g., /offers/summer-deal)"
            />

            <DialogActions sx={{ p: 0, pt: 2 }}>
                <Button onClick={onClose} color="error" variant="outlined">Cancel</Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={uploading}
                >
                    {uploading ? 'Processing...' : (isEditMode ? 'Update Image' : 'Add Image')}
                </Button>
            </DialogActions>
        </Box>
    );
};

const SliderImagesPage = () => {
    const [sliderImages, setSliderImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentSliderImage, setCurrentSliderImage] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [itemToDeleteId, setItemToDeleteId] = useState(null);

    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, []);

    const fetchSliderImages = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getSliderImagesAdmin();
            setSliderImages(response.data);
        } catch (err) {
            console.error('Error fetching slider images for admin:', err);
            setError('Failed to load slider images for administration.');
            const backendError = err.response?.data?.message || err.message;
            showSnackbar(`Failed to load slider images: ${backendError}`, 'error');
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchSliderImages();
    }, [fetchSliderImages]);

    const handleOpenAddDialog = () => {
        setCurrentSliderImage(null);
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (image) => {
        setCurrentSliderImage(image);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentSliderImage(null);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleFormSubmit = useCallback((success) => { 
        if (success) {
            fetchSliderImages(); // Re-fetch data on success
        }
        // SnackBar messages are handled by SliderImageForm directly
    }, [fetchSliderImages]);


    const handleDeleteSliderImage = (id) => {
        setItemToDeleteId(id);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDeleteId) return;

        setLoading(true);
        try {
            await deleteSliderImage(itemToDeleteId);
            showSnackbar('Slider image deleted successfully!', 'success');
            fetchSliderImages();
        } catch (err) {
            console.error('Error deleting slider image:', err);
            setError('Failed to delete slider image.');
            const backendError = err.response?.data?.message || err.message;
            showSnackbar(`Failed to delete slider image: ${backendError}`, 'error');
        } finally {
            setLoading(false);
            setConfirmDialogOpen(false);
            setItemToDeleteId(null);
        }
    };

    if (loading && !sliderImages.length && !error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h4" component="h1">
                        Manage Slider Images
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddDialog}
                    >
                        Add New Slider Image
                    </Button>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <TableContainer component={Paper} elevation={1}>
                    <Table sx={{ minWidth: 650 }} aria-label="slider images table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell align="center">Image Preview</TableCell>
                                <TableCell>Display Order</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Action URL</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sliderImages.length === 0 && !loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No slider images found. Add one from the button above!</TableCell>
                                </TableRow>
                            ) : (
                                sliderImages.map((image) => (
                                    <TableRow
                                        key={image.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">{image.id}</TableCell>
                                        <TableCell align="center">
                                            {image.imageUrl ? (
                                                <img src={image.imageUrl} alt={image.title || 'Slider item'} style={{ width: '100px', height: 'auto', objectFit: 'contain', borderRadius: '4px' }} />
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">No Image</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>{image.displayOrder}</TableCell>
                                        <TableCell>{image.title || '-'}</TableCell>
                                        <TableCell>{image.actionUrl || '-'}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                startIcon={<EditIcon />}
                                                sx={{ mr: 1 }}
                                                onClick={() => handleOpenEditDialog(image)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDeleteSliderImage(image.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                            {loading && sliderImages.length > 0 && (
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

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogContent>
                    <SliderImageForm
                        initialData={currentSliderImage}
                        onSubmit={handleFormSubmit}
                        onClose={handleCloseDialog}
                        isEditMode={!!currentSliderImage}
                        showSnackbar={showSnackbar}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this slider image? This action cannot be undone."
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

export default SliderImagesPage;
