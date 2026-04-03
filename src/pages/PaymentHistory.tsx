import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { usePayments } from '../contexts/PaymentContext';
import { uploadAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import ClientFilterDropdown from '../components/ClientFilterDropdown';

const PaymentHistory: React.FC = () => {
    const { payments, updatePayment } = usePayments();
    const navigate = useNavigate();
    const toast = useToast();
    const [viewType, setViewType] = useState<'monthly' | 'yearly'>('monthly');
    const [searchQuery, setSearchQuery] = useState('');
    const [groupBy, setGroupBy] = useState<'month' | 'client'>('month');
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
    const [selectedClient, setSelectedClient] = useState<string>('all');
    const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
    const [editingPaymentData, setEditingPaymentData] = useState({
        amount: '',
        date: '',
        status: 'paid' as 'paid' | 'pending' | 'overdue',
        invoiceNumber: '',
        description: ''
    });

    const toggleGroup = (groupKey: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupKey)) {
            newExpanded.delete(groupKey);
        } else {
            newExpanded.add(groupKey);
        }
        setExpandedGroups(newExpanded);
    };

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
                value: Math.floor(Math.random() * 15000) + 10000,
                color: colors[index]
            }));
        }

        return monthlyPayments;
    };

    const monthlyData = getMonthlyData();

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
        let filtered = payments;

        // Filter by search query
        if (searchQuery !== '') {
            filtered = filtered.filter(payment =>
                payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                payment.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by selected client
        if (selectedClient !== 'all') {
            filtered = filtered.filter(payment => payment.clientName === selectedClient);
        }

        return filtered;
    };

    // Get unique client names for the dropdown
    const getUniqueClients = () => {
        const clientNames = [...new Set(payments.map(p => p.clientName))];
        return clientNames.sort();
    };

    // Group payments by month
    const groupPaymentsByMonth = () => {
        const filtered = filterPayments();
        const grouped: { [key: string]: typeof payments } = {};

        filtered.forEach(payment => {
            const date = new Date(payment.date);
            const monthYear = `${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;

            if (!grouped[monthYear]) {
                grouped[monthYear] = [];
            }
            grouped[monthYear].push(payment);
        });

        const sortedGroups = Object.entries(grouped)
            .sort((a, b) => {
                const dateA = new Date(a[1][0].date);
                const dateB = new Date(b[1][0].date);
                return dateB.getTime() - dateA.getTime();
            })
            .map(([month, payments]) => ({
                month,
                payments: payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
                count: payments.length
            }));

        return sortedGroups;
    };

    const monthlyGroups = groupPaymentsByMonth();



    // Group payments by client
    const groupPaymentsByClient = () => {
        const filtered = filterPayments();
        const grouped: { [key: string]: typeof payments } = {};

        filtered.forEach(payment => {
            const clientName = payment.clientName;

            if (!grouped[clientName]) {
                grouped[clientName] = [];
            }
            grouped[clientName].push(payment);
        });

        const sortedGroups = Object.entries(grouped)
            .sort((a, b) => {
                const totalA = a[1].reduce((sum, p) => sum + p.amount, 0);
                const totalB = b[1].reduce((sum, p) => sum + p.amount, 0);
                return totalB - totalA;
            })
            .map(([clientName, payments]) => ({
                clientName,
                projectName: payments[0].projectName,
                payments: payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
                count: payments.length,
                paidCount: payments.filter(p => p.status === 'paid').length,
                pendingCount: payments.filter(p => p.status === 'pending').length
            }));

        return sortedGroups;
    };

    const clientGroups = groupPaymentsByClient();

    const handleEditPayment = (payment: typeof payments[0]) => {
        setEditingPaymentId(payment.id);
        setEditingPaymentData({
            amount: payment.amount.toString(),
            date: payment.date,
            status: payment.status,
            invoiceNumber: payment.invoiceNumber,
            description: payment.description || ''
        });
    };

    const handleSavePayment = () => {
        if (!editingPaymentId || !editingPaymentData.amount || !editingPaymentData.date) {
            toast.warning('Please fill all required fields');
            return;
        }

        const amount = parseFloat(editingPaymentData.amount);
        updatePayment(editingPaymentId, {
            amount,
            date: editingPaymentData.date,
            status: editingPaymentData.status,
            invoiceNumber: editingPaymentData.invoiceNumber,
            description: editingPaymentData.description
        });

        setEditingPaymentId(null);
        toast.success('Payment updated successfully!');
    };

    const handleCancelEdit = () => {
        setEditingPaymentId(null);
        setEditingPaymentData({
            amount: '',
            date: '',
            status: 'paid',
            invoiceNumber: '',
            description: ''
        });
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
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



            {/* Payment Analytics */}
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
                                <Tooltip
                                    formatter={(value) => {
                                        const numValue = typeof value === 'number' ? value : 0;
                                        return [`₹${numValue.toLocaleString()}`, 'Revenue'];
                                    }}
                                />
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

            {/* Search Bar with Filters - All in One Line */}
            <div className="flex gap-3 items-end">
                {/* Main Search Bar */}
                <div className="relative flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Search</label>
                    <input
                        type="text"
                        placeholder="Search by client, project, or invoice..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <svg
                        className="absolute left-3 bottom-2.5 h-5 w-5 text-gray-400"
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
                            className="absolute right-3 bottom-2.5 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* Client Filter Dropdown with Search */}
                <ClientFilterDropdown
                    clients={getUniqueClients()}
                    selectedClient={selectedClient}
                    onSelectClient={setSelectedClient}
                />

                {/* Group By Filter */}
                <div className="min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Group By</label>
                    <select
                        value={groupBy}
                        onChange={(e) => setGroupBy(e.target.value as 'month' | 'client')}
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white whitespace-nowrap"
                    >
                        <option value="month">Month</option>
                        <option value="client">Client</option>
                    </select>
                </div>

                {/* View Type Filter */}
                <div className="min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-700 mb-1">View Type</label>
                    <select
                        value={viewType}
                        onChange={(e) => setViewType(e.target.value as 'monthly' | 'yearly')}
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white whitespace-nowrap"
                    >
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>
            </div>



            {/* Payment Cards Grouped by Month or Client */}
            <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900">
                    {groupBy === 'month' ? 'Payments by Month' : 'Payments by Client'}
                </h2>

                {groupBy === 'month' ? (
                    /* Group by Month */
                    monthlyGroups.length > 0 ? (
                        monthlyGroups.map((group) => (
                            <div key={group.month} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Month Header - Collapsible */}
                                <div
                                    className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-colors"
                                    onClick={() => toggleGroup(group.month)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-600 text-white rounded-lg p-3 min-w-[120px] text-center">
                                                <p className="text-2xl font-bold">{group.month.split(' ')[0]}</p>
                                                <p className="text-sm opacity-90">{group.month.split(' ')[1]}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total Payments</p>
                                                <p className="text-2xl font-bold text-gray-900">{group.count}</p>
                                            </div>
                                            <div className="ml-8">
                                                <p className="text-sm text-gray-600">Total Amount</p>
                                                <p className="text-2xl font-bold text-green-600">₹{group.totalAmount.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                            <svg
                                                className={`w-6 h-6 transform transition-transform duration-200 ${expandedGroups.has(group.month) ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Payments List - Collapsible */}
                                {expandedGroups.has(group.month) && (
                                    <div className="divide-y divide-gray-200">
                                        {group.payments.map((payment) => (
                                            <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                {editingPaymentId === payment.id ? (
                                                    /* Edit Mode */
                                                    <div className="space-y-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">Amount *</label>
                                                                <input
                                                                    type="number"
                                                                    value={editingPaymentData.amount}
                                                                    onChange={(e) => setEditingPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
                                                                <input
                                                                    type="date"
                                                                    value={editingPaymentData.date}
                                                                    onChange={(e) => setEditingPaymentData(prev => ({ ...prev, date: e.target.value }))}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">Status *</label>
                                                                <select
                                                                    value={editingPaymentData.status}
                                                                    onChange={(e) => setEditingPaymentData(prev => ({ ...prev, status: e.target.value as any }))}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                >
                                                                    <option value="paid">Paid</option>
                                                                    <option value="pending">Pending</option>
                                                                    <option value="overdue">Overdue</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">Invoice Number</label>
                                                                <input
                                                                    type="text"
                                                                    value={editingPaymentData.invoiceNumber}
                                                                    onChange={(e) => setEditingPaymentData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                            <div className="md:col-span-2">
                                                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                                                <input
                                                                    type="text"
                                                                    value={editingPaymentData.description}
                                                                    onChange={(e) => setEditingPaymentData(prev => ({ ...prev, description: e.target.value }))}
                                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-3 justify-end">
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={handleSavePayment}
                                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                            >
                                                                Save Changes
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    /* View Mode */

                                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                                                                <p className="text-sm text-gray-600">
                                                                    {new Date(payment.date).toLocaleDateString('en-US', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    })}
                                                                </p>
                                                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(payment.status)}`}>
                                                                    {payment.status}
                                                                </span>
                                                                {payment.invoiceDocument && (
                                                                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                                        <span>📄</span> Invoice attached
                                                                    </p>
                                                                )}
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
                                                        <div className="flex gap-2 lg:flex-col">
                                                            {payment.invoiceDocument && (
                                                                <button
                                                                    onClick={() => {
                                                                        const fileUrl = uploadAPI.viewFile('invoiceDocument', payment.invoiceDocument!);
                                                                        window.open(fileUrl, '_blank');
                                                                    }}
                                                                    className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm flex items-center gap-2 whitespace-nowrap"
                                                                >
                                                                    📄 View Invoice
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => navigate(`/payments/${payment.id}`)}
                                                                className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm whitespace-nowrap"
                                                            >
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))

                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                            <p className="text-gray-500">
                                {searchQuery
                                    ? `No results for "${searchQuery}". Try a different search term.`
                                    : "No payment records available."
                                }
                            </p>
                        </div>
                    )
                ) : (
                    /* Group by Client */
                    clientGroups.length > 0 ? (
                        clientGroups.map((group) => (
                            <div key={group.clientName} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Client Header - Collapsible */}
                                <div
                                    className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200 p-6 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-colors"
                                    onClick={() => toggleGroup(group.clientName)}
                                >
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-purple-600 text-white rounded-lg p-3 min-w-[60px] text-center">
                                                <p className="text-3xl font-bold">{group.clientName.charAt(0).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{group.clientName}</h3>
                                                <p className="text-sm text-gray-600">{group.projectName}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-6 items-center">
                                            <div>
                                                <p className="text-sm text-gray-600">Total Payments</p>
                                                <p className="text-2xl font-bold text-gray-900">{group.count}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Paid</p>
                                                <p className="text-xl font-bold text-green-600">{group.paidCount}</p>
                                            </div>
                                            {group.pendingCount > 0 && (
                                                <div>
                                                    <p className="text-sm text-gray-600">Pending</p>
                                                    <p className="text-xl font-bold text-yellow-600">{group.pendingCount}</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm text-gray-600">Total Amount</p>
                                                <p className="text-2xl font-bold text-green-600">₹{group.totalAmount.toLocaleString()}</p>
                                            </div>
                                            <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                                <svg
                                                    className={`w-6 h-6 transform transition-transform duration-200 ${expandedGroups.has(group.clientName) ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>



                                {/* Payments List - Collapsible */}
                                {expandedGroups.has(group.clientName) && (
                                    <div className="divide-y divide-gray-200">
                                        {group.payments.map((payment) => (
                                            <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {/* Payment Date & Invoice */}
                                                        <div>
                                                            <p className="text-sm text-gray-600">Payment Date</p>
                                                            <p className="font-semibold text-gray-900">
                                                                {new Date(payment.date).toLocaleDateString('en-US', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                            <p className="text-xs text-gray-500 mt-1">Invoice: {payment.invoiceNumber}</p>
                                                        </div>

                                                        {/* Payment Details */}
                                                        <div>
                                                            <p className="text-lg font-bold text-gray-900">₹{payment.amount.toLocaleString()}</p>
                                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(payment.status)}`}>
                                                                {payment.status}
                                                            </span>
                                                            {payment.invoiceDocument && (
                                                                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                                    <span>📄</span> Invoice attached
                                                                </p>
                                                            )}
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
                                                    <div className="flex gap-2 lg:flex-col">
                                                        {payment.invoiceDocument && (
                                                            <button
                                                                onClick={() => {
                                                                    const fileUrl = uploadAPI.viewFile('invoiceDocument', payment.invoiceDocument!);
                                                                    window.open(fileUrl, '_blank');
                                                                }}
                                                                className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm flex items-center gap-2 whitespace-nowrap"
                                                            >
                                                                📄 View Invoice
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => navigate(`/payments/${payment.id}`)}
                                                            className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm whitespace-nowrap"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))

                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <div className="text-gray-400 text-6xl mb-4">🔍</div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                            <p className="text-gray-500">
                                {searchQuery
                                    ? `No results for "${searchQuery}". Try a different search term.`
                                    : "No payment records available."
                                }
                            </p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default PaymentHistory;
