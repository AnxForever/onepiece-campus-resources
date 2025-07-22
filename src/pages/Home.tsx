import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import MaterialCard from '../components/MaterialCard';
import UploadModal from '../components/UploadModal';
import EditModal from '../components/EditModal';
import PdfModal from '../components/PdfModal';
import { useStore } from '../store/useStore';
import { getMaterials, getMaterialStats } from '../api';
import { Material } from '../types';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

const Home: React.FC = () => {
  const { 
    materials, 
    setMaterials, 
    searchTerm, 
    setSearchTerm,
    filter,
    setFilter,
    sortOption,
    setSortOption,
    isUploadModalOpen,
    isEditModalOpen,
    isPdfModalOpen,
    admin
  } = useStore();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalMaterials: 0,
    totalExams: 0,
    totalCodes: 0
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  
  // 初始化粒子背景
  const particlesInit = async (engine: Engine) => {
    await loadFull(engine);
  };
  
  // 获取资料列表
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const materialsResponse = await getMaterials();
        const statsResponse = await getMaterialStats();
        
        if (materialsResponse.success) {
          setMaterials(materialsResponse.data);
        } else {
          setError(materialsResponse.message);
        }
        
        if (statsResponse.success && statsResponse.data) {
          setStats({
            totalMaterials: statsResponse.data.totalMaterials,
            totalExams: statsResponse.data.totalExams,
            totalCodes: statsResponse.data.totalCodes
          });
        }
      } catch (err) {
        setError('获取资料失败，请稍后再试');
        console.error('Error fetching materials:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMaterials();
  }, [setMaterials]);
  
  // 筛选和排序资料
  const filteredAndSortedMaterials = React.useMemo(() => {
    // 先筛选
    let result = [...materials];
    
    // 关键词搜索
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(material => 
        material.title.toLowerCase().includes(term) ||
        material.description.toLowerCase().includes(term) ||
        material.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // 资料类型筛选
    if (filter.materialType !== 'all') {
      result = result.filter(material => material.materialType === filter.materialType);
    }
    
    // 课程类型筛选
    if (filter.courseType !== 'all') {
      result = result.filter(material => material.courseType === filter.courseType);
    }
    
    // 编程语言筛选（仅对代码项目）
    if (filter.programmingLanguage && filter.programmingLanguage !== 'all') {
      result = result.filter(material => 
        material.materialType === 'code' && 
        material.programmingLanguage === filter.programmingLanguage
      );
    }
    
    // 年份筛选
    if (filter.year !== 'all') {
      result = result.filter(material => material.year === filter.year);
    }
    
    // 学期筛选
    if (filter.semester !== 'all') {
      result = result.filter(material => material.semester === filter.semester);
    }
    
    // 教师筛选
    if (filter.teacher !== 'all') {
      result = result.filter(material => material.teacher === filter.teacher);
    }
    
    // 然后排序
    switch (sortOption) {
      case 'latest':
        result.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
        break;
      case 'mostViewed':
        result.sort((a, b) => b.views - a.views);
        break;
      case 'mostDownloaded':
        result.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'mostFavorited':
        result.sort((a, b) => b.favorites - a.favorites);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    
    return result;
  }, [materials, searchTerm, filter, sortOption]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 动态粒子背景 */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 60,
          particles: {
            color: {
              value: '#6366f1',
            },
            links: {
              color: '#6366f1',
              distance: 150,
              enable: true,
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              outModes: {
                default: 'bounce',
              },
              random: false,
              speed: 1,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 40,
            },
            opacity: {
              value: 0.3,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 3 },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 z-0"
      />
      
      {/* 导航栏 */}
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-10 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-transparent">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              One Piece 校园资源共享平台
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            发现、分享和管理高质量的学习资源，助力你的学术成功
          </p>
          
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {/* 试卷资料卡片 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalExams}</div>
              <div className="text-gray-600">试卷资料</div>
            </div>
            
            {/* 代码项目卡片 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.totalCodes}</div>
              <div className="text-gray-600">代码项目</div>
            </div>
            
            {/* 总资源数卡片 */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.totalMaterials}</div>
              <div className="text-gray-600">总资源数</div>
            </div>
          </div>
          
          {/* 特色标签 */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
              <span className="text-purple-600 mr-1">✓</span> 零后端成本
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
              <span className="text-purple-600 mr-1">✓</span> 快速上线
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
              <span className="text-purple-600 mr-1">✓</span> 社区驱动
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
              <span className="text-purple-600 mr-1">✓</span> AI 智能
            </div>
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-700">
              <span className="text-purple-600 mr-1">✓</span> 极速体验
            </div>
          </div>
        </div>
      </div>
      
      {/* 搜索和筛选区域 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-10">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          {/* 搜索框 */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="搜索资源标题、描述或标签..."
            />
          </div>
          
          {/* 筛选和排序区域 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 筛选按钮 */}
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Filter className="h-4 w-4" />
                <span>筛选</span>
              </button>
              
              {/* 筛选下拉菜单 */}
              {isFilterOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-md shadow-lg z-20 p-4 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">筛选选项</h3>
                  
                  {/* 资料类型筛选 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">资料类型</label>
                    <select
                      value={filter.materialType}
                      onChange={(e) => setFilter({ materialType: e.target.value as any })}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    >
                      <option value="all">全部</option>
                      <option value="exam">试卷资料</option>
                      <option value="code">代码项目</option>
                    </select>
                  </div>
                  
                  {/* 课程类型筛选 */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">课程类型</label>
                    <select
                      value={filter.courseType}
                      onChange={(e) => setFilter({ courseType: e.target.value as any })}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                    >
                      <option value="all">全部</option>
                      <option value="dataStructure">数据结构</option>
                      <option value="algorithms">算法</option>
                      <option value="computerNetworks">计算机网络</option>
                      <option value="operatingSystems">操作系统</option>
                      <option value="databaseSystems">数据库系统</option>
                      <option value="webDevelopment">Web开发</option>
                      <option value="machineLearning">机器学习</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                  
                  {/* 更多筛选选项... */}
                  
                  {/* 重置按钮 */}
                  <button
                    onClick={() => {
                      setFilter({ materialType: 'all', courseType: 'all', year: 'all', semester: 'all', teacher: 'all' });
                      setIsFilterOpen(false);
                    }}
                    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    重置筛选
                  </button>
                </div>
              )}
            </div>
            
            {/* 排序按钮 */}
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>排序</span>
              </button>
              
              {/* 排序下拉菜单 */}
              {isSortOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1 border border-gray-200">
                  <button
                    onClick={() => {
                      setSortOption('latest');
                      setIsSortOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm text-left w-full ${sortOption === 'latest' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    最新上传
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('mostViewed');
                      setIsSortOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm text-left w-full ${sortOption === 'mostViewed' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    最多浏览
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('mostDownloaded');
                      setIsSortOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm text-left w-full ${sortOption === 'mostDownloaded' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    最多下载
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('mostFavorited');
                      setIsSortOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm text-left w-full ${sortOption === 'mostFavorited' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    最多收藏
                  </button>
                  <button
                    onClick={() => {
                      setSortOption('alphabetical');
                      setIsSortOpen(false);
                    }}
                    className={`block px-4 py-2 text-sm text-left w-full ${sortOption === 'alphabetical' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    字母顺序
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 资料网格 */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-10">
        {/* 精选资源标题 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchTerm || filter.materialType !== 'all' || filter.courseType !== 'all' ? '筛选结果' : '精选资源'}
          </h2>
          <div className="text-sm text-gray-500">
            共 {filteredAndSortedMaterials.length} 个资源
          </div>
        </div>
        
        {/* 资料网格容器 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-center">
            {error}
          </div>
        ) : filteredAndSortedMaterials.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-12 rounded-md text-center">
            <p className="text-lg mb-2">暂无符合条件的资源</p>
            <p className="text-sm">尝试调整筛选条件或清除搜索关键词</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedMaterials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        )}
      </div>
      
      {/* 模态框 */}
      {isUploadModalOpen && <UploadModal />}
      {isEditModalOpen && <EditModal />}
      {isPdfModalOpen && <PdfModal />}
    </div>
  );
};

export default Home;