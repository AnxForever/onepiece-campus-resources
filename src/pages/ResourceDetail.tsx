import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Eye, Heart, Share2, Calendar, User, BookOpen, Code, ExternalLink, Star, Clock, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import PdfModal from '../components/PdfModal';

const ResourceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { materials, favorites, toggleFavorite, openPdfModal } = useStore();
  const [material, setMaterial] = useState<any>(null);
  const [relatedMaterials, setRelatedMaterials] = useState<any[]>([]);
  const [downloadCount, setDownloadCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (id) {
      const foundMaterial = materials.find(m => m.id === id);
      if (foundMaterial) {
        setMaterial(foundMaterial);
        setDownloadCount(Math.floor(Math.random() * 500) + 50); // 模拟下载次数
        
        // 查找相关资源
        const related = materials
          .filter(m => 
            m.id !== id && 
            (m.courseName === foundMaterial.courseName || m.contentType === foundMaterial.contentType)
          )
          .slice(0, 4);
        setRelatedMaterials(related);
      }
    }
    setIsVisible(true);
  }, [id, materials]);

  const handleDownload = () => {
    if (material) {
      setDownloadCount(prev => prev + 1);
      toast.success('下载已开始');
      // 这里可以添加实际的下载逻辑
    }
  };

  const handlePreview = () => {
    if (material) {
      if (material.contentType === 'Paper') {
        openPdfModal(material.filePath);
      } else {
        window.open(material.filePath, '_blank');
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('链接已复制到剪贴板');
  };

  const isFavorited = material ? favorites.includes(material.id) : false;

  if (!material) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-20">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-neutral-800 mb-4">资源未找到</h2>
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
      </div>

      <Navbar />
      
      <div className={`relative z-10 container mx-auto px-4 pt-20 pb-16 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 mb-8 px-4 py-2 bg-white/80 backdrop-blur-sm text-neutral-700 rounded-xl hover:bg-white transition-all duration-200 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回资源列表</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：预览区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              {/* 资源标题 */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${
                    material.contentType === 'Paper' 
                      ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {material.contentType === 'Paper' ? (
                      <BookOpen className="w-6 h-6 text-white" />
                    ) : (
                      <Code className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-800">{material.title}</h1>
                    <p className="text-neutral-600 mt-1">{material.courseName} - {material.teacher}</p>
                  </div>
                </div>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    material.contentType === 'Paper'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {material.contentType === 'Paper' ? '试卷资料' : '代码项目'}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {material.year}年
                  </span>
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {material.semester}
                  </span>
                </div>
              </div>

              {/* 预览区域 */}
              <div className="bg-neutral-100 rounded-2xl p-8 mb-6 text-center">
                <div className="mb-4">
                  {material.contentType === 'Paper' ? (
                    <BookOpen className="w-16 h-16 text-neutral-400 mx-auto" />
                  ) : (
                    <Code className="w-16 h-16 text-neutral-400 mx-auto" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                  {material.contentType === 'Paper' ? 'PDF 文档预览' : '代码项目预览'}
                </h3>
                <p className="text-neutral-500 mb-6">
                  {material.contentType === 'Paper' 
                    ? '点击预览按钮查看 PDF 内容' 
                    : '点击预览按钮访问 GitHub 仓库'
                  }
                </p>
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  {material.contentType === 'Paper' ? (
                    <>
                      <Eye className="w-5 h-5" />
                      <span>预览 PDF</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-5 h-5" />
                      <span>访问仓库</span>
                    </>
                  )}
                </button>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  <span>下载资源</span>
                </button>
                
                <button
                  onClick={() => toggleFavorite(material.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 shadow-lg ${
                    isFavorited
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                      : 'bg-white text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                  <span>{isFavorited ? '已收藏' : '收藏'}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all duration-200 shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                  <span>分享</span>
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：信息面板 */}
          <div className="space-y-6">
            {/* 资源信息 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-neutral-800 mb-4">资源信息</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-500">授课教师</p>
                    <p className="font-medium text-neutral-800">{material.teacher}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-500">学年学期</p>
                    <p className="font-medium text-neutral-800">{material.year}年 {material.semester}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-500">下载次数</p>
                    <p className="font-medium text-neutral-800">{downloadCount} 次</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-neutral-500" />
                  <div>
                    <p className="text-sm text-neutral-500">上传时间</p>
                    <p className="font-medium text-neutral-800">2024年3月15日</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 相关推荐 */}
            {relatedMaterials.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-neutral-800 mb-4">相关推荐</h3>
                <div className="space-y-3">
                  {relatedMaterials.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/resource/${item.id}`)}
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      <div className={`p-2 rounded-lg ${
                        item.contentType === 'Paper'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.contentType === 'Paper' ? (
                          <BookOpen className="w-4 h-4" />
                        ) : (
                          <Code className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-800 truncate">{item.title}</p>
                        <p className="text-sm text-neutral-500">{item.courseName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <PdfModal />
    </div>
  );
};

export default ResourceDetail;