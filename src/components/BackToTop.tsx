import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-24 right-0 p-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-y border-l border-slate-200 dark:border-slate-700 rounded-l-xl shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary dark:hover:text-primary transition-all duration-300 z-50 animate-in slide-in-from-right-full"
            aria-label="Back to top"
        >
            <ArrowUp size={20} />
        </button>
    );
};

export default BackToTop;
