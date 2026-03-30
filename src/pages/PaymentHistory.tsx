import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { usePayments, Payment } from '../contexts/PaymentContext';
import PaymentDetailsModal from '../components/PaymentDetailsModal';

const PaymentHistory: React.FC = () => {
    const { payments } = usePayments();
    const [viewType, setViewType] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Get last 6 months dynamically
    const getLast6Months = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentDate = new Date();
        const last6Months = [];
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            last6Months.push({
                name: months[date.getMonth()],
                month: date.getMonth(),
                year: date.getFullYear(),
                fullDate: date
            });
        }
        
        return last6Months;
    };

    // Calculate monthly data from actual payments
    const getMonthlyData = () => {
        const last6Months = getLast6Months();
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
        
        const monthlyPayments = last6Months.map((month, index) => {
            const monthPayments = payments.filter(payment => {
                const paymentDate = new Date(payment.date);
                return paymentDate.getMonth() === month.month && 
                       paymentDate.getFullYear() === month.year &&
                       payment.status === 'paid';
            });
            
            const totalAmount = monthPayments.reduce((sum, p) => sum + p.amount, 0);
            
            return {
                name: `${month.name} ${month.year}`,
                value: totalAmount,
                color: colors[index]
            };
        });

        // Check if all values are 0, if so, use sample data
        const hasData = monthlyPayments.some(item => item.value > 0);
        
        if (!hasData) {
            // Return sample data for visualization
            return last6Months.map((month, index) => ({
                name: `${month.name} ${month.year}`,
                value: Math.floor(Math.random() * 15000) + 10000, // Random between 10k-25k
                color: colors[index]
            }));
        }
        
        return monthlyPayments;
    };

    // Monthly payment data for pie chart
    const monthlyData = getMonthlyData();

    // Yearly payment data for pie chart
    const yearlyData = [
        { name: '2022', value: 125000, color: '#3B82F6' },
        { name: '2023', value: 185000, color: '#10B981' },
        { name: '2024', value: 95000, color: '#F59E0B' },
    ];

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

    const filterPayments = () => {
        if (searchQuery === '') {
            return payments;
        }

        return payments.filter(payment =>
            payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const downloadInvoice = (payment: Payment) => {
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

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
                    <select
                        value={viewType}
                        onChange={(e) => setViewType(e.target.value as 'monthly' | 'yearly')}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-fit"
                    >
                        <option value="monthly">Monthly View</option>
                        <option value="yearly">Yearly View</option>
                    </select>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by client name, project, or invoice number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* Payment Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-50">
                            <span className="text-2xl">💰</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Received</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ₹{payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-yellow-50">
                            <span className="text-2xl">⏳</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ₹{payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-50">
                            <span className="text-2xl">📊</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Payments</p>
                            <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-purple-50">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg Payment</p>
                            <p className="text-2xl font-bold text-gray-900">
                                ₹{Math.round(payments.reduce((sum, p) => sum + p.amount, 0) / payments.length).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Analytics - MOVED UP */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    Payment Analytics - {viewType === 'yearly' ? 'Yearly' : 'Monthly'} View
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pie Chart */}
                    <div>
                        <h3 className="text-md font-medium text-gray-700 mb-4">
                            {viewType === 'monthly' ? 'Monthly' : 'Yearly'} Revenue Distribution
                        </h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={viewType === 'monthly' ? monthlyData : yearlyData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(viewType === 'monthly' ? monthlyData : yearlyData).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Summary Stats */}
                    <div className="space-y-4">
                        <h3 className="text-md font-medium text-gray-700">Payment Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                <span className="text-sm font-medium text-green-700">Total Received</span>
                                <span className="text-lg font-bold text-green-800">
                                    ₹{payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                <span className="text-sm font-medium text-yellow-700">Pending Payments</span>
                                <span className="text-lg font-bold text-yellow-800">
                                    ₹{payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-medium text-blue-700">Average Payment</span>
                                <span className="text-lg font-bold text-blue-800">
                                    ₹{Math.round(payments.reduce((sum, p) => sum + p.amount, 0) / payments.length).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                <span className="text-sm font-medium text-purple-700">Active Installments</span>
                                <span className="text-lg font-bold text-purple-800">
                                    {payments.filter(p => p.currentInstallment < p.totalInstallments).length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Cards - MOVED DOWN */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
                <div className="grid gap-4">
                    {filterPayments()
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((payment) => (
                            <div key={payment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Client & Project Info */}
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{payment.clientName}</h3>
                                            <p className="text-sm text-gray-600">{payment.projectName}</p>
                                            <p className="text-xs text-gray-500 mt-1">Invoice: {payment.invoiceNumber}</p>
                                        </div>

                                        {/* Payment Details */}
                                        <div>
                                            <p className="text-lg font-bold text-gray-900">₹{payment.amount.toLocaleString()}</p>
                                            <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</p>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(payment.status)}`}>
                                                {payment.status}
                                            </span>
                                        </div>

                                        {/* Installment Info */}
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">Installment: {payment.installment}</p>
                                            <p className="text-sm text-gray-600">{payment.remaining}</p>
                                            <div className="mt-2">
                                                {payment.currentInstallment === payment.totalInstallments ? (
                                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                                        ✅ Completed
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        📊 {payment.totalInstallments - payment.currentInstallment} remaining
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-4 lg:mt-0 lg:ml-6 flex gap-2">
                                        <button
                                            onClick={() => downloadInvoice(payment)}
                                            className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm"
                                        >
                                            📄 Invoice
                                        </button>
                                        <button
                                            onClick={() => setSelectedPayment(payment)}
                                            className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Empty State */}
            {filterPayments().length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                    <p className="text-gray-500">
                        {searchQuery
                            ? `No results for "${searchQuery}". Try a different search term.`
                            : "No payment records available."
                        }
                    </p>
                </div>
            )}

            {/* Payment Details Modal */}
            {selectedPayment && (
                <PaymentDetailsModal
                    payment={selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                />
            )}
        </div>
    );
};

export default PaymentHistory;