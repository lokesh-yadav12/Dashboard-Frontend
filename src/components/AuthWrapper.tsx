import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

interface AuthWrapperProps {
    children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const { user, isLoading } = useAuth();
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return authMode === 'login' ? (
            <Login onSwitchToSignup={() => setAuthMode('signup')} />
        ) : (
            <Signup onSwitchToLogin={() => setAuthMode('login')} />
        );
    }

    return <>{children}</>;
};

export default AuthWrapper;