import React, { useState } from 'react';
import { useClients, ClientDocument } from '../contexts/ClientContext';
import { useToast } from '../contexts/ToastContext';
import { uploadAPI } from '../services/api';
import PromptModal from './PromptModal';

interface AddClientModalProps {
    onClose: () => void;
}

interface DocumentWithName {
    file: File;
    customName: string;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose }) => {
    const { addClient } = useClients();
    const toast = useToast();
    const [documents, setDocuments] = useState<DocumentWithName[]>([]);
    
    // Modal state for document naming
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
    const [formData, setFormData] = useState({
        clientName: '',
        projectName: '',
        projectBoughtBy: '',
        gstnNumber: '',
        email: '',
        address: '',
        contact: '',
        startDate: new Date().toISOString().split('T')[0],
        status: 'development' as 'live' | 'development' | 'completed',
        lastPayment: '',
        lastMeetNote: '',
        maintenanceStartDate: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
                        setDocuments(prev => [...prev, { file, customName }]);
                        setPromptModal(prev => ({ ...prev, isOpen: false }));
                        toast.success('Document added successfully!');
                    }
                });
            }
        };
        input.click();
    };

    const handleRemoveDocument = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
        toast.info('Document removed');
    };

    const handleEditDocumentName = (index: number) => {
        setPromptModal({
            isOpen: true,
            title: 'Rename Document',
            message: 'Enter a new name for this document:',
            defaultValue: documents[index].customName,
            onConfirm: (newName: string) => {
                setDocuments(prev => prev.map((doc, i) => 
                    i === index ? { ...doc, customName: newName } : doc
                ));
                setPromptModal(prev => ({ ...prev, isOpen: false }));
                toast.success('Document renamed successfully!');
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.clientName || !formData.projectName || !formData.projectBoughtBy || !formData.gstnNumber || !formData.email || !formData.contact) {
            toast.warning('Please fill in all required fields');
            return;
        }

        try {
            const uploadedDocuments: ClientDocument[] = [];

            // Upload all documents
            for (const doc of documents) {
                const response = await uploadAPI.uploadFile(doc.file, 'clientDocument');
                uploadedDocuments.push({
                    id: Date.now() + Math.random(),
                    name: doc.customName,
                    fileName: response.data.data.fileName,
                    uploadDate: new Date().toISOString()
                });
            }

            // Add client using context
            addClient({
                clientName: formData.clientName,
                projectName: formData.projectName,
                projectBoughtBy: formData.projectBoughtBy,
                gstnNumber: formData.gstnNumber,
                email: formData.email,
                contact: formData.contact,
                address: formData.address,
                startDate: formData.startDate,
                status: formData.status,
                lastPayment: formData.lastPayment || 'No payment yet',
                payments: [],
                lastMeetNote: formData.lastMeetNote || 'Initial meeting scheduled',
                maintenanceStartDate: formData.maintenanceStartDate,
                documents: uploadedDocuments,
            });

            toast.success('Client added successfully!');
            onClose();
        } catch (error: any) {
            console.error('Error adding client:', error);
            toast.error(`Error: ${error.response?.data?.message || error.message || 'Failed to add client'}`);
        }
    };

    return (
        <>
            {/* Prompt Modal for Document Naming */}
            <PromptModal
                isOpen={promptModal.isOpen}
                title={promptModal.title}
                message={promptModal.message}
                defaultValue={promptModal.defaultValue}
                onConfirm={promptModal.onConfirm}
                onCancel={() => setPromptModal(prev => ({ ...prev, isOpen: false }))}
                placeholder="Enter document name"
            />
            
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Client</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Client Name */}
                        <div>
                            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
                                Client Name *
                            </label>
                            <input
                                type="text"
                                id="clientName"
                                name="clientName"
                                required
                                value={formData.clientName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter client name"
                            />
                        </div>

                        {/* Project Name */}
                        <div>
                            <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Name *
                            </label>
                            <input
                                type="text"
                                id="projectName"
                                name="projectName"
                                required
                                value={formData.projectName}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter project name"
                            />
                        </div>

                        {/* Project Bought By */}
                        <div>
                            <label htmlFor="projectBoughtBy" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Bought By *
                            </label>
                            <input
                                type="text"
                                id="projectBoughtBy"
                                name="projectBoughtBy"
                                required
                                value={formData.projectBoughtBy}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Person who purchased"
                            />
                        </div>

                        {/* GSTN Number */}
                        <div>
                            <label htmlFor="gstnNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                GSTN Number *
                            </label>
                            <input
                                type="text"
                                id="gstnNumber"
                                name="gstnNumber"
                                required
                                value={formData.gstnNumber}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 29ABCDE1234F1Z5"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter email address"
                            />
                        </div>

                        {/* Contact */}
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                                Contact Number *
                            </label>
                            <input
                                type="tel"
                                id="contact"
                                name="contact"
                                required
                                value={formData.contact}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter contact number"
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Project Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="development">Development</option>
                                <option value="live">Live</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        {/* Maintenance Start Date - Only for Live/Completed */}
                        {(formData.status === 'live' || formData.status === 'completed') && (
                            <div>
                                <label htmlFor="maintenanceStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Maintenance Start Date
                                </label>
                                <input
                                    type="date"
                                    id="maintenanceStartDate"
                                    name="maintenanceStartDate"
                                    value={formData.maintenanceStartDate}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            rows={3}
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter client address"
                        />
                    </div>

                    {/* Last Meet Note */}
                    <div>
                        <label htmlFor="lastMeetNote" className="block text-sm font-medium text-gray-700 mb-1">
                            Initial Meeting Note
                        </label>
                        <textarea
                            id="lastMeetNote"
                            name="lastMeetNote"
                            rows={2}
                            value={formData.lastMeetNote}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter meeting notes"
                        />
                    </div>

                    {/* Documents Section */}
                    <div>
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
                        {documents.length > 0 ? (
                            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                                {documents.map((doc, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <div className="flex items-center gap-2 flex-1">
                                            <span className="text-blue-600">📄</span>
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
                        ) : (
                            <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                <p className="text-sm text-gray-500">No documents added yet</p>
                                <p className="text-xs text-gray-400 mt-1">Click "Add Document" to upload files</p>
                            </div>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Add Client
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default AddClientModal;