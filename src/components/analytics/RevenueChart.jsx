import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, Typography, Box, ToggleButtonGroup, 
    ToggleButton, Skeleton, useTheme, alpha
} from '@mui/material';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { getRevenueData } from '../../api/analyticsApi';
import { formatCurrency } from '../../utils/chartHelpers';

const RevenueChart = ({ dateRange }) => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [period, setPeriod] = useState('daily');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getRevenueData(period);
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch revenue data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [period, dateRange]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Box sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1.5,
                    boxShadow: theme.shadows[4]
                }}>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                        {label}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        {formatCurrency(payload[0].value)}
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Card elevation={0} sx={{ 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 3,
            height: '100%'
        }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Revenue Trends
                    </Typography>
                    
                    <ToggleButtonGroup
                        value={period}
                        exclusive
                        onChange={(e, value) => value && setPeriod(value)}
                        size="small"
                        sx={{ 
                            '& .MuiToggleButton-root': {
                                borderRadius: 1,
                                textTransform: 'none',
                                px: 2
                            }
                        }}
                    >
                        <ToggleButton value="daily">Daily</ToggleButton>
                        <ToggleButton value="weekly">Weekly</ToggleButton>
                        <ToggleButton value="monthly">Monthly</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {loading ? (
                    <Box sx={{ height: 350 }}>
                        <Skeleton variant="rectangular" width="100%" height="100%" />
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.5)} />
                            <XAxis 
                                dataKey="period" 
                                stroke={theme.palette.text.secondary}
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis 
                                stroke={theme.palette.text.secondary}
                                fontSize={12}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke={theme.palette.primary.main}
                                strokeWidth={3}
                                fill="url(#revenueGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default RevenueChart;
