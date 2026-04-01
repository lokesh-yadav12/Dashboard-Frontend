import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ClientProvider } from './contexts/ClientContext';
import { TeamProvider } from './contexts/TeamContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { ToastProvider } from './contexts/ToastContext';
import AuthWrapper from './components/AuthWrapper';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ClientDetails from './pages/ClientDetails';
import PaymentHistory from './pages/PaymentHistory';
import PaymentDetails from './pages/PaymentDetails';
import Team from './pages/Team';
import TeamMemberDetails from './pages/TeamMemberDetails';

function App() {
    return (
        <AuthProvider>
            <ClientProvider>
                <TeamProvider>
                    <PaymentProvider>
                        <ToastProvider>
                            <Router>
                                <AuthWrapper>
                                    <DashboardContent />
                                </AuthWrapper>
                            </Router>
                        </ToastProvider>
                    </PaymentProvider>
                </TeamProvider>
            </ClientProvider>
        </AuthProvider>
    );
}

function DashboardContent() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/clients/:id" element={<ClientDetails />} />
                        <Route path="/payment-history" element={<PaymentHistory />} />
                        <Route path="/payments/:id" element={<PaymentDetails />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/team/:id" element={<TeamMemberDetails />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}

export default App;