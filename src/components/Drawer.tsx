import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    position?: 'bottom' | 'right';
}

const Drawer: React.FC<DrawerProps> = ({
    isOpen,
    onClose,
    title,
    children,
    position = 'bottom'
}) => {
    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const positionClasses = position === 'bottom'
        ? 'bottom-0 left-0 right-0 rounded-t-2xl max-h-[85vh]'
        : 'top-0 right-0 bottom-0 w-80 h-full rounded-l-2xl';

    const animationClasses = position === 'bottom'
        ? 'animate-[slideUp_0.3s_ease-out]'
        : 'animate-[slideLeft_0.3s_ease-out]';

    return (
        <div className="fixed inset-0 z-50 flex justify-end sm:justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Content */}
            <div
                className={`relative bg-white dark:bg-slate-900 shadow-2xl flex flex-col transition-transform duration-300 ${positionClasses} ${animationClasses}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Drawer;
