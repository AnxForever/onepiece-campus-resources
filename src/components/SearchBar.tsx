import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';

const SearchBar: React.FC = () => {
  const { filters, setFilters, materials } = useStore();
  const searchQuery = filters.searchQuery;
  const setSearchQuery = (query: string) => setFilters({ searchQuery: query });
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [recentSearches] = useState(['数据结构', '操作系统', '计算机网络']);

  useEffect(() => {
    if (searchQuery.length > 0 && materials && materials.length > 0) {
      const filtered = materials
        .filter(m => 
          m.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.materialType.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(m => m.courseName)
        .filter((value, index, self) => self.indexOf(value) === index)
        .slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && isFocused);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, materials, isFocused]);

  const handleClear = () => {
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchQuery.length === 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // 延迟隐藏建议，以便点击建议项
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* 搜索输入框 */}
      <div className={`relative transition-all duration-300 ${
        isFocused ? 'transform scale-105' : ''
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl blur-xl transition-opacity duration-300" 
             style={{ opacity: isFocused ? 1 : 0 }} />
        
        <div className="relative bg-white/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center">
            <div className="pl-6 pr-2">
              <Search className={`w-6 h-6 transition-all duration-300 ${
                isFocused ? 'text-purple-600 scale-110' : 'text-neutral-400'
              }`} />
            </div>
            
            <input
              ref={inputRef}
              type="text"
              placeholder="搜索课程名称、教师或资料类型..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="flex-1 py-4 px-2 bg-transparent border-none outline-none text-neutral-800 placeholder-neutral-400 text-lg"
            />
            
            {searchQuery && (
              <button
                onClick={handleClear}
                className="p-2 mr-4 text-neutral-400 hover:text-neutral-600 transition-colors rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* 搜索建议下拉框 */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50">
              {searchQuery.length === 0 ? (
                /* 最近搜索 */
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3 text-sm text-neutral-500">
                    <Clock className="w-4 h-4" />
                    <span>最近搜索</span>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 mb-2 text-sm text-neutral-500">
                    <TrendingUp className="w-4 h-4" />
                    <span>热门搜索</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['数据结构', '算法设计', '数据库', '软件工程'].map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(tag)}
                        className="px-3 py-1 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-full text-sm hover:from-purple-200 hover:to-purple-300 transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* 搜索建议 */
                <div className="p-2">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500">
                    <Sparkles className="w-4 h-4" />
                    <span>搜索建议</span>
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-3 py-2 text-neutral-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <Search className="w-4 h-4 text-neutral-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* 搜索快捷键提示 */}
      <div className="flex items-center justify-center mt-4 text-sm text-neutral-500">
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-white/50 border border-neutral-200 rounded text-xs">Ctrl</kbd>
          <span>+</span>
          <kbd className="px-2 py-1 bg-white/50 border border-neutral-200 rounded text-xs">K</kbd>
          <span className="ml-2">快速搜索</span>
        </span>
      </div>
    </div>
  );
};

export default SearchBar;