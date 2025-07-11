import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { reimbursementAPI } from '@/Services/api';

export default function PendingApprovals() {
    const [reimbursements, setReimbursements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState({});
    const [selectedReimbursement, setSelectedReimbursement] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState('');
    const [comments, setComments] = useState('');

    useEffect(() => {
        fetchPendingReimbursements();
    }, []);

    const fetchPendingReimbursements = async () => {
        try {
            const response = await reimbursementAPI.getPending();
            setReimbursements(response.data.reimbursements);
        } catch (error) {
            setError('Failed to fetch pending reimbursements');
            console.error('Error fetching pending reimbursements:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprovalAction = (reimbursement, actionType) => {
        setSelectedReimbursement(reimbursement);
        setAction(actionType);
        setComments('');
        setShowModal(true);
    };

    const submitApproval = async () => {
        if (!selectedReimbursement) return;

        setProcessing(prev => ({ ...prev, [selectedReimbursement.id]: true }));

        try {
            if (action === 'approve') {
                await reimbursementAPI.approve(selectedReimbursement.id, comments);
            } else {
                await reimbursementAPI.reject(selectedReimbursement.id, comments);
            }

            // Refresh the list
            await fetchPendingReimbursements();
            setShowModal(false);
            setSelectedReimbursement(null);
            setComments('');
        } catch (error) {
            setError(`Failed to ${action} reimbursement`);
            console.error(`Error ${action}ing reimbursement:`, error);
        } finally {
            setProcessing(prev => ({ ...prev, [selectedReimbursement.id]: false }));
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
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Pending Approvals
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Pending Approvals
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {error && (
                                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            {reimbursements.length === 0 ? (
                                <div className="text-center py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pending approvals</h3>
                                    <p className="mt-1 text-sm text-gray-500">All reimbursements have been processed.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Employee
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {reimbursements.map((reimbursement) => (
                                                <tr key={reimbursement.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {reimbursement.user?.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {reimbursement.user?.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {reimbursement.title}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {reimbursement.description}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {formatCurrency(reimbursement.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(reimbursement.created_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={() => handleApprovalAction(reimbursement, 'approve')}
                                                            className="inline-flex items-center px-3 py-1 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:bg-green-700 active:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                            disabled={processing[reimbursement.id]}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleApprovalAction(reimbursement, 'reject')}
                                                            className="inline-flex items-center px-3 py-1 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700 focus:bg-red-700 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                                            disabled={processing[reimbursement.id]}
                                                        >
                                                            Reject
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Approval Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {action === 'approve' ? 'Approve' : 'Reject'} Reimbursement
                            </h3>
                            
                            {selectedReimbursement && (
                                <div className="mb-4 p-3 bg-gray-50 rounded">
                                    <p className="font-medium">{selectedReimbursement.title}</p>
                                    <p className="text-sm text-gray-600">{formatCurrency(selectedReimbursement.amount)}</p>
                                    <p className="text-sm text-gray-600">by {selectedReimbursement.user?.name}</p>
                                </div>
                            )}

                            <div className="mb-4">
                                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                                    Comments {action === 'reject' && <span className="text-red-500">*</span>}
                                </label>
                                <textarea
                                    id="comments"
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                    rows={3}
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm block w-full"
                                    placeholder={`Enter ${action === 'approve' ? 'approval' : 'rejection'} comments...`}
                                    required={action === 'reject'}
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={submitApproval}
                                    className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 ${
                                        action === 'approve'
                                            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    }`}
                                    disabled={action === 'reject' && !comments.trim()}
                                >
                                    {action === 'approve' ? 'Approve' : 'Reject'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

