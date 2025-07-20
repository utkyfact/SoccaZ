import React from 'react';

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Onayla', cancelText = 'İptal', type = 'warning' }) {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'danger':
                return '🗑️';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            case 'success':
                return '✅';
            default:
                return '❓';
        }
    };

    const getColors = () => {
        switch (type) {
            case 'danger':
                return {
                    bg: 'bg-red-500',
                    button: 'bg-red-600 hover:bg-red-700',
                    cancelButton: 'bg-gray-500 hover:bg-gray-600'
                };
            case 'warning':
                return {
                    bg: 'bg-orange-500',
                    button: 'bg-orange-600 hover:bg-orange-700',
                    cancelButton: 'bg-gray-500 hover:bg-gray-600'
                };
            case 'info':
                return {
                    bg: 'bg-blue-500',
                    button: 'bg-blue-600 hover:bg-blue-700',
                    cancelButton: 'bg-gray-500 hover:bg-gray-600'
                };
            case 'success':
                return {
                    bg: 'bg-green-500',
                    button: 'bg-green-600 hover:bg-green-700',
                    cancelButton: 'bg-gray-500 hover:bg-gray-600'
                };
            default:
                return {
                    bg: 'bg-gray-500',
                    button: 'bg-gray-600 hover:bg-gray-700',
                    cancelButton: 'bg-gray-500 hover:bg-gray-600'
                };
        }
    };

    const colors = getColors();

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all">
                {/* Header */}
                <div className={`${colors.bg} text-white p-6 rounded-t-xl`}>
                    <div className="flex items-center">
                        <span className="text-3xl mr-4">{getIcon()}</span>
                        <h2 className="text-xl font-bold">{title}</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className={`flex-1 ${colors.cancelButton} text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium cursor-pointer`}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            className={`flex-1 ${colors.button} text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium cursor-pointer`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal; 