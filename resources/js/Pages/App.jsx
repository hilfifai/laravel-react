import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/Contexts/AuthContext';
import ProtectedRoute from '@/Components/ProtectedRoute';

// Import pages
import Login from './Auth/Login';
import Register from './Auth/Register';
import Dashboard from './Dashboard';
import ReimbursementList from './Reimbursement/List';
import ReimbursementCreate from './Reimbursement/Create';
import ReimbursementDetail from './Reimbursement/Detail';
import PendingApprovals from './Manager/PendingApprovals';
import AllReimbursements from './Admin/AllReimbursements';
import UserManagement from './Admin/UserManagement';

export default function App() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route 
                    path="/login" 
                    element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
                />
                <Route 
                    path="/register" 
                    element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
                />
                
                {/* Protected routes */}
                <Route 
                    path="/dashboard" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Employee routes */}
                <Route 
                    path="/reimbursements" 
                    element={
                        <ProtectedRoute>
                            <ReimbursementList />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/reimbursements/create" 
                    element={
                        <ProtectedRoute>
                            <ReimbursementCreate />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/reimbursements/:id" 
                    element={
                        <ProtectedRoute>
                            <ReimbursementDetail />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Manager routes */}
                <Route 
                    path="/pending-approvals" 
                    element={
                        <ProtectedRoute>
                            <PendingApprovals />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Admin routes */}
                <Route 
                    path="/admin/reimbursements" 
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AllReimbursements />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/admin/users" 
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <UserManagement />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Default redirect */}
                <Route 
                    path="/" 
                    element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
                />
            </Routes>
        </Router>
    );
}

