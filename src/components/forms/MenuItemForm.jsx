import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  DialogActions,
  FormControlLabel,
  Checkbox,
  Input,
  CircularProgress,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { uploadImage } from '../../api/adminApi.jsx';

const MenuItemForm = ({ initialData = null, onSubmit, onClose, isEditMode = false, showSnackbar }) => {
  const itemToInitialize = initialData || {};
  const { price: initialPrice, isBestseller: initialBestseller, ...restOfItem } = itemToInitialize;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    imageUrl: '',
    available: true,
    isBestseller: initialBestseller || false,
    ...restOfItem,
    price: initialPrice ? String(initialPrice) : '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const item = initialData || {};
    const { price, isBestseller, ...rest } = item;
    setFormData({
      name: '',
      description: '',
      category: '',
      imageUrl: '',
      available: true,
      isBestseller: isBestseller || false,
      ...rest,
      price: price ? String(price) : '',
    });
    setImagePreview(item.imageUrl || null);
    setSelectedFile(null);
    setUploading(false);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || isNaN(parseFloat(formData.price))) {
      showSnackbar('Please enter a valid item name and price.', 'warning');
      return;
    }

    const dataToSubmit = {
      ...formData,
      price: parseFloat(formData.price),
    };

    if (selectedFile) {
      setUploading(true);
      try {
        const response = await uploadImage(selectedFile);
        dataToSubmit.imageUrl = response.data.imageUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        showSnackbar('Failed to upload image. Please try again.', 'error');
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    onSubmit(dataToSubmit);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 3, minWidth: 400 }}
    >
      <Typography variant="h6" component="h2" gutterBottom>
        {isEditMode ? 'Edit Menu Item' : 'Add New Menu Item'}
      </Typography>

      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={3}
        fullWidth
      />

      <TextField
        label="Price"
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        required
        fullWidth
        inputProps={{ step: "0.01" }}
      />

      <TextField
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        fullWidth
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Input
          type="file"
          id="image-upload-button"
          inputProps={{ accept: 'image/*' }}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="image-upload-button">
          <Button
            variant="outlined"
            component="span"
            startIcon={<PhotoCamera />}
            disabled={uploading}
          >
            {selectedFile ? selectedFile.name : formData.imageUrl ? 'Change Image' : 'Upload Image'}
          </Button>
        </label>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: 100, maxHeight: 100, objectFit: 'contain', border: '1px solid #ccc', borderRadius: 4 }}
          />
        )}
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.available}
            onChange={handleChange}
            name="available"
          />
        }
        label="Available"
      />

      {/* Optional field for bestseller not actively used */}
      {/* <FormControlLabel control={<Checkbox checked={formData.isBestseller} onChange={handleChange} name="isBestseller" />} label="Mark as Bestseller" /> */}

      <DialogActions sx={{ p: 0, pt: 2 }}>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary" disabled={uploading}>
          {uploading ? <CircularProgress size={24} /> : isEditMode ? 'Update Item' : 'Add Item'}
        </Button>
      </DialogActions>
    </Box>
  );
};

export default MenuItemForm;
