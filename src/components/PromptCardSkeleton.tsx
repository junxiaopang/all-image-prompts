import React from 'react';

const PromptCardSkeleton: React.FC = () => {
    return (
        <div className="break-inside-avoid mb-4 rounded-xl overflow-hidden bg-white dark:bg-dark-card shadow-sm border border-gray-100 dark:border-dark-border">
            {/* Image Placeholder */}
            <div className="w-full h-64 bg-gray-200 dark:bg-slate-800 animate-pulse" />

            {/* Content Placeholder */}
            <div className="p-3 space-y-3">
                {/* Title & Like */}
                <div className="flex justify-between items-start gap-4">
                    <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded w-8 animate-pulse" />
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 flex-wrap">
                    <div className="h-5 bg-gray-100 dark:bg-slate-800 rounded w-12 animate-pulse" />
                    <div className="h-5 bg-gray-100 dark:bg-slate-800 rounded w-16 animate-pulse" />
                    <div className="h-5 bg-gray-100 dark:bg-slate-800 rounded w-10 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default PromptCardSkeleton;
