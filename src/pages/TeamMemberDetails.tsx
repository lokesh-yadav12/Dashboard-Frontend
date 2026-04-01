import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';
import { uploadAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

const TeamMemberDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { teamMembers, updateTeamMember } = useTeam();
    const toast = useToast();
    
    const member = teamMembers.find(m => m.id === Number(id));
    const [isEditing, setIsEditing] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
    const [qualificationDocFile, setQualificationDocFile] = useState<File | null>(null);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profileImage' | 'qualificationDocument') => {
        const file = e.target.files?.[0] || null;
        if (field === 'profileImage') {
            setProfileImageFile(file);
            if (file) {
                setFormData(prev => ({ ...prev, profileImage: file.name }));
            }
        } else {
            setQualificationDocFile(file);
            if (file) {
                setFormData(prev => ({ ...prev, qualificationDocument: file.name }));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            let updatedData = { ...formData };

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

            // Upload qualification document if new file selected
            if (qualificationDocFile) {
                try {
                    const response = await uploadAPI.uploadFile(qualificationDocFile, 'qualificationDocument');
                    updatedData.qualificationDocument = response.data.data.fileName;
                } catch (uploadError: any) {
                    console.error('Qualification document upload error:', uploadError);
                    toast.error(`Error uploading qualification document: ${uploadError.response?.data?.message || uploadError.message}`);
                    return;
                }
            }

            updateTeamMember(member.id, updatedData);
            setIsEditing(false);
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
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/team')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isEditing ? 'Edit Team Member' : 'Team Member Profile'}
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">{member.name} - {member.role}</p>
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
                                        onChange={(e) => handleFileChange(e, 'profileImage')}
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
                        
                        {/* Qualification Document Upload */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Qualification Document</label>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'qualificationDocument')}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                            {formData.qualificationDocument && (
                                <p className="text-xs text-green-600 mt-1">✓ {formData.qualificationDocument}</p>
                            )}
                        </div>

                        <div className="mt-6"><label className="block text-sm font-medium text-gray-700 mb-2">Bio</label><textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border rounded-lg" /></div>
                        <div className="flex gap-4 mt-6"><button type="button" onClick={() => setIsEditing(false)} className="flex-1 px-6 py-3 bg-gray-100 rounded-lg">Cancel</button><button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg">Save Changes</button></div>
                    </div>
                </form>
            ) : (
                /* View Profile */
                <div className="space-y-6 max-w-6xl">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
                        <div className="flex items-center gap-6 mb-6">
                            {member.profileImage ? (
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100">
                                    <img 
                                        src={uploadAPI.viewFile('profileImage', member.profileImage)}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback to avatar if image fails to load
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">${member.avatar}</div>`;
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                    {member.avatar}
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold">{member.name}</h3>
                                <p className="text-lg text-gray-700">{member.role}</p>
                                <div className="flex gap-3 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(member.status)}`}>{member.status.toUpperCase()}</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDepartmentColor(member.department)}`}>{member.department}</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white bg-opacity-60 rounded-lg p-4"><p className="text-sm text-gray-600">Join Date</p><p className="text-lg font-semibold">{new Date(member.joinDate).toLocaleDateString()}</p></div>
                            <div className="bg-white bg-opacity-60 rounded-lg p-4"><p className="text-sm text-gray-600">Time in Company</p><p className="text-lg font-semibold">{getTimeInCompany()}</p></div>
                            <div className="bg-white bg-opacity-60 rounded-lg p-4"><p className="text-sm text-gray-600">Active Projects</p><p className="text-lg font-semibold">{member.projects} projects</p></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white border rounded-xl p-6">
                            <h4 className="text-lg font-bold mb-4">👤 Employee Information</h4>
                            <div className="space-y-4">
                                <div><p className="text-sm text-gray-600">Employee ID</p><p className="font-semibold text-blue-600">{member.employeeId}</p></div>
                                <div><p className="text-sm text-gray-600">Email</p><p>{member.email}</p></div>
                                <div><p className="text-sm text-gray-600">Phone</p><p>{member.phone}</p></div>
                                {member.salary && <div><p className="text-sm text-gray-600">Salary</p><p>₹{member.salary}</p></div>}
                                {member.highestQualification && <div><p className="text-sm text-gray-600">Highest Qualification</p><p className="font-semibold">{member.highestQualification}</p></div>}
                                {member.qualificationDocument && (
                                    <div>
                                        <p className="text-sm text-gray-600">Qualification Document</p>
                                        <button
                                            onClick={() => openDocument(member.qualificationDocument!)}
                                            className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1 underline"
                                        >
                                            <span>📄</span> {member.qualificationDocument}
                                        </button>
                                    </div>
                                )}
                                {member.profileImage && (
                                    <div>
                                        <p className="text-sm text-gray-600">Profile Image</p>
                                        <p className="text-sm text-blue-600 flex items-center gap-1">
                                            <span>🖼️</span> {member.profileImage}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="bg-white border rounded-xl p-6">
                            <h4 className="text-lg font-bold mb-4">💼 Work Details</h4>
                            <div className="space-y-4">
                                <div><p className="text-sm text-gray-600">Department</p><span className={`px-3 py-1 rounded-full text-sm ${getDepartmentColor(member.department)}`}>{member.department}</span></div>
                                <div><p className="text-sm text-gray-600">Status</p><span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(member.status)}`}>{member.status.toUpperCase()}</span></div>
                                <div><p className="text-sm text-gray-600">Active Projects</p><p>{member.projects} projects</p></div>
                            </div>
                        </div>
                    </div>

                    {member.skills && member.skills.length > 0 && (
                        <div className="bg-white border rounded-xl p-6">
                            <h4 className="text-lg font-bold mb-4">🎯 Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {member.skills.map((skill, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{skill}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {member.bio && (
                        <div className="bg-white border rounded-xl p-6">
                            <h4 className="text-lg font-bold mb-4">📝 Bio</h4>
                            <div className="bg-gray-50 rounded-lg p-4"><p>{member.bio}</p></div>
                        </div>
                    )}

                    <div className="grid grid-cols-4 gap-4">
                        <button onClick={() => setIsEditing(true)} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">✏️ Edit</button>
                        <button className="px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100">📧 Email</button>
                        <button className="px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">📞 Call</button>
                        <button className="px-4 py-3 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100">📅 Schedule</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeamMemberDetails;
