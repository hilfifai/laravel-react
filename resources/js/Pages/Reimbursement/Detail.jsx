import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { reimbursementAPI } from '@/Services/api';

export default function ReimbursementDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reimbursement, setReimbursement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReimbursement = async () => {
            try {
                const response = await reimbursementAPI.getById(id);
                setReimbursement(response.data.reimbursement);
            } catch (error) {
                setError('Failed to fetch reimbursement details');
                console.error('Error fetching reimbursement:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReimbursement();
    }, [id]);

    const getStatusBadge = (status) => {
        const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
        switch (status) {
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Reimbursement Details
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (error || !reimbursement) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Reimbursement Details
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error || 'Reimbursement not found'}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Reimbursement Details
                    </h2>
                    <button
                        onClick={() => navigate('/reimbursements')}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        Back to List
                    </button>
                </div>
            }
        >
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Reimbursement Information</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Title</label>
                                            <p className="mt-1 text-sm text-gray-900">{reimbursement.title}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <p className="mt-1 text-sm text-gray-900">{reimbursement.description || 'No description provided'}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                                            <p className="mt-1 text-lg font-semibold text-gray-900">{formatCurrency(reimbursement.amount)}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Status</label>
                                            <div className="mt-1">
                                                <span className={getStatusBadge(reimbursement.status)}>
                                                    {reimbursement.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Submitted Date</label>
                                            <p className="mt-1 text-sm text-gray-900">{formatDate(reimbursement.created_at)}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                                            <p className="mt-1 text-sm text-gray-900">{formatDate(reimbursement.updated_at)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Approval History</h3>
                                    
                                    {reimbursement.approvals && reimbursement.approvals.length > 0 ? (
                                        <div className="space-y-4">
                                            {reimbursement.approvals.map((approval, index) => (
                                                <div key={approval.id} className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{approval.approver?.name}</p>
                                                            <p className="text-sm text-gray-500">{approval.approver?.email}</p>
                                                        </div>
                                                        <span className={getStatusBadge(approval.status)}>
                                                            {approval.status}
                                                        </span>
                                                    </div>
                                                    
                                                    {approval.comments && (
                                                        <div className="mt-2">
                                                            <label className="block text-sm font-medium text-gray-700">Comments</label>
                                                            <p className="mt-1 text-sm text-gray-900">{approval.comments}</p>
                                                        </div>
                                                    )}
                                                    
                                                    {approval.approved_at && (
                                                        <div className="mt-2">
                                                            <label className="block text-sm font-medium text-gray-700">Date</label>
                                                            <p className="mt-1 text-sm text-gray-900">{formatDate(approval.approved_at)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No approvals yet</h3>
                                            <p className="mt-1 text-sm text-gray-500">This reimbursement is waiting for approval.</p>
                                        </div>
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

