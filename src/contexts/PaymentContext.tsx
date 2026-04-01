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
    invoiceDocument?: string;
}

interface PaymentContextType {
    payments: Payment[];
    addPayment: (payment: Omit<Payment, 'id'>) => void;
    updatePayment: (id: number, payment: Partial<Payment>) => void;
    deletePayment: (id: number) => void;
    getPayment: (id: number) => Payment | undefined;
    updateClientNameInPayments: (oldClientName: string, newClientName: string, newProjectName?: string) => void;
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
            const samplePayments: Payment[] = [];
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

    const updateClientNameInPayments = (oldClientName: string, newClientName: string, newProjectName?: string) => {
        const updatedPayments = payments.map(payment => {
            if (payment.clientName === oldClientName) {
                return {
                    ...payment,
                    clientName: newClientName,
                    ...(newProjectName && { projectName: newProjectName })
                };
            }
            return payment;
        });
        setPayments(updatedPayments);
        localStorage.setItem('payments', JSON.stringify(updatedPayments));
    };

    const value = {
        payments,
        addPayment,
        updatePayment,
        deletePayment,
        getPayment,
        updateClientNameInPayments
    };

    return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};