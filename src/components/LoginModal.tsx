import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

const LoginModal: React.FC = () => {
  const { admin, toggleLoginModal, setAdminMode } = useStore();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 模拟API请求延迟
    setTimeout(() => {
      // 检查密码是否正确
      if (password === admin.password) {
        setAdminMode(true);
        toggleLoginModal(false);
        toast.success('管理员登录成功');
      } else {
        setError('密码错误，请重试');
      }
      setIsLoading(false);
    }, 800);
  };

  // 处理取消按钮
  const handleCancel = () => {
    toggleLoginModal(false);
  };

  // 处理密码输入变化
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError('');
  };

  // 切换密码显示/隐藏
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancel}></div>
      
      {/* 模态框 */}
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl transform transition-all animate-fade-in-up">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-blue-400/30 to-purple-400/30 rounded-full blur-3xl" />
        </div>
        
        {/* 内容区域 */}
        <div className="relative z-10">
          {/* 标题和关闭按钮 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              管理员登录
            </h2>
            <button 
              onClick={handleCancel}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* 登录表单 */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="relative">
                <div className="flex">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="请输入管理员密码"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
                
                <p className="mt-3 text-sm text-gray-500">
                  提示：默认管理员密码为 <span className="font-medium text-purple-600">admin123</span>
                </p>
              </div>
            </div>
            
            {/* 按钮区域 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? '登录中...' : '登录'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;