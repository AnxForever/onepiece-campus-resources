import React, { useState } from 'react';
import { Star, Edit, Trash2, Eye, Download, Share2, ExternalLink, Heart, Copy, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Material } from '../types';
import { downloadMaterial, updateMaterialStats, deleteMaterial } from '../api';
import { toast } from 'react-hot-toast';

interface MaterialCardProps {
  material: Material;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const { admin, toggleEditModal, setCurrentMaterial, toggleFavorite } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(material.isFavorited || false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  
  // 处理下载点击
  const handleDownloadClick = async () => {
    try {
      // 如果是代码项目，直接打开仓库链接
      if (material.materialType === 'code') {
        window.open(material.repoUrl, '_blank');
        // 更新统计数据
        await updateMaterialStats(material.id, 'downloads');
        return;
      }
      
      // 如果是试卷资料，下载PDF
      const response = await downloadMaterial(material.id);
      if (response.success) {
        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${material.title}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 更新统计数据
        await updateMaterialStats(material.id, 'downloads');
        
        toast.success('下载成功');
      } else {
        toast.error(response.message || '下载失败');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('下载失败，请稍后再试');
    }
  };
  
  // 处理预览点击
  const handlePreviewClick = async () => {
    try {
      // 如果是代码项目，直接打开仓库链接
      if (material.materialType === 'code') {
        window.open(material.repoUrl, '_blank');
        // 更新统计数据
        await updateMaterialStats(material.id, 'views');
        return;
      }
      
      // 如果是试卷资料，在新窗口预览PDF
      window.open(`/preview/${material.id}`, '_blank');
      
      // 更新统计数据
      await updateMaterialStats(material.id, 'views');
    } catch (error) {
      console.error('Preview error:', error);
      toast.error('预览失败，请稍后再试');
    }
  };
  
  // 处理编辑点击
  const handleEditClick = () => {
    setCurrentMaterial(material);
    toggleEditModal(true);
  };
  
  // 处理删除点击
  const handleDeleteClick = async () => {
    if (!showConfirmDelete) {
      setShowConfirmDelete(true);
      return;
    }
    
    try {
      const response = await deleteMaterial(material.id);
      if (response.success) {
        toast.success('删除成功');
        // 刷新资料列表（通过全局状态管理）
        window.location.reload();
      } else {
        toast.error(response.message || '删除失败');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('删除失败，请稍后再试');
    } finally {
      setShowConfirmDelete(false);
    }
  };
  
  // 根据资料类型设置卡片样式
  const cardStyle = material.materialType === 'exam' 
    ? 'border-purple-200 hover:border-purple-300 bg-gradient-to-br from-white to-purple-50' 
    : 'border-blue-200 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50';
  
  // 根据资料类型设置标签样式
  const tagStyle = material.materialType === 'exam'
    ? 'bg-purple-100 text-purple-800'
    : 'bg-blue-100 text-blue-800';
  
  // 根据资料类型设置图标样式
  const iconStyle = material.materialType === 'exam'
    ? 'text-purple-500'
    : 'text-blue-500';
  
  return (
    <div 
      className={`relative rounded-xl border ${cardStyle} p-5 shadow-sm transition-all duration-300 ${isHovered ? 'shadow-md transform -translate-y-1' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 动态背景装饰 */}
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-xl pointer-events-none">
        <div 
          className={`absolute -top-4 -right-4 w-16 h-16 rounded-full ${material.materialType === 'exam' ? 'bg-purple-200' : 'bg-blue-200'} opacity-30`}
        ></div>
        <div 
          className={`absolute top-10 -right-10 w-24 h-24 rounded-full ${material.materialType === 'exam' ? 'bg-purple-100' : 'bg-blue-100'} opacity-20`}
        ></div>
      </div>
      
      {/* 粒子效果 */}
      {isHovered && (
        <>
          <div className={`absolute top-1/4 left-1/4 w-2 h-2 rounded-full ${material.materialType === 'exam' ? 'bg-purple-400' : 'bg-blue-400'} opacity-40 animate-float-slow`}></div>
          <div className={`absolute top-3/4 left-1/3 w-1 h-1 rounded-full ${material.materialType === 'exam' ? 'bg-purple-300' : 'bg-blue-300'} opacity-40 animate-float-medium`}></div>
          <div className={`absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full ${material.materialType === 'exam' ? 'bg-purple-300' : 'bg-blue-300'} opacity-40 animate-float-fast`}></div>
        </>
      )}
      
      {/* 头部区域 */}
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-purple-700 transition-colors">
            {material.title}
          </h3>
        </div>
        
        {/* 星标按钮 */}
        {material.isStarred && (
          <div className="ml-2 flex-shrink-0">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          </div>
        )}
      </div>
      
      {/* 类型标签 */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* 考试类型 */}
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${tagStyle}`}>
          {material.materialType === 'exam' ? '试卷资料' : '代码项目'}
        </span>
        
        {/* 课程类型 */}
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-800">
          {{
            'dataStructure': '数据结构',
            'algorithms': '算法',
            'computerNetworks': '计算机网络',
            'operatingSystems': '操作系统',
            'databaseSystems': '数据库系统',
            'compilers': '编译原理',
            'computerArchitecture': '计算机组成原理',
            'softwareEngineering': '软件工程',
            'webDevelopment': 'Web开发',
            'mobileDevelopment': '移动开发',
            'artificialIntelligence': '人工智能',
            'machineLearning': '机器学习',
            'deepLearning': '深度学习',
            'computerVision': '计算机视觉',
            'naturalLanguageProcessing': '自然语言处理',
            'distributedSystems': '分布式系统',
            'cloudComputing': '云计算',
            'bigData': '大数据',
            'informationSecurity': '信息安全',
            'other': '其他'
          }[material.courseType] || material.courseType}
        </span>
        
        {/* 编程语言（仅代码项目） */}
        {material.materialType === 'code' && material.programmingLanguage && (
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-xs font-medium text-green-800">
            {{
              'c': 'C',
              'cpp': 'C++',
              'java': 'Java',
              'python': 'Python',
              'javascript': 'JavaScript',
              'typescript': 'TypeScript',
              'go': 'Go',
              'rust': 'Rust',
              'csharp': 'C#',
              'php': 'PHP',
              'ruby': 'Ruby',
              'swift': 'Swift',
              'kotlin': 'Kotlin',
              'scala': 'Scala',
              'r': 'R',
              'matlab': 'MATLAB',
              'assembly': 'Assembly',
              'sql': 'SQL',
              'other': '其他'
            }[material.programmingLanguage] || material.programmingLanguage}
          </span>
        )}
        
        {/* 星级 */}
        {material.rating > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-yellow-100 text-xs font-medium text-yellow-800">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < material.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} mr-0.5`} 
              />
            ))}
          </span>
        )}
      </div>
      
      {/* 教师、年份、学期 */}
      <div className="flex flex-wrap text-xs text-gray-500 mb-3 gap-x-3">
        {material.teacher && (
          <span>教师: {material.teacher}</span>
        )}
        {material.year && (
          <span>年份: {material.year}</span>
        )}
        {material.semester && (
          <span>学期: {{
            'spring': '春季学期',
            'fall': '秋季学期',
            'summer': '夏季学期',
            'winter': '冬季学期'
          }[material.semester] || material.semester}</span>
        )}
      </div>
      
      {/* 管理员操作按钮 */}
      {admin.isAdminMode && (
        <div className="flex gap-2 mb-3">
          <button 
            onClick={handleEditClick}
            className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-purple-500"
          >
            <Edit className="h-3 w-3 mr-1" />
            编辑
          </button>
          
          <button 
            onClick={handleDeleteClick}
            className={`inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded ${showConfirmDelete ? 'text-white bg-red-500 hover:bg-red-600' : 'text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-red-500`}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {showConfirmDelete ? '确认删除' : '删除'}
          </button>
        </div>
      )}
      
      {/* 资料描述 */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {material.description}
      </p>
      
      {/* 统计信息 */}
      <div className="flex text-xs text-gray-500 mb-4 gap-x-3">
        <span className="flex items-center">
          <Eye className="h-3 w-3 mr-1" />
          {material.views} 浏览
        </span>
        <span className="flex items-center">
          <Download className="h-3 w-3 mr-1" />
          {material.downloads} 下载
        </span>
        <span className="flex items-center">
          <Heart className="h-3 w-3 mr-1" />
          {material.favorites} 收藏
        </span>
      </div>
      
      {/* 操作按钮区域 */}
      <div className="flex justify-between items-center">
        {/* 主要操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={handlePreviewClick}
            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white ${material.materialType === 'exam' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-0 ${material.materialType === 'exam' ? 'focus:ring-purple-500' : 'focus:ring-blue-500'}`}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            {material.materialType === 'exam' ? '预览' : '访问'}
          </button>
          
          <button
            onClick={handleDownloadClick}
            className={`inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-0 ${material.materialType === 'exam' ? 'focus:ring-purple-500' : 'focus:ring-blue-500'}`}
          >
            <Download className="h-3.5 w-3.5 mr-1" />
            {material.materialType === 'exam' ? '下载' : '访问'}
          </button>
        </div>
        
        {/* 更多操作按钮 */}
        <div className="flex gap-1">
          {/* 收藏按钮 */}
          <button
            onClick={() => {
              setIsFavorited(!isFavorited);
              toggleFavorite(material.id);
            }}
            className={`p-1.5 rounded-full ${isFavorited ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'}`}
            aria-label="收藏"
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500' : ''}`} />
          </button>
          
          {/* 分享按钮 */}
          <button
            onClick={() => {
              // 复制分享链接
              const shareUrl = `${window.location.origin}/material/${material.id}`;
              navigator.clipboard.writeText(shareUrl).then(() => {
                setIsLinkCopied(true);
                setTimeout(() => setIsLinkCopied(false), 2000);
                toast.success('链接已复制到剪贴板');
              });
              
              // 如果支持原生分享API，则使用
              if (navigator.share) {
                navigator.share({
                  title: material.title,
                  text: material.description,
                  url: shareUrl,
                });
              }
            }}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            aria-label="分享"
          >
            {isLinkCopied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
          </button>
          
          {/* 新窗口打开按钮 */}
          <button
            onClick={handlePreviewClick}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            aria-label="在新窗口打开"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* 悬浮效果装饰 */}
      {isHovered && (
        <div className="absolute inset-0 rounded-xl pointer-events-none">
          <div className={`absolute bottom-0 left-0 w-full h-1 ${material.materialType === 'exam' ? 'bg-purple-400' : 'bg-blue-400'} opacity-50 rounded-bl-xl rounded-br-xl`}></div>
        </div>
      )}
    </div>
  );
};

export default MaterialCard;