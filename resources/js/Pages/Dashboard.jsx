import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useAuth } from '@/Contexts/AuthContext';
import { reimbursementAPI } from '@/Services/api';

export default function Dashboard() {
    const { user, isEmployee, isManager, isAdmin, canApprove } = useAuth();
    const [stats, setStats] = useState({
        myReimbursements: 0,
        pendingApprovals: 0,
        totalReimbursements: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get my reimbursements count
                const myReimbursements = await reimbursementAPI.getMyReimbursements();
                setStats(prev => ({ ...prev, myReimbursements: myReimbursements.data.reimbursements.length }));

                // Get pending approvals count (for managers/admins)
                if (canApprove()) {
                    const pendingApprovals = await reimbursementAPI.getPending();
                    setStats(prev => ({ ...prev, pendingApprovals: pendingApprovals.data.reimbursements.length }));
                }

                // Get total reimbursements count (for admins)
                if (isAdmin()) {
                    const allReimbursements = await reimbursementAPI.getAll();
                    setStats(prev => ({ ...prev, totalReimbursements: allReimbursements.data.reimbursements.length }));
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [canApprove, isAdmin]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Welcome back, {user?.name}!
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                    You are logged in as {user?.role}.
                                </p>
                            </div>

                            {loading ? (
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-blue-50 overflow-hidden shadow rounded-lg">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                                            My Reimbursements
                                                        </dt>
                                                        <dd className="text-lg font-medium text-gray-900">
                                                            {stats.myReimbursements}
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-blue-50 px-5 py-3">
                                            <div className="text-sm">
                                                <Link to="/reimbursements" className="font-medium text-blue-700 hover:text-blue-900">
                                                    View all
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {canApprove() && (
                                        <div className="bg-yellow-50 overflow-hidden shadow rounded-lg">
                                            <div className="p-5">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                Pending Approvals
                                                            </dt>
                                                            <dd className="text-lg font-medium text-gray-900">
                                                                {stats.pendingApprovals}
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-yellow-50 px-5 py-3">
                                                <div className="text-sm">
                                                    <Link to="/pending-approvals" className="font-medium text-yellow-700 hover:text-yellow-900">
                                                        Review now
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {isAdmin() && (
                                        <div className="bg-green-50 overflow-hidden shadow rounded-lg">
                                            <div className="p-5">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-5 w-0 flex-1">
                                                        <dl>
                                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                                Total Reimbursements
                                                            </dt>
                                                            <dd className="text-lg font-medium text-gray-900">
                                                                {stats.totalReimbursements}
                                                            </dd>
                                                        </dl>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-green-50 px-5 py-3">
                                                <div className="text-sm">
                                                    <Link to="/admin/reimbursements" className="font-medium text-green-700 hover:text-green-900">
                                                        View all
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Link
                                        to="/reimbursements/create"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Create New Reimbursement
                                    </Link>
                                    
                                    <Link
                                        to="/reimbursements"
                                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        View My Reimbursements
                                    </Link>

                                    {canApprove() && (
                                        <Link
                                            to="/pending-approvals"
                                            className="inline-flex items-center px-4 py-2 bg-yellow-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-yellow-700 focus:bg-yellow-700 active:bg-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Review Pending Approvals
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}