import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Payment {
    id: number;
    clientName: string;
    projectName: string;
    amount: number;
    date: string;
    installment: string;
    totalInstallments: number;
    currentInstallment: number;
    remaining: string;
    invoiceNumber: string;
    status: 'paid' | 'pending' | 'overdue';
    description?: string;
    paymentMethod?: string;
}

interface PaymentContextType {
    payments: Payment[];
    addPayment: (payment: Omit<Payment, 'id'>) => void;
    updatePayment: (id: number, payment: Partial<Payment>) => void;
    deletePayment: (id: number) => void;
    getPayment: (id: number) => Payment | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayments = () => {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error('usePayments must be used within a PaymentProvider');
    }
    return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [payments, setPayments] = useState<Payment[]>([]);

    useEffect(() => {
        // Load payments from localStorage on app start
        const savedPayments = localStorage.getItem('payments');
        if (savedPayments) {
            setPayments(JSON.parse(savedPayments));
        } else {
            // Initialize with sample data
            const samplePayments: Payment[] = [
                {
                    id: 1,
                    clientName: 'Tech Solutions Inc',
                    projectName: 'E-commerce Website',
                    amount: 5000,
                    date: '2024-03-25',
                    installment: '3/5',
                    totalInstallments: 5,
                    currentInstallment: 3,
                    remaining: '2 installments remaining',
                    invoiceNumber: 'INV-2024-001',
                    status: 'paid',
                    description: 'Third installment for e-commerce development',
                    paymentMethod: 'Bank Transfer'
                },
                {
                    id: 2,
                    clientName: 'StartupXYZ',
                    projectName: 'Mobile App Development',
                    amount: 3500,
                    date: '2024-03-20',
                    installment: '2/4',
                    totalInstallments: 4,
                    currentInstallment: 2,
                    remaining: '2 installments remaining',
                    invoiceNumber: 'INV-2024-002',
                    status: 'paid',
                    description: 'Second installment for mobile app development',
                    paymentMethod: 'Credit Card'
                },
                {
                    id: 3,
                    clientName: 'Global Corp',
                    projectName: 'Corporate Website',
                    amount: 2800,
                    date: '2024-03-15',
                    installment: '4/4',
                    totalInstallments: 4,
                    currentInstallment: 4,
                    remaining: 'Project Completed',
                    invoiceNumber: 'INV-2024-003',
                    status: 'paid',
                    description: 'Final payment for corporate website',
                    paymentMethod: 'Bank Transfer'
                },
                {
                    id: 4,
                    clientName: 'Business Solutions Ltd',
                    projectName: 'CRM System',
                    amount: 4200,
                    date: '2024-03-10',
                    installment: '1/3',
                    totalInstallments: 3,
                    currentInstallment: 1,
                    remaining: '2 installments remaining',
                    invoiceNumber: 'INV-2024-004',
                    status: 'pending',
                    description: 'First installment for CRM system development',
                    paymentMethod: 'Bank Transfer'
                },
                {
                    id: 5,
                    clientName: 'Tech Solutions Inc',
                    projectName: 'E-commerce Website',
                    amount: 5000,
                    date: '2024-02-15',
                    installment: '2/5',
                    totalInstallments: 5,
                    currentInstallment: 2,
                    remaining: '3 installments remaining',
                    invoiceNumber: 'INV-2024-005',
                    status: 'paid',
                    description: 'Second installment for e-commerce development',
                    paymentMethod: 'Bank Transfer'
                },
            ];
            setPayments(samplePayments);
            localStorage.setItem('payments', JSON.stringify(samplePayments));
        }
    }, []);

    const addPayment = (paymentData: Omit<Payment, 'id'>) => {
        const newPayment: Payment = {
            ...paymentData,
            id: Date.now()
        };
        const updatedPayments = [...payments, newPayment];
        setPayments(updatedPayments);
        localStorage.setItem('payments', JSON.stringify(updatedPayments));
    };

    const updatePayment = (id: number, paymentData: Partial<Payment>) => {
        const updatedPayments = payments.map(payment =>
            payment.id === id ? { ...payment, ...paymentData } : payment
        );
        setPayments(updatedPayments);
        localStorage.setItem('payments', JSON.stringify(updatedPayments));
    };

    const deletePayment = (id: number) => {
        const updatedPayments = payments.filter(payment => payment.id !== id);
        setPayments(updatedPayments);
        localStorage.setItem('payments', JSON.stringify(updatedPayments));
    };

    const getPayment = (id: number) => {
        return payments.find(payment => payment.id === id);
    };

    const value = {
        payments,
        addPayment,
        updatePayment,
        deletePayment,
        getPayment
    };

    return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};