import React, { useEffect, useState } from 'react';
import { Sparkles, BookOpen, Code, Users, TrendingUp, Star, Zap, Rocket, Heart, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import SortBar from '../components/SortBar';
import MaterialGrid from '../components/MaterialGrid';
import UploadModal from '../components/UploadModal';
import EditModal from '../components/EditModal';
import PdfModal from '../components/PdfModal';
import { useMaterials } from '../hooks/useMaterials';
import { useStore } from '../store/useStore';

const Home: React.FC = () => {
  // 加载资料数据
  useMaterials();
  
  const { materials } = useStore();
  const [stats, setStats] = useState({ papers: 0, codes: 0, total: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const papers = materials.filter(m => m.contentType === 'Paper').length;
    const codes = materials.filter(m => m.contentType === 'Code').length;
    setStats({ papers, codes, total: materials.length });
  }, [materials]);

  return (
    <div className="min-h-screen relative overflow-hidden animated-gradient">
      {/* 动态粒子背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 主要浮动元素 */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl floating-animation neon-glow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/30 to-purple-400/30 rounded-full blur-3xl floating-animation" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }} />
        
        {/* 粒子效果 */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-purple-400/60 rounded-full particle-animation" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-32 w-3 h-3 bg-blue-400/60 rounded-full particle-animation" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-pink-400/60 rounded-full particle-animation" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-green-400/60 rounded-full particle-animation" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-20 right-1/4 w-4 h-4 bg-yellow-400/60 rounded-full particle-animation" style={{ animationDelay: '4s' }} />
        <div className="absolute top-60 left-1/3 w-3 h-3 bg-indigo-400/60 rounded-full particle-animation" style={{ animationDelay: '5s' }} />
        
        {/* 几何装饰 */}
        <div className="absolute top-1/4 left-10 w-16 h-16 border-2 border-purple-400/30 rotate-45 animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-12 h-12 border-2 border-blue-400/30 rounded-full animate-breathe" />
        <div className="absolute top-3/4 left-1/4 w-8 h-8 bg-gradient-to-r from-pink-400/40 to-purple-400/40 transform rotate-12 animate-wave" />
      </div>

      {/* 导航栏 */}
      <Navbar />
      
      {/* 主要内容 */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className={`container mx-auto px-4 pt-8 pb-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-8">
            {/* 主标题 */}
            <div className="relative inline-block mb-4">
              <h1 className="text-4xl md:text-6xl font-bold rainbow-text mb-3 relative z-10 card-3d">
                One Piece
              </h1>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-purple-800/30 blur-3xl transform scale-125 neon-glow" />
              {/* 装饰性图标 */}
              <div className="absolute -top-4 -left-4 text-purple-400 animate-wave">
                <Rocket className="w-8 h-8" />
              </div>
              <div className="absolute -top-4 -right-4 text-blue-400 animate-pulse">
                <Zap className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-4 -left-4 text-pink-400 animate-breathe">
                <Heart className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-4 -right-4 text-green-400 particle-animation">
                <Globe className="w-8 h-8" />
              </div>
            </div>
            
            {/* 副标题 */}
            <div className="glass-effect rounded-2xl p-4 max-w-3xl mx-auto mb-6 magnetic-hover">
              <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                校园真题与课设仓库
              </p>
              <p className="text-base md:text-lg text-neutral-700 leading-relaxed">
                让学习资源触手可及，让知识传承更简单
              </p>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-6">
              <div className="glass-effect rounded-2xl p-4 card-3d magnetic-hover gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 animate-pulse" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl neon-glow animate-breathe">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-2">{stats.papers}</div>
                  <div className="text-lg font-medium text-neutral-700">试卷资料</div>
                  <div className="text-sm text-neutral-500 mt-1">📚 精选题库</div>
                </div>
              </div>
              
              <div className="glass-effect rounded-2xl p-4 card-3d magnetic-hover gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl neon-glow animate-breathe" style={{ animationDelay: '1s' }}>
                      <Code className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">{stats.codes}</div>
                  <div className="text-lg font-medium text-neutral-700">代码项目</div>
                  <div className="text-sm text-neutral-500 mt-1">💻 实战代码</div>
                </div>
              </div>
              
              <div className="glass-effect rounded-3xl p-8 card-3d magnetic-hover gradient-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl neon-glow animate-breathe" style={{ animationDelay: '2s' }}>
                      <Users className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-2">{stats.total}</div>
                  <div className="text-lg font-medium text-neutral-700">总资源数</div>
                  <div className="text-sm text-neutral-500 mt-1">🌟 海量资源</div>
                </div>
              </div>
            </div>

            {/* 特色标签 */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <span className="inline-flex items-center px-4 py-2 glass-effect rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-purple-700 text-white hover-scale neon-glow">
                <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                零后端成本
              </span>
              <span className="inline-flex items-center px-4 py-2 glass-effect rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover-scale magnetic-hover">
                <TrendingUp className="w-5 h-5 mr-2 animate-wave" />
                快速上线
              </span>
              <span className="inline-flex items-center px-4 py-2 glass-effect rounded-full text-sm font-semibold bg-gradient-to-r from-green-600 to-green-700 text-white hover-scale card-3d">
                <Star className="w-5 h-5 mr-2 animate-breathe" />
                社区驱动
              </span>
              <span className="inline-flex items-center px-4 py-2 glass-effect rounded-full text-sm font-semibold bg-gradient-to-r from-pink-600 to-pink-700 text-white hover-scale">
                <Rocket className="w-5 h-5 mr-2" />
                AI智能
              </span>
              <span className="inline-flex items-center px-4 py-2 glass-effect rounded-full text-sm font-semibold bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover-scale animate-fade-in-up">
                <Zap className="w-5 h-5 mr-2 animate-pulse" />
                极速体验
              </span>
            </div>
          </div>
        </div>

        {/* 搜索和筛选区域 */}
        <div className={`container mx-auto px-4 mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-5xl mx-auto">
            {/* 搜索区域 */}
            <div className="glass-effect rounded-2xl p-6 mb-6 gradient-border magnetic-hover relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 animate-pulse" />
              <div className="relative z-10">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                    🔍 探索学习资源
                  </h2>
                  <p className="text-lg text-neutral-700 font-medium">
                    搜索你需要的试卷和代码项目
                  </p>
                </div>
                <div className="transform hover:scale-105 transition-all duration-300">
                  <SearchBar />
                </div>
              </div>
            </div>
            
            {/* 筛选和排序区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* 筛选区域 */}
              <div className="glass-effect rounded-2xl p-4 card-3d hover-scale relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-500/5 animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="relative z-10">
                  <div className="flex items-center mb-3">
                    <div className="p-1.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg mr-2">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                      智能筛选
                    </h3>
                  </div>
                  <FilterBar />
                </div>
              </div>
              
              {/* 排序区域 */}
              <div className="glass-effect rounded-2xl p-4 card-3d hover-scale relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="relative z-10">
                  <div className="flex items-center mb-3">
                    <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg mr-2">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      排序方式
                    </h3>
                  </div>
                  <SortBar />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 资料网格 */}
        <div className={`container mx-auto px-4 pb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-7xl mx-auto">
            {/* 资料展示标题 */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
                🎯 精选资源
              </h2>
              <p className="text-lg text-neutral-700 max-w-xl mx-auto">
                发现最优质的学习资料，助力你的学术之路
              </p>
            </div>
            
            {/* 资料网格容器 */}
            <div className="glass-effect rounded-2xl p-6 magnetic-hover relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 to-blue-500/8 animate-pulse" />
              <div className="relative z-10">
                <MaterialGrid />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 模态框 */}
      <UploadModal />
      <EditModal />
      <PdfModal />
    </div>
  );
};

export default Home;