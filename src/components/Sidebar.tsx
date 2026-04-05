import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useOTPAuth } from '../contexts/OTPAuthContext';
import img1 from "../../public/elite8digital-nav.png"

const Sidebar: React.FC = () => {
    const { user, logout } = useOTPAuth();
    const navigate = useNavigate();

    const menuItems = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊', path: '/dashboard' },
        { id: 'clients', name: 'Clients', icon: '👥', path: '/clients' },
        { id: 'payment-history', name: 'Payment History', icon: '💳', path: '/payment-history' },
        { id: 'team', name: 'Team', icon: '🏢', path: '/team' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/otp-login');
    };

    return (
        <div className="w-64 bg-white shadow-lg flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-32 px-3 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <img 
                    src={img1} 
                    alt='logo' 
                    className="h-full mr-8 w-full object-contain"
                />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) => `
                            w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200
                            ${isActive
                                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700'
                                : 'text-gray-700 hover:bg-gray-50'
                            }
                        `}
                    >
                        <span className="text-xl mr-3">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                    <span className="mr-2">🚪</span>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;