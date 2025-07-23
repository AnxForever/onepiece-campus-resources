import React from 'react';
import { ArrowUpDown, Calendar, Star, Eye, Download } from 'lucide-react';
import { useStore } from '../store/useStore';

type SortOption = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SortBar: React.FC = () => {
  const { filters, setFilters } = useStore();
  const currentSort = filters.sortBy || 'newest';
  const sortOrder = filters.sortOrder || 'desc';

  const sortOptions: SortOption[] = [
    { key: 'newest', label: '最新发布', icon: Calendar },
    { key: 'oldest', label: '最早发布', icon: Calendar },
    { key: 'name', label: '名称排序', icon: ArrowUpDown },
    { key: 'popular', label: '最受欢迎', icon: Star },
    { key: 'downloads', label: '下载量', icon: Download },
  ];

  const handleSortChange = (sortKey: string) => {
    let newSortBy = sortKey;
    let newSortOrder: 'asc' | 'desc' = 'desc';

    // 处理特殊排序逻辑
    if (sortKey === 'oldest') {
      newSortBy = 'newest';
      newSortOrder = 'asc';
    } else if (sortKey === 'name') {
      newSortOrder = currentSort === 'name' && sortOrder === 'asc' ? 'desc' : 'asc';
    }

    setFilters({ 
      sortBy: newSortBy, 
      sortOrder: newSortOrder 
    });
  };

  const getCurrentSortLabel = () => {
    if (currentSort === 'newest' && sortOrder === 'asc') {
      return '最早发布';
    }
    const option = sortOptions.find(opt => opt.key === currentSort);
    return option?.label || '最新发布';
  };

  const getCurrentSortIcon = () => {
    if (currentSort === 'newest' && sortOrder === 'asc') {
      return Calendar;
    }
    const option = sortOptions.find(opt => opt.key === currentSort);
    return option?.icon || Calendar;
  };

  const CurrentIcon = getCurrentSortIcon();

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2 text-sm text-neutral-600">
        <ArrowUpDown className="w-4 h-4" />
        <span>排序方式:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isActive = 
            (option.key === currentSort) ||
            (option.key === 'oldest' && currentSort === 'newest' && sortOrder === 'asc');
          
          return (
            <button
              key={option.key}
              onClick={() => handleSortChange(option.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{option.label}</span>
              {option.key === 'name' && isActive && (
                <span className="text-xs opacity-70">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex items-center gap-2 text-xs text-neutral-500 ml-auto">
        <CurrentIcon className="w-3 h-3" />
        <span>当前: {getCurrentSortLabel()}</span>
      </div>
    </div>
  );
};

export default SortBar;