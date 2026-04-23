import React from 'react';
import { Box } from '@mui/material';
import AdminLoginForm from '../components/forms/AdminLoginForm.jsx'; // Corrected path/casing

const LoginPage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh', // Take full viewport height
                backgroundColor: '#f0f2f5', // Light background for login page
            }}
        >
            <AdminLoginForm /> {/* Render the login form component */}
        </Box>
    );
};

export default LoginPage;
