import React, { useState } from 'react';
import { X, LogIn, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { login } from '../api';
import { toast } from 'react-hot-toast';

const LoginModal: React.FC = () => {
  const { showLoginModal, toggleLoginModal, setAdmin } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 处理登录表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!username.trim() || !password.trim()) {
      setError('用户名和密码不能为空');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // 调用登录API
      const response = await login(username, password);
      
      if (response.success) {
        // 登录成功
        setAdmin({
          isAdminMode: true,
          token: response.data.token,
          username: username
        });
        
        // 关闭模态框
        toggleLoginModal(false);
        
        // 清空表单
        setUsername('');
        setPassword('');
        
        // 显示成功提示
        toast.success('登录成功');
      } else {
        // 登录失败
        setError(response.message || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('登录失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 如果模态框不显示，则不渲染
  if (!showLoginModal) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={() => toggleLoginModal(false)}
      ></div>
      
      {/* 模态框内容 */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 overflow-hidden transform transition-all">
          {/* 模态框头部 */}
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-medium text-gray-900">管理员登录</h3>
            <button
              onClick={() => toggleLoginModal(false)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* 登录表单 */}
          <form onSubmit={handleSubmit}>
            {/* 错误提示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            {/* 用户名输入 */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                用户名
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入管理员用户名"
                disabled={isLoading}
              />
            </div>
            
            {/* 密码输入 */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="请输入管理员密码"
                disabled={isLoading}
              />
            </div>
            
            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  登录中...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-1.5" />
                  登录
                </>
              )}
            </button>
          </form>
          
          {/* 装饰元素 */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 rounded-full bg-gradient-to-br from-purple-200 to-indigo-200 opacity-50"></div>
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 rounded-full bg-gradient-to-tr from-purple-200 to-indigo-200 opacity-50"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;