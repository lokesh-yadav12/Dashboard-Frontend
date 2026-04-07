import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOTPAuth } from '../contexts/OTPAuthContext';
import { useToast } from '../contexts/ToastContext';

const OTPLogin: React.FC = () => {
    const navigate = useNavigate();
    const { requestOTP, verifyOTP, isAuthenticated } = useOTPAuth();
    const toast = useToast();

    const [step, setStep] = useState<'email' | 'otp'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOTP] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await requestOTP(email);
        
        if (result.success) {
            toast.success(result.message);
            setStep('otp');
            setCountdown(60); // 60 seconds cooldown
        } else {
            toast.error(result.message);
        }

        setIsLoading(false);
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await verifyOTP(email, otp);
        
        if (result.success) {
            toast.success('Login successful!');
            navigate('/dashboard');
        } else {
            toast.error(result.message);
        }

        setIsLoading(false);
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;
        
        setIsLoading(true);
        const result = await requestOTP(email);
        
        if (result.success) {
            toast.success('OTP resent successfully!');
            setCountdown(60);
        } else {
            toast.error(result.message);
        }
        
        setIsLoading(false);
    };

    const handleBackToEmail = () => {
        setStep('email');
        setOTP('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-6 lg:mb-8">
                    <div className="inline-block p-3 lg:p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-3 lg:mb-4">
                        <span className="text-3xl lg:text-4xl">🔐</span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Dashboard Login</h1>
                    <p className="text-sm lg:text-base text-gray-600">Secure access with OTP verification</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
                    {step === 'email' ? (
                        /* Email Step */
                        <form onSubmit={handleRequestOTP} className="space-y-5 lg:space-y-6">
                            <div>
                                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Enter Your Email</h2>
                                <p className="text-xs lg:text-sm text-gray-600 mb-4">We'll send you a one-time password</p>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-2.5 lg:py-3 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full py-2.5 lg:py-3 text-sm lg:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 lg:h-5 lg:w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        Send OTP
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        /* OTP Step */
                        <form onSubmit={handleVerifyOTP} className="space-y-5 lg:space-y-6">
                            <div>
                                <button
                                    type="button"
                                    onClick={handleBackToEmail}
                                    className="flex items-center gap-2 text-xs lg:text-sm text-gray-600 hover:text-gray-900 mb-4"
                                >
                                    <svg className="w-3 h-3 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Change email
                                </button>
                                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2">Enter OTP</h2>
                                <p className="text-xs lg:text-sm text-gray-600 mb-1">
                                    We sent a code to <span className="font-medium text-gray-900 break-all">{email}</span>
                                </p>
                                <p className="text-xs text-gray-500">Check your inbox and spam folder</p>
                            </div>

                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    6-Digit Code
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    required
                                    placeholder="000000"
                                    maxLength={6}
                                    className="w-full px-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-xl lg:text-2xl font-bold tracking-widest"
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.length !== 6}
                                className="w-full py-2.5 lg:py-3 text-sm lg:text-base bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 lg:h-5 lg:w-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify & Login
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={countdown > 0 || isLoading}
                                    className="text-xs lg:text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                                >
                                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-4 lg:mt-6">
                    <p className="text-xs lg:text-sm text-gray-600">
                        🔒 Secure login with email verification
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OTPLogin;
