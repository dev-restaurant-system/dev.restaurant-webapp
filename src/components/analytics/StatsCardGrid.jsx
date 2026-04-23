import React from 'react';
import {
    Grid, Card, CardContent, Typography, Box, Skeleton,
    Chip, useTheme, alpha
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';

import { formatCurrency, formatNumber } from '../../utils/chartHelpers';

const StatsCard = ({ 
    title, 
    value, 
    change, 
    changeType, 
    icon: Icon, 
    color = 'primary',
    loading = false 
}) => {
    const theme = useTheme();
    
    const getChangeColor = () => {
        if (changeType === 'positive') return theme.palette.success.main;
        if (changeType === 'negative') return theme.palette.error.main;
        return theme.palette.text.secondary;
    };

    const getChangeIcon = () => {
        if (changeType === 'positive') return <TrendingUpIcon fontSize="small" />;
        if (changeType === 'negative') return <TrendingDownIcon fontSize="small" />;
        return null;
    };

    if (loading) {
        return (
            <Card elevation={0} sx={{ 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 3,
                height: '100%'
            }}>
                <CardContent sx={{ p: 3 }}>
                    <Skeleton variant="circular" width={48} height={48} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="60%" height={24} />
                    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="50%" height={20} />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card 
            elevation={0} 
            sx={{ 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                    borderColor: `${color}.main`,
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box 
                        sx={{ 
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: alpha(theme.palette[color].main, 0.1),
                            color: `${color}.main`
                        }}
                    >
                        <Icon fontSize="medium" />
                    </Box>
                    {change !== undefined && (
                        <Chip
                            size="small"
                            icon={getChangeIcon()}
                            label={`${change > 0 ? '+' : ''}${change}%`}
                            sx={{
                                backgroundColor: alpha(getChangeColor(), 0.1),
                                color: getChangeColor(),
                                fontWeight: 600,
                                '& .MuiChip-icon': {
                                    color: getChangeColor()
                                }
                            }}
                        />
                    )}
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                
                <Typography 
                    variant="h4" 
                    sx={{ 
                        fontWeight: 700, 
                        mb: 1,
                        color: 'text.primary'
                    }}
                >
                    {typeof value === 'number' && title.toLowerCase().includes('revenue') 
                        ? formatCurrency(value)
                        : typeof value === 'number' 
                        ? formatNumber(value)
                        : value
                    }
                </Typography>
            </CardContent>
        </Card>
    );
};

const StatsCardGrid = ({ stats, loading }) => {
    const statsConfig = [
        {
            key: 'totalRevenue',
            title: 'Total Revenue',
            icon: AccountBalanceWalletIcon,
            color: 'primary'
        },
        {
            key: 'totalOrders',
            title: 'Total Orders',
            icon: ShoppingCartIcon,
            color: 'secondary'
        },
        {
            key: 'totalCustomers',
            title: 'Total Customers',
            icon: PeopleIcon,
            color: 'info'
        },
        {
            key: 'totalMenuItems',
            title: 'Menu Items',
            icon: RestaurantMenuIcon,
            color: 'warning'
        }
    ];

    return (
        <Grid container spacing={3}>
            {statsConfig.map((config) => (
                <Grid item xs={12} sm={6} lg={3} key={config.key}>
                    <StatsCard
                        title={config.title}
                        value={stats?.[config.key] || 0}
                        change={stats?.[`${config.key}Change`]}
                        changeType={stats?.[`${config.key}Change`] > 0 ? 'positive' : 'negative'}
                        icon={config.icon}
                        color={config.color}
                        loading={loading}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default StatsCardGrid;
