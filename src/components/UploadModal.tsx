import React, { useState } from 'react';
import { X, Upload, FileText, Github, AlertCircle, CheckCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { UploadFormData, MaterialItem } from '../types';
import { uploadFile, validateFile, generateThumbnail, validateGitHubUrl, getGitHubRepoInfo } from '../utils/fileUtils';
import { toast } from 'sonner';

const UploadModal: React.FC = () => {
  const { admin, closeUploadModal, addMaterial, setUploadProgress } = useStore();
  const [formData, setFormData] = useState<UploadFormData>({
    contentType: 'Paper',
    courseName: '',
    year: new Date().getFullYear(),
    semester: '春季',
    teacher: '',
    description: '',
    examType: '期末考试',
    repoUrl: '',
    language: 'JavaScript'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!admin.isUploadModalOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseName.trim()) {
      newErrors.courseName = '课程名称不能为空';
    }
    if (!formData.teacher.trim()) {
      newErrors.teacher = '教师姓名不能为空';
    }
    if (!formData.description.trim()) {
      newErrors.description = '描述不能为空';
    }

    if (formData.contentType === 'Paper') {
      if (!selectedFile) {
        newErrors.file = '请选择PDF文件';
      } else {
        const fileError = validateFile(selectedFile, ['application/pdf'], 50 * 1024 * 1024); // 50MB
        if (fileError) {
          newErrors.file = fileError;
        }
      }
      if (!formData.examType) {
        newErrors.examType = '请选择考试类型';
      }
    } else {
      if (!formData.repoUrl?.trim()) {
        newErrors.repoUrl = 'GitHub仓库链接不能为空';
      } else if (!validateGitHubUrl(formData.repoUrl)) {
        newErrors.repoUrl = '请输入有效的GitHub仓库链接';
      }
      if (!formData.language) {
        newErrors.language = '请选择编程语言';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let fileId = '';
      let thumbnailPath = '';
      let repoInfo = null;

      if (formData.contentType === 'Paper' && selectedFile) {
        // 上传PDF文件
        setUploadProgress(20);
        fileId = await uploadFile(selectedFile, 'pdf');
        
        setUploadProgress(60);
        // 生成缩略图
        thumbnailPath = await generateThumbnail(selectedFile);
        
        setUploadProgress(80);
        toast.success('PDF文件上传成功！');
      } else if (formData.contentType === 'Code') {
        // 验证GitHub仓库
        setUploadProgress(30);
        repoInfo = await getGitHubRepoInfo(formData.repoUrl);
        
        if (!repoInfo) {
          throw new Error('无法获取GitHub仓库信息，请检查仓库地址是否正确');
        }
        
        setUploadProgress(70);
        toast.success('GitHub仓库验证成功！');
      }

      setUploadProgress(90);

      // 生成新的资料项
      const newMaterial: MaterialItem = {
        id: `${formData.contentType.toLowerCase()}_${Date.now()}`,
        contentType: formData.contentType,
        materialType: formData.contentType === 'Paper' ? 'Exam' : 'Project',
        courseName: formData.courseName,
        year: formData.year.toString(),
        semester: formData.semester,
        teacher: formData.teacher,
        description: formData.description,
        fileUrl: formData.contentType === 'Paper' ? fileId : formData.repoUrl,
        downloadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(formData.contentType === 'Paper' ? {
          examType: formData.examType,
          filePath: fileId,
          thumbnailPath: thumbnailPath || '/thumbnails/placeholder.png'
        } : {
          repoUrl: formData.repoUrl,
          language: repoInfo?.language || formData.language,
          stars: repoInfo?.stars || 0
        })
      };

      setUploadProgress(100);
      addMaterial(newMaterial);
      
      toast.success(`${formData.contentType === 'Paper' ? '试卷资料' : '代码项目'}上传成功！`);
      closeUploadModal();
      
      // 重置表单
      setFormData({
        contentType: 'Paper',
        courseName: '',
        year: new Date().getFullYear(),
        semester: '春季',
        teacher: '',
        description: '',
        examType: '期末考试',
        repoUrl: '',
        language: 'JavaScript'
      });
      setSelectedFile(null);
      setErrors({});
    } catch (error) {
      console.error('上传失败:', error);
      toast.error(error instanceof Error ? error.message : '上传失败，请重试');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 验证文件
      const fileError = validateFile(file, ['application/pdf'], 50 * 1024 * 1024);
      if (fileError) {
        setErrors(prev => ({ ...prev, file: fileError }));
        toast.error(fileError);
        return;
      }
      
      setSelectedFile(file);
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: '' }));
      }
      toast.success(`已选择文件：${file.name}`);
    }
  };

  const handleInputChange = (field: keyof UploadFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-purple-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-purple-200">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-purple-200">
          <div className="flex items-center gap-3">
            {formData.contentType === 'Paper' ? (
              <FileText className="w-6 h-6 text-purple-600" />
            ) : (
              <Github className="w-6 h-6 text-purple-500" />
            )}
            <h2 className="text-xl font-bold text-purple-800">
              上传{formData.contentType === 'Paper' ? '试卷资料' : '代码项目'}
            </h2>
          </div>
          <button
            onClick={closeUploadModal}
            className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-purple-600" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 内容类型选择 */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              内容类型
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="contentType"
                  value="Paper"
                  checked={formData.contentType === 'Paper'}
                  onChange={(e) => handleInputChange('contentType', e.target.value as 'Paper' | 'Code')}
                  className="text-purple-500"
                  disabled={isSubmitting}
                />
                <FileText className="w-4 h-4" />
                <span className="text-purple-700">试卷资料</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="contentType"
                  value="Code"
                  checked={formData.contentType === 'Code'}
                  onChange={(e) => handleInputChange('contentType', e.target.value as 'Paper' | 'Code')}
                  className="text-purple-500"
                  disabled={isSubmitting}
                />
                <Github className="w-4 h-4" />
                <span className="text-purple-700">代码项目</span>
              </label>
            </div>
          </div>

          {/* 基础信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                教师姓名 *
              </label>
              <input
                type="text"
                value={formData.courseName}
                onChange={(e) => handleInputChange('courseName', e.target.value)}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-purple-800 placeholder-purple-400 focus:outline-none focus:ring-2 ${
                  errors.courseName ? 'border-red-500 focus:ring-red-500' : 'border-purple-300 focus:ring-purple-500'
                }`}
                placeholder="如：数据结构与算法"
                disabled={isSubmitting}
              />
              {errors.courseName && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.courseName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                教师姓名 *
              </label>
              <input
                type="text"
                value={formData.teacher}
                onChange={(e) => handleInputChange('teacher', e.target.value)}
                className={`w-full px-3 py-2 bg-white border rounded-lg text-purple-800 placeholder-purple-400 focus:outline-none focus:ring-2 ${
                  errors.teacher ? 'border-red-500 focus:ring-red-500' : 'border-purple-300 focus:ring-purple-500'
                }`}
                placeholder="如：张教授"
                disabled={isSubmitting}
              />
              {errors.teacher && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.teacher}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                年份
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="2000"
                max="2030"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                学期
              </label>
              <select
                value={formData.semester}
                onChange={(e) => handleInputChange('semester', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isSubmitting}
              >
                <option value="春季">春季</option>
                <option value="秋季">秋季</option>
                <option value="夏季">夏季</option>
              </select>
            </div>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-2">
              描述 *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 bg-white border rounded-lg text-purple-800 placeholder-purple-400 focus:outline-none focus:ring-2 resize-none ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-purple-300 focus:ring-purple-500'
              }`}
              placeholder="简要描述这份资料的内容和特点"
              rows={3}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          {/* 试卷特定字段 */}
          {formData.contentType === 'Paper' && (
            <>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  考试类型
                </label>
                <select
                  value={formData.examType}
                  onChange={(e) => handleInputChange('examType', e.target.value)}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-purple-800 focus:outline-none focus:ring-2 ${
                    errors.examType ? 'border-red-500 focus:ring-red-500' : 'border-purple-300 focus:ring-purple-500'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="期末考试">期末考试</option>
                  <option value="期中考试">期中考试</option>
                  <option value="随堂测验">随堂测验</option>
                  <option value="补考">补考</option>
                </select>
                {errors.examType && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.examType}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  PDF文件 *
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  errors.file ? 'border-red-500 bg-red-500/10' : 'border-purple-300 hover:border-purple-400'
                }`}>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-purple-700 mb-1">
                      {selectedFile ? selectedFile.name : '点击选择PDF文件'}
                    </p>
                    <p className="text-sm text-purple-500">
                      支持PDF格式，最大50MB
                    </p>
                  </label>
                </div>
                {errors.file && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.file}
                  </p>
                )}
              </div>
            </>
          )}

          {/* 代码特定字段 */}
          {formData.contentType === 'Code' && (
            <>
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  GitHub仓库链接 *
                </label>
                <input
                  type="url"
                  value={formData.repoUrl}
                  onChange={(e) => handleInputChange('repoUrl', e.target.value)}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-purple-800 placeholder-purple-400 focus:outline-none focus:ring-2 ${
                    errors.repoUrl ? 'border-red-500 focus:ring-red-500' : 'border-purple-300 focus:ring-purple-500'
                  }`}
                  placeholder="https://github.com/username/repository"
                  disabled={isSubmitting}
                />
                {errors.repoUrl && (
                  <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.repoUrl}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">
                  编程语言
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-purple-300 rounded-lg text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isSubmitting}
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="C">C</option>
                  <option value="Go">Go</option>
                  <option value="Rust">Rust</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="Other">其他</option>
                </select>
              </div>
            </>
          )}

          {/* 上传进度 */}
          {isSubmitting && admin.uploadProgress > 0 && (
            <div>
              <div className="flex justify-between text-sm text-purple-700 mb-1">
                <span>上传进度</span>
                <span>{admin.uploadProgress}%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${admin.uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-purple-200">
            <button
              type="button"
              onClick={closeUploadModal}
              className="px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  上传中...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  上传
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;