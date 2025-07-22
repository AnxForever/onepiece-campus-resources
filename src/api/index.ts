import axios from 'axios';
import { Material, MaterialFormData } from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 实际部署时替换为真实API地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器，添加认证token
api.interceptors.request.use(
  (config) => {
    const adminState = JSON.parse(localStorage.getItem('campus-resources-storage') || '{}');
    const token = adminState?.state?.admin?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// 模拟的API服务
// 在实际项目中，这些函数将调用后端API

// 管理员登录
export const login = async (username: string, password: string) => {
  try {
    // 模拟API调用
    // const response = await api.post('/admin/login', { username, password });
    // return response.data;
    
    // 模拟登录逻辑
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (username === 'admin' && password === 'password') {
      return {
        success: true,
        token: 'mock-jwt-token',
        message: '登录成功'
      };
    } else {
      return {
        success: false,
        message: '用户名或密码错误'
      };
    }
  } catch (error) {
    console.error('Login API error:', error);
    return {
      success: false,
      message: '登录失败，请稍后再试'
    };
  }
};

// 获取资料列表
export const getMaterials = async () => {
  try {
    // 模拟API调用
    // const response = await api.get('/materials');
    // return response.data;
    
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockMaterials: Material[] = [
      {
        id: '1',
        title: '数据结构期末试卷（2023年春季学期）',
        description: '包含数据结构与算法分析课程的期末考试试题和参考答案，涵盖链表、树、图、排序和搜索算法等内容。',
        materialType: 'exam',
        courseType: 'dataStructure',
        fileUrl: 'https://example.com/files/data-structure-exam-2023.pdf',
        thumbnailUrl: 'https://example.com/thumbnails/data-structure-exam-2023.jpg',
        uploadDate: '2023-07-15',
        teacher: '张教授',
        year: '2023',
        semester: 'spring',
        views: 1250,
        downloads: 780,
        favorites: 320
      },
      {
        id: '2',
        title: '操作系统实验报告模板',
        description: '操作系统课程实验报告的标准模板，包含进程管理、内存管理、文件系统等实验的格式要求和评分标准。',
        materialType: 'exam',
        courseType: 'operatingSystems',
        fileUrl: 'https://example.com/files/os-lab-template.pdf',
        thumbnailUrl: 'https://example.com/thumbnails/os-lab-template.jpg',
        uploadDate: '2023-03-22',
        teacher: '李教授',
        year: '2023',
        semester: 'spring',
        views: 980,
        downloads: 650,
        favorites: 210
      },
      {
        id: '3',
        title: '计算机网络课程项目：聊天应用',
        description: '基于Socket编程实现的简单聊天应用，支持多客户端连接、私聊和群聊功能，是计算机网络课程的综合实践项目。',
        materialType: 'code',
        courseType: 'computerNetworks',
        programmingLanguage: 'java',
        repoUrl: 'https://github.com/example/chat-app',
        thumbnailUrl: 'https://example.com/thumbnails/chat-app.jpg',
        uploadDate: '2023-05-10',
        teacher: '王教授',
        year: '2023',
        semester: 'spring',
        views: 1560,
        downloads: 920,
        favorites: 450
      },
      {
        id: '4',
        title: '人工智能导论期中考试（2022年秋季学期）',
        description: '人工智能导论课程的期中考试试题，包含机器学习基础、搜索算法、知识表示等内容，附有详细解析。',
        materialType: 'exam',
        courseType: 'artificialIntelligence',
        fileUrl: 'https://example.com/files/ai-midterm-2022.pdf',
        thumbnailUrl: 'https://example.com/thumbnails/ai-midterm-2022.jpg',
        uploadDate: '2022-11-18',
        teacher: '刘教授',
        year: '2022',
        semester: 'fall',
        views: 2100,
        downloads: 1450,
        favorites: 580
      },
      {
        id: '5',
        title: '数据库系统实现：迷你SQL引擎',
        description: '一个简化的SQL引擎实现，支持基本的SQL查询、表创建和数据操作，是数据库系统课程的大作业项目。',
        materialType: 'code',
        courseType: 'databaseSystems',
        programmingLanguage: 'cpp',
        repoUrl: 'https://github.com/example/mini-sql-engine',
        thumbnailUrl: 'https://example.com/thumbnails/mini-sql-engine.jpg',
        uploadDate: '2023-01-05',
        teacher: '赵教授',
        year: '2022',
        semester: 'fall',
        views: 1820,
        downloads: 1100,
        favorites: 490
      },
      {
        id: '6',
        title: '编译原理实验：词法分析器',
        description: '使用C++实现的词法分析器，能够识别C语言的关键字、标识符、常量和运算符，是编译原理课程的第一个实验。',
        materialType: 'code',
        courseType: 'compilers',
        programmingLanguage: 'cpp',
        repoUrl: 'https://github.com/example/lexical-analyzer',
        thumbnailUrl: 'https://example.com/thumbnails/lexical-analyzer.jpg',
        uploadDate: '2022-10-12',
        teacher: '钱教授',
        year: '2022',
        semester: 'fall',
        views: 1350,
        downloads: 890,
        favorites: 320
      }
    ];
    
    return {
      success: true,
      data: mockMaterials
    };
  } catch (error) {
    console.error('Get materials API error:', error);
    return {
      success: false,
      message: '获取资料列表失败',
      data: []
    };
  }
};

// 上传新资料
export const uploadMaterial = async (formData: MaterialFormData) => {
  try {
    // 模拟API调用
    // const response = await api.post('/materials', formData);
    // return response.data;
    
    // 模拟上传逻辑
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 生成模拟数据
    const newMaterial: Material = {
      id: Date.now().toString(),
      ...formData,
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0,
      downloads: 0,
      favorites: 0
    };
    
    return {
      success: true,
      data: newMaterial,
      message: '资料上传成功'
    };
  } catch (error) {
    console.error('Upload material API error:', error);
    return {
      success: false,
      message: '上传资料失败，请稍后再试'
    };
  }
};

// 更新资料
export const updateMaterial = async (id: string, formData: MaterialFormData) => {
  try {
    // 模拟API调用
    // const response = await api.put(`/materials/${id}`, formData);
    // return response.data;
    
    // 模拟更新逻辑
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 获取当前资料（在实际应用中，这会从后端获取）
    const currentMaterial = {
      id,
      uploadDate: '2023-01-01',
      views: 100,
      downloads: 50,
      favorites: 20
    };
    
    // 更新资料
    const updatedMaterial: Material = {
      ...currentMaterial,
      ...formData
    };
    
    return {
      success: true,
      data: updatedMaterial,
      message: '资料更新成功'
    };
  } catch (error) {
    console.error('Update material API error:', error);
    return {
      success: false,
      message: '更新资料失败，请稍后再试'
    };
  }
};

// 删除资料
export const deleteMaterial = async (id: string) => {
  try {
    // 模拟API调用
    // const response = await api.delete(`/materials/${id}`);
    // return response.data;
    
    // 模拟删除逻辑
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: '资料删除成功'
    };
  } catch (error) {
    console.error('Delete material API error:', error);
    return {
      success: false,
      message: '删除资料失败，请稍后再试'
    };
  }
};

// 下载资料
export const downloadMaterial = async (id: string) => {
  try {
    // 模拟API调用
    // 在实际应用中，这会触发文件下载
    // const response = await api.get(`/materials/${id}/download`, { responseType: 'blob' });
    // const url = window.URL.createObjectURL(new Blob([response.data]));
    // const link = document.createElement('a');
    // link.href = url;
    // link.setAttribute('download', `material-${id}.pdf`);
    // document.body.appendChild(link);
    // link.click();
    // link.remove();
    
    // 模拟下载逻辑
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: '下载开始'
    };
  } catch (error) {
    console.error('Download material API error:', error);
    return {
      success: false,
      message: '下载失败，请稍后再试'
    };
  }
};

// 获取统计数据
export const getStatistics = async () => {
  try {
    // 模拟API调用
    // const response = await api.get('/statistics');
    // return response.data;
    
    // 模拟统计数据
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        totalMaterials: 256,
        totalExams: 178,
        totalProjects: 78,
        totalViews: 45280,
        totalDownloads: 28750,
        totalFavorites: 12340
      }
    };
  } catch (error) {
    console.error('Get statistics API error:', error);
    return {
      success: false,
      message: '获取统计数据失败',
      data: {
        totalMaterials: 0,
        totalExams: 0,
        totalProjects: 0,
        totalViews: 0,
        totalDownloads: 0,
        totalFavorites: 0
      }
    };
  }
};

export default api;