import React, { useState, useEffect } from 'react';
import {
    Card, CardContent, Typography, Box, Skeleton, useTheme
} from '@mui/material';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { getOrdersData } from '../../api/analyticsApi';

const OrdersChart = ({ dateRange }) => {
    const theme = useTheme();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLORS = [
        theme.palette.success.main,    // Delivered
        theme.palette.warning.main,    // Pending
        theme.palette.info.main,       // Preparing
        theme.palette.error.main,      // Cancelled
        theme.palette.secondary.main,  // Others
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getOrdersData('status');
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch orders data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <Box sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1.5,
                    boxShadow: theme.shadows[4]
                }}>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>
                        {data.name}
                    </Typography>
                    <Typography variant="body2" color="primary">
                        {data.value} orders ({data.percentage}%)
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        if (percent < 0.05) return null; // Don't show label if less than 5%
        
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text 
                x={x} 
                y={y} 
                fill="white" 
                textAnchor={x > cx ? 'start' : 'end'} 
                dominantBaseline="central"
                fontSize={12}
                fontWeight="600"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
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
                    Order Status Distribution
                </Typography>

                {loading ? (
                    <Box sx={{ height: 350, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Skeleton variant="circular" width={280} height={280} />
                    </Box>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomLabel}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                stroke={theme.palette.background.paper}
                                strokeWidth={2}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend 
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{
                                    paddingTop: '20px',
                                    fontSize: '14px'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
};

export default OrdersChart;
