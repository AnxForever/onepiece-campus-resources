import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, X, ArrowUpDown, Upload } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getMaterials, getStatistics } from '../api';
import Navbar from '../components/Navbar';
import MaterialCard from '../components/MaterialCard';
import { Material, FilterState, SortOption } from '../types';
import { toast } from 'react-hot-toast';

const Home: React.FC = () => {
  const { 
    materials, 
    setMaterials,
    admin,
    filter,
    setFilter,
    resetFilter,
    sortOption,
    setSortOption,
    searchKeyword,
    setSearchKeyword,
    toggleUploadModal
  } = useStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalProjects: 0,
    totalMaterials: 0
  });
  
  // 获取资料列表和统计数据
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // 获取资料列表
        const materialsResponse = await getMaterials();
        if (materialsResponse.success) {
          setMaterials(materialsResponse.data);
        } else {
          toast.error(materialsResponse.message || '获取资料列表失败');
        }
        
        // 获取统计数据
        const statsResponse = await getStatistics();
        if (statsResponse.success) {
          setStats({
            totalExams: statsResponse.data.totalExams,
            totalProjects: statsResponse.data.totalProjects,
            totalMaterials: statsResponse.data.totalMaterials
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('获取数据失败，请稍后再试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [setMaterials]);
  
  // 处理搜索输入变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };
  
  // 处理筛选变化
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilter({ [key]: value });
  };
  
  // 处理排序变化
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setIsSortOpen(false);
  };
  
  // 筛选和排序资料
  const filteredAndSortedMaterials = React.useMemo(() => {
    // 先筛选
    let result = materials.filter(material => {
      // 搜索关键词筛选
      if (searchKeyword && !material.title.toLowerCase().includes(searchKeyword.toLowerCase()) && 
          !material.description.toLowerCase().includes(searchKeyword.toLowerCase())) {
        return false;
      }
      
      // 资料类型筛选
      if (filter.materialType !== 'all' && material.materialType !== filter.materialType) {
        return false;
      }
      
      // 课程类型筛选
      if (filter.courseType !== 'all' && material.courseType !== filter.courseType) {
        return false;
      }
      
      // 编程语言筛选（仅对代码项目）
      if (material.materialType === 'code' && filter.programmingLanguage && 
          filter.programmingLanguage !== 'all' && material.programmingLanguage !== filter.programmingLanguage) {
        return false;
      }
      
      // 年份筛选
      if (filter.year !== 'all' && material.year !== filter.year) {
        return false;
      }
      
      // 学期筛选
      if (filter.semester !== 'all' && material.semester !== filter.semester) {
        return false;
      }
      
      return true;
    });
    
    // 再排序
    result.sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'oldest':
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        case 'mostViewed':
          return b.views - a.views;
        case 'mostDownloaded':
          return b.downloads - a.downloads;
        case 'mostFavorited':
          return b.favorites - a.favorites;
        default:
          return 0;
      }
    });
    
    return result;
  }, [materials, searchKeyword, filter, sortOption]);
  
  // 动态粒子背景
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    speed: Math.random() * 1 + 0.5
  }));
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 动态背景 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 opacity-70"></div>
        {particles.map((particle) => (
          <div 
            key={particle.id}
            className="absolute rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.speed * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          ></div>
        ))}
      </div>
      
      {/* 导航栏 */}
      <Navbar />
      
      {/* 主内容 */}
      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              OnePiece
            </span>
            <span className="ml-2">校园资源共享平台</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-gray-500">
            汇集优质考试资料与代码项目，助力学习与成长
          </p>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 试卷资料 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-purple-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">试卷资料</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalExams}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* 代码项目 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">代码项目</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalProjects}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
            </div>
          </div>
          
          {/* 总资源数 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-indigo-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">总资源数</p>
                <h3 className="text-3xl font-bold text-gray-900">{stats.totalMaterials}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* 特色标签 */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">零后端成本</span>
          </div>
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">快速上线</span>
          </div>
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">社区驱动</span>
          </div>
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">AI智能</span>
          </div>
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
              <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">极速体验</span>
          </div>
        </div>
        
        {/* 搜索和筛选区域 */}
        <div className="mb-8">
          {/* 搜索框 */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="搜索资料标题或描述..."
              value={searchKeyword}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          
          {/* 筛选和排序区域 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {/* 筛选按钮 */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-1.5" />
                  筛选
                </button>
                
                {/* 筛选下拉菜单 */}
                {isFilterOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">筛选选项</h3>
                      <div className="flex items-center">
                        <button
                          onClick={() => resetFilter()}
                          className="text-xs text-purple-600 hover:text-purple-800 mr-2"
                        >
                          重置
                        </button>
                        <button
                          onClick={() => setIsFilterOpen(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    {/* 资料类型筛选 */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">资料类型</label>
                      <select
                        value={filter.materialType}
                        onChange={(e) => handleFilterChange('materialType', e.target.value)}
                        className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="all">全部</option>
                        <option value="exam">试卷资料</option>
                        <option value="code">代码项目</option>
                      </select>
                    </div>
                    
                    {/* 课程类型筛选 */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">课程类型</label>
                      <select
                        value={filter.courseType}
                        onChange={(e) => handleFilterChange('courseType', e.target.value)}
                        className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="all">全部</option>
                        <option value="dataStructure">数据结构</option>
                        <option value="algorithms">算法</option>
                        <option value="computerNetworks">计算机网络</option>
                        <option value="operatingSystems">操作系统</option>
                        <option value="databaseSystems">数据库系统</option>
                        <option value="compilers">编译原理</option>
                        <option value="computerArchitecture">计算机组成原理</option>
                        <option value="softwareEngineering">软件工程</option>
                        <option value="webDevelopment">Web开发</option>
                        <option value="mobileDevelopment">移动开发</option>
                        <option value="artificialIntelligence">人工智能</option>
                        <option value="machineLearning">机器学习</option>
                        <option value="deepLearning">深度学习</option>
                        <option value="computerVision">计算机视觉</option>
                        <option value="naturalLanguageProcessing">自然语言处理</option>
                        <option value="distributedSystems">分布式系统</option>
                        <option value="cloudComputing">云计算</option>
                        <option value="bigData">大数据</option>
                        <option value="informationSecurity">信息安全</option>
                        <option value="other">其他</option>
                      </select>
                    </div>
                    
                    {/* 编程语言筛选（仅当资料类型为代码项目时显示） */}
                    {filter.materialType === 'code' && (
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">编程语言</label>
                        <select
                          value={filter.programmingLanguage || 'all'}
                          onChange={(e) => handleFilterChange('programmingLanguage', e.target.value)}
                          className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="all">全部</option>
                          <option value="c">C</option>
                          <option value="cpp">C++</option>
                          <option value="java">Java</option>
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                          <option value="typescript">TypeScript</option>
                          <option value="go">Go</option>
                          <option value="rust">Rust</option>
                          <option value="csharp">C#</option>
                          <option value="php">PHP</option>
                          <option value="ruby">Ruby</option>
                          <option value="swift">Swift</option>
                          <option value="kotlin">Kotlin</option>
                          <option value="scala">Scala</option>
                          <option value="r">R</option>
                          <option value="matlab">MATLAB</option>
                          <option value="assembly">Assembly</option>
                          <option value="sql">SQL</option>
                          <option value="other">其他</option>
                        </select>
                      </div>
                    )}
                    
                    {/* 年份筛选 */}
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">年份</label>
                      <select
                        value={filter.year}
                        onChange={(e) => handleFilterChange('year', e.target.value)}
                        className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="all">全部</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                      </select>
                    </div>
                    
                    {/* 学期筛选 */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">学期</label>
                      <select
                        value={filter.semester}
                        onChange={(e) => handleFilterChange('semester', e.target.value)}
                        className="block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="all">全部</option>
                        <option value="spring">春季学期</option>
                        <option value="fall">秋季学期</option>
                        <option value="summer">夏季学期</option>
                        <option value="winter">冬季学期</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 排序按钮 */}
              <div className="relative">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  <ArrowUpDown className="h-4 w-4 mr-1.5" />
                  排序
                </button>
                
                {/* 排序下拉菜单 */}
                {isSortOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 py-1 border border-gray-200">
                    <button
                      onClick={() => handleSortChange('latest')}
                      className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'latest' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      最新上传
                    </button>
                    <button
                      onClick={() => handleSortChange('oldest')}
                      className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'oldest' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      最早上传
                    </button>
                    <button
                      onClick={() => handleSortChange('mostViewed')}
                      className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'mostViewed' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      最多浏览
                    </button>
                    <button
                      onClick={() => handleSortChange('mostDownloaded')}
                      className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'mostDownloaded' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      最多下载
                    </button>
                    <button
                      onClick={() => handleSortChange('mostFavorited')}
                      className={`w-full text-left px-4 py-2 text-sm ${sortOption === 'mostFavorited' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      最多收藏
                    </button>
                  </div>
                )}
              </div>
              
              {/* 活跃筛选标签 */}
              {(filter.materialType !== 'all' || 
                filter.courseType !== 'all' || 
                (filter.programmingLanguage && filter.programmingLanguage !== 'all') || 
                filter.year !== 'all' || 
                filter.semester !== 'all' || 
                searchKeyword) && (
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                  {filter.materialType !== 'all' && (
                    <div className="flex items-center bg-purple-50 px-2 py-1 rounded-full text-xs text-purple-700">
                      {filter.materialType === 'exam' ? '试卷资料' : '代码项目'}
                      <button 
                        onClick={() => handleFilterChange('materialType', 'all')}
                        className="ml-1 text-purple-500 hover:text-purple-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {filter.courseType !== 'all' && (
                    <div className="flex items-center bg-blue-50 px-2 py-1 rounded-full text-xs text-blue-700">
                      {{
                        'dataStructure': '数据结构',
                        'algorithms': '算法',
                        'computerNetworks': '计算机网络',
                        'operatingSystems': '操作系统',
                        'databaseSystems': '数据库系统',
                        'compilers': '编译原理',
                        'computerArchitecture': '计算机组成原理',
                        'softwareEngineering': '软件工程',
                        'webDevelopment': 'Web开发',
                        'mobileDevelopment': '移动开发',
                        'artificialIntelligence': '人工智能',
                        'machineLearning': '机器学习',
                        'deepLearning': '深度学习',
                        'computerVision': '计算机视觉',
                        'naturalLanguageProcessing': '自然语言处理',
                        'distributedSystems': '分布式系统',
                        'cloudComputing': '云计算',
                        'bigData': '大数据',
                        'informationSecurity': '信息安全',
                        'other': '其他'
                      }[filter.courseType] || filter.courseType}
                      <button 
                        onClick={() => handleFilterChange('courseType', 'all')}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {filter.programmingLanguage && filter.programmingLanguage !== 'all' && (
                    <div className="flex items-center bg-green-50 px-2 py-1 rounded-full text-xs text-green-700">
                      {{
                        'c': 'C',
                        'cpp': 'C++',
                        'java': 'Java',
                        'python': 'Python',
                        'javascript': 'JavaScript',
                        'typescript': 'TypeScript',
                        'go': 'Go',
                        'rust': 'Rust',
                        'csharp': 'C#',
                        'php': 'PHP',
                        'ruby': 'Ruby',
                        'swift': 'Swift',
                        'kotlin': 'Kotlin',
                        'scala': 'Scala',
                        'r': 'R',
                        'matlab': 'MATLAB',
                        'assembly': 'Assembly',
                        'sql': 'SQL',
                        'other': '其他'
                      }[filter.programmingLanguage] || filter.programmingLanguage}
                      <button 
                        onClick={() => handleFilterChange('programmingLanguage', 'all')}
                        className="ml-1 text-green-500 hover:text-green-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {filter.year !== 'all' && (
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full text-xs text-yellow-700">
                      {filter.year}年
                      <button 
                        onClick={() => handleFilterChange('year', 'all')}
                        className="ml-1 text-yellow-500 hover:text-yellow-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {filter.semester !== 'all' && (
                    <div className="flex items-center bg-red-50 px-2 py-1 rounded-full text-xs text-red-700">
                      {{
                        'spring': '春季学期',
                        'fall': '秋季学期',
                        'summer': '夏季学期',
                        'winter': '冬季学期'
                      }[filter.semester] || filter.semester}
                      <button 
                        onClick={() => handleFilterChange('semester', 'all')}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  {searchKeyword && (
                    <div className="flex items-center bg-indigo-50 px-2 py-1 rounded-full text-xs text-indigo-700">
                      搜索: {searchKeyword}
                      <button 
                        onClick={() => setSearchKeyword('')}
                        className="ml-1 text-indigo-500 hover:text-indigo-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  
                  <button 
                    onClick={resetFilter}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    清除全部
                  </button>
                </div>
              )}
            </div>
            
            {/* 管理员上传按钮 */}
            {admin.isAdminMode && (
              <button
                onClick={() => toggleUploadModal(true)}
                className="flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors shadow-sm"
              >
                <Upload className="h-4 w-4 mr-1.5" />
                上传资源
              </button>
            )}
          </div>
        </div>
        
        {/* 资料网格 */}
        <div>
          {/* 精选资源标题 */}
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {filteredAndSortedMaterials.length > 0 ? (
              <>
                {searchKeyword ? `搜索结果` : `精选资源`}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  共 {filteredAndSortedMaterials.length} 项
                </span>
              </>
            ) : (
              <>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-t-transparent border-purple-500 rounded-full animate-spin mr-2"></div>
                    加载中...
                  </div>
                ) : (
                  <>未找到符合条件的资源</>
                )}
              </>
            )}
          </h2>
          
          {/* 资料网格容器 */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-5 border border-gray-200 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="flex justify-between mt-6">
                    <div className="h-8 bg-gray-200 rounded w-2/5"></div>
                    <div className="h-8 bg-gray-200 rounded w-2/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      {/* 模态框（上传、编辑、PDF） */}
      {/* 这些模态框组件会在其他文件中定义，并通过全局状态控制显示 */}
    </div>
  );
};

export default Home;