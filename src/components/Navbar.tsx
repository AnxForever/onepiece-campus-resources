import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, Upload, User, Home, Book, Code } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import LoginModal from './LoginModal';

const Navbar: React.FC = () => {
  const { admin, logout, toggleLoginModal, toggleUploadModal } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // 监听滚动事件，用于导航栏样式变化
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // 关闭移动端菜单
  const closeMenu = () => setIsMenuOpen(false);
  
  // 处理登录按钮点击
  const handleLoginClick = () => {
    toggleLoginModal(true);
    closeMenu();
  };
  
  // 处理登出按钮点击
  const handleLogoutClick = () => {
    logout();
    closeMenu();
  };
  
  // 处理上传按钮点击
  const handleUploadClick = () => {
    toggleUploadModal(true);
    closeMenu();
  };
  
  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center" onClick={closeMenu}>
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">OP</span>
                </div>
                <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                  OnePiece
                </span>
              </Link>
            </div>
            
            {/* 桌面端导航 */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-sm font-medium ${location.pathname === '/' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'} transition-colors`}
              >
                首页
              </Link>
              <Link 
                to="/exams" 
                className={`text-sm font-medium ${location.pathname === '/exams' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'} transition-colors`}
              >
                试卷资料
              </Link>
              <Link 
                to="/projects" 
                className={`text-sm font-medium ${location.pathname === '/projects' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'} transition-colors`}
              >
                代码项目
              </Link>
              <Link 
                to="/about" 
                className={`text-sm font-medium ${location.pathname === '/about' ? 'text-purple-600' : 'text-gray-700 hover:text-purple-600'} transition-colors`}
              >
                关于我们
              </Link>
              
              {/* 管理员上传按钮 */}
              {admin.isAdminMode && (
                <button
                  onClick={handleUploadClick}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Upload className="h-4 w-4 mr-1.5" />
                  上传资源
                </button>
              )}
              
              {/* 登录/登出按钮 */}
              {admin.isAdminMode ? (
                <button
                  onClick={handleLogoutClick}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <LogOut className="h-4 w-4 mr-1.5" />
                  退出管理
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <LogIn className="h-4 w-4 mr-1.5" />
                  管理员登录
                </button>
              )}
            </nav>
            
            {/* 移动端菜单按钮 */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-purple-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <span className="sr-only">打开菜单</span>
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
          <div className="md:hidden bg-white shadow-lg rounded-b-lg mt-2">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                onClick={closeMenu}
              >
                <Home className="h-5 w-5 mr-2" />
                首页
              </Link>
              <Link
                to="/exams"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                onClick={closeMenu}
              >
                <Book className="h-5 w-5 mr-2" />
                试卷资料
              </Link>
              <Link
                to="/projects"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                onClick={closeMenu}
              >
                <Code className="h-5 w-5 mr-2" />
                代码项目
              </Link>
              <Link
                to="/about"
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                onClick={closeMenu}
              >
                <User className="h-5 w-5 mr-2" />
                关于我们
              </Link>
              
              {/* 管理员上传按钮（移动端） */}
              {admin.isAdminMode && (
                <button
                  onClick={handleUploadClick}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  上传资源
                </button>
              )}
              
              {/* 登录/登出按钮（移动端） */}
              {admin.isAdminMode ? (
                <button
                  onClick={handleLogoutClick}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  退出管理
                </button>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  管理员登录
                </button>
              )}
            </div>
          </div>
        )}
      </header>
      
      {/* 登录模态框 */}
      <LoginModal />
    </>
  );
};

export default Navbar;