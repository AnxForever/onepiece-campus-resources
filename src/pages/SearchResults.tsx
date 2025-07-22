import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SortAsc, SortDesc, BookOpen, Code, Calendar, User, ArrowLeft, Lightbulb, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import Navbar from '../components/Navbar';
import MaterialCard from '../components/MaterialCard';
import Empty from '../components/Empty';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'correction' | 'related' | 'popular';
}

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { materials } = useStore();
  const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // 筛选状态
  const [filters, setFilters] = useState({
    contentType: '',
    course: '',
    year: '',
    semester: '',
    teacher: ''
  });
  
  // 搜索建议
  const [suggestions] = useState<SearchSuggestion[]>([
    { id: '1', text: '数据结构', type: 'correction' },
    { id: '2', text: '算法设计', type: 'related' },
    { id: '3', text: '操作系统', type: 'related' },
    { id: '4', text: '计算机网络', type: 'popular' },
    { id: '5', text: '软件工程', type: 'popular' }
  ]);
  
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  
  // 获取筛选选项
  const getFilterOptions = () => {
    const courses = [...new Set(materials.map(m => m.courseName))].sort();
    const years = [...new Set(materials.map(m => m.year))].sort((a, b) => parseInt(b) - parseInt(a));
    const semesters = [...new Set(materials.map(m => m.semester))].sort();
    const teachers = [...new Set(materials.map(m => m.teacher))].sort();
    
    return { courses, years, semesters, teachers };
  };
  
  const { courses, years, semesters, teachers } = getFilterOptions();
  
  // 搜索和筛选逻辑
  useEffect(() => {
    let results = materials;
    
    // 关键词搜索
    if (query) {
      results = results.filter(material => 
        material.courseName.toLowerCase().includes(query.toLowerCase()) ||
        material.courseName.toLowerCase().includes(query.toLowerCase()) ||
        material.teacher.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // 应用筛选
    if (filters.contentType) {
      results = results.filter(m => m.contentType === filters.contentType);
    }
    if (filters.course) {
      results = results.filter(m => m.courseName === filters.course);
    }
    if (filters.year) {
      results = results.filter(m => m.year.toString() === filters.year);
    }
    if (filters.semester) {
      results = results.filter(m => m.semester === filters.semester);
    }
    if (filters.teacher) {
      results = results.filter(m => m.teacher === filters.teacher);
    }
    
    // 排序
    results.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.courseName.localeCompare(b.courseName);
          break;
        case 'course':
          comparison = a.courseName.localeCompare(b.courseName);
          break;
        case 'year':
          comparison = parseInt(a.year) - parseInt(b.year);
          break;
        case 'teacher':
          comparison = a.teacher.localeCompare(b.teacher);
          break;
        default: // relevance
          // 简单的相关性排序：标题匹配优先
          if (query) {
            const aRelevance = a.courseName.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            const bRelevance = b.courseName.toLowerCase().includes(query.toLowerCase()) ? 1 : 0;
            comparison = bRelevance - aRelevance;
          }
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredMaterials(results);
  }, [materials, query, filters, sortBy, sortOrder]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };
  
  const clearFilters = () => {
    setFilters({
      contentType: '',
      course: '',
      year: '',
      semester: '',
      teacher: ''
    });
  };
  
  const hasActiveFilters = Object.values(filters).some(value => value !== '');
  
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'correction': return <Search className="w-4 h-4" />;
      case 'related': return <Lightbulb className="w-4 h-4" />;
      case 'popular': return <TrendingUp className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };
  
  const getSuggestionLabel = (type: string) => {
    switch (type) {
      case 'correction': return '搜索建议';
      case 'related': return '相关搜索';
      case 'popular': return '热门搜索';
      default: return '搜索建议';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
      </div>

      <Navbar />
      
      <div className={`relative z-10 container mx-auto px-4 pt-20 pb-16 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-8 px-4 py-2 bg-white/80 backdrop-blur-sm text-neutral-700 rounded-xl hover:bg-white transition-all duration-200 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回首页</span>
        </button>

        {/* 搜索区域 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 mb-6">
            搜索结果
            {query && (
              <span className="text-lg font-normal text-neutral-600 ml-3">
                关于 "{query}" 的结果
              </span>
            )}
          </h1>
          
          {/* 搜索框 */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="搜索试卷、代码项目、课程名称..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
              >
                搜索
              </button>
            </div>
          </form>
          
          {/* 搜索建议 */}
          {query && filteredMaterials.length === 0 && (
            <div className="bg-neutral-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">搜索建议</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => {
                      setSearchInput(suggestion.text);
                      navigate(`/search?q=${encodeURIComponent(suggestion.text)}`);
                    }}
                    className="flex items-center gap-3 w-full text-left p-3 bg-white rounded-xl hover:bg-neutral-100 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${
                      suggestion.type === 'correction' ? 'bg-blue-100 text-blue-600' :
                      suggestion.type === 'related' ? 'bg-green-100 text-green-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {getSuggestionIcon(suggestion.type)}
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">{suggestion.text}</p>
                      <p className="text-sm text-neutral-500">{getSuggestionLabel(suggestion.type)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 筛选和排序工具栏 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  showFilters || hasActiveFilters
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>筛选</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                )}
              </button>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  清除筛选
                </button>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">
                找到 {filteredMaterials.length} 个结果
              </span>
              
              <div className="flex items-center gap-2">
                <label className="text-sm text-neutral-600">排序：</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="relevance">相关性</option>
                  <option value="title">标题</option>
                  <option value="course">课程</option>
                  <option value="year">年份</option>
                  <option value="teacher">教师</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-1 text-neutral-600 hover:text-neutral-800 transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* 筛选面板 */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">资源类型</label>
                  <select
                    value={filters.contentType}
                    onChange={(e) => setFilters({...filters, contentType: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">全部类型</option>
                    <option value="Paper">试卷资料</option>
                    <option value="Code">代码项目</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">课程</label>
                  <select
                    value={filters.course}
                    onChange={(e) => setFilters({...filters, course: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">全部课程</option>
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">年份</label>
                  <select
                    value={filters.year}
                    onChange={(e) => setFilters({...filters, year: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">全部年份</option>
                    {years.map(year => (
                      <option key={year} value={year.toString()}>{year}年</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">学期</label>
                  <select
                    value={filters.semester}
                    onChange={(e) => setFilters({...filters, semester: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">全部学期</option>
                    {semesters.map(semester => (
                      <option key={semester} value={semester}>{semester}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">教师</label>
                  <select
                    value={filters.teacher}
                    onChange={(e) => setFilters({...filters, teacher: e.target.value})}
                    className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">全部教师</option>
                    {teachers.map(teacher => (
                      <option key={teacher} value={teacher}>{teacher}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 搜索结果 */}
        {filteredMaterials.length === 0 ? (
          <Empty 
            message={query ? `未找到与 "${query}" 相关的资源` : '请输入搜索关键词'}
            description={query ? '尝试使用不同的关键词或调整筛选条件' : '在上方搜索框中输入您要查找的内容'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;