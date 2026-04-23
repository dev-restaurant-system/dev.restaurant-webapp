import React, { useState, useEffect, useCallback } from 'react';
import {
    Container, Typography, Box, Grid, Snackbar, Alert,
    Fade, useTheme, alpha, Paper, IconButton, Tooltip, Button
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';

// Components
import StatsCardGrid from '../components/analytics/StatsCardGrid';
import RevenueChart from '../components/analytics/RevenueChart';
import OrdersChart from '../components/analytics/OrdersChart';
import TopMenuItems from '../components/analytics/TopMenuItems';
import RecentActivity from '../components/analytics/RecentActivity';
import DateRangePicker from '../components/common/DateRangePicker';

// API
import { getDashboardStats } from '../api/analyticsApi';
import { getDateRangePresets } from '../utils/chartHelpers';

const AnalyticsDashboardPage = () => {
    const theme = useTheme();
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Date range state - default to last 7 days
    const [dateRange, setDateRange] = useState(() => {
        const presets = getDateRangePresets();
        return presets.find(p => p.value === 'week');
    });

    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }, []);

    const fetchDashboardStats = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getDashboardStats({
                startDate: dateRange.startDate.toISOString(),
                endDate: dateRange.endDate.toISOString()
            });
            setStats(response.data);
            showSnackbar('Dashboard data refreshed successfully');
        } catch (err) {
            console.error('Failed to fetch dashboard stats:', err);
            setError('Failed to load dashboard data. Please try again.');
            showSnackbar('Failed to refresh dashboard data', 'error');
        } finally {
            setLoading(false);
        }
    }, [dateRange, showSnackbar]);

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    const handleDateRangeChange = (newRange) => {
        setDateRange(newRange);
    };

    const handleRefresh = () => {
        fetchDashboardStats();
    };

    const handleExport = () => {
        showSnackbar('Export feature coming soon', 'info');
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Fade in timeout={800}>
                <Box>
                    {/* Header Section */}
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 4, 
                            mb: 4, 
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Background pattern */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: -50,
                                right: -50,
                                width: 200,
                                height: 200,
                                borderRadius: '50%',
                                background: alpha('#fff', 0.1),
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: -30,
                                left: -30,
                                width: 150,
                                height: 150,
                                borderRadius: '50%',
                                background: alpha('#fff', 0.05),
                            }}
                        />

                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: { xs: 'flex-start', md: 'center' },
                                flexDirection: { xs: 'column', md: 'row' },
                                gap: { xs: 3, md: 0 }
                            }}>
                                <Box>
                                    <Typography 
                                        variant="h3" 
                                        sx={{ 
                                            fontWeight: 700,
                                            mb: 1,
                                            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                                        }}
                                    >
                                        Analytics Dashboard
                                    </Typography>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            opacity: 0.9,
                                            fontWeight: 400,
                                            fontSize: { xs: '1rem', md: '1.25rem' }
                                        }}
                                    >
                                        Track your restaurant's performance and insights
                                    </Typography>
                                </Box>

                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 2, 
                                    alignItems: 'center',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    width: { xs: '100%', md: 'auto' }
                                }}>
                                    <DateRangePicker
                                        value={dateRange}
                                        onChange={handleDateRangeChange}
                                        sx={{ 
                                            backgroundColor: alpha('#fff', 0.15),
                                            color: 'white',
                                            borderColor: alpha('#fff', 0.3),
                                            '&:hover': {
                                                borderColor: alpha('#fff', 0.5),
                                                backgroundColor: alpha('#fff', 0.2),
                                            },
                                            width: { xs: '100%', sm: 'auto' }
                                        }}
                                    />
                                    
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Tooltip title="Refresh Data">
                                            <IconButton 
                                                onClick={handleRefresh}
                                                disabled={loading}
                                                sx={{ 
                                                    color: 'white',
                                                    backgroundColor: alpha('#fff', 0.15),
                                                    '&:hover': { backgroundColor: alpha('#fff', 0.25) }
                                                }}
                                            >
                                                <RefreshIcon />
                                            </IconButton>
                                        </Tooltip>
                                        
                                        <Tooltip title="Export Report">
                                            <IconButton 
                                                onClick={handleExport}
                                                sx={{ 
                                                    color: 'white',
                                                    backgroundColor: alpha('#fff', 0.15),
                                                    '&:hover': { backgroundColor: alpha('#fff', 0.25) }
                                                }}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Stats Cards */}
                    <Box sx={{ mb: 4 }}>
                        <StatsCardGrid stats={stats} loading={loading} />
                    </Box>

                    {/* Charts Row */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} lg={8}>
                            <RevenueChart dateRange={dateRange} />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <OrdersChart dateRange={dateRange} />
                        </Grid>
                    </Grid>

                    {/* Bottom Row */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TopMenuItems dateRange={dateRange} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <RecentActivity dateRange={dateRange} />
                        </Grid>
                    </Grid>

                    {/* Error State */}
                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mt: 3, 
                                borderRadius: 2,
                                '& .MuiAlert-message': {
                                    width: '100%'
                                }
                            }}
                            action={
                                <Button color="inherit" size="small" onClick={handleRefresh}>
                                    Retry
                                </Button>
                            }
                        >
                            {error}
                        </Alert>
                    )}
                </Box>
            </Fade>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleSnackbarClose} 
                    severity={snackbarSeverity}
                    sx={{ 
                        width: '100%',
                        borderRadius: 2
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AnalyticsDashboardPage;
