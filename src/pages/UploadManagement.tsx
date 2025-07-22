import React, { useState, useEffect } from 'react';
import { Upload, FileText, Code, Edit3, Trash2, Eye, Download, Plus, Check, X, AlertCircle, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { MaterialItem } from '../types';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface UploadFormData {
  title: string;
  course: string;
  teacher: string;
  year: number;
  semester: string;
  contentType: 'Paper' | 'Code';
  description: string;
  file: File | null;
  githubUrl?: string;
}

interface MaterialWithStatus {
  id: string;
  title: string;
  course: string;
  teacher: string;
  year: number;
  semester: string;
  contentType: 'Paper' | 'Code';
  status: 'published' | 'draft' | 'pending';
  uploadDate: string;
  downloads: number;
}

const UploadManagement: React.FC = () => {
  const navigate = useNavigate();
  const { admin, materials, addMaterial, updateMaterial, deleteMaterial } = useStore();
  const [activeTab, setActiveTab] = useState('upload');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // 上传表单状态
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    course: '',
    teacher: '',
    year: new Date().getFullYear(),
    semester: '上学期',
    contentType: 'Paper',
    description: '',
    file: null,
    githubUrl: ''
  });
  
  const [uploadStep, setUploadStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  
  // 模拟管理数据
  const [managedMaterials] = useState<MaterialWithStatus[]>([
    {
      id: '1',
      title: '数据结构期末考试试卷',
      course: '数据结构',
      teacher: '张教授',
      year: 2024,
      semester: '上学期',
      contentType: 'Paper',
      status: 'published',
      uploadDate: '2024-03-15',
      downloads: 156
    },
    {
      id: '2',
      title: '算法设计课程设计',
      course: '算法设计与分析',
      teacher: '李教授',
      year: 2024,
      semester: '上学期',
      contentType: 'Code',
      status: 'published',
      uploadDate: '2024-03-14',
      downloads: 89
    },
    {
      id: '3',
      title: '操作系统期中试卷',
      course: '操作系统',
      teacher: '王教授',
      year: 2024,
      semester: '上学期',
      contentType: 'Paper',
      status: 'draft',
      uploadDate: '2024-03-13',
      downloads: 0
    }
  ]);
  
  useEffect(() => {
    if (!admin.isAdminMode) {
      navigate('/');
      return;
    }
    setIsVisible(true);
  }, [admin.isAdminMode, navigate]);
  
  const handleInputChange = (field: keyof UploadFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };
  
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('请输入资源标题');
      return false;
    }
    if (!formData.course.trim()) {
      toast.error('请输入课程名称');
      return false;
    }
    if (!formData.teacher.trim()) {
      toast.error('请输入教师姓名');
      return false;
    }
    if (formData.contentType === 'Paper' && !formData.file) {
      toast.error('请选择要上传的PDF文件');
      return false;
    }
    if (formData.contentType === 'Code' && !formData.githubUrl?.trim()) {
      toast.error('请输入GitHub仓库链接');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsUploading(true);
    
    try {
      // 模拟上传过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newMaterial: MaterialItem = {
        id: Date.now().toString(),
        contentType: formData.contentType,
        materialType: '其他',
        courseName: formData.course,
        year: formData.year.toString(),
        semester: formData.semester,
        teacher: formData.teacher,
        description: formData.description,
        fileUrl: formData.contentType === 'Paper' ? '/pdf/sample.pdf' : formData.githubUrl || '',
        downloadCount: 0,
        examType: formData.contentType === 'Paper' ? '期末考试' : undefined,
        filePath: formData.contentType === 'Paper' ? '/pdf/sample.pdf' : undefined,
        repoUrl: formData.contentType === 'Code' ? formData.githubUrl : undefined,
        language: formData.contentType === 'Code' ? 'JavaScript' : undefined,
        stars: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uploadedBy: '管理员',
        uploadDate: new Date().toISOString(),
        downloads: 0,
        views: 0,
        favorites: 0
      };
      
      addMaterial(newMaterial);
      toast.success('资源上传成功！');
      
      // 重置表单
      setFormData({
        title: '',
        course: '',
        teacher: '',
        year: new Date().getFullYear(),
        semester: '上学期',
        contentType: 'Paper',
        description: '',
        file: null,
        githubUrl: ''
      });
      setUploadStep(1);
      
    } catch (error) {
      toast.error('上传失败，请重试');
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleBatchDelete = () => {
    if (selectedItems.length === 0) {
      toast.error('请选择要删除的项目');
      return;
    }
    
    selectedItems.forEach(id => {
      deleteMaterial(id);
    });
    
    toast.success(`已删除 ${selectedItems.length} 个项目`);
    setSelectedItems([]);
  };
  
  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };
  
  const selectAllItems = () => {
    const filteredIds = getFilteredMaterials().map(m => m.id);
    setSelectedItems(prev => 
      prev.length === filteredIds.length ? [] : filteredIds
    );
  };
  
  const getFilteredMaterials = () => {
    return managedMaterials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           material.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           material.teacher.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || material.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return '已发布';
      case 'draft': return '草稿';
      case 'pending': return '待审核';
      default: return '未知';
    }
  };
  
  const renderUploadForm = () => (
    <div className="space-y-8">
      {/* 进度指示器 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                uploadStep >= step 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-neutral-200 text-neutral-500'
              }`}>
                {uploadStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 3 && (
                <div className={`w-20 h-1 mx-4 ${
                  uploadStep > step ? 'bg-purple-600' : 'bg-neutral-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-neutral-600">
          <span>基本信息</span>
          <span>文件上传</span>
          <span>确认提交</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        {uploadStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-800 mb-6">基本信息</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">资源标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="请输入资源标题"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">课程名称 *</label>
                <input
                  type="text"
                  value={formData.course}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="请输入课程名称"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">授课教师 *</label>
                <input
                  type="text"
                  value={formData.teacher}
                  onChange={(e) => handleInputChange('teacher', e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="请输入教师姓名"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">资源类型 *</label>
                <select
                  value={formData.contentType}
                  onChange={(e) => handleInputChange('contentType', e.target.value as 'Paper' | 'Code')}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="Paper">试卷资料</option>
                  <option value="Code">代码项目</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">学年</label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  min="2020"
                  max="2030"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">学期</label>
                <select
                  value={formData.semester}
                  onChange={(e) => handleInputChange('semester', e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                >
                  <option value="上学期">上学期</option>
                  <option value="下学期">下学期</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">资源描述</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="请输入资源描述（可选）"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setUploadStep(2)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                下一步
              </button>
            </div>
          </div>
        )}
        
        {uploadStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-800 mb-6">
              {formData.contentType === 'Paper' ? '文件上传' : 'GitHub 仓库'}
            </h3>
            
            {formData.contentType === 'Paper' ? (
              <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center hover:border-purple-400 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-neutral-700 mb-2">
                    {formData.file ? formData.file.name : '点击选择 PDF 文件'}
                  </p>
                  <p className="text-neutral-500">支持 PDF 格式，最大 50MB</p>
                </label>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">GitHub 仓库链接 *</label>
                <input
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="https://github.com/username/repository"
                />
                <p className="text-sm text-neutral-500 mt-2">
                  请确保仓库是公开的，以便其他用户可以访问
                </p>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setUploadStep(1)}
                className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-all duration-200"
              >
                上一步
              </button>
              <button
                type="button"
                onClick={() => setUploadStep(3)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                下一步
              </button>
            </div>
          </div>
        )}
        
        {uploadStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-800 mb-6">确认信息</h3>
            
            <div className="bg-neutral-50 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-neutral-500">资源标题：</span>
                  <p className="font-medium text-neutral-800">{formData.title}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">课程名称：</span>
                  <p className="font-medium text-neutral-800">{formData.course}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">授课教师：</span>
                  <p className="font-medium text-neutral-800">{formData.teacher}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">资源类型：</span>
                  <p className="font-medium text-neutral-800">
                    {formData.contentType === 'Paper' ? '试卷资料' : '代码项目'}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">学年学期：</span>
                  <p className="font-medium text-neutral-800">{formData.year}年 {formData.semester}</p>
                </div>
                <div>
                  <span className="text-sm text-neutral-500">
                    {formData.contentType === 'Paper' ? '文件：' : 'GitHub 链接：'}
                  </span>
                  <p className="font-medium text-neutral-800 truncate">
                    {formData.contentType === 'Paper' 
                      ? formData.file?.name || '未选择文件'
                      : formData.githubUrl || '未填写链接'
                    }
                  </p>
                </div>
              </div>
              
              {formData.description && (
                <div className="mt-4">
                  <span className="text-sm text-neutral-500">描述：</span>
                  <p className="font-medium text-neutral-800 mt-1">{formData.description}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setUploadStep(2)}
                className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-all duration-200"
              >
                上一步
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>上传中...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>确认上传</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
  
  const renderManagement = () => {
    const filteredMaterials = getFilteredMaterials();
    
    return (
      <div className="space-y-6">
        {/* 搜索和筛选 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索资源..."
                  className="pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">全部状态</option>
                <option value="published">已发布</option>
                <option value="draft">草稿</option>
                <option value="pending">待审核</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              {selectedItems.length > 0 && (
                <button
                  onClick={handleBatchDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>删除选中 ({selectedItems.length})</span>
                </button>
              )}
              
              <button
                onClick={() => setActiveTab('upload')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>新增资源</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* 资源列表 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === filteredMaterials.length && filteredMaterials.length > 0}
                      onChange={selectAllItems}
                      className="w-4 h-4 text-purple-600 border-neutral-300 rounded focus:ring-purple-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700">资源信息</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700">上传时间</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700">下载量</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredMaterials.map((material) => (
                  <tr key={material.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(material.id)}
                        onChange={() => toggleSelectItem(material.id)}
                        className="w-4 h-4 text-purple-600 border-neutral-300 rounded focus:ring-purple-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          material.contentType === 'Paper'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {material.contentType === 'Paper' ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <Code className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-800">{material.title}</p>
                          <p className="text-sm text-neutral-500">{material.course} - {material.teacher}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getStatusColor(material.status)
                      }`}>
                        {getStatusText(material.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {material.uploadDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {material.downloads}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-neutral-600 hover:text-purple-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-neutral-600 hover:text-blue-600 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-neutral-600 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">没有找到匹配的资源</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const tabs = [
    { id: 'upload', label: '上传资源', icon: Upload },
    { id: 'manage', label: '资源管理', icon: Edit3 }
  ];

  if (!admin.isAdminMode) {
    return null;
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
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
            上传管理
          </h1>
          <p className="text-neutral-600">管理和上传校园学习资源</p>
        </div>

        {/* 标签导航 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl mb-8">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 内容区域 */}
        <div className={`transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {activeTab === 'upload' ? renderUploadForm() : renderManagement()}
        </div>
      </div>
    </div>
  );
};

export default UploadManagement;