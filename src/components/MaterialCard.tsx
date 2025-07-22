import React, { useState } from 'react';
import { Eye, Download, Star, Share2, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Material } from '../types';
import { downloadMaterial, deleteMaterial } from '../api';
import { toast } from 'react-hot-toast';

interface MaterialCardProps {
  material: Material;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material }) => {
  const { 
    admin, 
    togglePdfModal, 
    toggleEditModal,
    deleteMaterial: removeFromStore,
    favorites,
    toggleFavorite 
  } = useStore();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const isFavorited = favorites.includes(material.id);
  
  // 处理点击下载
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toast.promise(
      downloadMaterial(material.id),
      {
        loading: '正在准备下载...',
        success: '下载已开始',
        error: '下载失败，请稍后再试',
      }
    );
  };
  
  // 处理点击预览
  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (material.materialType === 'exam' && material.fileUrl) {
      togglePdfModal(true, material.fileUrl);
    } else if (material.materialType === 'code' && material.repoUrl) {
      window.open(material.repoUrl, '_blank');
    }
  };
  
  // 处理点击编辑
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    toggleEditModal(true, material);
  };
  
  // 处理点击删除
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`确定要删除 "${material.title}" 吗？此操作不可撤销。`)) {
      setIsDeleting(true);
      
      try {
        const response = await deleteMaterial(material.id);
        
        if (response.success) {
          removeFromStore(material.id);
          toast.success('资料已成功删除');
        } else {
          toast.error(response.message || '删除失败，请稍后再试');
        }
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('删除过程中发生错误');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  // 根据资料类型设置卡片样式
  const getCardStyle = () => {
    if (material.materialType === 'exam') {
      return {
        gradientFrom: 'from-purple-500',
        gradientTo: 'to-indigo-600',
        iconColor: 'text-purple-500',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-100',
        hoverBorderColor: 'hover:border-purple-300',
        tagBg: 'bg-purple-100',
        tagText: 'text-purple-800'
      };
    } else {
      return {
        gradientFrom: 'from-blue-500',
        gradientTo: 'to-cyan-600',
        iconColor: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-100',
        hoverBorderColor: 'hover:border-blue-300',
        tagBg: 'bg-blue-100',
        tagText: 'text-blue-800'
      };
    }
  };
  
  const style = getCardStyle();
  
  return (
    <div 
      className={`relative group overflow-hidden rounded-xl shadow-sm ${style.borderColor} border hover:shadow-md transition-all duration-300 ${style.hoverBorderColor} ${style.bgColor} bg-opacity-30`}
    >
      {/* 卡片主体 */}
      <div className="relative z-10 p-5">
        {/* 动态背景装饰 */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${style.gradientFrom} ${style.gradientTo} opacity-10 -mr-16 -mt-16 blur-2xl`}></div>
        <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr ${style.gradientFrom} ${style.gradientTo} opacity-10 -ml-12 -mb-12 blur-xl`}></div>
        
        {/* 粒子效果 */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className={`absolute w-1 h-1 rounded-full ${style.gradientFrom} opacity-30`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 7}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
        
        {/* 头部区域 */}
        <div className="mb-3">
          {/* 课程名称和星标按钮 */}
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-purple-700 transition-colors">
              {material.title}
            </h3>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(material.id);
              }}
              className={`ml-2 flex-shrink-0 p-1 rounded-full transition-colors ${isFavorited ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'}`}
            >
              <Star className="w-5 h-5" fill={isFavorited ? 'currentColor' : 'none'} />
            </button>
          </div>
          
          {/* 考试类型/编程语言 */}
          <div className="flex flex-wrap gap-2 mb-2">
            {material.courseType && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
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
            )}
            
            {material.materialType === 'code' && material.programmingLanguage && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
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
          </div>
          
          {/* 星级、教师、年份、学期 */}
          <div className="flex flex-wrap text-xs text-gray-500 gap-x-4 gap-y-1 mb-1">
            {material.teacher && (
              <span className="flex items-center">
                <span className="mr-1">👨‍🏫</span>
                {material.teacher}
              </span>
            )}
            
            {material.year && (
              <span className="flex items-center">
                <span className="mr-1">📅</span>
                {material.year}
              </span>
            )}
            
            {material.semester && (
              <span className="flex items-center">
                <span className="mr-1">🍂</span>
                {{
                  'spring': '春季学期',
                  'fall': '秋季学期',
                  'summer': '夏季学期',
                  'winter': '冬季学期'
                }[material.semester] || material.semester}
              </span>
            )}
          </div>
        </div>
        
        {/* 类型标签 */}
        <div className="absolute top-0 left-0 mt-5 -ml-6 transform -rotate-45">
          <div className={`${style.tagBg} ${style.tagText} text-xs font-bold py-1 px-6 shadow-sm`}>
            {material.materialType === 'exam' ? '试卷资料' : '代码项目'}
          </div>
        </div>
        
        {/* 管理员操作按钮 */}
        {admin.isAdminMode && (
          <div className="absolute top-2 right-2 flex space-x-1">
            <button 
              onClick={handleEdit}
              disabled={isDeleting}
              className="p-1 rounded-full bg-white text-gray-600 hover:text-purple-600 shadow-sm hover:shadow transition-all"
              title="编辑"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1 rounded-full bg-white text-gray-600 hover:text-red-600 shadow-sm hover:shadow transition-all"
              title="删除"
            >
              {isDeleting ? (
                <div className="w-4 h-4 border-2 border-t-red-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
        
        {/* 资料描述 */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {material.description}
        </p>
        
        {/* 统计信息 */}
        <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
          <div className="flex items-center">
            <Eye className="w-3.5 h-3.5 mr-1" />
            <span>{material.views}</span>
          </div>
          <div className="flex items-center">
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>{material.downloads}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-3.5 h-3.5 mr-1" />
            <span>{material.favorites}</span>
          </div>
        </div>
        
        {/* 操作按钮区域 */}
        <div className="flex items-center justify-between">
          {/* 预览按钮 */}
          <button
            onClick={handlePreview}
            className={`flex-1 mr-2 flex items-center justify-center px-3 py-1.5 rounded-lg text-white text-sm font-medium bg-gradient-to-r ${style.gradientFrom} ${style.gradientTo} hover:opacity-90 transition-opacity shadow-sm`}
          >
            <Eye className="w-4 h-4 mr-1.5" />
            预览
          </button>
          
          {/* 下载/访问按钮 */}
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center px-3 py-1.5 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
          >
            {material.materialType === 'exam' ? (
              <>
                <Download className="w-4 h-4 mr-1.5" />
                下载
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-1.5" />
                访问
              </>
            )}
          </button>
        </div>
        
        {/* 更多操作按钮 */}
        <div className="absolute bottom-2 right-2 flex space-x-1">
          {/* 收藏按钮 */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(material.id);
              toast.success(isFavorited ? '已从收藏中移除' : '已添加到收藏');
            }}
            className={`p-1.5 rounded-full ${isFavorited ? 'bg-yellow-50 text-yellow-500' : 'bg-white text-gray-400'} hover:shadow transition-all`}
            title={isFavorited ? '取消收藏' : '收藏'}
          >
            <Star className="w-3.5 h-3.5" fill={isFavorited ? 'currentColor' : 'none'} />
          </button>
          
          {/* 分享按钮 */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowShareOptions(!showShareOptions);
              }}
              className="p-1.5 rounded-full bg-white text-gray-400 hover:text-blue-500 hover:shadow transition-all"
              title="分享"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            
            {showShareOptions && (
              <div className="absolute bottom-full right-0 mb-2 w-32 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // 复制分享链接
                    const shareUrl = `${window.location.origin}/material/${material.id}`;
                    navigator.clipboard.writeText(shareUrl);
                    toast.success('链接已复制到剪贴板');
                    setShowShareOptions(false);
                  }}
                  className="block w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                >
                  复制链接
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // 使用原生分享API（如果可用）
                    if (navigator.share) {
                      navigator.share({
                        title: material.title,
                        text: material.description,
                        url: `${window.location.origin}/material/${material.id}`,
                      });
                    } else {
                      toast.error('您的浏览器不支持分享功能');
                    }
                    setShowShareOptions(false);
                  }}
                  className="block w-full text-left px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                >
                  分享到...
                </button>
              </div>
            )}
          </div>
          
          {/* 新窗口打开按钮 */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // 打开PDF预览或仓库链接
              if (material.materialType === 'exam' && material.fileUrl) {
                window.open(material.fileUrl, '_blank');
              } else if (material.materialType === 'code' && material.repoUrl) {
                window.open(material.repoUrl, '_blank');
              }
            }}
            className="p-1.5 rounded-full bg-white text-gray-400 hover:text-purple-500 hover:shadow transition-all"
            title="在新窗口打开"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      {/* 卡片悬浮效果装饰 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-700 transform -skew-x-12 translate-x-full group-hover:translate-x-0"></div>
    </div>
  );
};

export default MaterialCard;