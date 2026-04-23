import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { CssBaseline, Box, Toolbar, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Context
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

import DiningHistoryPage from './pages/DiningHistoryPage.jsx'; // Import the new page
import Header from './components/layout/Header.jsx';

// Pages
import LoginPage from './pages/loginPage.jsx';
import DashboardPage from './pages/dashBoradPage.jsx';
import MenuItemsPage from './pages/menuItemsPage.jsx';
import OrdersPage from './pages/ordersPage.jsx';
import CustomersPage from './pages/customersPage.jsx';
import RestaurantPage from './pages/ResturantPage.jsx';
import SliderImagesPage from './pages/SliderImagesPage.jsx';
import DeliveryPeoplePage from './pages/DeliveryPeoplePage.jsx';
import OrderHistoryPage from './pages/OrderHistoryPage.jsx';
import BusinessPortfolioPage from './pages/BusinessPortfolioPage.jsx';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx';
import DiningBillingPage from './pages/DiningBillingPage.jsx';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage.jsx';

// Material UI theme
const theme = createTheme({
  palette: {
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' },
    // ... add other colors if needed
  },
});

// Authenticated Layout
const AuthenticatedLayout = ({ children }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <CssBaseline />
    <Header />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        pt: 2,
      }}
    >
      <Toolbar />
      <Box sx={{ px: { xs: 2, sm: 3 } }}>{children}</Box>
    </Box>
  </Box>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Auth redirect for the main "/" path
const AuthRedirect = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    // This logic now correctly handles the root path.
    // If logged in, go to dashboard. If not, go to the public-facing business page.
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <BusinessPortfolioPage />;
};

// --- THIS IS THE NEW, CLEANER ROUTE GROUPING ---
const ProtectedRoutesWrapper = () => (
    <ProtectedRoute>
        <AuthenticatedLayout>
            <Outlet /> 
        </AuthenticatedLayout>
    </ProtectedRoute>
);

// Main App Component
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes that everyone can see */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<LoginPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/business" element={<BusinessPortfolioPage />} />

            {/* --- All protected admin routes are now grouped here --- */}
            <Route element={<ProtectedRoutesWrapper />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/menu-items" element={<MenuItemsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/delivery-people" element={<DeliveryPeoplePage />} />
                <Route path="/dining-billing" element={<DiningBillingPage />} />
                <Route path="/restaurant" element={<RestaurantPage />} />
                <Route path="/slider-images" element={<SliderImagesPage />} />
                <Route path="/order-history" element={<OrderHistoryPage />} />
                <Route path="/analytics" element={<AnalyticsDashboardPage />} />
                <Route path="/dining-history" element={<DiningHistoryPage />} /> {/* <-- ADD THIS LINE */}

            </Route>

            {/* Catch-all: Redirects the root path based on auth state */}
            <Route path="*" element={<AuthRedirect />} />
            
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
