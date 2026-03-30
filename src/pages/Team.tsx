import React, { useState } from 'react';
import { useTeam, TeamMember } from '../contexts/TeamContext';
import TeamMemberModal from '../components/TeamMemberModal';
import AddTeamMemberModal from '../components/AddTeamMemberModal';

const Team: React.FC = () => {
    const { teamMembers } = useTeam();
    const [filter, setFilter] = useState('all');
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
    const [showAddModal, setShowAddModal] = useState(false);

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

    const filterMembers = () => {
        switch (filter) {
            case 'active':
                return teamMembers.filter(member => member.status === 'active');
            case 'inactive':
                return teamMembers.filter(member => member.status === 'inactive');
            case 'recent':
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return teamMembers.filter(member => new Date(member.joinDate) >= thirtyDaysAgo);
            default:
                return teamMembers;
        }
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

    const handleViewProfile = (member: TeamMember) => {
        setSelectedMember(member);
        setModalMode('view');
    };

    const handleEditMember = (member: TeamMember) => {
        setSelectedMember(member);
        setModalMode('edit');
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
                <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Members</option>
                        <option value="active">Active Members</option>
                        <option value="inactive">Inactive Members</option>
                        <option value="recent">Recently Joined</option>
                    </select>

                    {/* Add Member Button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                    >
                        <span className="text-lg">+</span>
                        Add Member
                    </button>
                </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-50">
                            <span className="text-2xl">👥</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Members</p>
                            <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-50">
                            <span className="text-2xl">✅</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Active Members</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {teamMembers.filter(m => m.status === 'active').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-purple-50">
                            <span className="text-2xl">🏢</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Departments</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {new Set(teamMembers.map(m => m.department)).size}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-orange-50">
                            <span className="text-2xl">📊</span>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Avg Projects</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {Math.round(teamMembers.reduce((sum, m) => sum + m.projects, 0) / teamMembers.length)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterMembers().map((member) => (
                    <div 
                        key={member.id} 
                        onClick={() => handleViewProfile(member)}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {member.avatar}
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                                    <p className="text-sm text-gray-600">{member.role}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                                {member.status}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Department</p>
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(member.department)}`}>
                                    {member.department}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">Email</p>
                                <p className="text-sm text-gray-900">{member.email}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">Phone</p>
                                <p className="text-sm text-gray-900">{member.phone}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Join Date</p>
                                    <p className="text-sm text-gray-900">{new Date(member.joinDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Time Here</p>
                                    <p className="text-sm text-gray-900">{getTimeInCompany(member.joinDate)}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                                <p className="text-sm text-gray-900">{member.projects} projects</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewProfile(member);
                                }}
                                className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                            >
                                View Profile
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditMember(member);
                                }}
                                className="flex-1 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filterMembers().length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">👥</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
                    <p className="text-gray-500">
                        {filter === 'all'
                            ? "No team members available."
                            : "No team members match the selected filter."
                        }
                    </p>
                </div>
            )}

            {/* Team Member Modal */}
            {selectedMember && (
                <TeamMemberModal
                    member={selectedMember}
                    mode={modalMode}
                    onClose={() => setSelectedMember(null)}
                />
            )}

            {/* Add Team Member Modal */}
            {showAddModal && (
                <AddTeamMemberModal onClose={() => setShowAddModal(false)} />
            )}
        </div>
    );
};

export default Team;