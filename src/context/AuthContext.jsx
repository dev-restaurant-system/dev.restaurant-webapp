import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminLogin } from '../api/adminApi.jsx';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('adminToken');
        const storedUser = localStorage.getItem('adminUser');

        console.log("AuthContext: useEffect [initial mount] - Checking localStorage."); 
        if (storedToken && storedUser) {
            console.log("AuthContext: Found stored token and user on mount.");
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("AuthContext: Error parsing user from localStorage:", e);
                setToken(null);
                setUser(null);
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            }
        } else {
            console.log("AuthContext: No stored token or user found on mount."); 
        }
        setLoading(false);
        console.log("AuthContext: Initial check complete, loading set to false.");
    }, []);

    useEffect(() => {
        console.log("AuthContext: useEffect [token/user state change] - Syncing localStorage. Current token:", token ? "Present" : "None", "User:", user ? "Present" : "None"); // NEW LOG
        if (token) {
            localStorage.setItem('adminToken', token);
            console.log("AuthContext: localStorage updated - adminToken saved."); 
        } else {
            localStorage.removeItem('adminToken');
            console.log("AuthContext: localStorage updated - adminToken removed."); 
        }
        if (user) {
            localStorage.setItem('adminUser', JSON.stringify(user));
            console.log("AuthContext: localStorage updated - adminUser saved."); 
        } else {
            localStorage.removeItem('adminUser');
            console.log("AuthContext: localStorage updated - adminUser removed."); 
        }
    }, [token, user]);

    const login = async (username, password) => {
        setLoading(true);
        console.log("AuthContext: login function called. Attempting to login with username:", username); 
        try {
            const response = await adminLogin(username, password);
            console.log("AuthContext: adminLogin API call successful. Response data:", response.data); 
            const { token: jwtToken, username: loggedInUsername, role } = response.data;

            if (!jwtToken || !loggedInUsername || !role) { 
                console.error("AuthContext: Login response data is incomplete:", response.data); 
                throw new Error("Login response data missing token, username, or role.");
            }

            setToken(jwtToken);
            setUser({ username: loggedInUsername, role });
            console.log("AuthContext: Token and User states updated."); // NEW LOG

        } catch (error) {
            console.error("AuthContext: Login failed during API call or state update:", error); 
            setToken(null);
            setUser(null);
            throw error; 
        } finally {
            setLoading(false);
            console.log("AuthContext: Login process finished, loading set to false."); // NEW LOG
        }
    };

    // Wrap logout in useCallback to ensure it has a stable identity across re-renders.
    // This is a best practice, especially when it's a dependency of another useEffect.
    const logout = React.useCallback(() => {
        console.log("AuthContext: logout function called. Clearing state and localStorage.");
        setToken(null);
        setUser(null);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
    }, []); // No dependencies, so this function is created only once.

    // Effect to handle global authentication errors from the API interceptor
    useEffect(() => {
        const handleAuthError = () => {
            console.log("AuthContext: 'auth-error' event received. Logging out.");
            logout();
            // After logout, the app state will change, and ProtectedRoutes will redirect.
            // A hard reload is no longer necessary.
        };
        window.addEventListener('auth-error', handleAuthError);

        // Cleanup the event listener when the component unmounts
        return () => window.removeEventListener('auth-error', handleAuthError);
    }, [logout]); 

    const isAuthenticated = !!token && !!user && !loading;
    const isAdmin = isAuthenticated && user?.role === 'ADMIN';

    console.log("AuthContext: Render - isAuthenticated:", isAuthenticated, "loading:", loading, "user:", user ? user.username : "none"); 

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated, isAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
    };

export const useAuth = () => useContext(AuthContext);