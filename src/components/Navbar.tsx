import React, { useState } from 'react';
import { Settings, Shield, ShieldOff, Upload, Plus, Menu, X, Bell, User, Search, Sparkles, TrendingUp, Users, LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import LoginModal from './LoginModal';

const Navbar: React.FC = () => {
  const { admin, openUploadModal, openLoginModal, closeLoginModal, logoutAdmin } = useStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: '新资料上传', message: '数据结构期末试卷已上传', time: '2分钟前', unread: true },
    { id: 2, title: '系统更新', message: '搜索功能已优化', time: '1小时前', unread: true },
    { id: 3, title: '用户反馈', message: '收到新的功能建议', time: '3小时前', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo区域 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    One Piece
                  </h1>
                  <p className="text-xs text-neutral-500 -mt-1">校园资源库</p>
                </div>
              </div>
            </div>

            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center space-x-3">
              {/* 导航链接 */}
              <nav className="flex items-center gap-4">
                <Link
                  to="/analytics"
                  className="flex items-center gap-2 px-3 py-2 text-neutral-700 hover:text-purple-600 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">学习分析</span>
                </Link>
                <Link
                  to="/groups"
                  className="flex items-center gap-2 px-3 py-2 text-neutral-700 hover:text-purple-600 transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">学习小组</span>
                </Link>
              </nav>
              
              {/* 快速搜索按钮 */}
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl hover:bg-neutral-200 transition-all duration-200 group">
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-sm">快速搜索</span>
                <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-xs">⌘K</kbd>
              </button>

              {/* 通知按钮 */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="p-4 border-b border-neutral-100">
                      <h3 className="font-semibold text-neutral-800">通知</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className={`p-4 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${
                          notification.unread ? 'bg-purple-50/50' : ''
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                              notification.unread ? 'bg-purple-500' : 'bg-neutral-300'
                            }`} />
                            <div className="flex-1">
                              <h4 className="font-medium text-neutral-800 text-sm">{notification.title}</h4>
                              <p className="text-neutral-600 text-sm mt-1">{notification.message}</p>
                              <p className="text-neutral-400 text-xs mt-2">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-neutral-100">
                      <button className="w-full text-center text-purple-600 text-sm font-medium hover:text-purple-700 transition-colors">
                        查看全部通知
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 管理员登录/退出 */}
              {admin.isAdminMode ? (
                <button
                  onClick={logoutAdmin}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium transition-all duration-200 hover:from-red-600 hover:to-red-700 shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  退出管理
                </button>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium transition-all duration-200 hover:from-purple-600 hover:to-purple-700 shadow-lg"
                >
                  <LogIn className="w-4 h-4" />
                  管理员登录
                </button>
              )}

              {/* 管理员操作按钮 */}
              {admin.isAdminMode && (
                <>
                  <button
                    onClick={openUploadModal}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="text-sm font-medium">上传资源</span>
                  </button>
                </>
              )}

              {/* 用户菜单 */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>
                
                {showUserMenu && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>个人中心</span>
                      </Link>
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                        <span>设置</span>
                      </button>
                    </div>
                    <div className="border-t border-neutral-100 p-2">
                      <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <span>退出登录</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* 移动端菜单 */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-white/20 py-4">
              <div className="space-y-2">
                {/* 管理员登录/退出 - 移动端 */}
                {admin.isAdminMode ? (
                  <button
                    onClick={logoutAdmin}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>退出管理模式</span>
                  </button>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>管理员登录</span>
                  </button>
                )}
                
                {/* 管理员功能 - 移动端 */}
                {admin.isAdminMode && (
                  <button
                    onClick={openUploadModal}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium transition-all duration-200"
                  >
                    <Upload className="w-5 h-5" />
                    <span>上传资源</span>
                  </button>
                )}
                
                <Link
                  to="/analytics"
                  className="w-full flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>学习分析</span>
                </Link>
                
                <Link
                  to="/groups"
                  className="w-full flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>学习小组</span>
                </Link>
                
                <Link
                  to="/profile"
                  className="w-full flex items-center gap-3 px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>个人中心</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 登录模态框 */}
      <LoginModal
        isOpen={admin.isLoginModalOpen}
        onClose={closeLoginModal}
      />
    </>
  );
};

export default Navbar;
