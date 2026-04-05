import React, { createContext, useContext, useState, useEffect } from 'react';
import { requestOTP as requestOTPService, verifyOTP as verifyOTPService, verifyToken } from '../services/otpAuthService';

interface User {
    email: string;
}

interface OTPAuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    requestOTP: (email: string) => Promise<{ success: boolean; message: string }>;
    verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
}

const OTPAuthContext = createContext<OTPAuthContextType | undefined>(undefined);

export const useOTPAuth = () => {
    const context = useContext(OTPAuthContext);
    if (!context) {
        throw new Error('useOTPAuth must be used within OTPAuthProvider');
    }
    return context;
};

export const OTPAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('otp_auth_token');
            if (storedToken) {
                const result = await verifyToken(storedToken);
                if (result.success && result.user) {
                    setToken(storedToken);
                    setUser(result.user);
                } else {
                    // Token invalid, clear it
                    localStorage.removeItem('otp_auth_token');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const requestOTP = async (email: string) => {
        try {
            const result = await requestOTPService(email);
            return {
                success: result.success,
                message: result.message
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to request OTP'
            };
        }
    };

    const verifyOTPHandler = async (email: string, otp: string) => {
        try {
            const result = await verifyOTPService(email, otp);
            if (result.success && result.token && result.user) {
                setToken(result.token);
                setUser(result.user);
                localStorage.setItem('otp_auth_token', result.token);
            }
            return {
                success: result.success,
                message: result.message
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to verify OTP'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('otp_auth_token');
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        requestOTP,
        verifyOTP: verifyOTPHandler,
        logout
    };

    return <OTPAuthContext.Provider value={value}>{children}</OTPAuthContext.Provider>;
};
