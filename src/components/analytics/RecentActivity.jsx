import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, Typography, List, ListItem, ListItemAvatar,
    ListItemText, Avatar, Chip, Box, Skeleton, useTheme, alpha
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { getRecentActivity } from '../../api/analyticsApi';
import { formatDistanceToNow } from 'date-fns';
import { formatCurrency } from '../../utils/chartHelpers';

const RecentActivity = ({ dateRange }) => {
    const theme = useTheme();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getRecentActivity(15);
                setActivities(response.data);
            } catch (error) {
                console.error('Failed to fetch recent activity:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    const getActivityIcon = (type) => {
        const iconMap = {
            'new_order': ShoppingCartIcon,
            'order_completed': CheckCircleIcon,
            'order_cancelled': CancelIcon,
            'customer_registered': PersonAddIcon,
            'menu_item_added': RestaurantMenuIcon,
            'promotion_created': LocalOfferIcon,
        };
        return iconMap[type] || ShoppingCartIcon;
    };

    const getActivityColor = (type) => {
        const colorMap = {
            'new_order': 'primary',
            'order_completed': 'success',
            'order_cancelled': 'error',
            'customer_registered': 'info',
            'menu_item_added': 'warning',
            'promotion_created': 'secondary',
        };
        return colorMap[type] || 'primary';
    };

    const getActivityTitle = (activity) => {
        const titleMap = {
            'new_order': `New order #${activity.orderId}`,
            'order_completed': `Order #${activity.orderId} completed`,
            'order_cancelled': `Order #${activity.orderId} cancelled`,
            'customer_registered': `New customer: ${activity.customerName}`,
            'menu_item_added': `New item: ${activity.itemName}`,
            'promotion_created': `Promotion: ${activity.promotionName}`,
        };
        return titleMap[activity.type] || 'Unknown activity';
    };

    const getActivitySubtitle = (activity) => {
        const subtitleMap = {
            'new_order': `${activity.customerName} • ${formatCurrency(activity.amount)}`,
            'order_completed': `Delivered to ${activity.customerName}`,
            'order_cancelled': `Reason: ${activity.reason || 'Not specified'}`,
            'customer_registered': activity.phone,
            'menu_item_added': `Category: ${activity.category}`,
            'promotion_created': `Discount: ${activity.discount}%`,
        };
        return subtitleMap[activity.type] || '';
    };

    return (
        <Card elevation={0} sx={{ 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 3,
            height: '100%'
        }}>
            <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Recent Activity
                </Typography>

                <List sx={{ p: 0, maxHeight: 400, overflowY: 'auto' }}>
                    {loading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 2 }}>
                                <ListItemAvatar>
                                    <Skeleton variant="circular" width={40} height={40} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={<Skeleton variant="text" width="60%" height={20} />}
                                    secondary={<Skeleton variant="text" width="80%" height={16} />}
                                />
                                <Skeleton variant="text" width={60} height={16} />
                            </ListItem>
                        ))
                    ) : (
                        activities.map((activity, index) => {
                            const IconComponent = getActivityIcon(activity.type);
                            const color = getActivityColor(activity.type);
                            
                            return (
                                <ListItem
                                    key={index}
                                    sx={{ 
                                        px: 0, 
                                        py: 2, 
                                        borderBottom: index < activities.length - 1 ? '1px solid' : 'none', 
                                        borderColor: 'divider',
                                        '&:hover': {
                                            backgroundColor: alpha(theme.palette[color].main, 0.04),
                                            borderRadius: 1
                                        }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            sx={{
                                                width: 40,
                                                height: 40,
                                                backgroundColor: alpha(theme.palette[color].main, 0.1),
                                                color: `${color}.main`
                                            }}
                                        >
                                            <IconComponent fontSize="small" />
                                        </Avatar>
                                    </ListItemAvatar>
                                    
                                    <ListItemText
                                        primary={
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    color: 'text.primary',
                                                    mb: 0.5
                                                }}
                                            >
                                                {getActivityTitle(activity)}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {getActivitySubtitle(activity)}
                                            </Typography>
                                        }
                                    />
                                    
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Typography 
                                            variant="caption" 
                                            color="text.secondary"
                                            sx={{ display: 'block' }}
                                        >
                                            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                        </Typography>
                                        {activity.urgent && (
                                            <Chip 
                                                label="Urgent" 
                                                size="small" 
                                                color="error" 
                                                sx={{ mt: 0.5, height: 20, fontSize: '0.75rem' }}
                                            />
                                        )}
                                    </Box>
                                </ListItem>
                            );
                        })
                    )}
                </List>

                {!loading && activities.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            No recent activity found
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentActivity;
