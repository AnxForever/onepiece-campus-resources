import React from 'react';
import { Settings, Upload, Shield, ShieldOff } from 'lucide-react';
import { useStore } from '../store/useStore';

const AdminToolbar: React.FC = () => {
  const { admin, loginAdmin, logoutAdmin, openUploadModal } = useStore();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-purple-200/30">
        {/* 管理员模式切换 */}
        <button
          onClick={admin.isAdminMode ? logoutAdmin : loginAdmin}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            admin.isAdminMode
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-white/20 text-purple-700 hover:bg-white/30'
          }`}
          title={admin.isAdminMode ? '退出管理员模式' : '进入管理员模式'}
        >
          {admin.isAdminMode ? (
            <>
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">管理模式</span>
            </>
          ) : (
            <>
              <ShieldOff className="w-4 h-4" />
              <span className="hidden sm:inline">普通模式</span>
            </>
          )}
        </button>

        {/* 管理员功能按钮 */}
        {admin.isAdminMode && (
          <>
            <div className="w-px h-6 bg-purple-300" />
            
            {/* 上传按钮 */}
            <button
              onClick={openUploadModal}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              title="上传新资料"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">上传</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminToolbar;