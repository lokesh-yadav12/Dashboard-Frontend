import React, { useState } from 'react';
import { useTeam } from '../contexts/TeamContext';
import { uploadAPI } from '../services/api';
import { useToast } from '../contexts/ToastContext';

interface AddTeamMemberModalProps {
    onClose: () => void;
}

const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({ onClose }) => {
    const { addTeamMember } = useTeam();
    const toast = useToast();
    const [formData, setFormData] = useState({
        employeeId: '',
        name: '',
        role: '',
        email: '',
        phone: '',
        department: 'Development',
        status: 'active' as 'active' | 'inactive',
        address: '',
        salary: 0,
        skills: '',
        joinDate: new Date().toISOString().split('T')[0],
        projects: 0,
        highestQualification: '',
        qualificationDocument: null as File | null,
        profileImage: null as File | null,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'salary' || name === 'projects' ? Number(value) : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'qualificationDocument' | 'profileImage') => {
        const file = e.target.files?.[0] || null;
        setFormData(prev => ({
            ...prev,
            [field]: file
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.employeeId || !formData.name || !formData.role || !formData.email || !formData.phone) {
            toast.warning('Please fill in all required fields');
            return;
        }

        try {
            // Generate avatar from name
            const nameParts = formData.name.split(' ');
            const avatar = nameParts.length > 1
                ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
                : formData.name.substring(0, 2).toUpperCase();

            let profileImageName = '';
            let qualificationDocName = '';

            // Upload profile image if selected
            if (formData.profileImage) {
                const response = await uploadAPI.uploadFile(formData.profileImage, 'profileImage');
                profileImageName = response.data.data.fileName;
            }

            // Upload qualification document if selected
            if (formData.qualificationDocument) {
                const response = await uploadAPI.uploadFile(formData.qualificationDocument, 'qualificationDocument');
                qualificationDocName = response.data.data.fileName;
            }

            // Add team member using context
            addTeamMember({
                employeeId: formData.employeeId,
                name: formData.name,
                role: formData.role,
                email: formData.email,
                phone: formData.phone,
                department: formData.department,
                status: formData.status,
                address: formData.address,
                salary: formData.salary,
                skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
                joinDate: formData.joinDate,
                projects: formData.projects,
                avatar: avatar,
                highestQualification: formData.highestQualification,
                qualificationDocument: qualificationDocName || undefined,
                profileImage: profileImageName || undefined,
            });

            toast.success('Team member added successfully!');
            onClose();
        } catch (error: any) {
            console.error('Error adding team member:', error);
            toast.error(`Error: ${error.response?.data?.message || error.message || 'Failed to add team member'}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Team Member</h2>
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
                        {/* Employee ID */}
                        <div>
                            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-1">
                                Employee ID *
                            </label>
                            <input
                                type="text"
                                id="employeeId"
                                name="employeeId"
                                required
                                value={formData.employeeId}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., EMP001"
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter full name"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                Role/Position *
                            </label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                required
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Senior Developer"
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

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter phone number"
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <select
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="Development">Development</option>
                                <option value="Design">Design</option>
                                <option value="Management">Management</option>
                                <option value="Quality Assurance">Quality Assurance</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Sales">Sales</option>
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Join Date */}
                        <div>
                            <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Join Date
                            </label>
                            <input
                                type="date"
                                id="joinDate"
                                name="joinDate"
                                value={formData.joinDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Salary */}
                        <div>
                            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                                Salary (Annual)
                            </label>
                            <input
                                type="number"
                                id="salary"
                                name="salary"
                                value={formData.salary}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter annual salary"
                            />
                        </div>
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
                            placeholder="Enter address"
                        />
                    </div>

                    {/* Skills */}
                    <div>
                        <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                            Skills (comma separated)
                        </label>
                        <textarea
                            id="skills"
                            name="skills"
                            rows={2}
                            value={formData.skills}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., React, Node.js, TypeScript, MongoDB"
                        />
                    </div>

                    {/* Highest Qualification */}
                    <div>
                        <label htmlFor="highestQualification" className="block text-sm font-medium text-gray-700 mb-1">
                            Highest Qualification
                        </label>
                        <input
                            type="text"
                            id="highestQualification"
                            name="highestQualification"
                            value={formData.highestQualification}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Master of Computer Science"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Qualification Document */}
                        <div>
                            <label htmlFor="qualificationDocument" className="block text-sm font-medium text-gray-700 mb-1">
                                Qualification Document
                            </label>
                            <input
                                type="file"
                                id="qualificationDocument"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'qualificationDocument')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG</p>
                            {formData.qualificationDocument && (
                                <p className="text-xs text-green-600 mt-1">✓ {formData.qualificationDocument.name}</p>
                            )}
                        </div>

                        {/* Profile Image */}
                        <div>
                            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                                Profile Image
                            </label>
                            <input
                                type="file"
                                id="profileImage"
                                accept=".jpg,.jpeg,.png"
                                onChange={(e) => handleFileChange(e, 'profileImage')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">JPG, PNG</p>
                            {formData.profileImage && (
                                <p className="text-xs text-green-600 mt-1">✓ {formData.profileImage.name}</p>
                            )}
                        </div>
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
                            Add Team Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeamMemberModal;