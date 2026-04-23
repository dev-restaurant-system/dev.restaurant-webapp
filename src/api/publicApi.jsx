import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL 
    ? `${process.env.REACT_APP_API_URL}/public` 
    : 'http://localhost:8080/api/public';

const publicApi = axios.create({
    baseURL: API_BASE_URL,
});
export const getPublicMenuItems = () => publicApi.get('/restaurants/menu');


export default publicApi;
