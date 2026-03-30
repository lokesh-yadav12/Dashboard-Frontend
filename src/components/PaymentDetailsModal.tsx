import React from 'react';
import { Payment } from '../contexts/PaymentContext';

interface PaymentDetailsModalProps {
    payment: Payment;
    onClose: () => void;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ payment, onClose }) => {
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

    const downloadInvoice = () => {
        // Create a simple invoice content
        const invoiceContent = `
      INVOICE
      
      Invoice Number: ${payment.invoiceNumber}
      Date: ${new Date(payment.date).toLocaleDateString()}
      
      Bill To:
      ${payment.clientName}
      
      Project: ${payment.projectName}
      
      Description: ${payment.description || 'Payment for services'}
      Amount: ₹${payment.amount.toLocaleString()}
      Payment Method: ${payment.paymentMethod || 'Not specified'}
      
      Installment: ${payment.installment}
      Status: ${payment.status.toUpperCase()}
      
      ${payment.currentInstallment === payment.totalInstallments
                ? 'PROJECT COMPLETED - All installments paid'
                : `Remaining: ${payment.totalInstallments - payment.currentInstallment} installments`
            }
      
      Thank you for your business!
    `;

        // Create and download the invoice
        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${payment.invoiceNumber}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const isCompleted = payment.currentInstallment === payment.totalInstallments;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
                        <p className="text-sm text-gray-600">{payment.invoiceNumber}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Client & Project Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{payment.clientName}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Project</p>
                                <p className="text-sm text-gray-900">{payment.projectName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Payment Date</p>
                                <p className="text-sm text-gray-900">{new Date(payment.date).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Amount */}
                    <div className="text-center py-6 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-600 mb-2">Payment Amount</p>
                        <p className="text-4xl font-bold text-blue-600">₹{payment.amount.toLocaleString()}</p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status.toUpperCase()}
                        </span>
                    </div>

                    {/* Installment Progress */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Installment Progress</h3>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700">
                                    Installment {payment.currentInstallment} of {payment.totalInstallments}
                                </span>
                                <span className="text-gray-600">
                                    {Math.round((payment.currentInstallment / payment.totalInstallments) * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full transition-all duration-300 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'
                                        }`}
                                    style={{ width: `${(payment.currentInstallment / payment.totalInstallments) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Status Message */}
                        <div className={`p-4 rounded-lg ${isCompleted
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-blue-50 border border-blue-200'
                            }`}>
                            <div className="flex items-center">
                                <span className="text-2xl mr-3">
                                    {isCompleted ? '🎉' : '📊'}
                                </span>
                                <div>
                                    <p className={`font-semibold ${isCompleted ? 'text-green-800' : 'text-blue-800'
                                        }`}>
                                        {isCompleted
                                            ? 'Project Completed!'
                                            : `${payment.totalInstallments - payment.currentInstallment} Installments Remaining`
                                        }
                                    </p>
                                    <p className={`text-sm ${isCompleted ? 'text-green-600' : 'text-blue-600'
                                        }`}>
                                        {isCompleted
                                            ? 'All payments have been received for this project.'
                                            : `Next payment expected for installment ${payment.currentInstallment + 1}`
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Payment Information</h4>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Payment Method</p>
                                    <p className="text-sm text-gray-900">{payment.paymentMethod || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Invoice Number</p>
                                    <p className="text-sm text-gray-900">{payment.invoiceNumber}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900">Description</h4>
                            <p className="text-sm text-gray-900">
                                {payment.description || 'No description provided'}
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={downloadInvoice}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <span>📄</span>
                            Download Invoice
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailsModal;