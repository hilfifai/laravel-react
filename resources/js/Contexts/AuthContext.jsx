import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/Services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user');
        console.log('MASUK USE');
        if (token && userData) {
          console.log('USDAH LOGIN',userData);
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { user: userData, token } = response.data;
            
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            
            return { success: true, user: userData };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Login failed' 
            };
        }
    };

    const register = async (userData) => {
        try {
            
          console.log('MASUK LOGIN',userData);
            const response = await authAPI.register(userData);
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.error || 'Registration failed' 
            };
        }
    };

    const logout = () => {
        authAPI.logout();
        setUser(null);
    };

    const isEmployee = () => user?.role === 'employee';
    const isManager = () => user?.role === 'manager';
    const isAdmin = () => user?.role === 'admin';
    const canApprove = () => isManager() || isAdmin();

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isEmployee,
        isManager,
        isAdmin,
        canApprove,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

