import React, { useState, useEffect, useRef } from 'react';
import { FileText, Github, Calendar, User, Star, Edit, Trash2, Download, Eye, Heart, Share2, MoreHorizontal, ExternalLink } from 'lucide-react';
import { MaterialItem } from '../types';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';
import { downloadFile, getFileName } from '../utils/fileUtils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface MaterialCardProps {
  material: MaterialItem;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const { openPdfModal, admin, openEditModal, deleteMaterial } = useStore();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  const handleClick = (e: React.MouseEvent) => {
    // 如果点击的是管理员按钮，不执行卡片点击事件
    if ((e.target as HTMLElement).closest('.admin-actions')) {
      return;
    }
    
    // 导航到资源详情页面
    navigate(`/resource/${material.id}`);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (material.contentType === 'Paper' && material.filePath) {
      const fileName = getFileName(material.filePath) || `${material.courseName}-${material.examType}.pdf`;
      downloadFile(material.filePath, fileName);
      toast.success(`开始下载：${fileName}`);
    } else if (material.contentType === 'Code' && material.repoUrl) {
      // 对于代码项目，打开GitHub页面
      window.open(material.repoUrl, '_blank');
      toast.success('已打开GitHub仓库页面');
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (material.contentType === 'Paper') {
      openPdfModal(material);
    } else if (material.contentType === 'Code' && material.repoUrl) {
      window.open(material.repoUrl, '_blank');
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditModal(material);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`确定要删除「${material.courseName}」吗？此操作不可撤销。`)) {
      const success = deleteMaterial(material.id);
      if (success !== false) {
        toast.success('资料删除成功');
      }
    }
  };

  const isPaper = material.contentType === 'Paper';
  const isCode = material.contentType === 'Code';

  const getTypeColor = () => {
    if (isPaper) {
      return {
        bg: 'bg-gradient-to-r from-blue-50 to-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        glow: 'shadow-blue-200/50'
      };
    } else {
      return {
        bg: 'bg-gradient-to-r from-green-50 to-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        glow: 'shadow-green-200/50'
      };
    }
  };

  const typeStyle = getTypeColor();

  return (
    <div className="group relative">
      {/* 卡片主体 */}
      <div
        onClick={handleClick}
        className={clsx(
          'relative glass-effect rounded-3xl p-8 magnetic-hover card-3d gradient-border overflow-hidden cursor-pointer transform transition-all duration-700 hover:scale-[1.02]'
        )}
      >
        {/* 动态背景装饰 */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl transform translate-x-20 -translate-y-20 group-hover:scale-150 transition-transform duration-700 neon-glow" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400/15 to-purple-400/15 rounded-full blur-2xl transform -translate-x-16 translate-y-16 group-hover:scale-125 transition-transform duration-500" />
        
        {/* 粒子效果 */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-purple-400/60 rounded-full particle-animation" />
        <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-blue-400/60 rounded-full particle-animation" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-6 left-6 w-2.5 h-2.5 bg-pink-400/60 rounded-full particle-animation" style={{ animationDelay: '2s' }} />
        
        {/* 头部区域 */}
        <div className="relative mb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300 line-clamp-1 flex-1">
                  {material.courseName}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsStarred(!isStarred);
                    toast.success(isStarred ? '已取消星标' : '已添加星标');
                  }}
                  className={`p-2 rounded-full transition-all duration-300 hover-scale ${
                    isStarred ? 'text-yellow-500 bg-yellow-100/80 neon-glow' : 'text-neutral-400 hover:text-yellow-500 hover:bg-yellow-50'
                  }`}
                >
                  <Star className={`w-5 h-5 ${isStarred ? 'fill-current animate-pulse' : ''}`} />
                </button>
              </div>
            
            {isPaper && material.examType && (
              <p className="text-purple-600 font-medium mb-2">
                {material.examType}
              </p>
            )}
            
            {isCode && material.language && (
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                  {material.language}
                </span>
                {material.stars && (
                  <div className="flex items-center gap-1 text-yellow-400 text-xs">
                    <Star className="w-3 h-3 fill-current" />
                    {material.stars}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-neutral-600 mb-3">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span className="font-medium">{material.teacher}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{material.year} {material.semester}</span>
              </div>
            </div>
          </div>
          
            {/* 类型标签 */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border} shadow-lg ${typeStyle.glow} hover-scale magnetic-hover relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
              <div className="relative z-10 flex items-center gap-3">
                {isPaper ? (
                  <>
                    <div className="p-1.5 bg-blue-500/20 rounded-lg">
                      <FileText className="w-5 h-5 animate-breathe" />
                    </div>
                    <span className="text-base font-bold">📄 试卷资料</span>
                  </>
                ) : (
                  <>
                    <div className="p-1.5 bg-green-500/20 rounded-lg">
                      <Github className="w-5 h-5 animate-wave" />
                    </div>
                    <span className="text-base font-bold">💻 代码项目</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* 管理员操作按钮 */}
          {admin.isAdminMode && (
            <div className="admin-actions absolute top-0 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
              <button
                onClick={handleEdit}
                className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                title="编辑"
              >
                <Edit className="w-3 h-3" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                title="删除"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* 描述区域 */}
        {material.description && (
          <div className="relative mb-4">
            <p className="text-neutral-700 text-sm leading-relaxed line-clamp-2">
              {material.description}
            </p>
          </div>
        )}

        {/* 统计信息 */}
        <div className="flex items-center gap-4 mb-4 text-xs text-neutral-500">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{material.views || 0} 浏览</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{material.downloads || 0} 下载</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{material.favorites || 0} 收藏</span>
          </div>
        </div>

        {/* 操作按钮区域 */}
        <div className="relative flex gap-2">
          <button 
            onClick={handlePreview}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 transition-all duration-500 shadow-md hover:shadow-lg magnetic-hover neon-glow group/btn relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-all duration-300 relative z-10" />
            <span className="font-medium text-sm relative z-10">预览</span>
          </button>
          
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 transition-all duration-500 shadow-md hover:shadow-lg magnetic-hover card-3d group/btn relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <Download className="w-4 h-4 group-hover/btn:scale-110 transition-all duration-300 relative z-10" />
            <span className="font-medium text-sm relative z-10">{material.contentType === 'Paper' ? '下载' : '访问'}</span>
          </button>
          
          {/* 更多操作 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className={`p-2 rounded-xl transition-all duration-500 shadow-md hover:shadow-lg magnetic-hover card-3d group/more relative overflow-hidden cursor-pointer ${
                showActions 
                  ? 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-2 border-purple-300' 
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-600 hover:text-gray-800'
              }`}
              type="button"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover/more:opacity-100 transition-opacity duration-300" />
              <MoreHorizontal className={`w-4 h-4 group-hover/more:scale-110 transition-all duration-300 relative z-10 pointer-events-none ${
                showActions ? 'rotate-90' : 'group-hover/more:rotate-90'
              }`} />
            </button>
            
            {showActions && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white/95 backdrop-blur-xl border-2 border-purple-200/50 rounded-xl shadow-xl overflow-hidden animate-fade-in z-[101]">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 to-blue-50/80" />
                <div className="p-1.5 relative z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLiked(!isLiked);
                        toast.success(isLiked ? '已取消收藏' : '已添加到收藏');
                        setShowActions(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-all duration-300 group/item hover-scale relative overflow-hidden mb-1 ${
                        isLiked 
                          ? 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200' 
                          : 'text-neutral-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 border border-transparent hover:border-red-200'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                      <Heart className={`w-4 h-4 group-hover/item:scale-110 transition-all duration-300 relative z-10 ${isLiked ? 'fill-current text-red-500' : 'text-red-500'}`} />
                      <span className="text-sm font-medium relative z-10">{isLiked ? '取消收藏' : '收藏'}</span>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const shareText = `分享一个好资源：${material.courseName} - ${material.teacher}老师`;
                        if (navigator.share) {
                          navigator.share({
                            title: material.courseName,
                            text: shareText,
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(shareText);
                          toast.success('分享链接已复制到剪贴板');
                        }
                        setShowActions(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-neutral-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-600 transition-all duration-300 group/item hover-scale relative overflow-hidden rounded-lg border border-transparent hover:border-blue-200 mb-1"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                      <Share2 className="w-4 h-4 group-hover/item:scale-110 group-hover/item:rotate-12 transition-all duration-300 text-blue-500 relative z-10" />
                      <span className="text-sm font-medium relative z-10">分享</span>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (material.contentType === 'Paper') {
                          openPdfModal(material);
                        } else if (material.repoUrl) {
                          window.open(material.repoUrl, '_blank');
                        }
                        setShowActions(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-neutral-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-all duration-300 group/item hover-scale relative overflow-hidden rounded-lg border border-transparent hover:border-green-200"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
                      <ExternalLink className="w-4 h-4 group-hover/item:scale-110 group-hover/item:-rotate-12 transition-all duration-300 text-green-500 relative z-10" />
                      <span className="text-sm font-medium relative z-10">新窗口打开</span>
                    </button>
                  </div>
                </div>
            )}
          </div>
        </div>
        
        {/* 悬浮效果装饰 */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
      

    </div>
  );
};

export default MaterialCard;