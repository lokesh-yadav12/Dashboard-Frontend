import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Client {
    id: number;
    clientName: string;
    projectName: string;
    startDate: string;
    status: 'live' | 'development' | 'completed';
    lastPayment: string;
    lastMeetNote: string;
    email: string;
    contact: string;
    address: string;
    document?: File | null;
    signedDocument?: File | null;
}

interface ClientContextType {
    clients: Client[];
    addClient: (client: Omit<Client, 'id'>) => void;
    updateClient: (id: number, client: Partial<Client>) => void;
    deleteClient: (id: number) => void;
    getClient: (id: number) => Client | undefined;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const useClients = () => {
    const context = useContext(ClientContext);
    if (context === undefined) {
        throw new Error('useClients must be used within a ClientProvider');
    }
    return context;
};

export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        // Load clients from localStorage on app start
        const savedClients = localStorage.getItem('clients');
        if (savedClients) {
            setClients(JSON.parse(savedClients));
        } else {
            // Initialize with sample data
            const sampleClients: Client[] = [
                {
                    id: 1,
                    clientName: 'Tech Solutions Inc',
                    projectName: 'E-commerce Website',
                    startDate: '2024-01-15',
                    status: 'live',
                    lastPayment: '₹5,000 - Jan 15, 2024',
                    lastMeetNote: 'Discussed new features for Q2',
                    email: 'contact@techsolutions.com',
                    contact: '+1 (555) 123-4567',
                    address: '123 Tech Street, Silicon Valley, CA'
                },
                {
                    id: 2,
                    clientName: 'StartupXYZ',
                    projectName: 'Mobile App Development',
                    startDate: '2024-02-01',
                    status: 'development',
                    lastPayment: '₹3,500 - Feb 20, 2024',
                    lastMeetNote: 'UI/UX review completed',
                    email: 'hello@startupxyz.com',
                    contact: '+1 (555) 234-5678',
                    address: '456 Innovation Ave, New York, NY'
                },
                {
                    id: 3,
                    clientName: 'Global Corp',
                    projectName: 'Corporate Website',
                    startDate: '2024-01-10',
                    status: 'completed',
                    lastPayment: '₹2,800 - Mar 10, 2024',
                    lastMeetNote: 'Final delivery and handover',
                    email: 'info@globalcorp.com',
                    contact: '+1 (555) 345-6789',
                    address: '789 Business Blvd, Chicago, IL'
                },
                {
                    id: 4,
                    clientName: 'Business Solutions Ltd',
                    projectName: 'CRM System',
                    startDate: '2024-03-01',
                    status: 'development',
                    lastPayment: '₹4,200 - Mar 25, 2024',
                    lastMeetNote: 'Database optimization discussion',
                    email: 'support@businesssolutions.com',
                    contact: '+1 (555) 456-7890',
                    address: '321 Enterprise Way, Austin, TX'
                },
            ];
            setClients(sampleClients);
            localStorage.setItem('clients', JSON.stringify(sampleClients));
        }
    }, []);

    const addClient = (clientData: Omit<Client, 'id'>) => {
        const newClient: Client = {
            ...clientData,
            id: Date.now()
        };
        const updatedClients = [...clients, newClient];
        setClients(updatedClients);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
    };

    const updateClient = (id: number, clientData: Partial<Client>) => {
        const updatedClients = clients.map(client =>
            client.id === id ? { ...client, ...clientData } : client
        );
        setClients(updatedClients);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
    };

    const deleteClient = (id: number) => {
        const updatedClients = clients.filter(client => client.id !== id);
        setClients(updatedClients);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
    };

    const getClient = (id: number) => {
        return clients.find(client => client.id === id);
    };

    const value = {
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClient
    };

    return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
};