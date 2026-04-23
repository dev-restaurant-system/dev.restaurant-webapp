import React, { useEffect, useState } from 'react';
import {
    TextField, Button, Box, Typography, Alert, CircularProgress,
    IconButton, InputAdornment
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const AdminLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 9000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            navigate('/dashboard'); // Redirect to dashboard on successful login
        } catch (err) {
            const errorMessage = err.response?.data || 'Invalid username or password. Please try again.';
            setError(errorMessage);
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const isFormDisabled = loading || authLoading;

    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 400,
                margin: 'auto',
                padding: 3,
                border: '1px solid #A5D6A7', // Slightly darker, soft green border
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(165, 214, 167, 0.2)', // Soft green shadow
                backgroundColor: '#F1F8E9', // Very pale, sweet green background for the form
            }}
            onSubmit={handleSubmit}
        >
            <Typography variant="h5" component="h1" gutterBottom align="center">
                Restaurant Portal
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={handleUsernameChange}
                required
                fullWidth
                disabled={isFormDisabled}
            />
            <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                required
                fullWidth
                disabled={isFormDisabled}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                                disabled={isFormDisabled}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
                disabled={loading || authLoading}
                sx={{ mt: 2 }}
            >
                {loading || authLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
        </Box>
    );
};

export default AdminLoginForm;
