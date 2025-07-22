import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, MessageCircle, Calendar, BookOpen, Star, Crown, Clock, MapPin, Filter, UserPlus, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  course: string;
  subject: string;
  memberCount: number;
  maxMembers: number;
  isPublic: boolean;
  createdAt: string;
  lastActivity: string;
  creator: {
    name: string;
    avatar: string;
  };
  tags: string[];
  meetingTime?: string;
  location?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'active' | 'recruiting' | 'full';
}

interface GroupMessage {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'announcement';
}

interface CreateGroupForm {
  name: string;
  description: string;
  course: string;
  subject: string;
  maxMembers: number;
  isPublic: boolean;
  tags: string[];
  meetingTime: string;
  location: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const StudyGroups: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  
  // 创建小组表单
  const [createForm, setCreateForm] = useState<CreateGroupForm>({
    name: '',
    description: '',
    course: '',
    subject: '',
    maxMembers: 10,
    isPublic: true,
    tags: [],
    meetingTime: '',
    location: '',
    difficulty: 'intermediate'
  });
  
  // 模拟学习小组数据
  const [studyGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: '数据结构算法精进小组',
      description: '专注于数据结构与算法的深入学习，每周定期讨论经典算法题目，分享解题思路和优化方案。',
      course: '数据结构与算法',
      subject: '计算机科学',
      memberCount: 8,
      maxMembers: 12,
      isPublic: true,
      createdAt: '2024-03-01',
      lastActivity: '2024-03-15',
      creator: {
        name: '张同学',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20cartoon%20style&image_size=square'
      },
      tags: ['算法', '编程', '面试准备'],
      meetingTime: '每周三 19:00-21:00',
      location: '图书馆3楼讨论室',
      difficulty: 'intermediate',
      status: 'recruiting'
    },
    {
      id: '2',
      name: '操作系统原理研讨会',
      description: '深入理解操作系统核心概念，通过实践项目加深对进程、内存管理、文件系统等的理解。',
      course: '操作系统',
      subject: '计算机科学',
      memberCount: 6,
      maxMembers: 8,
      isPublic: true,
      createdAt: '2024-02-28',
      lastActivity: '2024-03-14',
      creator: {
        name: '李同学',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20cartoon%20style&image_size=square'
      },
      tags: ['系统编程', '内核', '实践项目'],
      meetingTime: '每周五 14:00-16:00',
      location: '计算机实验室',
      difficulty: 'advanced',
      status: 'active'
    },
    {
      id: '3',
      name: '高等数学互助组',
      description: '针对高等数学课程的学习小组，互相答疑解惑，分享学习方法和解题技巧。',
      course: '高等数学',
      subject: '数学',
      memberCount: 15,
      maxMembers: 15,
      isPublic: true,
      createdAt: '2024-02-25',
      lastActivity: '2024-03-15',
      creator: {
        name: '王同学',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20cartoon%20style&image_size=square'
      },
      tags: ['微积分', '线性代数', '习题讲解'],
      meetingTime: '每周二、四 18:00-20:00',
      location: '数学楼201',
      difficulty: 'beginner',
      status: 'full'
    },
    {
      id: '4',
      name: '机器学习入门班',
      description: '从零开始学习机器学习，包括理论基础和实践项目，适合初学者参与。',
      course: '机器学习',
      subject: '人工智能',
      memberCount: 10,
      maxMembers: 12,
      isPublic: true,
      createdAt: '2024-03-05',
      lastActivity: '2024-03-15',
      creator: {
        name: '陈同学',
        avatar: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=student%20avatar%20cartoon%20style&image_size=square'
      },
      tags: ['Python', '深度学习', '项目实战'],
      meetingTime: '每周六 9:00-12:00',
      location: 'AI实验室',
      difficulty: 'beginner',
      status: 'recruiting'
    }
  ]);
  
  // 模拟我加入的小组
  const [myGroups] = useState<StudyGroup[]>([
    studyGroups[0],
    studyGroups[3]
  ]);
  
  // 模拟小组消息
  const [groupMessages] = useState<GroupMessage[]>([
    {
      id: '1',
      author: '张同学',
      content: '大家好！欢迎加入我们的算法学习小组。本周我们将讨论动态规划的经典问题。',
      timestamp: '2024-03-15 10:00',
      type: 'announcement'
    },
    {
      id: '2',
      author: '李同学',
      content: '我整理了一些LeetCode的动态规划题目，大家可以先练习一下。',
      timestamp: '2024-03-15 10:30',
      type: 'text'
    },
    {
      id: '3',
      author: '王同学',
      content: '分享一个很好的算法可视化网站，对理解算法很有帮助！',
      timestamp: '2024-03-15 11:00',
      type: 'text'
    }
  ]);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createForm.name.trim() || !createForm.description.trim()) {
      toast.error('请填写小组名称和描述');
      return;
    }
    
    // 模拟创建小组
    toast.success('学习小组创建成功！');
    setShowCreateModal(false);
    setCreateForm({
      name: '',
      description: '',
      course: '',
      subject: '',
      maxMembers: 10,
      isPublic: true,
      tags: [],
      meetingTime: '',
      location: '',
      difficulty: 'intermediate'
    });
  };
  
  const handleJoinGroup = (groupId: string) => {
    const group = studyGroups.find(g => g.id === groupId);
    if (group) {
      if (group.status === 'full') {
        toast.error('该小组已满员');
        return;
      }
      toast.success(`成功加入「${group.name}」！`);
    }
  };
  
  const getFilteredGroups = () => {
    return studyGroups.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           group.course.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = filterSubject === 'all' || group.subject === filterSubject;
      const matchesDifficulty = filterDifficulty === 'all' || group.difficulty === filterDifficulty;
      return matchesSearch && matchesSubject && matchesDifficulty;
    });
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '入门';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'recruiting': return 'bg-blue-100 text-blue-700';
      case 'full': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '活跃';
      case 'recruiting': return '招募中';
      case 'full': return '已满员';
      default: return '未知';
    }
  };
  
  const renderDiscoverTab = () => {
    const filteredGroups = getFilteredGroups();
    
    return (
      <div className="space-y-6">
        {/* 搜索和筛选 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索学习小组..."
                  className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">全部学科</option>
              <option value="计算机科学">计算机科学</option>
              <option value="数学">数学</option>
              <option value="物理">物理</option>
              <option value="人工智能">人工智能</option>
            </select>
            
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">全部难度</option>
              <option value="beginner">入门</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>创建小组</span>
            </button>
          </div>
        </div>
        
        {/* 小组列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGroups.map((group) => (
            <div key={group.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={group.creator.avatar}
                    alt={group.creator.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-neutral-800">{group.name}</h3>
                    <p className="text-sm text-neutral-500">创建者：{group.creator.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getDifficultyColor(group.difficulty)
                  }`}>
                    {getDifficultyText(group.difficulty)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    getStatusColor(group.status)
                  }`}>
                    {getStatusText(group.status)}
                  </span>
                </div>
              </div>
              
              <p className="text-neutral-600 mb-4 line-clamp-2">{group.description}</p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <BookOpen className="w-4 h-4" />
                  <span>{group.course}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Users className="w-4 h-4" />
                  <span>{group.memberCount}/{group.maxMembers} 成员</span>
                </div>
                
                {group.meetingTime && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Clock className="w-4 h-4" />
                    <span>{group.meetingTime}</span>
                  </div>
                )}
                
                {group.location && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <MapPin className="w-4 h-4" />
                    <span>{group.location}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {group.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-neutral-500">
                  最后活动：{group.lastActivity}
                </div>
                
                <button
                  onClick={() => handleJoinGroup(group.id)}
                  disabled={group.status === 'full'}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    group.status === 'full'
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-lg'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{group.status === 'full' ? '已满员' : '加入小组'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">没有找到匹配的学习小组</p>
          </div>
        )}
      </div>
    );
  };
  
  const renderMyGroupsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {myGroups.map((group) => (
          <div key={group.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={group.creator.avatar}
                  alt={group.creator.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-neutral-800">{group.name}</h3>
                  <p className="text-sm text-neutral-500">{group.course}</p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedGroup(group)}
                className="p-2 text-neutral-600 hover:text-purple-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Users className="w-4 h-4" />
                <span>{group.memberCount} 成员</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <Clock className="w-4 h-4" />
                <span>最后活动：{group.lastActivity}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {group.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-2 text-neutral-600 hover:text-blue-600 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedGroup(group)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
                >
                  进入讨论
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {myGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 mb-4">你还没有加入任何学习小组</p>
          <button
            onClick={() => setActiveTab('discover')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
          >
            发现小组
          </button>
        </div>
      )}
    </div>
  );
  
  const renderGroupChat = () => {
    if (!selectedGroup) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col">
          {/* 聊天头部 */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <img
                src={selectedGroup.creator.avatar}
                alt={selectedGroup.creator.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-neutral-800">{selectedGroup.name}</h3>
                <p className="text-sm text-neutral-500">{selectedGroup.memberCount} 成员在线</p>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedGroup(null)}
              className="p-2 text-neutral-600 hover:text-red-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {groupMessages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${
                message.type === 'announcement' ? 'justify-center' : ''
              }`}>
                {message.type !== 'announcement' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {message.author[0]}
                  </div>
                )}
                
                <div className={`flex-1 ${
                  message.type === 'announcement' ? 'max-w-md' : ''
                }`}>
                  {message.type === 'announcement' ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">公告</span>
                      </div>
                      <p className="text-blue-700">{message.content}</p>
                      <p className="text-xs text-blue-500 mt-2">{message.timestamp}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-neutral-800">{message.author}</span>
                        <span className="text-xs text-neutral-500">{message.timestamp}</span>
                      </div>
                      <div className="bg-neutral-100 rounded-xl p-3">
                        <p className="text-neutral-700">{message.content}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* 消息输入 */}
          <div className="p-6 border-t border-neutral-200">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="输入消息..."
                className="flex-1 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderCreateModal = () => {
    if (!showCreateModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-800">创建学习小组</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-neutral-600 hover:text-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateGroup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">小组名称 *</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="请输入小组名称"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">相关课程</label>
                  <input
                    type="text"
                    value={createForm.course}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, course: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="请输入课程名称"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">学科分类</label>
                  <select
                    value={createForm.subject}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">选择学科</option>
                    <option value="计算机科学">计算机科学</option>
                    <option value="数学">数学</option>
                    <option value="物理">物理</option>
                    <option value="人工智能">人工智能</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">难度等级</label>
                  <select
                    value={createForm.difficulty}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, difficulty: e.target.value as 'beginner' | 'intermediate' | 'advanced' }))}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="beginner">入门</option>
                    <option value="intermediate">中级</option>
                    <option value="advanced">高级</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">最大成员数</label>
                  <input
                    type="number"
                    value={createForm.maxMembers}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    min="3"
                    max="50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">会议时间</label>
                  <input
                    type="text"
                    value={createForm.meetingTime}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, meetingTime: e.target.value }))}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="例：每周三 19:00-21:00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">小组描述 *</label>
                <textarea
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  placeholder="请描述小组的学习目标和活动安排"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">活动地点</label>
                <input
                  type="text"
                  value={createForm.location}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="请输入活动地点"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={createForm.isPublic}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="w-4 h-4 text-purple-600 border-neutral-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="isPublic" className="text-sm text-neutral-700">
                  公开小组（其他用户可以搜索和加入）
                </label>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-all duration-200"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  创建小组
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  const tabs = [
    { id: 'discover', label: '发现小组', icon: Search },
    { id: 'my-groups', label: '我的小组', icon: Users }
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
            学习小组
          </h1>
          <p className="text-neutral-600">与同学一起学习，共同进步</p>
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
          {activeTab === 'discover' && renderDiscoverTab()}
          {activeTab === 'my-groups' && renderMyGroupsTab()}
        </div>
      </div>
      
      {/* 模态框 */}
      {renderCreateModal()}
      {renderGroupChat()}
    </div>
  );
};

export default StudyGroups;