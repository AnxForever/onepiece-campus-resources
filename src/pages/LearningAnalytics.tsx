import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, BookOpen, Download, Clock, Target, Award, Calendar, Users, Brain, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import Navbar from '../components/Navbar';

interface LearningStats {
  totalDownloads: number;
  studyTime: number;
  coursesStudied: number;
  weeklyGoal: number;
  weeklyProgress: number;
  streak: number;
}

interface CourseProgress {
  course: string;
  progress: number;
  totalMaterials: number;
  completedMaterials: number;
  lastAccessed: string;
}

interface WeeklyActivity {
  day: string;
  downloads: number;
  studyTime: number;
}

interface SubjectDistribution {
  subject: string;
  value: number;
  color: string;
}

interface Recommendation {
  id: string;
  title: string;
  course: string;
  reason: string;
  confidence: number;
  type: 'trending' | 'personalized' | 'similar';
}

const LearningAnalytics: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('week');
  
  // 模拟学习统计数据
  const [learningStats] = useState<LearningStats>({
    totalDownloads: 156,
    studyTime: 42.5,
    coursesStudied: 8,
    weeklyGoal: 20,
    weeklyProgress: 15.5,
    streak: 7
  });
  
  // 模拟课程进度数据
  const [courseProgress] = useState<CourseProgress[]>([
    {
      course: '数据结构与算法',
      progress: 85,
      totalMaterials: 24,
      completedMaterials: 20,
      lastAccessed: '2024-03-15'
    },
    {
      course: '操作系统',
      progress: 72,
      totalMaterials: 18,
      completedMaterials: 13,
      lastAccessed: '2024-03-14'
    },
    {
      course: '计算机网络',
      progress: 60,
      totalMaterials: 20,
      completedMaterials: 12,
      lastAccessed: '2024-03-13'
    },
    {
      course: '数据库系统',
      progress: 45,
      totalMaterials: 16,
      completedMaterials: 7,
      lastAccessed: '2024-03-12'
    }
  ]);
  
  // 模拟周活动数据
  const [weeklyActivity] = useState<WeeklyActivity[]>([
    { day: '周一', downloads: 12, studyTime: 3.5 },
    { day: '周二', downloads: 8, studyTime: 2.8 },
    { day: '周三', downloads: 15, studyTime: 4.2 },
    { day: '周四', downloads: 6, studyTime: 1.5 },
    { day: '周五', downloads: 20, studyTime: 5.8 },
    { day: '周六', downloads: 18, studyTime: 6.2 },
    { day: '周日', downloads: 14, studyTime: 4.1 }
  ]);
  
  // 模拟学科分布数据
  const [subjectDistribution] = useState<SubjectDistribution[]>([
    { subject: '计算机科学', value: 35, color: '#8B5CF6' },
    { subject: '数学', value: 25, color: '#06B6D4' },
    { subject: '物理', value: 20, color: '#10B981' },
    { subject: '英语', value: 12, color: '#F59E0B' },
    { subject: '其他', value: 8, color: '#EF4444' }
  ]);
  
  // 模拟推荐数据
  const [recommendations] = useState<Recommendation[]>([
    {
      id: '1',
      title: '高级数据结构期末复习',
      course: '数据结构与算法',
      reason: '基于你的学习进度推荐',
      confidence: 95,
      type: 'personalized'
    },
    {
      id: '2',
      title: '操作系统进程管理习题',
      course: '操作系统',
      reason: '热门资源，同学们都在学',
      confidence: 88,
      type: 'trending'
    },
    {
      id: '3',
      title: 'TCP/IP协议详解',
      course: '计算机网络',
      reason: '与你已学内容相关',
      confidence: 82,
      type: 'similar'
    }
  ]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      case 'personalized': return <Brain className="w-4 h-4" />;
      case 'similar': return <Zap className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };
  
  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'trending': return 'bg-red-100 text-red-700';
      case 'personalized': return 'bg-purple-100 text-purple-700';
      case 'similar': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const renderOverview = () => (
    <div className="space-y-8">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-neutral-800">{learningStats.totalDownloads}</span>
          </div>
          <h3 className="text-sm font-medium text-neutral-600">总下载量</h3>
          <p className="text-xs text-green-600 mt-1">+12% 本周</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-neutral-800">{learningStats.studyTime}h</span>
          </div>
          <h3 className="text-sm font-medium text-neutral-600">学习时长</h3>
          <p className="text-xs text-green-600 mt-1">+8% 本周</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-neutral-800">{learningStats.coursesStudied}</span>
          </div>
          <h3 className="text-sm font-medium text-neutral-600">学习课程</h3>
          <p className="text-xs text-blue-600 mt-1">活跃课程</p>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-neutral-800">{learningStats.streak}</span>
          </div>
          <h3 className="text-sm font-medium text-neutral-600">连续学习</h3>
          <p className="text-xs text-orange-600 mt-1">天数</p>
        </div>
      </div>
      
      {/* 周目标进度 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">本周学习目标</h3>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Target className="w-4 h-4" />
            <span>{learningStats.weeklyProgress}h / {learningStats.weeklyGoal}h</span>
          </div>
        </div>
        
        <div className="relative">
          <div className="w-full bg-neutral-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(learningStats.weeklyProgress / learningStats.weeklyGoal) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-neutral-500 mt-2">
            <span>0h</span>
            <span className="font-medium text-purple-600">
              {Math.round((learningStats.weeklyProgress / learningStats.weeklyGoal) * 100)}% 完成
            </span>
            <span>{learningStats.weeklyGoal}h</span>
          </div>
        </div>
      </div>
      
      {/* 周活动图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">本周下载活动</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="downloads" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-neutral-800 mb-4">学习时长趋势</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="studyTime" 
                stroke="#06B6D4" 
                fill="url(#colorStudyTime)" 
                strokeWidth={2}
              />
              <defs>
                <linearGradient id="colorStudyTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
  
  const renderProgress = () => (
    <div className="space-y-6">
      {/* 课程进度列表 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-neutral-800 mb-6">课程学习进度</h3>
        
        <div className="space-y-4">
          {courseProgress.map((course, index) => (
            <div key={index} className="p-4 bg-neutral-50 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-neutral-800">{course.course}</h4>
                  <p className="text-sm text-neutral-500">
                    {course.completedMaterials}/{course.totalMaterials} 个资料 · 最后访问：{course.lastAccessed}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-neutral-800">{course.progress}%</span>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${getProgressColor(course.progress)}`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 学科分布 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-neutral-800 mb-6">学科分布</h3>
        
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-64 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex-1">
            <div className="space-y-3">
              {subjectDistribution.map((subject, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <span className="font-medium text-neutral-700">{subject.subject}</span>
                  </div>
                  <span className="text-neutral-600">{subject.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderRecommendations = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">个性化推荐</h3>
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Brain className="w-4 h-4" />
            <span>基于AI分析</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-neutral-800">{rec.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      getRecommendationColor(rec.type)
                    }`}>
                      {getRecommendationIcon(rec.type)}
                      {rec.type === 'trending' ? '热门' : rec.type === 'personalized' ? '个性化' : '相关'}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">{rec.course}</p>
                  <p className="text-sm text-neutral-500">{rec.reason}</p>
                </div>
                
                <div className="text-right ml-4">
                  <div className="text-sm font-medium text-neutral-700">{rec.confidence}%</div>
                  <div className="text-xs text-neutral-500">匹配度</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="w-full bg-neutral-200 rounded-full h-1.5 mr-4">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-1.5 rounded-full transition-all duration-1000"
                    style={{ width: `${rec.confidence}%` }}
                  />
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 学习建议 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4">学习建议</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-200 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-medium text-blue-800">提升建议</h4>
            </div>
            <p className="text-sm text-blue-700">
              建议加强数据库系统的学习，当前进度较慢。可以多下载相关练习题进行巩固。
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-200 rounded-lg">
                <Award className="w-4 h-4 text-green-600" />
              </div>
              <h4 className="font-medium text-green-800">优势保持</h4>
            </div>
            <p className="text-sm text-green-700">
              数据结构与算法学习进度良好，继续保持当前的学习节奏和方法。
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-200 rounded-lg">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="font-medium text-purple-800">时间规划</h4>
            </div>
            <p className="text-sm text-purple-700">
              建议每天安排2-3小时学习时间，周末可以适当增加复习时间。
            </p>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-200 rounded-lg">
                <Users className="w-4 h-4 text-orange-600" />
              </div>
              <h4 className="font-medium text-orange-800">协作学习</h4>
            </div>
            <p className="text-sm text-orange-700">
              可以加入相关课程的学习小组，与同学们一起讨论和分享学习资源。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  const tabs = [
    { id: 'overview', label: '学习概览', icon: TrendingUp },
    { id: 'progress', label: '进度分析', icon: Target },
    { id: 'recommendations', label: 'AI推荐', icon: Brain }
  ];

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
            学习分析
          </h1>
          <p className="text-neutral-600">深入了解你的学习进度和表现</p>
        </div>

        {/* 时间范围选择 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl">
            <div className="flex gap-2">
              {['week', 'month', 'semester'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                    timeRange === range
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {range === 'week' ? '本周' : range === 'month' ? '本月' : '本学期'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 标签导航 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl mb-8">
          <div className="flex gap-2">
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
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'progress' && renderProgress()}
          {activeTab === 'recommendations' && renderRecommendations()}
        </div>
      </div>
    </div>
  );
};

export default LearningAnalytics;