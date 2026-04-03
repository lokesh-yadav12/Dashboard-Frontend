import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useClients, MeetingNote, ClientPayment, ClientDocument } from '../contexts/ClientContext';
import { usePayments } from '../contexts/PaymentContext';
import { uploadAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import PromptModal from '../components/PromptModal';
import ConfirmModal from '../components/ConfirmModal';

interface DocumentWithName {
    file: File;
    customName: string;
}

const ClientDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { clients, updateClient } = useClients();
    const { addPayment, updateClientNameInPayments, payments: allPayments, updatePayment } = usePayments();
    const toast = useToast();
    
    const client = clients.find(c => c.id === Number(id));
    const [isEditing, setIsEditing] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showAddNoteForm, setShowAddNoteForm] = useState(false);
    const [showPaymentHistory, setShowPaymentHistory] = useState(false);
    const [showMeetingNotes, setShowMeetingNotes] = useState(false);
    
    // Modal states
    const [promptModal, setPromptModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        defaultValue: string;
        onConfirm: (value: string) => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        defaultValue: '',
        onConfirm: () => {}
    });
    
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });
    const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);
    const [editingPaymentData, setEditingPaymentData] = useState<{
        amount: string;
        date: string;
        status: 'paid' | 'pending' | 'overdue';
    }>({
        amount: '',
        date: '',
        status: 'paid'
    });

    const [formData, setFormData] = useState({
        clientName: client?.clientName || '',
        projectName: client?.projectName || '',
        projectBoughtBy: client?.projectBoughtBy || '',
        gstnNumber: client?.gstnNumber || '',
        email: client?.email || '',
        contact: client?.contact || '',
        address: client?.address || '',
        startDate: client?.startDate || '',
        status: client?.status || 'development',
        lastPayment: client?.lastPayment || '',
        lastMeetNote: client?.lastMeetNote || '',
        maintenanceStartDate: client?.maintenanceStartDate || '',
    });

    const [existingDocuments, setExistingDocuments] = useState<ClientDocument[]>(client?.documents || []);
    const [newDocuments, setNewDocuments] = useState<DocumentWithName[]>([]);

    const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
    const [editingNoteText, setEditingNoteText] = useState('');

    const [noteFormData, setNoteFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        note: '',
    });

    const [paymentData, setPaymentData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        totalInstallments: client?.totalInstallments?.toString() || '',
        currentInstallment: client?.payments ? (client.payments.length + 1).toString() : '1',
        invoiceNumber: `INV-${Date.now()}`,
        description: '',
        paymentMethod: 'Bank Transfer',
        invoiceDocument: null as File | null,
    });

    if (!client) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Not Found</h2>
                    <button
                        onClick={() => navigate('/clients')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Clients
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPaymentData(prev => ({ ...prev, [name]: value }));
    };

    const handleInvoiceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setPaymentData(prev => ({ ...prev, invoiceDocument: file }));
    };

    const handleNoteInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNoteFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!client) return;

        const newNote: MeetingNote = {
            id: Date.now(),
            date: noteFormData.date,
            note: noteFormData.note,
        };

        const existingNotes = client.meetingNotes || [];
        const updatedNotes = [...existingNotes, newNote].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        updateClient(client.id, {
            meetingNotes: updatedNotes,
            lastMeetNote: noteFormData.note
        });

        setNoteFormData({
            date: new Date().toISOString().split('T')[0],
            note: '',
        });
        setShowAddNoteForm(false);
        toast.success('Meeting note added successfully!');
    };

    const handleEditNote = (noteId: number, currentNote: string) => {
        setEditingNoteId(noteId);
        setEditingNoteText(currentNote);
    };

    const handleSaveNote = (noteId: number) => {
        if (!client) return;

        const updatedNotes = client.meetingNotes?.map(note =>
            note.id === noteId ? { ...note, note: editingNoteText } : note
        );

        updateClient(client.id, {
            meetingNotes: updatedNotes
        });

        setEditingNoteId(null);
        setEditingNoteText('');
    };

    const handleDeleteNote = (noteId: number) => {
        if (!client) return;
        
        setConfirmModal({
            isOpen: true,
            title: 'Delete Meeting Note',
            message: 'Are you sure you want to delete this meeting note? This action cannot be undone.',
            onConfirm: () => {
                const updatedNotes = client.meetingNotes?.filter(note => note.id !== noteId);
                updateClient(client.id, {
                    meetingNotes: updatedNotes
                });
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                toast.success('Meeting note deleted successfully!');
            }
        });
    };

    const handleEditPayment = (paymentId: number) => {
        const payment = allPayments.find(p => p.id === paymentId);
        if (payment) {
            setEditingPaymentId(paymentId);
            setEditingPaymentData({
                amount: payment.amount.toString(),
                date: payment.date,
                status: payment.status
            });
        }
    };

    const handleSavePayment = (paymentId: number) => {
        if (!editingPaymentData.amount || !editingPaymentData.date) {
            toast.warning('Please fill all required fields');
            return;
        }

        const amount = parseFloat(editingPaymentData.amount);
        updatePayment(paymentId, {
            amount,
            date: editingPaymentData.date,
            status: editingPaymentData.status
        });

        // Update client's payment record
        if (client) {
            const updatedClientPayments = client.payments?.map(p => 
                p.id === paymentId 
                    ? { ...p, amount: `₹${amount}`, date: editingPaymentData.date }
                    : p
            );
            updateClient(client.id, { payments: updatedClientPayments });
        }

        setEditingPaymentId(null);
        toast.success('Payment updated successfully!');
    };

    const handleCancelEditPayment = () => {
        setEditingPaymentId(null);
        setEditingPaymentData({ amount: '', date: '', status: 'paid' });
    };

    const handleAddDocument = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
        input.onchange = (e: Event) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setPromptModal({
                    isOpen: true,
                    title: 'Name Your Document',
                    message: 'Enter a custom name for this document:',
                    defaultValue: file.name.split('.')[0],
                    onConfirm: (customName: string) => {
                        setNewDocuments(prev => [...prev, { file, customName }]);
                        setPromptModal(prev => ({ ...prev, isOpen: false }));
                        toast.success('Document added successfully!');
                    }
                });
            }
        };
        input.click();
    };

    const handleRemoveDocument = (index: number) => {
        setNewDocuments(prev => prev.filter((_, i) => i !== index));
        toast.info('Document removed');
    };

    const handleEditDocumentName = (index: number) => {
        setPromptModal({
            isOpen: true,
            title: 'Rename Document',
            message: 'Enter a new name for this document:',
            defaultValue: newDocuments[index].customName,
            onConfirm: (newName: string) => {
                setNewDocuments(prev => prev.map((doc, i) => 
                    i === index ? { ...doc, customName: newName } : doc
                ));
                setPromptModal(prev => ({ ...prev, isOpen: false }));
                toast.success('Document renamed successfully!');
            }
        });
    };

    const handleRemoveExistingDocument = (docId: number) => {
        setConfirmModal({
            isOpen: true,
            title: 'Remove Document',
            message: 'Are you sure you want to remove this document?',
            onConfirm: () => {
                setExistingDocuments(prev => prev.filter(doc => doc.id !== docId));
                setConfirmModal(prev => ({ ...prev, isOpen: false }));
                toast.success('Document removed successfully!');
            }
        });
    };

    const handleEditExistingDocumentName = (docId: number) => {
        const doc = existingDocuments.find(d => d.id === docId);
        if (doc) {
            setPromptModal({
                isOpen: true,
                title: 'Rename Document',
                message: 'Enter a new name for this document:',
                defaultValue: doc.name,
                onConfirm: (newName: string) => {
                    setExistingDocuments(prev => prev.map(d => 
                        d.id === docId ? { ...d, name: newName } : d
                    ));
                    setPromptModal(prev => ({ ...prev, isOpen: false }));
                    toast.success('Document renamed successfully!');
                }
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Check if client name or project name changed
            const oldClientName = client.clientName;
            const oldProjectName = client.projectName;
            const newClientName = formData.clientName;
            const newProjectName = formData.projectName;
            
            const uploadedDocuments: ClientDocument[] = [];

            // Upload all new documents
            for (const doc of newDocuments) {
                const response = await uploadAPI.uploadFile(doc.file, 'clientDocument');
                uploadedDocuments.push({
                    id: Date.now() + Math.random(),
                    name: doc.customName,
                    fileName: response.data.data.fileName,
                    uploadDate: new Date().toISOString()
                });
            }

            // Merge existing documents with newly uploaded ones
            const allDocuments = [...existingDocuments, ...uploadedDocuments];
            
            const updatedData = {
                ...formData,
                documents: allDocuments
            };
            
            // Update client
            updateClient(client.id, updatedData);
            
            // Update all related payments if client name or project name changed
            if (oldClientName !== newClientName || oldProjectName !== newProjectName) {
                updateClientNameInPayments(oldClientName, newClientName, newProjectName);
            }
            
            setIsEditing(false);
            setNewDocuments([]);
            toast.success('Client updated successfully!');
        } catch (error: unknown) {
            console.error('Error updating client:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to update client';
            toast.error(`Error: ${errorMessage}`);
        }
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!paymentData.invoiceDocument) {
            toast.warning('Please upload an invoice document');
            return;
        }

        if (!paymentData.totalInstallments) {
            toast.warning('Please enter total installments');
            return;
        }

        try {
            // Upload invoice document
            const uploadResponse = await uploadAPI.uploadFile(paymentData.invoiceDocument, 'invoiceDocument');
            const invoiceDocName = uploadResponse.data.data.fileName;

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
                invoiceDocument: invoiceDocName,
            };

            addPayment(newPayment);

            // Add payment to client's payments array
            const newClientPayment: ClientPayment = {
                id: Date.now(),
                amount: `₹${paymentData.amount}`,
                date: paymentData.date
            };

            const updatedPayments = [...(client.payments || []), newClientPayment];

            updateClient(client.id, {
                lastPayment: `₹${paymentData.amount} - ${new Date(paymentData.date).toLocaleDateString()}`,
                payments: updatedPayments,
                totalInstallments: totalInst
            });

            toast.success('Payment added successfully!');
            setShowPaymentForm(false);
            
            // Reset form with updated values
            setPaymentData({
                amount: '',
                date: new Date().toISOString().split('T')[0],
                totalInstallments: totalInst.toString(),
                currentInstallment: (currentInst + 1).toString(),
                invoiceNumber: `INV-${Date.now()}`,
                description: '',
                paymentMethod: 'Bank Transfer',
                invoiceDocument: null,
            });
        } catch (error) {
            console.error('Error adding payment:', error);
            toast.error('Error uploading invoice. Please try again.');
        }
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
        <div className="p-6 space-y-6">
            {/* Modals */}
            <PromptModal
                isOpen={promptModal.isOpen}
                title={promptModal.title}
                message={promptModal.message}
                defaultValue={promptModal.defaultValue}
                onConfirm={promptModal.onConfirm}
                onCancel={() => setPromptModal(prev => ({ ...prev, isOpen: false }))}
                placeholder="Enter document name"
            />
            
            <ConfirmModal
                isOpen={confirmModal.isOpen}
                title={confirmModal.title}
                message={confirmModal.message}
                onConfirm={confirmModal.onConfirm}
                onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                type="danger"
            />
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/clients')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Edit Client' : showPaymentForm ? 'Add Payment' : showAddNoteForm ? 'Add Meeting Note' : 'Client Details'}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">{client.clientName} - {client.projectName}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {showAddNoteForm ? (
                /* Add Meeting Note Form */
                <form onSubmit={handleAddNote} className="space-y-6 max-w-3xl">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">Adding meeting note for:</span> {client.clientName} - {client.projectName}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Date *</label>
                                <input 
                                    type="date" 
                                    name="date" 
                                    required 
                                    value={noteFormData.date} 
                                    onChange={handleNoteInputChange} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Notes *</label>
                                <textarea 
                                    name="note" 
                                    required 
                                    value={noteFormData.note} 
                                    onChange={handleNoteInputChange} 
                                    rows={6} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter meeting notes, discussion points, action items, etc."
                                />
                            </div>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button type="button" onClick={() => setShowAddNoteForm(false)} className="flex-1 px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                            <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Note</button>
                        </div>
                    </div>
                </form>
            ) : showPaymentForm ? (
                /* Payment Form */
                <form onSubmit={handlePaymentSubmit} className="space-y-6 max-w-3xl">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">Adding payment for:</span> {client.clientName} - {client.projectName}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                                <input 
                                    type="number" 
                                    name="totalInstallments" 
                                    required 
                                    min="1" 
                                    value={paymentData.totalInstallments} 
                                    onChange={handlePaymentInputChange} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    disabled={!!client.totalInstallments}
                                />
                                {client.totalInstallments && (
                                    <p className="text-xs text-gray-500 mt-1">Total installments is fixed. Edit client to change.</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Current Installment *</label>
                                <input 
                                    type="number" 
                                    name="currentInstallment" 
                                    required 
                                    min="1" 
                                    max={paymentData.totalInstallments} 
                                    value={paymentData.currentInstallment} 
                                    onChange={handlePaymentInputChange} 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">Auto-incremented based on previous payments</p>
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
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Document *</label>
                                <input 
                                    type="file" 
                                    required
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={handleInvoiceFileChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Upload invoice (PDF, DOC, DOCX, JPG, PNG)</p>
                                {paymentData.invoiceDocument && (
                                    <p className="text-xs text-green-600 mt-1">✓ {paymentData.invoiceDocument.name}</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea name="description" value={paymentData.description} onChange={handlePaymentInputChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button type="button" onClick={() => setShowPaymentForm(false)} className="flex-1 px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                            <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Payment</button>
                        </div>
                    </div>
                </form>
            ) : isEditing ? (
                /* Edit Form */
                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label><input type="text" name="clientName" required value={formData.clientName} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label><input type="text" name="projectName" required value={formData.projectName} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Project Bought By *</label><input type="text" name="projectBoughtBy" required value={formData.projectBoughtBy} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" placeholder="Person who purchased the project" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">GSTN Number *</label><input type="text" name="gstnNumber" required value={formData.gstnNumber} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" placeholder="e.g., 29ABCDE1234F1Z5" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Contact *</label><input type="tel" name="contact" required value={formData.contact} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label><input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg"><option value="development">Development</option><option value="live">Live</option><option value="completed">Completed</option></select></div>
                            {(formData.status === 'live' || formData.status === 'completed') && (
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Start Date</label><input type="date" name="maintenanceStartDate" value={formData.maintenanceStartDate} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            )}
                        </div>
                        <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Address</label><textarea name="address" value={formData.address} onChange={handleInputChange} rows={3} className="w-full px-4 py-3 border rounded-lg" /></div>
                        <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Last Payment</label><input type="text" name="lastPayment" value={formData.lastPayment} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                        <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Last Meeting Note</label><textarea name="lastMeetNote" value={formData.lastMeetNote} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border rounded-lg" /></div>
                        
                        {/* Documents Section */}
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Documents
                                </label>
                                <button
                                    type="button"
                                    onClick={handleAddDocument}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    + Add Document
                                </button>
                            </div>

                            {/* Existing Documents */}
                            {existingDocuments.length > 0 && (
                                <div className="mb-3">
                                    <p className="text-xs text-gray-600 mb-2 font-medium">Existing Documents:</p>
                                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                        {existingDocuments.map((doc) => (
                                            <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <span className="text-blue-600">📄</span>
                                                    <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                                                    <span className="text-xs text-gray-500">
                                                        ({new Date(doc.uploadDate).toLocaleDateString()})
                                                    </span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditExistingDocumentName(doc.id)}
                                                        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                                    >
                                                        ✏️ Rename
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingDocument(doc.id)}
                                                        className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
                                                    >
                                                        🗑️ Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Documents */}
                            {newDocuments.length > 0 && (
                                <div>
                                    <p className="text-xs text-gray-600 mb-2 font-medium">New Documents to Upload:</p>
                                    <div className="space-y-2 max-h-40 overflow-y-auto border border-green-200 rounded-lg p-3 bg-green-50">
                                        {newDocuments.map((doc, index) => (
                                            <div key={index} className="flex items-center justify-between bg-white p-2 rounded">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <span className="text-green-600">📄</span>
                                                    <span className="text-sm font-medium text-gray-900">{doc.customName}</span>
                                                    <span className="text-xs text-gray-500">({doc.file.name})</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEditDocumentName(index)}
                                                        className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                                    >
                                                        ✏️ Rename
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveDocument(index)}
                                                        className="px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
                                                    >
                                                        🗑️ Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {existingDocuments.length === 0 && newDocuments.length === 0 && (
                                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-sm text-gray-500">No documents added yet</p>
                                    <p className="text-xs text-gray-400 mt-1">Click "Add Document" to upload files</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-4 mt-6"><button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-6 py-3 bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg">Save Changes</button></div>
                    </div>
                </form>
            ) : (
                /* View Details */
                <div className="space-y-6 max-w-6xl">
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
                        {(client.status === 'live' || client.status === 'completed') && client.maintenanceStartDate && (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🔧</span>
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Maintenance Period</p>
                                        <p className="text-lg font-bold text-green-900">Started: {new Date(client.maintenanceStartDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white border rounded-xl p-6">
                            <h4 className="text-lg font-bold mb-4">📞 Contact Information</h4>
                            <div className="space-y-4">
                                <div><p className="text-sm text-gray-600">Project Bought By</p><p className="font-semibold text-blue-600">{client.projectBoughtBy}</p></div>
                                <div><p className="text-sm text-gray-600">GSTN Number</p><p className="font-semibold">{client.gstnNumber}</p></div>
                                <div><p className="text-sm text-gray-600">Email</p><p>{client.email}</p></div>
                                <div><p className="text-sm text-gray-600">Phone</p><p>{client.contact}</p></div>
                                {client.address && <div><p className="text-sm text-gray-600">Address</p><p>{client.address}</p></div>}
                            </div>
                        </div>
                        <div className="bg-white border rounded-xl p-6">
                            <h4 className="text-lg font-bold mb-4">📊 Project Details</h4>
                            <div className="space-y-4">
                                <div><p className="text-sm text-gray-600">Status</p><span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(client.status)}`}>{client.status.toUpperCase()}</span></div>
                                <div><p className="text-sm text-gray-600">Duration</p><p>{getProjectDuration()}</p></div>
                                {client.documents && client.documents.length > 0 && (
                                    <div>
                                        <p className="text-md text-gray-600 mb-2">Documents</p>
                                        <div className="space-y-2">
                                            {client.documents.map((doc) => (
                                                <button
                                                    key={doc.id}
                                                    onClick={() => {
                                                        const fileUrl = uploadAPI.viewFile('clientDocument', doc.fileName);
                                                        window.open(fileUrl, '_blank');
                                                    }}
                                                    className="w-full text-left text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2  p-2 rounded transition-colors"
                                                >
                                                    <span>📄</span>
                                                    <span className="font-medium">{doc.name}</span>
                                                    <span className="text-xs text-gray-500 ml-auto">
                                                        {new Date(doc.uploadDate).toLocaleDateString()}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* All Payments Section */}
                    {client.payments && client.payments.length > 0 && (
                        <div className="bg-white border rounded-xl overflow-hidden">
                            <div 
                                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                            >
                                <h4 className="text-lg font-bold">💰 Payment History ({client.payments.length})</h4>
                                <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                    <svg 
                                        className={`w-6 h-6 transform transition-transform duration-200 ${showPaymentHistory ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                            {showPaymentHistory && (
                                <div className="px-6 pb-6 space-y-3 border-t border-gray-200 pt-4">
                                    {client.payments
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map((payment, index) => {
                                            // Find full payment details from allPayments
                                            const fullPayment = allPayments.find(p => p.id === payment.id);
                                            
                                            return (
                                        <div key={payment.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                                            {editingPaymentId === payment.id ? (
                                                <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Amount</label>
                                                        <input
                                                            type="number"
                                                            value={editingPaymentData.amount}
                                                            onChange={(e) => setEditingPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                            placeholder="5000"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-600 mb-1">Date</label>
                                                        <input
                                                            type="date"
                                                            value={editingPaymentData.date}
                                                            onChange={(e) => setEditingPaymentData(prev => ({ ...prev, date: e.target.value }))}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleSavePayment(payment.id)}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEditPayment}
                                                            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-2xl font-bold text-green-600">{index + 1}</span>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{payment.amount}</p>
                                                            <p className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString('en-US', { 
                                                                weekday: 'short',
                                                                year: 'numeric', 
                                                                month: 'short', 
                                                                day: 'numeric' 
                                                            })}</p>
                                                            {fullPayment?.paymentMethod && (
                                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                                    <span>💳</span> {fullPayment.paymentMethod}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEditPayment(payment.id)}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                                        >
                                                            ✏️ Edit
                                                        </button>
                                                        <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-medium">
                                                            Paid
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {client.meetingNotes && client.meetingNotes.length > 0 ? (
                        <div className="bg-white border rounded-xl overflow-hidden">
                            <div 
                                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setShowMeetingNotes(!showMeetingNotes)}
                            >
                                <h4 className="text-lg font-bold">📝 Meeting Notes History ({client.meetingNotes.length})</h4>
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowAddNoteForm(true);
                                        }}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                    >
                                        + Add Note
                                    </button>
                                    <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                        <svg 
                                            className={`w-6 h-6 transform transition-transform duration-200 ${showMeetingNotes ? 'rotate-180' : ''}`}
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {showMeetingNotes && (
                                <div className="px-6 pb-6 space-y-4 border-t border-gray-200 pt-4">
                                    {client.meetingNotes
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map((note, index) => (
                                        <div key={note.id} className="border-l-4 border-blue-500 bg-gray-50 rounded-lg p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-2xl font-bold text-blue-600">{index + 1}</span>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {new Date(note.date).toLocaleDateString('en-US', { 
                                                                weekday: 'short',
                                                                year: 'numeric', 
                                                                month: 'short', 
                                                                day: 'numeric' 
                                                            })}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {Math.abs(Math.floor((new Date().getTime() - new Date(note.date).getTime()) / (1000 * 60 * 60 * 24)))} days ago
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {editingNoteId === note.id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleSaveNote(note.id)}
                                                                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingNoteId(null)}
                                                                className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleEditNote(note.id, note.note)}
                                                                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteNote(note.id)}
                                                                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </>
                                                    )}
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                        📅 Meeting #{index + 1}
                                                    </span>
                                                </div>
                                            </div>
                                            {editingNoteId === note.id ? (
                                                <textarea
                                                    value={editingNoteText}
                                                    onChange={(e) => setEditingNoteText(e.target.value)}
                                                    className="w-full ml-11 px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    rows={4}
                                                />
                                            ) : (
                                                <p className="text-gray-700 ml-11">{note.note}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white border rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-bold">📝 Meeting Notes History</h4>
                                <button 
                                    onClick={() => setShowAddNoteForm(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                >
                                    + Add Note
                                </button>
                            </div>
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-4xl mb-3">📝</div>
                                <p className="text-gray-500">No meeting notes yet. Add your first note!</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-4 gap-4">
                        <button onClick={() => setIsEditing(true)} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">✏️ Edit</button>
                        <button onClick={() => setShowPaymentForm(true)} className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">💰 Add Payment</button>
                        <button onClick={() => setShowAddNoteForm(true)} className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">📝 Add Note</button>
                        <button className="px-4 py-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100">📧 Email</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDetails;
