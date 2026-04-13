import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTeam, TeamDocument, TeamMember } from '../contexts/TeamContext';
import { uploadAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import PromptModal from '../components/PromptModal';
import ConfirmModal from '../components/ConfirmModal';

interface DocumentWithName {
    file: File;
    customName: string;
}

const TeamMemberDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { teamMembers, updateTeamMember } = useTeam();
    const toast = useToast();
    
    const member = teamMembers.find(m => m.id === Number(id));
    const [isEditing, setIsEditing] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [existingDocuments, setExistingDocuments] = useState<TeamDocument[]>(member?.documents || []);
    const [newDocuments, setNewDocuments] = useState<DocumentWithName[]>([]);
    
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

    const [formData, setFormData] = useState({
        employeeId: member?.employeeId || '',
        name: member?.name || '',
        role: member?.role || '',
        department: member?.department || '',
        email: member?.email || '',
        phone: member?.phone || '',
        joinDate: member?.joinDate || '',
        status: member?.status || 'active',
        salary: member?.salary || '',
        projects: member?.projects || 0,
        skills: member?.skills || [],
        bio: member?.bio || '',
        highestQualification: member?.highestQualification || '',
        qualificationDocument: member?.qualificationDocument || '',
        profileImage: member?.profileImage || '',
    });

    if (!member) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Member Not Found</h2>
                    <button
                        onClick={() => navigate('/team')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Back to Team
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setProfileImageFile(file);
        if (file) {
            setFormData(prev => ({ ...prev, profileImage: file.name }));
        }
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
            let updatedData: Partial<TeamMember> = { 
                ...formData,
                salary: formData.salary ? Number(formData.salary) : undefined
            };

            // Upload profile image if new file selected
            if (profileImageFile) {
                try {
                    const response = await uploadAPI.uploadFile(profileImageFile, 'profileImage');
                    updatedData.profileImage = response.data.data.fileName;
                } catch (uploadError: any) {
                    console.error('Profile image upload error:', uploadError);
                    toast.error(`Error uploading profile image: ${uploadError.response?.data?.message || uploadError.message}`);
                    return;
                }
            }

            const uploadedDocuments: TeamDocument[] = [];

            // Upload all new documents
            for (const doc of newDocuments) {
                const response = await uploadAPI.uploadFile(doc.file, 'qualificationDocument');
                uploadedDocuments.push({
                    id: Date.now() + Math.random(),
                    name: doc.customName,
                    fileName: response.data.data.fileName,
                    uploadDate: new Date().toISOString()
                });
            }

            // Merge existing documents with newly uploaded ones
            const allDocuments = [...existingDocuments, ...uploadedDocuments];
            updatedData.documents = allDocuments;

            updateTeamMember(member.id, updatedData);
            setIsEditing(false);
            setNewDocuments([]);
            toast.success('Team member updated successfully!');
        } catch (error: any) {
            console.error('Error updating team member:', error);
            toast.error(`Error: ${error.response?.data?.message || error.message || 'Please try again'}`);
        }
    };

    const openDocument = (docName: string) => {
        if (!docName) {
            toast.warning('No document available');
            return;
        }
        
        console.log('Opening document:', docName);
        const fileUrl = uploadAPI.viewFile('qualificationDocument', docName);
        console.log('File URL:', fileUrl);
        
        // Open in new tab
        const newWindow = window.open(fileUrl, '_blank');
        if (!newWindow) {
            toast.warning('Please allow popups to view the document');
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    const getDepartmentColor = (department: string) => {
        const colors: { [key: string]: string } = {
            'Development': 'bg-blue-100 text-blue-800',
            'Design': 'bg-purple-100 text-purple-800',
            'Management': 'bg-orange-100 text-orange-800',
            'Quality Assurance': 'bg-green-100 text-green-800',
        };
        return colors[department] || 'bg-gray-100 text-gray-800';
    };

    const getTimeInCompany = () => {
        const join = new Date(member.joinDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - join.getTime());
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
        <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
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
                <div className="flex items-center gap-2 lg:gap-4">
                    <button
                        onClick={() => navigate('/team')}
                        className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-lg lg:text-2xl font-bold text-gray-900">
                            {isEditing ? 'Edit Team Member' : 'Team Member Profile'}
                        </h1>
                        <p className="text-xs lg:text-sm text-gray-600 mt-0.5 lg:mt-1">{member.name} - {member.role}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            {isEditing ? (
                /* Edit Form */
                <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        {/* Profile Image Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                            <div className="flex items-center gap-4">
                                {profileImageFile ? (
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-500">
                                        <img 
                                            src={URL.createObjectURL(profileImageFile)} 
                                            alt="Profile preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : member.profileImage ? (
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-300">
                                        <img 
                                            src={uploadAPI.viewFile('profileImage', member.profileImage)}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">${member.avatar}</div>`;
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                                        {member.avatar}
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                                    {formData.profileImage && (
                                        <p className="text-xs text-green-600 mt-1">✓ {formData.profileImage}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label><input type="text" name="employeeId" required value={formData.employeeId} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Name *</label><input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Role *</label><input type="text" name="role" required value={formData.role} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Department *</label><select name="department" value={formData.department} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg"><option value="Development">Development</option><option value="Design">Design</option><option value="Management">Management</option><option value="Quality Assurance">Quality Assurance</option></select></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Email *</label><input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label><input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label><input type="date" name="joinDate" value={formData.joinDate} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Status</label><select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg"><option value="active">Active</option><option value="inactive">Inactive</option></select></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Salary</label><input type="text" name="salary" value={formData.salary} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-700 mb-2">Active Projects</label><input type="number" name="projects" value={formData.projects} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                        </div>
                        <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification</label><input type="text" name="highestQualification" value={formData.highestQualification} onChange={handleInputChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                        
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

                        <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Bio</label><textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border rounded-lg" /></div>
                        <div className="flex gap-4 mt-6"><button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-6 py-3 bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg">Save Changes</button></div>
                    </div>
                </form>
            ) : (
                /* View Profile */
                <div className="space-y-4 lg:space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 lg:p-8">
                        <div className="flex items-center gap-3 lg:gap-6 mb-4 lg:mb-6">
                            {member.profileImage ? (
                                <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                                    <img 
                                        src={uploadAPI.viewFile('profileImage', member.profileImage)}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to avatar if image fails to load
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xl lg:text-3xl font-bold">${member.avatar}</div>`;
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 lg:w-24 lg:h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl lg:text-3xl font-bold shadow-lg">
                                    {member.avatar}
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-lg lg:text-2xl font-bold">{member.name}</h3>
                                <p className="text-sm lg:text-lg text-gray-700">{member.role}</p>
                                <div className="flex gap-2 lg:gap-3 mt-1 lg:mt-2 flex-wrap">
                                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${getStatusColor(member.status)}`}>{member.status.toUpperCase()}</span>
                                    <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${getDepartmentColor(member.department)}`}>{member.department}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-6">
                            <div className="bg-white bg-opacity-60 rounded-lg p-3 lg:p-4"><p className="text-xs lg:text-sm text-gray-600">Join Date</p><p className="text-sm lg:text-lg font-semibold">{new Date(member.joinDate).toLocaleDateString()}</p></div>
                            <div className="bg-white bg-opacity-60 rounded-lg p-3 lg:p-4"><p className="text-xs lg:text-sm text-gray-600">Time in Company</p><p className="text-sm lg:text-lg font-semibold">{getTimeInCompany()}</p></div>
                            <div className="bg-white bg-opacity-60 rounded-lg p-3 lg:p-4"><p className="text-xs lg:text-sm text-gray-600">Active Projects</p><p className="text-sm lg:text-lg font-semibold">{member.projects} projects</p></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                        <div className="bg-white border rounded-xl p-4 lg:p-6">
                            <h4 className="text-base lg:text-lg font-bold mb-3 lg:mb-4">👤 Employee Information</h4>
                            <div className="space-y-3 lg:space-y-4">
                                <div><p className="text-xs lg:text-sm text-gray-600">Employee ID</p><p className="text-sm lg:text-base font-semibold text-blue-600">{member.employeeId}</p></div>
                                <div><p className="text-sm text-gray-600">Email</p><p>{member.email}</p></div>
                                <div><p className="text-sm text-gray-600">Phone</p><p>{member.phone}</p></div>
                                {member.salary && <div><p className="text-sm text-gray-600">Salary</p><p>₹{member.salary}</p></div>}
                                {member.highestQualification && <div><p className="text-sm text-gray-600">Highest Qualification</p><p className="font-semibold">{member.highestQualification}</p></div>}
                                {/* {member.documents && member.documents.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-2">Documents</p>
                                        <div className="space-y-2">
                                            {member.documents.map((doc) => (
                                                <button
                                                    key={doc.id}
                                                    onClick={() => {
                                                        const fileUrl = uploadAPI.viewFile('qualificationDocument', doc.fileName);
                                                        window.open(fileUrl, '_blank');
                                                    }}
                                                    className="w-full text-left text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2  p-2 rounded  transition-colors"
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
                                )} */}
                                {member.profileImage && (
                                    <div>
                                        <p className="text-xs lg:text-sm text-gray-600">Profile Image</p>
                                        <p className="text-xs lg:text-sm text-blue-600 flex items-center gap-1">
                                            <span>🖼️</span> {member.profileImage}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-white border rounded-xl p-4 lg:p-6">
                            <h4 className="text-base lg:text-lg font-bold mb-3 lg:mb-4">💼 Work Details</h4>
                            <div className="space-y-3 lg:space-y-4 pb-4 lg:pb-6">
                                <div><p className="text-xs lg:text-sm text-gray-600">Department</p><span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm ${getDepartmentColor(member.department)}`}>{member.department}</span></div>
                                <div><p className="text-xs lg:text-sm text-gray-600">Status</p><span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm ${getStatusColor(member.status)}`}>{member.status.toUpperCase()}</span></div>
                                <div><p className="text-xs lg:text-sm text-gray-600">Active Projects</p><p className="text-sm lg:text-base">{member.projects} projects</p></div>
                            </div>

                            {member.documents && member.documents.length > 0 && (
                                    <div>
                                        <p className="text-sm lg:text-base text-gray-600 mb-2">Documents</p>
                                        <div className="space-y-2">
                                            {member.documents.map((doc) => (
                                                <button
                                                    key={doc.id}
                                                    onClick={() => {
                                                        const fileUrl = uploadAPI.viewFile('qualificationDocument', doc.fileName);
                                                        window.open(fileUrl, '_blank');
                                                    }}
                                                    className="w-full text-left text-xs lg:text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2 p-2 rounded transition-colors"
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

                        {/* yaha pe aayega niche */}
                        



                    </div>

                    {member.skills && member.skills.length > 0 && (
                        <div className="bg-white border rounded-xl p-4 lg:p-6">
                            <h4 className="text-base lg:text-lg font-bold mb-3 lg:mb-4">🎯 Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {member.skills.map((skill, index) => (
                                    <span key={index} className="px-2 lg:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs lg:text-sm">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {member.bio && (
                        <div className="bg-white border rounded-xl p-4 lg:p-6">
                            <h4 className="text-base lg:text-lg font-bold mb-3 lg:mb-4">📝 Bio</h4>
                            <div className="bg-gray-50 rounded-lg p-3 lg:p-4"><p className="text-sm lg:text-base">{member.bio}</p></div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                        <button onClick={() => setIsEditing(true)} className="px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700">✏️ Edit</button>
                        <button className="px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">📧 Email</button>
                        <button className="px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base bg-green-50 text-green-600 rounded-lg hover:bg-green-100">📞 Call</button>
                        <button className="px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100">📅 Schedule</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamMemberDetails;
