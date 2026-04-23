import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, Typography, List, ListItem, Box,
    Avatar, Chip, Skeleton, LinearProgress, useTheme
} from '@mui/material';
import { getTopMenuItems } from '../../api/analyticsApi';
import { formatCurrency } from '../../utils/chartHelpers';

const TopMenuItems = ({ dateRange }) => {
    const theme = useTheme();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getTopMenuItems(10);
                setItems(response.data);
            } catch (error) {
                console.error('Failed to fetch top menu items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    const maxQuantity = Math.max(...items.map(item => item.totalQuantity), 1);

    const getRankColor = (rank) => {
        if (rank === 1) return theme.palette.warning.main; // Gold
        if (rank === 2) return theme.palette.grey[400];    // Silver
        if (rank === 3) return theme.palette.warning.light; // Bronze
        return theme.palette.text.secondary;
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
                    Top Selling Items
                </Typography>

                <List sx={{ p: 0 }}>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Box sx={{ flex: 1 }}>
                                        <Skeleton variant="text" width="60%" height={20} />
                                        <Skeleton variant="text" width="40%" height={16} sx={{ mt: 0.5 }} />
                                        <Skeleton variant="rectangular" width="100%" height={4} sx={{ mt: 1, borderRadius: 1 }} />
                                    </Box>
                                    <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                                </Box>
                            </ListItem>
                        ))
                    ) : (
                        items.map((item, index) => {
                            const rank = index + 1;
                            const percentage = (item.totalQuantity / maxQuantity) * 100;
                            
                            return (
                                <ListItem key={item.id} sx={{ px: 0, py: 2, borderBottom: index < items.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                                        <Avatar
                                            sx={{ 
                                                width: 40, 
                                                height: 40,
                                                backgroundColor: getRankColor(rank),
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            #{rank}
                                        </Avatar>
                                        
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        fontWeight: 600, 
                                                        color: 'text.primary',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '200px'
                                                    }}
                                                >
                                                    {item.name}
                                                </Typography>
                                                <Chip
                                                    label={`${item.totalQuantity} sold`}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ ml: 1, flexShrink: 0 }}
                                                />
                                            </Box>
                                            
                                            <Typography 
                                                variant="caption" 
                                                color="text.secondary"
                                                sx={{ display: 'block', mb: 1 }}
                                            >
                                                Revenue: {formatCurrency(item.totalRevenue)}
                                            </Typography>
                                            
                                            <LinearProgress
                                                variant="determinate"
                                                value={percentage}
                                                sx={{
                                                    height: 6,
                                                    borderRadius: 3,
                                                    backgroundColor: theme.palette.grey[200],
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 3,
                                                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </ListItem>
                            );
                        })
                    )}
                </List>

                {!loading && items.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            No data available for selected period
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default TopMenuItems;
