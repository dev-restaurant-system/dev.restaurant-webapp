import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL 
    ? `${process.env.REACT_APP_API_URL}/admin` 
    : 'http://localhost:8080/api/admin';

const adminApi = axios.create({
    baseURL: API_BASE_URL,
});
adminApi.interceptors.request.use(
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
adminApi.interceptors.response.use(
    (response) => {
        console.log("Admin API Response Interceptor: Successful response. Status:", response.status);
        return response;
    },
    (error) => {
        console.error("Admin API Response Interceptor: Error response. Status:", error.response ? error.response.status : 'No status', "Data:", error.response ? error.response.data : 'None');
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized access (401). Dispatching auth-error event.');
            window.dispatchEvent(new Event('auth-error'));
        }
        return Promise.reject(error);
    }
);
export const adminLogin = (username, password) => adminApi.post('/login', { username, password });

// Menu Items
export const getMenuItems = () => adminApi.get('/menu-items');
export const getMenuItemById = (id) => adminApi.get(`/menu-items/${id}`);
export const createMenuItem = (menuItemData) => adminApi.post('/menu-items', menuItemData);
export const updateMenuItem = (id, menuItemData) => adminApi.put(`/menu-items/${id}`, menuItemData);
export const deleteMenuItem = (id) => adminApi.delete(`/menu-items/${id}`);

// Customers
export const getCustomers = () => adminApi.get('/customers');
export const getCustomerById = (id) => adminApi.get(`/customers/${id}`);
export const blockCustomer = (id) => adminApi.put(`/customers/${id}/block`);
export const unblockCustomer = (id) => adminApi.put(`/customers/${id}/unblock`);

// Orders
export const getOrders = () => adminApi.get('/orders');
export const getOrderById = (id) => adminApi.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => adminApi.put(`/orders/${id}/status`, { status });
export const createOrder = (orderData) => adminApi.post('/orders', orderData);


// Restaurant
export const getRestaurantDetails = () => adminApi.get('/restaurant');
export const updateRestaurantDetails = (restaurantData) => adminApi.put('/restaurant', restaurantData);

// Note: Axios automatically sets 'Content-Type': 'multipart/form-data' for FormData payloads.
const uploadFile = (url, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return adminApi.post(url, formData);
};

export const uploadImage = (file) => uploadFile('/menu-items/upload-image', file);
export const uploadRestaurantImage = (file) => uploadFile('/restaurant/upload-image', file);

// This function uploads a slider image file and returns its URL. Used in EDIT mode of SliderImageForm.
export const uploadSliderImage = (file) => uploadFile('/slider-images/upload', file);

// --- SLIDER IMAGE MANAGEMENT (DATABASE OPERATIONS) ---
export const getSliderImagesAdmin = () => adminApi.get('/slider-images'); // Fetch list

// FIX: This `createSliderImage` function now sends the file AND metadata in one multipart request.
// It maps to backend's `POST /api/admin/slider-images` (base path).
export const createSliderImage = (file, title, displayOrder, actionUrl) => { 
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('displayOrder', displayOrder);
    formData.append('actionUrl', actionUrl);
    return adminApi.post('/slider-images', formData); 
};
export const updateSliderImage = (id, sliderImageData) => adminApi.put(`/slider-images/${id}`, sliderImageData);
export const deleteSliderImage = (id) => adminApi.delete(`/slider-images/${id}`);
export const getDeliveryPeople = () => adminApi.get('/delivery-people');
export const approveDeliveryPerson = (id) => adminApi.put(`/delivery-people/${id}/approve`);
export const deleteDeliveryPerson = (id) => adminApi.delete(`/delivery-people/${id}`);
export const getAvailableDeliveryPeople = () => adminApi.get('/delivery-people/available');
export const assignOrderToPerson = (orderId, personId) => adminApi.put(`/orders/${orderId}/assign-delivery/${personId}`);
export const deleteOrderHistory = (days) => adminApi.delete(`/orders/history?days=${days}`);
export const getDiningHistory = () => {
    return adminApi.get('/admin/orders/non-customer');
};
export const hasNewOrders = () => {
  return adminApi.get('/orders/has-new');
};

export const markAllAsViewed = () => {
  return adminApi.post('/orders/mark-all-viewed');
};
export default adminApi;
