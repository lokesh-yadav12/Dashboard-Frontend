import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClientProvider } from './contexts/ClientContext';
import { TeamProvider } from './contexts/TeamContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { ToastProvider } from './contexts/ToastContext';
import { OTPAuthProvider } from './contexts/OTPAuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OTPLogin from './pages/OTPLogin';
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
        <ToastProvider>
            <OTPAuthProvider>
                <ClientProvider>
                    <TeamProvider>
                        <PaymentProvider>
                            <Router>
                                <Routes>
                                    {/* Public Route - OTP Login */}
                                    <Route path="/otp-login" element={<OTPLogin />} />
                                    
                                    {/* Protected Routes - Dashboard */}
                                    <Route path="/*" element={
                                        <ProtectedRoute>
                                            <DashboardContent />
                                        </ProtectedRoute>
                                    } />
                                </Routes>
                            </Router>
                        </PaymentProvider>
                    </TeamProvider>
                </ClientProvider>
            </OTPAuthProvider>
        </ToastProvider>
    );
}

function DashboardContent() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-30 
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Mobile Header */}
                <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
                    <div className="w-10" /> {/* Spacer for centering */}
                </div>

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