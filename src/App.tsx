import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ClientProvider } from './contexts/ClientContext';
import { TeamProvider } from './contexts/TeamContext';
import { PaymentProvider } from './contexts/PaymentContext';
import AuthWrapper from './components/AuthWrapper';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import PaymentHistory from './pages/PaymentHistory';
import Team from './pages/Team';

function App() {
    return (
        <AuthProvider>
            <ClientProvider>
                <TeamProvider>
                    <PaymentProvider>
                        <AuthWrapper>
                            <DashboardContent />
                        </AuthWrapper>
                    </PaymentProvider>
                </TeamProvider>
            </ClientProvider>
        </AuthProvider>
    );
}

function DashboardContent() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'clients':
                return <Clients />;
            case 'payment-history':
                return <PaymentHistory />;
            case 'team':
                return <Team />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm border-b border-gray-200 md:hidden">
                    <div className="flex items-center justify-between px-4 py-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">Business Dashboard</h1>
                    </div>
                </header>

                <main className="flex-1 overflow-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default App;