import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClients, Client } from '../contexts/ClientContext';
import AddClientModal from '../components/AddClientModal';
import MobileFilterDropdown from '../components/MobileFilterDropdown';

const Clients: React.FC = () => {
    const { clients } = useClients();
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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

    const filterClients = () => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        return clients.filter(client => {
            const startDate = new Date(client.startDate);

            // Date filter
            let dateMatch = true;
            switch (filter) {
                case '7days':
                    dateMatch = startDate >= sevenDaysAgo;
                    break;
                case '30days':
                    dateMatch = startDate >= thirtyDaysAgo;
                    break;
                default:
                    dateMatch = true;
            }

            // Status filter
            let statusMatch = true;
            if (statusFilter !== 'all') {
                statusMatch = client.status === statusFilter;
            }

            // Search filter
            const searchMatch = searchQuery === '' ||
                client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.email.toLowerCase().includes(searchQuery.toLowerCase());

            return dateMatch && statusMatch && searchMatch;
        });
    };

    return (
        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Clients</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-4 lg:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <span className="text-lg">+</span>
                        Add Client
                    </button>
                </div>

                {/* Search and Filter Bar - Responsive Layout */}
                <div className="flex flex-col lg:flex-row gap-3">
                    {/* Search Bar - Half width on desktop */}
                    <div className="relative flex-1 lg:w-1/2">
                        <input
                            type="text"
                            placeholder="Search by client name, project, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
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

                    {/* Filter Group - Half width on desktop, split into 2 equal parts */}
                    <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:w-1/2">
                        {/* Status Filter */}
                        <div className="w-full sm:flex-1">
                            <MobileFilterDropdown
                                value={statusFilter}
                                onChange={setStatusFilter}
                                options={[
                                    { value: 'all', label: 'All Projects' },
                                    { value: 'live', label: 'Live' },
                                    { value: 'development', label: 'Development' },
                                    { value: 'completed', label: 'Completed' }
                                ]}
                            />
                        </div>

                        {/* Date Filter */}
                        <div className="w-full sm:flex-1">
                            <MobileFilterDropdown
                                value={filter}
                                onChange={setFilter}
                                options={[
                                    { value: 'all', label: 'All Time' },
                                    { value: '7days', label: 'Last 7 Days' },
                                    { value: '30days', label: 'Last 30 Days' }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <span className="text-blue-600">👥</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Total Clients</p>
                            <p className="text-xl font-bold text-gray-900">{filterClients().length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <span className="text-green-600">🟢</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Active Projects</p>
                            <p className="text-xl font-bold text-gray-900">
                                {filterClients().filter(c => c.status === 'live' || c.status === 'development').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-50 rounded-lg">
                            <span className="text-purple-600">✅</span>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-xl font-bold text-gray-900">
                                {filterClients().filter(c => c.status === 'completed').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Client Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterClients().map((client) => (
                    <div 
                        key={client.id} 
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                    >
                        {/* Client Name */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{client.clientName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                                {client.status}
                            </span>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Project Name</p>
                                <p className="text-sm text-gray-900">{client.projectName}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">Start Date</p>
                                <p className="text-sm text-gray-900">{new Date(client.startDate).toLocaleDateString()}</p>
                            </div>

                            {client.status === 'live' && client.maintenanceStartDate && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 -mx-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">🔧</span>
                                        <div>
                                            <p className="text-xs font-medium text-green-700">Maintenance Period</p>
                                            <p className="text-sm font-bold text-green-900">Started: {new Date(client.maintenanceStartDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {client.status === 'completed' && client.maintenanceStartDate && (
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Maintenance Start</p>
                                    <p className="text-sm text-gray-900 flex items-center gap-1">
                                        <span className="text-green-600">🔧</span>
                                        {new Date(client.maintenanceStartDate).toLocaleDateString()}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-gray-600">Contact</p>
                                <p className="text-sm text-gray-900">{client.contact}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">Email</p>
                                <p className="text-sm text-gray-900 truncate">{client.email}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">Last Payment</p>
                                <p className="text-sm text-gray-900">{client.lastPayment}</p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-600">Last Meet Note</p>
                                <p className="text-sm text-gray-900 line-clamp-2">{client.lastMeetNote}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filterClients().length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                    <p className="text-gray-500 mb-4">
                        {searchQuery
                            ? `No results for "${searchQuery}". Try a different search term.`
                            : filter === 'all'
                                ? "You haven't added any clients yet."
                                : "No clients match the selected filter."
                        }
                    </p>
                    {!searchQuery && filter === 'all' && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Add Your First Client
                        </button>
                    )}
                </div>
            )}

            {/* Add Client Modal */}
            {showAddModal && (
                <AddClientModal onClose={() => setShowAddModal(false)} />
            )}
        </div>
    );
};

export default Clients;