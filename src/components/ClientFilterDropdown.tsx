import React, { useState, useRef, useEffect } from 'react';

interface ClientFilterDropdownProps {
    clients: string[];
    selectedClient: string;
    onSelectClient: (client: string) => void;
}

const ClientFilterDropdown: React.FC<ClientFilterDropdownProps> = ({
    clients,
    selectedClient,
    onSelectClient
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter clients based on search query
    const filteredClients = clients.filter(client =>
        client.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectClient = (client: string) => {
        onSelectClient(client);
        setIsOpen(false);
        setSearchQuery('');
    };

    const getDisplayText = () => {
        if (selectedClient === 'all') {
            return `All Clients (${clients.length})`;
        }
        return selectedClient;
    };

    return (
        <div className="relative min-w-[200px]" ref={dropdownRef}>
            <label className="block text-xs font-medium text-gray-700 mb-1">Filter by Client</label>
            
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    selectedClient !== 'all' ? 'pr-16' : 'pr-10'
                }`}
            >
                <span className="truncate">{getDisplayText()}</span>
                <svg 
                    className={`h-5 w-5 text-gray-400 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Clear Button */}
            {selectedClient !== 'all' && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectClient('all');
                    }}
                    className="absolute right-9 top-[26px] text-gray-400 hover:text-gray-600 z-10 p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Clear filter"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                    {/* Search Bar */}
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSearchQuery('');
                                    }}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Client List */}
                    <div className="max-h-60 overflow-y-auto">
                        {/* All Clients Option */}
                        <button
                            onClick={() => handleSelectClient('all')}
                            className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex items-center justify-between ${
                                selectedClient === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                            }`}
                        >
                            <span>All Clients ({clients.length})</span>
                            {selectedClient === 'all' && (
                                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="border-t border-gray-200"></div>

                        {/* Filtered Client List */}
                        {filteredClients.length > 0 ? (
                            filteredClients.map((client) => (
                                <button
                                    key={client}
                                    onClick={() => handleSelectClient(client)}
                                    className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors flex items-center justify-between ${
                                        selectedClient === client ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                    }`}
                                >
                                    <span className="truncate">{client}</span>
                                    {selectedClient === client && (
                                        <svg className="h-5 w-5 text-blue-600 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-gray-500">
                                <div className="text-3xl mb-2">🔍</div>
                                <p className="text-sm">No clients found</p>
                                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientFilterDropdown;
