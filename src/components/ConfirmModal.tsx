import React from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type = 'warning'
}) => {
    if (!isOpen) return null;

    const getColors = () => {
        switch (type) {
            case 'danger':
                return {
                    gradient: 'from-red-500 to-red-600',
                    hoverGradient: 'hover:from-red-600 hover:to-red-700',
                    icon: '⚠️'
                };
            case 'warning':
                return {
                    gradient: 'from-orange-500 to-orange-600',
                    hoverGradient: 'hover:from-orange-600 hover:to-orange-700',
                    icon: '⚠️'
                };
            case 'info':
                return {
                    gradient: 'from-blue-500 to-indigo-600',
                    hoverGradient: 'hover:from-blue-600 hover:to-indigo-700',
                    icon: 'ℹ️'
                };
        }
    };

    const colors = getColors();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-slideUp">
                {/* Header */}
                <div className={`bg-gradient-to-r ${colors.gradient} rounded-t-2xl p-6`}>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-2xl">{colors.icon}</span>
                        {title}
                    </h3>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-700">{message}</p>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-3 bg-gradient-to-r ${colors.gradient} ${colors.hoverGradient} text-white rounded-lg transition-all font-medium`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default ConfirmModal;
