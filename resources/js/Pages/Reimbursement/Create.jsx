import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { reimbursementAPI } from '@/Services/api';

export default function CreateReimbursement() {
    const [data, setData] = useState({
        title: '',
        description: '',
        amount: '',
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            await reimbursementAPI.create({
                title: data.title,
                description: data.description,
                amount: parseFloat(data.amount),
            });
            
            navigate('/reimbursements');
        } catch (error) {
            if (error.response?.data?.error) {
                setErrors({ general: error.response.data.error });
            } else {
                setErrors({ general: 'Failed to create reimbursement' });
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleChange = (e) => {
        setData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Create New Reimbursement
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {errors.general && (
                                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {errors.general}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="title" className="block font-medium text-sm text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm block w-full"
                                        placeholder="Enter reimbursement title"
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.title && (
                                        <div className="text-sm text-red-600 mt-1">{errors.title}</div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="description" className="block font-medium text-sm text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        rows={4}
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm block w-full"
                                        placeholder="Enter detailed description of the reimbursement"
                                        onChange={handleChange}
                                    />
                                    {errors.description && (
                                        <div className="text-sm text-red-600 mt-1">{errors.description}</div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="amount" className="block font-medium text-sm text-gray-700 mb-2">
                                        Amount (IDR)
                                    </label>
                                    <input
                                        id="amount"
                                        type="number"
                                        name="amount"
                                        value={data.amount}
                                        step="0.01"
                                        min="0"
                                        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm block w-full"
                                        placeholder="0.00"
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.amount && (
                                        <div className="text-sm text-red-600 mt-1">{errors.amount}</div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/reimbursements')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 focus:bg-gray-400 active:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Reimbursement'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

