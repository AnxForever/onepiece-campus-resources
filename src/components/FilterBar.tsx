import React, { useState } from 'react';
import { Filter, X, ChevronDown, Tag, User, Calendar, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';

const FilterBar: React.FC = () => {
  const { filters, setFilters, materials } = useStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const materialTypes = [...new Set(materials.map(m => m.materialType))];
  const teachers = [...new Set(materials.map(m => m.teacher))];
  const years = [...new Set(materials.map(m => m.year.toString()))];

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value });
    setActiveDropdown(null);
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: filters.searchQuery,
      materialType: '',
      teacher: '',
      year: ''
    });
  };

  const clearSingleFilter = (key: string) => {
    setFilters({ [key]: '' });
  };

  const hasActiveFilters = filters.materialType || filters.teacher || filters.year;
  const activeFiltersCount = [filters.materialType, filters.teacher, filters.year].filter(Boolean).length;

  const FilterDropdown = ({ 
    label, 
    value, 
    options, 
    filterKey, 
    icon: Icon 
  }: {
    label: string;
    value: string;
    options: string[];
    filterKey: string;
    icon: React.ComponentType<any>;
  }) => {
    const isActive = activeDropdown === filterKey;
    const hasValue = Boolean(value);

    return (
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(isActive ? null : filterKey)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 ${
            hasValue 
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-500 shadow-lg' 
              : 'bg-white/80 backdrop-blur-sm text-neutral-700 border-neutral-200 hover:border-purple-300 hover:bg-white/90'
          }`}
        >
          <Icon className={`w-4 h-4 ${hasValue ? 'text-white' : 'text-neutral-500'}`} />
          <span className="text-sm font-medium">
            {value || label}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
            isActive ? 'rotate-180' : ''
          } ${hasValue ? 'text-white' : 'text-neutral-400'}`} />
        </button>

        {isActive && (
          <div className="absolute top-full left-0 mt-2 min-w-48 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl overflow-hidden z-40">
            <div className="p-2">
              <button
                onClick={() => handleFilterChange(filterKey, '')}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  !value ? 'bg-purple-50 text-purple-700' : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                全部{label.replace('筛选', '')}
              </button>
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleFilterChange(filterKey, option)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    value === option ? 'bg-purple-50 text-purple-700' : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {filterKey === 'year' ? `${option}年` : option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mb-8">
      {/* 筛选标题和统计 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            <span className="text-lg font-semibold text-neutral-800">智能筛选</span>
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              <span>{activeFiltersCount} 个筛选条件</span>
            </div>
          )}
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            清除全部
          </button>
        )}
      </div>

      {/* 筛选选项 */}
      <div className="flex flex-wrap gap-3 mb-4">
        <FilterDropdown
          label="类型筛选"
          value={filters.materialType}
          options={materialTypes}
          filterKey="materialType"
          icon={Layers}
        />
        
        <FilterDropdown
          label="教师筛选"
          value={filters.teacher}
          options={teachers}
          filterKey="teacher"
          icon={User}
        />
        
        <FilterDropdown
          label="年份筛选"
          value={filters.year}
          options={years.sort((a, b) => parseInt(b) - parseInt(a))}
          filterKey="year"
          icon={Calendar}
        />
      </div>

      {/* 活跃筛选标签 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.materialType && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-full text-sm">
              <Tag className="w-3 h-3" />
              <span>类型: {filters.materialType}</span>
              <button
                onClick={() => clearSingleFilter('materialType')}
                className="hover:bg-purple-300 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {filters.teacher && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-sm">
              <User className="w-3 h-3" />
              <span>教师: {filters.teacher}</span>
              <button
                onClick={() => clearSingleFilter('teacher')}
                className="hover:bg-blue-300 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          
          {filters.year && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full text-sm">
              <Calendar className="w-3 h-3" />
              <span>年份: {filters.year}年</span>
              <button
                onClick={() => clearSingleFilter('year')}
                className="hover:bg-green-300 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* 点击外部关闭下拉框 */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};

export default FilterBar;