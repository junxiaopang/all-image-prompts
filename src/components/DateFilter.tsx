import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { translations, Language } from '../translations';

export type DateFilterType = 'all' | 'today' | 'week' | 'month' | 'custom';

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface DateFilterProps {
  selectedFilter: DateFilterType;
  onSelectFilter: (filter: DateFilterType) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  lang: Language;
}

const DateFilter: React.FC<DateFilterProps> = ({ 
  selectedFilter, 
  onSelectFilter, 
  dateRange,
  onDateRangeChange,
  lang 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDateDisplay = () => {
    if (selectedFilter === 'custom' && (dateRange.startDate || dateRange.endDate)) {
      const start = dateRange.startDate || '';
      const end = dateRange.endDate || '';
      if (start && end) {
        return `${start} ~ ${end}`;
      } else if (start) {
        return `${start} ~`;
      } else if (end) {
        return `~ ${end}`;
      }
    }
    return '';
  };

  const getLabel = (filter: DateFilterType) => {
    switch (filter) {
      case 'today': return t.dateToday;
      case 'week': return t.dateWeek;
      case 'month': return t.dateMonth;
      case 'custom': 
        const display = formatDateDisplay();
        return display || t.dateCustom;
      default: return t.dateFilter;
    }
  };

  const handleSelect = (filter: DateFilterType) => {
    onSelectFilter(filter);
    if (filter !== 'custom') {
      setIsOpen(false);
    }
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newRange = { ...dateRange };
    if (type === 'start') {
      newRange.startDate = value || null;
    } else {
      newRange.endDate = value || null;
    }
    onDateRangeChange(newRange);
    onSelectFilter('custom');
  };

  const clearDateRange = () => {
    onDateRangeChange({ startDate: null, endDate: null });
    onSelectFilter('all');
  };

  const hasCustomDate = dateRange.startDate || dateRange.endDate;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm font-medium shadow-sm transition-colors ${
          selectedFilter !== 'all'
            ? 'bg-primary text-white border-primary'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
        }`}
      >
        <Calendar size={16} />
        <span className="hidden xl:inline max-w-32 truncate">{getLabel(selectedFilter)}</span>
        <span className="xl:hidden max-w-24 truncate">{selectedFilter !== 'all' ? getLabel(selectedFilter) : t.dateFilter}</span>
        {hasCustomDate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              clearDateRange();
            }}
            className="ml-1 p-0.5 rounded-full hover:bg-white/20"
          >
            <X size={12} />
          </button>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* 预设选项 */}
          <div className="py-1 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => handleSelect('all')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${
                selectedFilter === 'all' ? 'text-primary font-medium' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {t.dateAll}
            </button>
            <button
              onClick={() => handleSelect('today')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${
                selectedFilter === 'today' ? 'text-primary font-medium' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {t.dateToday}
            </button>
            <button
              onClick={() => handleSelect('week')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${
                selectedFilter === 'week' ? 'text-primary font-medium' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {t.dateWeek}
            </button>
            <button
              onClick={() => handleSelect('month')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${
                selectedFilter === 'month' ? 'text-primary font-medium' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {t.dateMonth}
            </button>
          </div>

          {/* 自定义日期范围 */}
          <div className="p-4 space-y-3">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t.dateCustom}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 dark:text-slate-400 w-12">{t.dateStart}</label>
                <input
                  type="date"
                  value={dateRange.startDate || ''}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="flex-1 px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 dark:text-slate-400 w-12">{t.dateEnd}</label>
                <input
                  type="date"
                  value={dateRange.endDate || ''}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="flex-1 px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            {hasCustomDate && (
              <button
                onClick={clearDateRange}
                className="w-full mt-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md transition-colors"
              >
                {t.clearDateRange}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
