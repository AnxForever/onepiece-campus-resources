import axios from 'axios';
import { Material, MaterialFormData } from '../types';

// 模拟API基础URL
const API_BASE_URL = 'https://api.example.com';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const adminData = localStorage.getItem('onepiece-storage');
    if (adminData) {
      try {
        const { state } = JSON.parse(adminData);
        if (state.admin && state.admin.token) {
          config.headers.Authorization = `Bearer ${state.admin.token}`;
        }
      } catch (error) {
        console.error('Error parsing admin data:', error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 模拟延迟函数
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟管理员登录
export const login = async (username: string, password: string) => {
  try {
    // 模拟API调用延迟
    await delay(1000);
    
    // 模拟登录验证
    if (username === 'admin' && password === 'admin123') {
      return {
        success: true,
        token: 'mock-jwt-token-for-admin',
        message: '登录成功'
      };
    } else {
      return {
        success: false,
        token: null,
        message: '用户名或密码错误'
      };
    }
    
    // 实际API调用（已注释）
    // const response = await api.post('/auth/login', { username, password });
    // return response.data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      token: null,
      message: '登录失败，请稍后再试'
    };
  }
};

// 获取资料列表
export const getMaterials = async () => {
  try {
    // 模拟API调用延迟
    await delay(1000);
    
    // 模拟资料数据
    const mockMaterials: Material[] = [
      {
        id: '1',
        title: '数据结构期末考试真题',
        description: '2023年春季学期数据结构期末考试真题，包含答案和详细解析',
        materialType: 'exam',
        courseType: 'dataStructure',
        fileUrl: 'https://example.com/files/data-structure-exam-2023.pdf',
        thumbnailUrl: 'https://example.com/thumbnails/data-structure-exam-2023.jpg',
        uploadDate: '2023-07-15T08:30:00Z',
        teacher: '张教授',
        year: '2023',
        semester: 'spring',
        views: 1250,
        downloads: 780,
        favorites: 320,
        fileSize: 2.5,
        fileType: 'pdf',
        tags: ['数据结构', '期末考试', '真题']
      },
      {
        id: '2',
        title: 'Web开发课程项目代码',
        description: '基于React和Node.js的完整Web应用项目，包含前后端代码和文档',
        materialType: 'code',
        courseType: 'webDevelopment',
        fileUrl: 'https://github.com/example/web-dev-project',
        thumbnailUrl: 'https://example.com/thumbnails/web-dev-project.jpg',
        uploadDate: '2023-06-20T14:15:00Z',
        teacher: '李教授',
        year: '2023',
        semester: 'spring',
        views: 980,
        downloads: 450,
        favorites: 210,
        programmingLanguage: 'javascript',
        repoUrl: 'https://github.com/example/web-dev-project',
        tags: ['Web开发', 'React', 'Node.js', '项目代码']
      },
      {
        id: '3',
        title: '计算机网络实验报告模板',
        description: '计算机网络课程实验报告标准模板，包含格式要求和示例',
        materialType: 'exam',
        courseType: 'computerNetworks',
        fileUrl: 'https://example.com/files/network-lab-report-template.docx',
        thumbnailUrl: 'https://example.com/thumbnails/network-lab-report.jpg',
        uploadDate: '2023-05-10T10:45:00Z',
        teacher: '王教授',
        year: '2023',
        semester: 'spring',
        views: 850,
        downloads: 620,
        favorites: 150,
        fileSize: 1.2,
        fileType: 'docx',
        tags: ['计算机网络', '实验报告', '模板']
      },
      {
        id: '4',
        title: '算法分析与设计课程笔记',
        description: '算法分析与设计课程完整笔记，包含所有重要算法的详细解析和复杂度分析',
        materialType: 'exam',
        courseType: 'algorithms',
        fileUrl: 'https://example.com/files/algorithm-notes-2023.pdf',
        thumbnailUrl: 'https://example.com/thumbnails/algorithm-notes.jpg',
        uploadDate: '2023-04-25T16:20:00Z',
        teacher: '赵教授',
        year: '2023',
        semester: 'spring',
        views: 1500,
        downloads: 950,
        favorites: 420,
        fileSize: 4.8,
        fileType: 'pdf',
        tags: ['算法', '课程笔记', '复杂度分析']
      },
      {
        id: '5',
        title: '机器学习项目代码',
        description: '基于Python和TensorFlow的图像分类机器学习项目，包含数据集和训练模型',
        materialType: 'code',
        courseType: 'machineLearning',
        fileUrl: 'https://github.com/example/ml-image-classification',
        thumbnailUrl: 'https://example.com/thumbnails/ml-project.jpg',
        uploadDate: '2023-03-15T09:10:00Z',
        teacher: '陈教授',
        year: '2023',
        semester: 'spring',
        views: 1100,
        downloads: 580,
        favorites: 290,
        programmingLanguage: 'python',
        repoUrl: 'https://github.com/example/ml-image-classification',
        tags: ['机器学习', 'Python', 'TensorFlow', '图像分类']
      },
      {
        id: '6',
        title: '操作系统期中考试真题',
        description: '2022年秋季学期操作系统期中考试真题，包含部分答案',
        materialType: 'exam',
        courseType: 'operatingSystems',
        fileUrl: 'https://example.com/files/os-midterm-2022.pdf',
        thumbnailUrl: 'https://example.com/thumbnails/os-midterm.jpg',
        uploadDate: '2022-12-10T11:30:00Z',
        teacher: '林教授',
        year: '2022',
        semester: 'fall',
        views: 920,
        downloads: 680,
        favorites: 180,
        fileSize: 1.8,
        fileType: 'pdf',
        tags: ['操作系统', '期中考试', '真题']
      }
    ];
    
    return {
      success: true,
      data: mockMaterials,
      message: '获取资料列表成功'
    };
    
    // 实际API调用（已注释）
    // const response = await api.get('/materials');
    // return response.data;
  } catch (error) {
    console.error('Get materials error:', error);
    return {
      success: false,
      data: [],
      message: '获取资料列表失败，请稍后再试'
    };
  }
};

// 上传资料
export const uploadMaterial = async (formData: MaterialFormData, onProgress?: (progress: number) => void) => {
  try {
    // 模拟上传进度
    if (onProgress) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 500);
    }
    
    // 模拟API调用延迟
    await delay(5000);
    
    // 模拟新上传的资料
    const newMaterial: Material = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      materialType: formData.materialType,
      courseType: formData.courseType,
      fileUrl: 'https://example.com/files/new-material.pdf',
      thumbnailUrl: 'https://example.com/thumbnails/new-material.jpg',
      uploadDate: new Date().toISOString(),
      teacher: formData.teacher,
      year: formData.year,
      semester: formData.semester,
      views: 0,
      downloads: 0,
      favorites: 0,
      tags: formData.tags || [],
      ...(formData.materialType === 'exam' ? {
        fileSize: 2.5,
        fileType: 'pdf',
      } : {
        programmingLanguage: formData.programmingLanguage,
        repoUrl: formData.repoUrl,
      }),
    };
    
    return {
      success: true,
      data: newMaterial,
      message: '资料上传成功'
    };
    
    // 实际API调用（已注释）
    // const response = await api.post('/materials', formData, {
    //   onUploadProgress: (progressEvent) => {
    //     if (progressEvent.total && onProgress) {
    //       const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    //       onProgress(percentCompleted);
    //     }
    //   }
    // });
    // return response.data;
  } catch (error) {
    console.error('Upload material error:', error);
    return {
      success: false,
      data: null,
      message: '资料上传失败，请稍后再试'
    };
  }
};

// 更新资料
export const updateMaterial = async (materialId: string, updates: Partial<MaterialFormData>) => {
  try {
    // 模拟API调用延迟
    await delay(1000);
    
    return {
      success: true,
      message: '资料更新成功'
    };
    
    // 实际API调用（已注释）
    // const response = await api.put(`/materials/${materialId}`, updates);
    // return response.data;
  } catch (error) {
    console.error('Update material error:', error);
    return {
      success: false,
      message: '资料更新失败，请稍后再试'
    };
  }
};

// 删除资料
export const deleteMaterial = async (materialId: string) => {
  try {
    // 模拟API调用延迟
    await delay(1000);
    
    return {
      success: true,
      message: '资料删除成功'
    };
    
    // 实际API调用（已注释）
    // const response = await api.delete(`/materials/${materialId}`);
    // return response.data;
  } catch (error) {
    console.error('Delete material error:', error);
    return {
      success: false,
      message: '资料删除失败，请稍后再试'
    };
  }
};

// 下载资料
export const downloadMaterial = async (materialId: string) => {
  try {
    // 模拟API调用延迟
    await delay(500);
    
    // 模拟下载逻辑
    // 实际应用中，这里应该触发文件下载
    
    return {
      success: true,
      message: '资料下载成功'
    };
    
    // 实际API调用（已注释）
    // const response = await api.get(`/materials/${materialId}/download`, { responseType: 'blob' });
    // const url = window.URL.createObjectURL(new Blob([response.data]));
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', 'filename'); // 从响应头获取文件名
    // document.body.appendChild(link);
    // link.click();
    // link.remove();
    // return { success: true, message: '资料下载成功' };
  } catch (error) {
    console.error('Download material error:', error);
    return {
      success: false,
      message: '资料下载失败，请稍后再试'
    };
  }
};

// 获取资料统计数据
export const getMaterialStats = async () => {
  try {
    // 模拟API调用延迟
    await delay(800);
    
    // 模拟统计数据
    return {
      success: true,
      data: {
        totalMaterials: 120,
        totalExams: 75,
        totalCodes: 45,
        totalViews: 15800,
        totalDownloads: 8900,
        popularCourses: [
          { courseType: 'dataStructure', count: 28 },
          { courseType: 'algorithms', count: 22 },
          { courseType: 'webDevelopment', count: 18 },
          { courseType: 'machineLearning', count: 15 },
          { courseType: 'operatingSystems', count: 12 },
        ]
      },
      message: '获取统计数据成功'
    };
    
    // 实际API调用（已注释）
    // const response = await api.get('/materials/stats');
    // return response.data;
  } catch (error) {
    console.error('Get stats error:', error);
    return {
      success: false,
      data: null,
      message: '获取统计数据失败，请稍后再试'
    };
  }
};
