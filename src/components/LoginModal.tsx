import React, { useState } from 'react';
import { X, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../store/useStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { loginAdmin } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 模拟登录延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    if (username === 'AnxForever' && password === 'foryou123') {
      loginAdmin();
      onClose();
      setUsername('');
      setPassword('');
    } else {
      setError('账号或密码错误，请重试');
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-neutral-800">管理员登录</h2>
                <p className="text-sm text-neutral-500">请输入管理员凭据</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 表单内容 */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* 错误提示 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 账号输入 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                管理员账号
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="请输入管理员账号"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700">
                管理员密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="请输入管理员密码"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 提示信息 */}
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-xs text-purple-600">
                💡 只有拥有管理员权限的用户才能访问资源上传和管理功能
              </p>
            </div>

            {/* 按钮组 */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors font-medium"
                disabled={isLoading}
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !username || !password}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>登录中...</span>
                  </div>
                ) : (
                  '登录'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginModal;