import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { login } from '../api';
import { toast } from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setAdmin } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 处理登录表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(username, password);
      
      if (response.success) {
        // 登录成功，更新全局状态
        setAdmin({
          isAdminMode: true,
          token: response.token,
          username: username
        });
        
        toast.success('登录成功！');
        onClose();
      } else {
        // 登录失败，显示错误信息
        setError(response.message || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('登录过程中发生错误，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  // 如果模态框未打开，不渲染任何内容
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* 模态框内容 */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
        {/* 模态框头部 */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <h2 className="text-xl font-bold">管理员登录</h2>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* 装饰元素 */}
          <div className="absolute -bottom-6 right-0 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute -top-8 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
        </div>
        
        {/* 模态框主体 */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* 错误信息 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          {/* 用户名输入 */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="请输入管理员用户名"
              required
              disabled={isLoading}
            />
          </div>
          
          {/* 密码输入 */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="请输入管理员密码"
              required
              disabled={isLoading}
            />
          </div>
          
          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300 focus:outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                登录中...
              </div>
            ) : '登录'}
          </button>
          
          {/* 提示信息 */}
          <p className="mt-4 text-xs text-gray-500 text-center">
            本系统仅供管理员使用，普通用户无需登录即可浏览和下载资源。
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;