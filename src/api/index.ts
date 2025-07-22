import { MaterialItem } from '../types';
import { toast } from 'sonner';

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 从localStorage获取资料数据
const getMaterialsFromStorage = (): MaterialItem[] => {
  try {
    const data = localStorage.getItem('materials');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading materials from localStorage:', error);
    return [];
  }
};

// 保存资料数据到localStorage
const saveMaterialsToStorage = (materials: MaterialItem[]): void => {
  try {
    localStorage.setItem('materials', JSON.stringify(materials));
  } catch (error) {
    console.error('Error saving materials to localStorage:', error);
    toast.error('保存数据失败，请检查浏览器存储空间');
  }
};

// 获取所有资料
export const fetchMaterials = async (): Promise<MaterialItem[]> => {
  try {
    // 模拟API请求延迟
    await delay(800);
    
    // 从localStorage获取数据
    let materials = getMaterialsFromStorage();
    
    // 如果没有数据，初始化一些示例数据
    if (materials.length === 0) {
      materials = generateSampleData();
      saveMaterialsToStorage(materials);
    }
    
    return materials;
  } catch (error) {
    console.error('Error fetching materials:', error);
    toast.error('获取资料数据失败');
    return [];
  }
};

// 添加新资料
export const addMaterial = async (material: Omit<MaterialItem, 'id'>): Promise<MaterialItem | null> => {
  try {
    // 模拟API请求延迟
    await delay(1000);
    
    const materials = getMaterialsFromStorage();
    
    // 生成新ID
    const newId = Date.now().toString();
    const newMaterial: MaterialItem = {
      ...material,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      downloads: 0,
      favorites: 0
    };
    
    // 添加到数组并保存
    materials.unshift(newMaterial);
    saveMaterialsToStorage(materials);
    
    return newMaterial;
  } catch (error) {
    console.error('Error adding material:', error);
    toast.error('添加资料失败');
    return null;
  }
};

// 更新资料
export const updateMaterial = async (id: string, updates: Partial<MaterialItem>): Promise<MaterialItem | null> => {
  try {
    // 模拟API请求延迟
    await delay(1000);
    
    const materials = getMaterialsFromStorage();
    const index = materials.findIndex(m => m.id === id);
    
    if (index === -1) {
      toast.error('资料不存在');
      return null;
    }
    
    // 更新资料
    const updatedMaterial = {
      ...materials[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    materials[index] = updatedMaterial;
    saveMaterialsToStorage(materials);
    
    return updatedMaterial;
  } catch (error) {
    console.error('Error updating material:', error);
    toast.error('更新资料失败');
    return null;
  }
};

// 删除资料
export const deleteMaterial = async (id: string): Promise<boolean> => {
  try {
    // 模拟API请求延迟
    await delay(800);
    
    const materials = getMaterialsFromStorage();
    const filteredMaterials = materials.filter(m => m.id !== id);
    
    if (filteredMaterials.length === materials.length) {
      toast.error('资料不存在');
      return false;
    }
    
    saveMaterialsToStorage(filteredMaterials);
    return true;
  } catch (error) {
    console.error('Error deleting material:', error);
    toast.error('删除资料失败');
    return false;
  }
};

// 上传文件（模拟）
export const uploadFile = async (file: File, onProgress?: (progress: number) => void): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // 模拟上传进度
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        if (onProgress) onProgress(progress);
        
        if (progress === 100) {
          clearInterval(interval);
          // 模拟文件URL
          const fileUrl = `https://example.com/files/${file.name}`;
          setTimeout(() => resolve(fileUrl), 500);
        }
      }, 500);
    } catch (error) {
      console.error('Error uploading file:', error);
      reject(new Error('文件上传失败'));
    }
  });
};

// 生成示例数据
const generateSampleData = (): MaterialItem[] => {
  return [
    {
      id: '1',
      courseName: '数据结构与算法',
      teacher: '张教授',
      year: '2023',
      semester: '春季',
      examType: '期末考试',
      contentType: 'Paper',
      description: '本资料包含数据结构与算法课程的期末考试真题及详细解答，涵盖了排序算法、树、图等重要知识点。',
      filePath: 'https://example.com/files/data_structure_exam.pdf',
      tags: ['数据结构', '算法', '计算机科学'],
      createdAt: '2023-06-15T08:00:00Z',
      updatedAt: '2023-06-15T08:00:00Z',
      views: 245,
      downloads: 120,
      favorites: 56
    },
    {
      id: '2',
      courseName: 'Web全栈开发',
      teacher: '李老师',
      year: '2023',
      semester: '秋季',
      contentType: 'Code',
      language: 'JavaScript',
      description: '基于React和Node.js的校园资源共享平台，包含完整的前后端代码和详细文档。',
      repoUrl: 'https://github.com/example/campus-resource-sharing',
      stars: 89,
      tags: ['React', 'Node.js', 'Web开发'],
      createdAt: '2023-12-10T14:30:00Z',
      updatedAt: '2023-12-10T14:30:00Z',
      views: 320,
      downloads: 78,
      favorites: 92
    },
    {
      id: '3',
      courseName: '操作系统原理',
      teacher: '王教授',
      year: '2022',
      semester: '秋季',
      examType: '期中考试',
      contentType: 'Paper',
      description: '操作系统原理期中考试真题，包含进程管理、内存管理、文件系统等核心知识点。',
      filePath: 'https://example.com/files/os_midterm.pdf',
      tags: ['操作系统', '进程管理', '计算机科学'],
      createdAt: '2022-11-05T10:15:00Z',
      updatedAt: '2022-11-05T10:15:00Z',
      views: 189,
      downloads: 95,
      favorites: 42
    },
    {
      id: '4',
      courseName: '人工智能导论',
      teacher: '刘教授',
      year: '2023',
      semester: '春季',
      contentType: 'Code',
      language: 'Python',
      description: '基于PyTorch实现的机器学习算法集合，包含神经网络、决策树、支持向量机等多种算法的实现和示例。',
      repoUrl: 'https://github.com/example/ai-algorithms',
      stars: 156,
      tags: ['人工智能', 'Python', '机器学习'],
      createdAt: '2023-05-20T09:45:00Z',
      updatedAt: '2023-05-20T09:45:00Z',
      views: 412,
      downloads: 203,
      favorites: 178
    },
    {
      id: '5',
      courseName: '计算机网络',
      teacher: '陈教授',
      year: '2022',
      semester: '春季',
      examType: '期末考试',
      contentType: 'Paper',
      description: '计算机网络期末考试真题，涵盖OSI模型、TCP/IP协议、网络安全等重要内容。',
      filePath: 'https://example.com/files/network_final.pdf',
      tags: ['计算机网络', 'TCP/IP', '网络协议'],
      createdAt: '2022-07-10T11:30:00Z',
      updatedAt: '2022-07-10T11:30:00Z',
      views: 276,
      downloads: 142,
      favorites: 63
    },
    {
      id: '6',
      courseName: '数据库系统',
      teacher: '赵老师',
      year: '2023',
      semester: '秋季',
      examType: '期末考试',
      contentType: 'Paper',
      description: '数据库系统期末考试真题，包含SQL查询、数据库设计、事务管理等核心知识点。',
      filePath: 'https://example.com/files/database_final.pdf',
      tags: ['数据库', 'SQL', '数据管理'],
      createdAt: '2023-12-25T13:20:00Z',
      updatedAt: '2023-12-25T13:20:00Z',
      views: 198,
      downloads: 87,
      favorites: 45
    },
    {
      id: '7',
      courseName: '移动应用开发',
      teacher: '孙老师',
      year: '2023',
      semester: '春季',
      contentType: 'Code',
      language: 'Kotlin',
      description: '基于Kotlin开发的Android校园信息APP，包含完整源码和UI设计资源。',
      repoUrl: 'https://github.com/example/campus-app',
      stars: 72,
      tags: ['Android', 'Kotlin', '移动开发'],
      createdAt: '2023-06-30T15:45:00Z',
      updatedAt: '2023-06-30T15:45:00Z',
      views: 254,
      downloads: 118,
      favorites: 83
    },
    {
      id: '8',
      courseName: '软件工程',
      teacher: '钱教授',
      year: '2022',
      semester: '秋季',
      examType: '期中考试',
      contentType: 'Paper',
      description: '软件工程期中考试真题，涵盖软件开发流程、需求分析、软件测试等重要内容。',
      filePath: 'https://example.com/files/software_engineering_midterm.pdf',
      tags: ['软件工程', '软件开发', '项目管理'],
      createdAt: '2022-10-15T09:00:00Z',
      updatedAt: '2022-10-15T09:00:00Z',
      views: 167,
      downloads: 79,
      favorites: 38
    },
    {
      id: '9',
      courseName: '计算机图形学',
      teacher: '周教授',
      year: '2023',
      semester: '春季',
      contentType: 'Code',
      language: 'C++',
      description: '基于OpenGL实现的3D渲染引擎，包含光照模型、纹理映射、阴影算法等多种图形学技术的实现。',
      repoUrl: 'https://github.com/example/graphics-engine',
      stars: 124,
      tags: ['计算机图形学', 'OpenGL', 'C++'],
      createdAt: '2023-04-05T16:30:00Z',
      updatedAt: '2023-04-05T16:30:00Z',
      views: 289,
      downloads: 135,
      favorites: 97
    },
    {
      id: '10',
      courseName: '编译原理',
      teacher: '吴教授',
      year: '2022',
      semester: '春季',
      examType: '期末考试',
      contentType: 'Paper',
      description: '编译原理期末考试真题，包含词法分析、语法分析、代码生成等核心知识点。',
      filePath: 'https://example.com/files/compiler_final.pdf',
      tags: ['编译原理', '程序语言', '代码分析'],
      createdAt: '2022-07-20T10:45:00Z',
      updatedAt: '2022-07-20T10:45:00Z',
      views: 213,
      downloads: 104,
      favorites: 51
    }
  ];
};
