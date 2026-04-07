import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-500',
                    text: 'text-green-800',
                    icon: '✓',
                    iconBg: 'bg-green-500'
                };
            case 'error':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-500',
                    text: 'text-red-800',
                    icon: '✕',
                    iconBg: 'bg-red-500'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-500',
                    text: 'text-yellow-800',
                    icon: '⚠',
                    iconBg: 'bg-yellow-500'
                };
            case 'info':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-500',
                    text: 'text-blue-800',
                    icon: 'ℹ',
                    iconBg: 'bg-blue-500'
                };
        }
    };

    const styles = getStyles();

    return (
        <div className="animate-slide-in">
            <div className={`${styles.bg} ${styles.text} border-l-4 ${styles.border} rounded-lg shadow-lg p-3 lg:p-4 min-w-[280px] lg:min-w-[300px] max-w-[calc(100vw-2rem)] lg:max-w-md`}>
                <div className="flex items-center gap-2 lg:gap-3">
                    <div className={`${styles.iconBg} text-white w-7 h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-sm lg:text-base`}>
                        {styles.icon}
                    </div>
                    <p className="flex-1 font-medium text-sm lg:text-base break-words">{message}</p>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                        <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast;
