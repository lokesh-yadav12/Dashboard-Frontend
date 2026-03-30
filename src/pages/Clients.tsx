import React, { useState } from 'react';
import { useClients, Client } from '../contexts/ClientContext';
import AddClientModal from '../components/AddClientModal';
import ClientDetailsModal from '../components/ClientDetailsModal';

const Clients: React.FC = () => {
    const { clients } = useClients();
    const [filter, setFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
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

            // Search filter
            const searchMatch = searchQuery === '' ||
                client.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.email.toLowerCase().includes(searchQuery.toLowerCase());

            return dateMatch && searchMatch;
        });
    };

    const handleViewDetails = (client: Client) => {
        setSelectedClient(client);
        setModalMode('view');
    };

    const handleEditClient = (client: Client) => {
        setSelectedClient(client);
        setModalMode('edit');
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 w-fit"
                    >
                        <span className="text-lg">+</span>
                        Add Client
                    </button>
                </div>

                {/* Search and Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search by client name, project, or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                    {/* Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Time</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                    </select>
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
                        onClick={() => handleViewDetails(client)}
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

                        {/* Actions */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(client);
                                }}
                                className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                            >
                                View Details
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClient(client);
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

            {/* Client Details Modal */}
            {selectedClient && (
                <ClientDetailsModal
                    client={selectedClient}
                    mode={modalMode}
                    onClose={() => setSelectedClient(null)}
                />
            )}
        </div>
    );
};

export default Clients;