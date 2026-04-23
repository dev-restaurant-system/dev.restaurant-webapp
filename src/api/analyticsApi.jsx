import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL 
    ? `${process.env.REACT_APP_API_URL}/admin/analytics` 
    : 'http://localhost:8080/api/admin/analytics';

const analyticsApi = axios.create({
    baseURL: API_BASE_URL,
});

analyticsApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

analyticsApi.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("Analytics API Error:", error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
            window.dispatchEvent(new Event('auth-error'));
        }
        return Promise.reject(error);
    }
);

// Dashboard overview stats
export const getDashboardStats = (dateRange) => analyticsApi.get('/dashboard-stats', { params: dateRange });

// Revenue analytics
export const getRevenueData = (period) => analyticsApi.get('/revenue', { params: { period } });

// Order analytics
export const getOrdersData = (period) => analyticsApi.get('/orders', { params: { period } });

// Top selling items
export const getTopMenuItems = (limit = 10) => analyticsApi.get('/top-items', { params: { limit } });

// Recent activity
export const getRecentActivity = (limit = 20) => analyticsApi.get('/recent-activity', { params: { limit } });

// Customer analytics
export const getCustomerStats = () => analyticsApi.get('/customers');

export default analyticsApi;
