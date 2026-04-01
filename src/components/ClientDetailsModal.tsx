import React, { useState, useEffect } from 'react';
import { Client, useClients } from '../contexts/ClientContext';
import { usePayments } from '../contexts/PaymentContext';
import { useToast } from '../contexts/ToastContext';

interface ClientDetailsModalProps {
    client: Client;
    mode: 'view' | 'edit';
    onClose: () => void;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ client, mode, onClose }) => {
    const { updateClient } = useClients();
    const { addPayment, updateClientNameInPayments } = usePayments();
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(mode === 'edit');
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    const [formData, setFormData] = useState({
        clientName: client.clientName,
        projectName: client.projectName,
        email: client.email,
        contact: client.contact,
        address: client.address,
        startDate: client.startDate,
        status: client.status,
        lastPayment: client.lastPayment,
        lastMeetNote: client.lastMeetNote,
    });

    const [paymentData, setPaymentData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        totalInstallments: '1',
        currentInstallment: '1',
        invoiceNumber: `INV-${Date.now()}`,
        description: '',
        paymentMethod: 'Bank Transfer',
    });

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.clientName || !formData.projectName || !formData.email || !formData.contact) {
            toast.warning('Please fill in all required fields');
            return;
        }
        
        // Check if client name or project name changed
        const oldClientName = client.clientName;
        const oldProjectName = client.projectName;
        const newClientName = formData.clientName;
        const newProjectName = formData.projectName;
        
        // Update client
        updateClient(client.id, formData);
        
        // Update all related payments if client name or project name changed
        if (oldClientName !== newClientName || oldProjectName !== newProjectName) {
            updateClientNameInPayments(oldClientName, newClientName, newProjectName);
        }
        
        setIsEditing(false);
        toast.success('Client updated successfully!');
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentData.amount || !paymentData.date) {
            toast.warning('Please fill in all required payment fields');
            return;
        }

        const totalInst = parseInt(paymentData.totalInstallments);
        const currentInst = parseInt(paymentData.currentInstallment);
        const remainingInst = totalInst - currentInst;

        const newPayment = {
            clientName: client.clientName,
            projectName: client.projectName,
            amount: parseFloat(paymentData.amount),
            date: paymentData.date,
            totalInstallments: totalInst,
            currentInstallment: currentInst,
            installment: `${currentInst}/${totalInst}`,
            remaining: remainingInst === 0 ? 'Project Completed' : `${remainingInst} installment${remainingInst > 1 ? 's' : ''} remaining`,
            invoiceNumber: paymentData.invoiceNumber,
            status: 'paid' as const,
            description: paymentData.description,
            paymentMethod: paymentData.paymentMethod,
        };

        addPayment(newPayment);
        updateClient(client.id, {
            lastPayment: `₹${paymentData.amount} - ${new Date(paymentData.date).toLocaleDateString()}`
        });

        toast.success('Payment added successfully!');
        setShowPaymentForm(false);
        setPaymentData({
            amount: '',
            date: new Date().toISOString().split('T')[0],
            totalInstallments: '1',
            currentInstallment: '1',
            invoiceNumber: `INV-${Date.now()}`,
            description: '',
            paymentMethod: 'Bank Transfer',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'live':
                return 'bg-green-100 text-green-800';
            case 'development':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getProjectDuration = () => {
        const start = new Date(client.startDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return `${diffDays} days`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months} month${months > 1 ? 's' : ''}`;
        } else {
            const years = Math.floor(diffDays / 365);
            const remainingMonths = Math.floor((diffDays % 365) / 30);
            return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
        }
    };

    return (
        <div 
            className={`fixed inset-0 bg-black transition-opacity duration-300 ease-out z-50 ${
                isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
            }`}
            onClick={handleClose}
        >
            <div 
                className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {isEditing ? 'Edit Client' : showPaymentForm ? 'Add Payment' : 'Client Details'}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">{client.clientName} - {client.projectName}</p>
                        </div>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-white rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {showPaymentForm ? (
                            <form onSubmit={handlePaymentSubmit} className="space-y-6 max-w-3xl mx-auto">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                    <p className="text-sm text-blue-800">
                                        <span className="font-semibold">Adding payment for:</span> {client.clientName} - {client.projectName}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Amount *</label>
                                        <input type="number" name="amount" required step="0.01" value={paymentData.amount} onChange={handlePaymentInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="5000.00" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date *</label>
                                        <input type="date" name="date" required value={paymentData.date} onChange={handlePaymentInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Installments *</label>
                                        <input type="number" name="totalInstallments" required min="1" value={paymentData.totalInstallments} onChange={handlePaymentInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Installment *</label>
                                        <input type="number" name="currentInstallment" required min="1" max={paymentData.totalInstallments} value={paymentData.currentInstallment} onChange={handlePaymentInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number *</label>
                                        <input type="text" name="invoiceNumber" required value={paymentData.invoiceNumber} onChange={handlePaymentInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method *</label>
                                        <select name="paymentMethod" value={paymentData.paymentMethod} onChange={handlePaymentInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="Credit Card">Credit Card</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Check">Check</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea name="description" value={paymentData.description} onChange={handlePaymentInputChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowPaymentForm(false)} className="flex-1 px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                    <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Payment</button>
                                </div>
                            </form>
                        ) : isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label><input type="text" name="clientName" required value={formData.clientName} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label><input type="text" name="projectName" required value={formData.projectName} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Contact *</label><input type="tel" name="contact" required value={formData.contact} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label><input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                                    <div><label className="block text-sm font-medium text-gray-700 mb-2">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg"><option value="development">Development</option><option value="live">Live</option><option value="completed">Completed</option></select></div>
                                </div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Address</label><textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 border rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Last Payment</label><input type="text" name="lastPayment" value={formData.lastPayment} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Last Meeting Note</label><textarea name="lastMeetNote" value={formData.lastMeetNote} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border rounded-lg" /></div>
                                <div className="flex gap-4"><button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-6 py-3 bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg">Save Changes</button></div>
                            </form>
                        ) : (
                            <div className="space-y-6 max-w-5xl mx-auto">
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
                                    <div className="flex justify-between mb-6">
                                        <h3 className="text-2xl font-bold">{client.projectName}</h3>
                                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(client.status)}`}>{client.status.toUpperCase()}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="bg-white bg-opacity-60 rounded-lg p-4"><p className="text-sm text-gray-600">Start Date</p><p className="text-lg font-semibold">{new Date(client.startDate).toLocaleDateString()}</p></div>
                                        <div className="bg-white bg-opacity-60 rounded-lg p-4"><p className="text-sm text-gray-600">Duration</p><p className="text-lg font-semibold">{getProjectDuration()}</p></div>
                                        <div className="bg-white bg-opacity-60 rounded-lg p-4"><p className="text-sm text-gray-600">Last Payment</p><p className="text-lg font-semibold">{client.lastPayment}</p></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="border rounded-xl p-6">
                                        <h4 className="text-lg font-bold mb-4">📞 Contact Information</h4>
                                        <div className="space-y-4">
                                            <div><p className="text-sm text-gray-600">Email</p><p>{client.email}</p></div>
                                            <div><p className="text-sm text-gray-600">Phone</p><p>{client.contact}</p></div>
                                            {client.address && <div><p className="text-sm text-gray-600">Address</p><p>{client.address}</p></div>}
                                        </div>
                                    </div>
                                    <div className="border rounded-xl p-6">
                                        <h4 className="text-lg font-bold mb-4">📊 Project Details</h4>
                                        <div className="space-y-4">
                                            <div><p className="text-sm text-gray-600">Status</p><span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(client.status)}`}>{client.status.toUpperCase()}</span></div>
                                            <div><p className="text-sm text-gray-600">Duration</p><p>{getProjectDuration()}</p></div>
                                        </div>
                                    </div>
                                </div>

                                {client.lastMeetNote && (
                                    <div className="border rounded-xl p-6">
                                        <h4 className="text-lg font-bold mb-4">📝 Last Meeting Note</h4>
                                        <div className="bg-gray-50 rounded-lg p-4"><p>{client.lastMeetNote}</p></div>
                                    </div>
                                )}

                                <div className="grid grid-cols-4 gap-4">
                                    <button onClick={() => setIsEditing(true)} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">✏️ Edit</button>
                                    <button onClick={() => setShowPaymentForm(true)} className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">💰 Add Payment</button>
                                    <button className="px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">📧 Email</button>
                                    <button className="px-4 py-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100">📅 Schedule</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailsModal;


