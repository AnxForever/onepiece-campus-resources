import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Bell, Search, Upload, LogOut, User, Settings, ChevronDown, BookOpen, Users, BarChart2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import LoginModal from './LoginModal';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { admin, toggleLoginModal, isLoginModalOpen, logoutAdmin, toggleUploadModal } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // 通知列表（示例数据）
  const notifications = [
    { id: 1, title: '新资源上传', message: '数据结构期末考试真题已上传', time: '10分钟前', isRead: false },
    { id: 2, title: '系统通知', message: '平台将于今晚22:00-23:00进行维护', time: '2小时前', isRead: true },
    { id: 3, title: '资源更新', message: 'Web开发课程项目代码已更新', time: '昨天', isRead: true },
  ];

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 关闭移动端菜单
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // 处理管理员登录
  const handleAdminLogin = () => {
    toggleLoginModal(true);
    closeMobileMenu();
  };

  // 处理管理员登出
  const handleAdminLogout = () => {
    logoutAdmin();
    closeMobileMenu();
  };

  // 处理上传资源
  const handleUpload = () => {
    toggleUploadModal(true);
    closeMobileMenu();
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo区域 */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  One Piece
                </span>
              </Link>
            </div>

            {/* 桌面端导航 */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <Link 
                to="/analytics" 
                className={`text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/analytics' ? 'text-purple-600' : ''}`}
              >
                <div className="flex items-center space-x-1">
                  <BarChart2 className="w-4 h-4" />
                  <span>学习分析</span>
                </div>
              </Link>
              
              <Link 
                to="/groups" 
                className={`text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/groups' ? 'text-purple-600' : ''}`}
              >
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>学习小组</span>
                </div>
              </Link>
              
              {/* 快速搜索按钮 */}
              <button className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                <div className="flex items-center space-x-1">
                  <Search className="w-4 h-4" />
                  <span>快速搜索</span>
                </div>
              </button>
              
              {/* 通知按钮及下拉菜单 */}
              <div className="relative" ref={notificationsRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative text-gray-600 hover:text-purple-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                </button>
                
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700">通知</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div>
                          {notifications.map((notification) => (
                            <div 
                              key={notification.id} 
                              className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-blue-50' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                                <span className="text-xs text-gray-500">{notification.time}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-center text-gray-500">
                          <p>暂无通知</p>
                        </div>
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 text-center">
                      <button className="text-sm text-purple-600 hover:text-purple-800 font-medium">
                        查看全部
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 管理员登录/退出按钮 */}
              {admin.isAdminMode ? (
                <button 
                  onClick={handleAdminLogout}
                  className="text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-1">
                    <LogOut className="w-4 h-4" />
                    <span>退出管理</span>
                  </div>
                </button>
              ) : (
                <button 
                  onClick={handleAdminLogin}
                  className="text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>管理员登录</span>
                  </div>
                </button>
              )}
              
              {/* 管理员操作按钮 */}
              {admin.isAdminMode && (
                <button 
                  onClick={handleUpload}
                  className="text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-1">
                    <Upload className="w-4 h-4" />
                    <span>上传资源</span>
                  </div>
                </button>
              )}
              
              {/* 用户菜单 */}
              <div className="relative" ref={userMenuRef}>
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    U
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isUserMenuOpen ? 'transform rotate-180' : ''}`} />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>个人中心</span>
                      </div>
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>设置</span>
                      </div>
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        // 处理登出逻辑
                        setIsUserMenuOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <LogOut className="w-4 h-4" />
                        <span>退出登录</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-purple-600 p-2 rounded-md transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 移动端菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* 管理员模式下的退出管理模式按钮 */}
              {admin.isAdminMode && (
                <button 
                  onClick={handleAdminLogout}
                  className="w-full flex items-center justify-center space-x-2 text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md mb-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>退出管理模式</span>
                </button>
              )}
              
              {/* 管理员登录按钮 */}
              {!admin.isAdminMode && (
                <button 
                  onClick={handleAdminLogin}
                  className="w-full flex items-center justify-center space-x-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md mb-2"
                >
                  <User className="w-4 h-4" />
                  <span>管理员登录</span>
                </button>
              )}
              
              {/* 管理员功能 */}
              {admin.isAdminMode && (
                <button 
                  onClick={handleUpload}
                  className="w-full flex items-center justify-center space-x-2 text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md mb-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>上传资源</span>
                </button>
              )}
              
              {/* 学习分析 */}
              <Link 
                to="/analytics" 
                className="block text-gray-600 hover:bg-gray-50 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center space-x-2">
                  <BarChart2 className="w-5 h-5" />
                  <span>学习分析</span>
                </div>
              </Link>
              
              {/* 学习小组 */}
              <Link 
                to="/groups" 
                className="block text-gray-600 hover:bg-gray-50 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>学习小组</span>
                </div>
              </Link>
              
              {/* 个人中心 */}
              <Link 
                to="/profile" 
                className="block text-gray-600 hover:bg-gray-50 hover:text-purple-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={closeMobileMenu}
              >
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>个人中心</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      {/* 登录模态框 */}
      {isLoginModalOpen && <LoginModal />}
    </>
  );
};

export default Navbar;