import React, { useState, useEffect } from 'react';
import { TeamMember, useTeam } from '../contexts/TeamContext';

interface TeamMemberModalProps {
    member: TeamMember;
    mode: 'view' | 'edit';
    onClose: () => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({ member, mode, onClose }) => {
    const { updateTeamMember } = useTeam();
    const [isEditing, setIsEditing] = useState(mode === 'edit');
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: member.name,
        role: member.role,
        email: member.email,
        phone: member.phone,
        department: member.department,
        status: member.status,
        address: member.address || '',
        salary: member.salary || 0,
        skills: member.skills?.join(', ') || '',
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
        setFormData(prev => ({
            ...prev,
            [name]: name === 'salary' ? Number(value) : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        updateTeamMember(member.id, {
            ...formData,
            skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
        });

        setIsEditing(false);
    };

    const getTimeInCompany = (joinDate: string) => {
        const join = new Date(joinDate);
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

    return (
        <div
            className={`fixed inset-0 bg-black transition-opacity duration-300 ease-out z-50 ${isVisible ? 'bg-opacity-50' : 'bg-opacity-0'
                }`}
            onClick={handleClose}
        >
            <div
                className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-300 ease-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mr-4">
                                {member.avatar}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isEditing ? 'Edit Team Member' : member.name}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">{member.role} • {member.department}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-white rounded-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {isEditing ? (
                            /* Edit Form */
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <input
                                            type="text"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="Development">Development</option>
                                            <option value="Design">Design</option>
                                            <option value="Management">Management</option>
                                            <option value="Quality Assurance">Quality Assurance</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                                        <input
                                            type="number"
                                            name="salary"
                                            value={formData.salary}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                                    <textarea
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="React, Node.js, TypeScript"
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            /* View Profile */
                            <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600">Contact Information</h3>
                                            <div className="mt-2 space-y-2">
                                                <p className="text-sm text-gray-900">{member.email}</p>
                                                <p className="text-sm text-gray-900">{member.phone}</p>
                                                {member.address && <p className="text-sm text-gray-900">{member.address}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600">Department</h3>
                                            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(member.department)}`}>
                                                {member.department}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600">Status</h3>
                                            <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                                                {member.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-600">Employment Details</h3>
                                            <div className="mt-2 space-y-2">
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium">Join Date:</span> {new Date(member.joinDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium">Time in Company:</span> {getTimeInCompany(member.joinDate)}
                                                </p>
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium">Active Projects:</span> {member.projects}
                                                </p>
                                                {member.salary && (
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-medium">Salary:</span> ₹{member.salary.toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                {member.skills && member.skills.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-600 mb-2">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {member.skills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamMemberModal;