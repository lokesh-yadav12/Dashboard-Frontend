import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MeetingNote {
    id: number;
    date: string;
    note: string;
}

export interface ClientPayment {
    id: number;
    amount: string;
    date: string;
}

export interface Client {
    id: number;
    clientName: string;
    projectName: string;
    projectBoughtBy: string;
    gstnNumber: string;
    startDate: string;
    status: 'live' | 'development' | 'completed';
    lastPayment: string;
    payments: ClientPayment[];
    totalInstallments?: number;
    lastMeetNote: string;
    meetingNotes?: MeetingNote[];
    maintenanceStartDate?: string;
    email: string;
    contact: string;
    address: string;
    document?: string;
    signedDocument?: string;
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
            const sampleClients: Client[] = [];
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