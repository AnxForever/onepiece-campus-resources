import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Upload, LogIn, LogOut, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import LoginModal from './LoginModal';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { admin, logout, toggleUploadModal } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // 监听滚动事件，添加导航栏背景
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 处理登录按钮点击
  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
    setIsMenuOpen(false);
  };
  
  // 处理登出按钮点击
  const handleLogoutClick = () => {
    logout();
    setIsMenuOpen(false);
  };
  
  // 处理上传按钮点击
  const handleUploadClick = () => {
    toggleUploadModal(true);
    setIsMenuOpen(false);
  };
  
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo和品牌名称 */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-lg mr-2">
                  OP
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  OnePiece
                </span>
                <span className="ml-1 text-gray-700 font-medium hidden sm:inline-block">
                  校园资源共享
                </span>
              </Link>
            </div>
            
            {/* 桌面导航链接 */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}
              >
                首页
              </Link>
              <Link 
                to="/about" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/about' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'}`}
              >
                关于我们
              </Link>
              
              {/* 管理员操作按钮 */}
              {admin.isAdminMode ? (
                <div className="flex items-center ml-4">
                  <button
                    onClick={handleUploadClick}
                    className="ml-2 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-1" />
                    上传资源
                  </button>
                  
                  <div className="relative ml-3 group">
                    <button className="flex items-center text-sm font-medium text-gray-700 hover:text-purple-600 focus:outline-none">
                      <User className="w-5 h-5 mr-1" />
                      <span>{admin.username}</span>
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block">
                      <button
                        onClick={handleLogoutClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        退出登录
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="ml-4 inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-1" />
                  管理员登录
                </button>
              )}
            </div>
            
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <span className="sr-only">打开主菜单</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-b-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                首页
              </Link>
              <Link
                to="/about"
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/about' ? 'text-purple-600 bg-purple-50' : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                关于我们
              </Link>
              
              {/* 管理员操作按钮（移动端） */}
              {admin.isAdminMode ? (
                <div className="space-y-1 pt-2 border-t border-gray-200">
                  <div className="px-3 py-2 text-sm text-gray-500">
                    已登录为: {admin.username}
                  </div>
                  <button
                    onClick={handleUploadClick}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 flex items-center"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    上传资源
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    退出登录
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="w-full text-left mt-2 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50 flex items-center"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  管理员登录
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* 登录模态框 */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;