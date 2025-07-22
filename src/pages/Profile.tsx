import React, { useState, useEffect } from 'react';
import { User, Heart, Download, BarChart3, Settings, Calendar, TrendingUp, BookOpen, Code, Star, Clock, Award } from 'lucide-react';
import { useStore } from '../store/useStore';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface DownloadHistory {
  id: string;
  title: string;
  course: string;
  contentType: 'Paper' | 'Code';
  downloadDate: string;
  filePath: string;
}

interface LearningStats {
  totalDownloads: number;
  totalFavorites: number;
  activeDays: number;
  studyHours: number;
  completedCourses: number;
  achievements: string[];
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { materials, favorites } = useStore();
  const [activeTab, setActiveTab] = useState('info');
  const [isVisible, setIsVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '学生用户',
    email: 'student@example.com',
    studentId: '2021001001',
    major: '计算机科学与技术',
    grade: '2021级',
    joinDate: '2024年1月'
  });
  
  const [downloadHistory] = useState<DownloadHistory[]>([
    {
      id: '1',
      title: '数据结构期末考试试卷',
      course: '数据结构',
      contentType: 'Paper',
      downloadDate: '2024-03-15 14:30',
      filePath: '/pdf/sample.pdf'
    },
    {
      id: '2',
      title: '算法设计课程设计',
      course: '算法设计与分析',
      contentType: 'Code',
      downloadDate: '2024-03-14 10:15',
      filePath: 'https://github.com/example/algorithm-project'
    },
    {
      id: '3',
      title: '操作系统期中试卷',
      course: '操作系统',
      contentType: 'Paper',
      downloadDate: '2024-03-13 16:45',
      filePath: '/pdf/sample.pdf'
    }
  ]);
  
  const [learningStats] = useState<LearningStats>({
    totalDownloads: 45,
    totalFavorites: 23,
    activeDays: 28,
    studyHours: 156,
    completedCourses: 8,
    achievements: ['早起鸟', '学习达人', '收藏家', '分享者']
  });

  const favoriteMaterials = materials.filter(m => favorites.includes(m.id));

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const tabs = [
    { id: 'info', label: '个人信息', icon: User },
    { id: 'favorites', label: '我的收藏', icon: Heart },
    { id: 'downloads', label: '下载历史', icon: Download },
    { id: 'stats', label: '学习统计', icon: BarChart3 }
  ];

  const renderUserInfo = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-neutral-800 mb-2">{userInfo.name}</h2>
            <p className="text-neutral-600">{userInfo.major} · {userInfo.grade}</p>
            <p className="text-sm text-neutral-500 mt-1">加入时间：{userInfo.joinDate}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">姓名</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">邮箱</label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">学号</label>
              <input
                type="text"
                value={userInfo.studentId}
                onChange={(e) => setUserInfo({...userInfo, studentId: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">专业</label>
              <input
                type="text"
                value={userInfo.major}
                onChange={(e) => setUserInfo({...userInfo, major: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">年级</label>
              <select
                value={userInfo.grade}
                onChange={(e) => setUserInfo({...userInfo, grade: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                <option value="2021级">2021级</option>
                <option value="2022级">2022级</option>
                <option value="2023级">2023级</option>
                <option value="2024级">2024级</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
            保存更改
          </button>
          <button className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-all duration-200">
            取消
          </button>
        </div>
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-neutral-800 mb-6">我的收藏 ({favoriteMaterials.length})</h3>
        {favoriteMaterials.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 mb-4">还没有收藏任何资源</p>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              去发现资源
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteMaterials.map((material) => (
              <div
                key={material.id}
                onClick={() => navigate(`/resource/${material.id}`)}
                className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    material.contentType === 'Paper'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {material.contentType === 'Paper' ? (
                      <BookOpen className="w-5 h-5" />
                    ) : (
                      <Code className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-800 truncate">{material.courseName}</h4>
                    <p className="text-sm text-neutral-500">{material.courseName}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>{material.teacher}</span>
                  <span>{material.year}年</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderDownloads = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-neutral-800 mb-6">下载历史 ({downloadHistory.length})</h3>
        {downloadHistory.length === 0 ? (
          <div className="text-center py-12">
            <Download className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">暂无下载记录</p>
          </div>
        ) : (
          <div className="space-y-3">
            {downloadHistory.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                <div className={`p-3 rounded-xl ${
                  item.contentType === 'Paper'
                    ? 'bg-purple-100 text-purple-600'
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {item.contentType === 'Paper' ? (
                    <BookOpen className="w-5 h-5" />
                  ) : (
                    <Code className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-neutral-800">{item.title}</h4>
                  <p className="text-sm text-neutral-500">{item.course}</p>
                  <p className="text-xs text-neutral-400 mt-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    {item.downloadDate}
                  </p>
                </div>
                <button className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                  重新下载
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{learningStats.totalDownloads}</p>
              <p className="text-sm text-neutral-600">总下载数</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{learningStats.totalFavorites}</p>
              <p className="text-sm text-neutral-600">收藏数量</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{learningStats.activeDays}</p>
              <p className="text-sm text-neutral-600">活跃天数</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-neutral-800">{learningStats.studyHours}</p>
              <p className="text-sm text-neutral-600">学习时长</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 学习成就 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-neutral-800 mb-6 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          学习成就
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {learningStats.achievements.map((achievement, index) => (
            <div key={index} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-medium text-neutral-800">{achievement}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* 学习进度 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h3 className="text-xl font-semibold text-neutral-800 mb-6">学习进度</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-700">数据结构</span>
              <span className="text-sm text-neutral-500">85%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '85%'}}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-700">算法设计</span>
              <span className="text-sm text-neutral-500">72%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '72%'}}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-neutral-700">操作系统</span>
              <span className="text-sm text-neutral-500">90%</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '90%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'info': return renderUserInfo();
      case 'favorites': return renderFavorites();
      case 'downloads': return renderDownloads();
      case 'stats': return renderStats();
      default: return renderUserInfo();
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
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
            个人中心
          </h1>
          <p className="text-neutral-600">管理您的个人信息和学习数据</p>
        </div>

        {/* 标签导航 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 内容区域 */}
        <div className={`transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;