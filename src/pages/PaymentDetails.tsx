import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePayments } from '../contexts/PaymentContext';
import { uploadAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const PaymentDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { payments, updatePayment } = usePayments();
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    
    const payment = payments.find(p => p.id === Number(id));

    const [editData, setEditData] = useState({
        amount: payment?.amount.toString() || '',
        date: payment?.date || '',
        status: payment?.status || 'paid',
        invoiceNumber: payment?.invoiceNumber || '',
        description: payment?.description || '',
        paymentMethod: payment?.paymentMethod || 'Bank Transfer',
        currentInstallment: payment?.currentInstallment.toString() || '',
        totalInstallments: payment?.totalInstallments.toString() || ''
    });

    if (!payment) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Not Found</h2>
                    <button
                        onClick={() => navigate('/payment-history')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Payment History
                    </button>
                </div>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const downloadInvoice = async () => {
        if (!payment.invoiceDocument) {
            toast.warning('No invoice document available');
            return;
        }

        try {
            const response = await uploadAPI.downloadFile('invoiceDocument', payment.invoiceDocument);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', payment.invoiceDocument);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            toast.error('Error downloading invoice. The file may not exist on the server.');
        }
    };

    const progressPercentage = (payment.currentInstallment / payment.totalInstallments) * 100;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        if (!payment) return;

        const amount = parseFloat(editData.amount);
        const currentInst = parseInt(editData.currentInstallment);
        const totalInst = parseInt(editData.totalInstallments);
        const remainingInst = totalInst - currentInst;

        updatePayment(payment.id, {
            amount,
            date: editData.date,
            status: editData.status as 'paid' | 'pending' | 'overdue',
            invoiceNumber: editData.invoiceNumber,
            description: editData.description,
            paymentMethod: editData.paymentMethod,
            currentInstallment: currentInst,
            totalInstallments: totalInst,
            installment: `${currentInst}/${totalInst}`,
            remaining: remainingInst === 0 ? 'Project Completed' : `${remainingInst} installment${remainingInst > 1 ? 's' : ''} remaining`
        });

        setIsEditing(false);
        toast.success('Payment updated successfully!');
    };

    const handleCancelEdit = () => {
        setEditData({
            amount: payment?.amount.toString() || '',
            date: payment?.date || '',
            status: payment?.status || 'paid',
            invoiceNumber: payment?.invoiceNumber || '',
            description: payment?.description || '',
            paymentMethod: payment?.paymentMethod || 'Bank Transfer',
            currentInstallment: payment?.currentInstallment.toString() || '',
            totalInstallments: payment?.totalInstallments.toString() || ''
        });
        setIsEditing(false);
    };

    return (
        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 lg:gap-4">
                    <button
                        onClick={() => navigate('/payment-history')}
                        className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-lg lg:text-2xl font-bold text-gray-900">{isEditing ? 'Edit Payment' : 'Payment Details'}</h1>
                        <p className="text-xs lg:text-sm text-gray-600 mt-0.5 lg:mt-1">{payment.invoiceNumber}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isEditing ? (
                /* Edit Mode */
                <div className="space-y-4 lg:space-y-6 max-w-4xl">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6">
                        <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-4 lg:mb-6">Edit Payment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                            <div>
                                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Amount *</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={editData.amount}
                                    onChange={handleInputChange}
                                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="5000.00"
                                />
                            </div>
                            <div>
                                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={editData.date}
                                    onChange={handleInputChange}
                                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Status *</label>
                                <select
                                    name="status"
                                    value={editData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                                <select
                                    name="paymentMethod"
                                    value={editData.paymentMethod}
                                    onChange={handleInputChange}
                                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Check">Check</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Invoice Number *</label>
                                <input
                                    type="text"
                                    name="invoiceNumber"
                                    value={editData.invoiceNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Current Installment *</label>
                                <input
                                    type="number"
                                    name="currentInstallment"
                                    value={editData.currentInstallment}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Total Installments *</label>
                                <input
                                    type="number"
                                    name="totalInstallments"
                                    value={editData.totalInstallments}
                                    onChange={handleInputChange}
                                    min="1"
                                    className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="mt-4 lg:mt-6">
                            <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={editData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Add payment description or notes..."
                            />
                        </div>
                        <div className="flex gap-3 lg:gap-4 mt-4 lg:mt-6">
                            <button
                                onClick={handleCancelEdit}
                                className="flex-1 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="flex-1 px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                /* View Mode */
            <div className="space-y-4 lg:space-y-6 max-w-6xl">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 lg:p-8">
                    <div className="flex flex-col sm:flex-row justify-between mb-4 lg:mb-6 gap-3">
                        <div>
                            <h3 className="text-lg lg:text-2xl font-bold">{payment.clientName}</h3>
                            <p className="text-sm lg:text-lg text-gray-700">{payment.projectName}</p>
                        </div>
                        <span className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-semibold h-fit ${getStatusColor(payment.status)}`}>
                            {payment.status.toUpperCase()}
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6">
                        <div className="bg-white bg-opacity-60 rounded-lg p-3 lg:p-4">
                            <p className="text-xs lg:text-sm text-gray-600">Amount</p>
                            <p className="text-xl lg:text-2xl font-bold text-green-600">₹{payment.amount.toLocaleString()}</p>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-3 lg:p-4">
                            <p className="text-xs lg:text-sm text-gray-600">Payment Date</p>
                            <p className="text-sm lg:text-lg font-semibold">{new Date(payment.date).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-white bg-opacity-60 rounded-lg p-3 lg:p-4">
                            <p className="text-xs lg:text-sm text-gray-600">Invoice Number</p>
                            <p className="text-sm lg:text-lg font-semibold">{payment.invoiceNumber}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                    <div className="bg-white border rounded-xl p-4 lg:p-6">
                        <h4 className="text-base lg:text-lg font-bold mb-3 lg:mb-4">💳 Payment Information</h4>
                        <div className="space-y-3 lg:space-y-4">
                            <div><p className="text-xs lg:text-sm text-gray-600">Payment Method</p><p className="text-sm lg:text-base font-medium">{payment.paymentMethod || 'Not specified'}</p></div>
                            <div><p className="text-xs lg:text-sm text-gray-600">Status</p><span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm ${getStatusColor(payment.status)}`}>{payment.status.toUpperCase()}</span></div>
                            <div><p className="text-xs lg:text-sm text-gray-600">Transaction Date</p><p className="text-sm lg:text-base font-medium">{new Date(payment.date).toLocaleDateString()}</p></div>
                        </div>
                    </div>
                    <div className="bg-white border rounded-xl p-4 lg:p-6">
                        <h4 className="text-base lg:text-lg font-bold mb-3 lg:mb-4">📊 Installment Progress</h4>
                        <div className="space-y-3 lg:space-y-4">
                            <div><p className="text-xs lg:text-sm text-gray-600">Current Installment</p><p className="text-xl lg:text-2xl font-bold text-blue-600">{payment.installment}</p></div>
                            <div><p className="text-xs lg:text-sm text-gray-600">Remaining</p><p className="text-sm lg:text-base font-medium">{payment.remaining}</p></div>
                            <div>
                                <p className="text-xs lg:text-sm text-gray-600 mb-2">Progress</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 lg:h-3">
                                    <div className="bg-blue-600 h-2 lg:h-3 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{progressPercentage.toFixed(0)}% Complete</p>
                            </div>
                        </div>
                    </div>
                </div>

                {payment.description && (
                    <div className="bg-white border rounded-xl p-4 lg:p-6">
                        <h4 className="text-base lg:text-lg font-bold mb-3 lg:mb-4">📝 Description</h4>
                        <div className="bg-gray-50 rounded-lg p-3 lg:p-4"><p className="text-sm lg:text-base">{payment.description}</p></div>
                    </div>
                )}

                <div className="bg-white border rounded-xl p-4 lg:p-6">
                    <h4 className="text-base lg:text-lg font-bold mb-3 lg:mb-4">📄 Invoice Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                        <div><p className="text-xs lg:text-sm text-gray-600">Invoice Number</p><p className="text-sm lg:text-base font-medium">{payment.invoiceNumber}</p></div>
                        <div><p className="text-xs lg:text-sm text-gray-600">Issue Date</p><p className="text-sm lg:text-base font-medium">{new Date(payment.date).toLocaleDateString()}</p></div>
                        <div><p className="text-xs lg:text-sm text-gray-600">Client Name</p><p className="text-sm lg:text-base font-medium">{payment.clientName}</p></div>
                        <div><p className="text-xs lg:text-sm text-gray-600">Project Name</p><p className="text-sm lg:text-base font-medium">{payment.projectName}</p></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                    {payment.invoiceDocument ? (
                        <>
                            <button 
                                onClick={() => {
                                    const fileUrl = uploadAPI.viewFile('invoiceDocument', payment.invoiceDocument!);
                                    window.open(fileUrl, '_blank');
                                }}
                                className="px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                👁️ View
                            </button>
                            <button 
                                onClick={downloadInvoice} 
                                className="px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                📄 Download
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={downloadInvoice} 
                            className="px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            📄 Download
                        </button>
                    )}
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                    >
                        ✏️ Edit
                    </button>
                     <button className="px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">📧 Email</button>
                   
                </div>
            </div>
            )}
        </div>
    );
};

export default PaymentDetails;
