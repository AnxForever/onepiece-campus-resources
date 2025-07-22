import axios from 'axios';
import { useStore } from '../store/useStore';
import { Material, MaterialFormData } from '../types';

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 实际项目中应该使用环境变量
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器，添加认证token
api.interceptors.request.use(
  (config) => {
    const { admin } = useStore.getState();
    if (admin.token) {
      config.headers['Authorization'] = `Bearer ${admin.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 模拟数据
const mockMaterials: Material[] = [
  {
    id: '1',
    title: '数据结构期末考试试卷（2023年春季学期）',
    description: '本试卷包含数据结构的基本概念、算法分析、线性表、栈与队列、树、图、查找与排序等内容，难度适中，适合复习备考。',
    materialType: 'exam',
    courseType: 'dataStructure',
    teacher: '张教授',
    year: '2023',
    semester: 'spring',
    uploadDate: '2023-07-15T08:30:00Z',
    views: 1250,
    downloads: 780,
    favorites: 320,
    rating: 4.5,
    isStarred: true,
    isFavorited: false
  },
  {
    id: '2',
    title: '算法分析与设计课程项目：红黑树可视化',
    description: '这是一个使用JavaScript和D3.js实现的红黑树可视化项目，包含插入、删除、查找等操作的动画展示，帮助理解红黑树的平衡调整过程。',
    materialType: 'code',
    courseType: 'algorithms',
    programmingLanguage: 'javascript',
    repoUrl: 'https://github.com/example/red-black-tree-visualization',
    teacher: '李教授',
    year: '2023',
    semester: 'spring',
    uploadDate: '2023-06-20T14:15:00Z',
    views: 950,
    downloads: 420,
    favorites: 280,
    rating: 4.8,
    isStarred: true,
    isFavorited: false
  },
  {
    id: '3',
    title: '计算机网络期中考试试卷（2022年秋季学期）',
    description: '本试卷涵盖计算机网络的物理层、数据链路层、网络层、传输层和应用层的知识点，包含选择题、填空题和简答题。',
    materialType: 'exam',
    courseType: 'computerNetworks',
    teacher: '王教授',
    year: '2022',
    semester: 'fall',
    uploadDate: '2023-01-10T10:45:00Z',
    views: 820,
    downloads: 560,
    favorites: 190,
    rating: 4.2,
    isStarred: false,
    isFavorited: false
  },
  {
    id: '4',
    title: '操作系统课程项目：简易Shell实现',
    description: '使用C语言实现的简易Shell程序，支持基本命令执行、管道、重定向、后台运行等功能，展示了操作系统进程管理和文件系统的基本原理。',
    materialType: 'code',
    courseType: 'operatingSystems',
    programmingLanguage: 'c',
    repoUrl: 'https://github.com/example/simple-shell',
    teacher: '赵教授',
    year: '2022',
    semester: 'fall',
    uploadDate: '2022-12-05T16:20:00Z',
    views: 730,
    downloads: 380,
    favorites: 210,
    rating: 4.6,
    isStarred: false,
    isFavorited: false
  },
  {
    id: '5',
    title: '数据库系统期末考试试卷（2022年春季学期）',
    description: '本试卷包含关系数据库理论、SQL语言、数据库设计、事务处理、并发控制等内容，难度适中，适合复习备考。',
    materialType: 'exam',
    courseType: 'databaseSystems',
    teacher: '钱教授',
    year: '2022',
    semester: 'spring',
    uploadDate: '2022-07-20T09:10:00Z',
    views: 680,
    downloads: 450,
    favorites: 170,
    rating: 4.3,
    isStarred: false,
    isFavorited: false
  },
  {
    id: '6',
    title: '编译原理课程项目：简易编程语言解释器',
    description: '使用Python实现的简易编程语言解释器，包含词法分析、语法分析、语义分析和代码生成等阶段，展示了编译原理的基本概念和实现方法。',
    materialType: 'code',
    courseType: 'compilers',
    programmingLanguage: 'python',
    repoUrl: 'https://github.com/example/simple-interpreter',
    teacher: '孙教授',
    year: '2022',
    semester: 'spring',
    uploadDate: '2022-06-15T11:30:00Z',
    views: 590,
    downloads: 320,
    favorites: 150,
    rating: 4.4,
    isStarred: false,
    isFavorited: false
  }
];

// 模拟登录API
export const login = async (username: string, password: string) => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟验证（实际项目中应该使用真实的API请求）
  if (username === 'admin' && password === 'admin123') {
    return {
      success: true,
      data: {
        token: 'mock-jwt-token-for-admin',
        username: 'admin'
      },
      message: '登录成功'
    };
  } else {
    return {
      success: false,
      data: null,
      message: '用户名或密码错误'
    };
  }
};

// 获取资料列表
export const getMaterials = async () => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟成功响应
  return {
    success: true,
    data: mockMaterials,
    message: '获取资料列表成功'
  };
};

// 获取单个资料详情
export const getMaterialById = async (id: string) => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 查找资料
  const material = mockMaterials.find(item => item.id === id);
  
  if (material) {
    return {
      success: true,
      data: material,
      message: '获取资料详情成功'
    };
  } else {
    return {
      success: false,
      data: null,
      message: '资料不存在'
    };
  }
};

// 上传资料
export const uploadMaterial = async (formData: MaterialFormData) => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 检查管理员权限
  const { admin } = useStore.getState();
  if (!admin.isAdminMode) {
    return {
      success: false,
      data: null,
      message: '没有上传权限'
    };
  }
  
  // 模拟成功响应
  const newMaterial: Material = {
    id: `${mockMaterials.length + 1}`,
    ...formData,
    uploadDate: new Date().toISOString(),
    views: 0,
    downloads: 0,
    favorites: 0,
    rating: 0,
    isStarred: false,
    isFavorited: false
  };
  
  // 将新资料添加到模拟数据中
  mockMaterials.unshift(newMaterial);
  
  return {
    success: true,
    data: newMaterial,
    message: '上传资料成功'
  };
};

// 更新资料
export const updateMaterial = async (id: string, formData: Partial<MaterialFormData>) => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 检查管理员权限
  const { admin } = useStore.getState();
  if (!admin.isAdminMode) {
    return {
      success: false,
      data: null,
      message: '没有更新权限'
    };
  }
  
  // 查找资料
  const index = mockMaterials.findIndex(item => item.id === id);
  
  if (index !== -1) {
    // 更新资料
    const updatedMaterial = {
      ...mockMaterials[index],
      ...formData
    };
    
    mockMaterials[index] = updatedMaterial;
    
    return {
      success: true,
      data: updatedMaterial,
      message: '更新资料成功'
    };
  } else {
    return {
      success: false,
      data: null,
      message: '资料不存在'
    };
  }
};

// 删除资料
export const deleteMaterial = async (id: string) => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 检查管理员权限
  const { admin } = useStore.getState();
  if (!admin.isAdminMode) {
    return {
      success: false,
      data: null,
      message: '没有删除权限'
    };
  }
  
  // 查找资料
  const index = mockMaterials.findIndex(item => item.id === id);
  
  if (index !== -1) {
    // 删除资料
    mockMaterials.splice(index, 1);
    
    return {
      success: true,
      data: null,
      message: '删除资料成功'
    };
  } else {
    return {
      success: false,
      data: null,
      message: '资料不存在'
    };
  }
};

// 下载资料
export const downloadMaterial = async (id: string) => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // 查找资料
  const material = mockMaterials.find(item => item.id === id);
  
  if (material) {
    // 模拟下载文件（实际项目中应该返回文件流或下载链接）
    return {
      success: true,
      data: new Blob(['模拟PDF文件内容'], { type: 'application/pdf' }),
      message: '下载资料成功'
    };
  } else {
    return {
      success: false,
      data: null,
      message: '资料不存在'
    };
  }
};

// 更新资料统计数据（浏览量、下载量、收藏数）
export const updateMaterialStats = async (id: string, type: 'views' | 'downloads' | 'favorites') => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 查找资料
  const index = mockMaterials.findIndex(item => item.id === id);
  
  if (index !== -1) {
    // 更新统计数据
    mockMaterials[index] = {
      ...mockMaterials[index],
      [type]: mockMaterials[index][type] + 1
    };
    
    return {
      success: true,
      data: mockMaterials[index],
      message: `更新${type === 'views' ? '浏览量' : type === 'downloads' ? '下载量' : '收藏数'}成功`
    };
  } else {
    return {
      success: false,
      data: null,
      message: '资料不存在'
    };
  }
};

// 获取统计数据
export const getStatistics = async () => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 计算统计数据
  const totalMaterials = mockMaterials.length;
  const totalExams = mockMaterials.filter(item => item.materialType === 'exam').length;
  const totalProjects = mockMaterials.filter(item => item.materialType === 'code').length;
  
  return {
    success: true,
    data: {
      totalMaterials,
      totalExams,
      totalProjects
    },
    message: '获取统计数据成功'
  };
};

export default api;
