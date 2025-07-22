import React, { useState, useEffect } from 'react';
import { X, Save, FileText, Github, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { MaterialItem } from '../types';
import { validateGitHubUrl, getGitHubRepoInfo } from '../utils/fileUtils';
import { toast } from 'sonner';

const EditModal: React.FC = () => {
  const { admin, closeEditModal, updateMaterial } = useStore();
  const [formData, setFormData] = useState<Partial<MaterialItem>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (admin.editingMaterial) {
      setFormData({ ...admin.editingMaterial });
    }
  }, [admin.editingMaterial]);

  if (!admin.isEditModalOpen || !admin.editingMaterial) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.courseName?.trim()) {
      newErrors.courseName = '课程名称不能为空';
    }
    if (!formData.teacher?.trim()) {
      newErrors.teacher = '教师姓名不能为空';
    }
    if (!formData.description?.trim()) {
      newErrors.description = '描述不能为空';
    }

    if (formData.contentType === 'Paper') {
      if (!formData.examType?.trim()) {
        newErrors.examType = '请选择考试类型';
      }
    } else if (formData.contentType === 'Code') {
      if (!formData.repoUrl?.trim()) {
        newErrors.repoUrl = 'GitHub仓库链接不能为空';
      } else if (!validateGitHubUrl(formData.repoUrl)) {
        newErrors.repoUrl = '请输入有效的GitHub仓库链接';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      let updatedData = { ...formData };
      
      // 如果是代码项目且GitHub链接发生变化，重新获取仓库信息
      if (formData.contentType === 'Code' && formData.repoUrl && 
          formData.repoUrl !== admin.editingMaterial?.repoUrl) {
        const repoInfo = await getGitHubRepoInfo(formData.repoUrl);
        if (repoInfo) {
          updatedData = {
            ...updatedData,
            language: repoInfo.language || formData.language,
            stars: repoInfo.stars || 0
          };
          toast.success('GitHub仓库信息已更新');
        }
      }
      
      updateMaterial(admin.editingMaterial!.id, updatedData);
      toast.success('资料信息更新成功！');
      closeEditModal();
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof MaterialItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {formData.contentType === 'Paper' ? (
              <FileText className="w-6 h-6 text-blue-500" />
            ) : (
              <Github className="w-6 h-6 text-purple-500" />
            )}
            <h2 className="text-xl font-bold text-white">
              编辑{formData.contentType === 'Paper' ? '试卷资料' : '代码项目'}
            </h2>
          </div>
          <button
            onClick={closeEditModal}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 基础信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                课程名称 *
              </label>
              <input
                type="text"
                value={formData.courseName || ''}
                onChange={(e) => handleInputChange('courseName', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.courseName ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
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
                value={formData.teacher || ''}
                onChange={(e) => handleInputChange('teacher', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.teacher ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                年份
              </label>
              <input
                type="number"
                value={formData.year || new Date().getFullYear()}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="2000"
                max="2030"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                学期
              </label>
              <select
                value={formData.semester || '春季'}
                onChange={(e) => handleInputChange('semester', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-300 mb-2">
              描述 *
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 resize-none ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                考试类型 *
              </label>
              <select
                value={formData.examType || '期末考试'}
                onChange={(e) => handleInputChange('examType', e.target.value)}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                  errors.examType ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
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
          )}

          {/* 代码特定字段 */}
          {formData.contentType === 'Code' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GitHub仓库链接 *
                </label>
                <input
                  type="url"
                  value={formData.repoUrl || ''}
                  onChange={(e) => handleInputChange('repoUrl', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    errors.repoUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-blue-500'
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  编程语言
                </label>
                <select
                  value={formData.language || 'JavaScript'}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* 元数据信息（只读） */}
          {(formData.createdAt || formData.updatedAt) && (
            <div className="bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">元数据信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                {formData.createdAt && (
                  <div>
                    <span className="font-medium">创建时间：</span>
                    {new Date(formData.createdAt).toLocaleString('zh-CN')}
                  </div>
                )}
                {formData.updatedAt && (
                  <div>
                    <span className="font-medium">更新时间：</span>
                    {new Date(formData.updatedAt).toLocaleString('zh-CN')}
                  </div>
                )}
                {formData.uploadedBy && (
                  <div>
                    <span className="font-medium">上传者：</span>
                    {formData.uploadedBy}
                  </div>
                )}
                <div>
                  <span className="font-medium">资料ID：</span>
                  {formData.id}
                </div>
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={closeEditModal}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              disabled={isSubmitting}
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  保存
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;