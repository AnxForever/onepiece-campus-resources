// 管理员状态类型
export interface AdminState {
  isAdminMode: boolean;
  token: string | null;
  username: string | null;
}

// 资料类型
export interface Material {
  id: string;
  title: string;
  description: string;
  materialType: 'exam' | 'code'; // 试卷资料 or 代码项目
  courseType: CourseType;
  fileUrl: string;
  thumbnailUrl?: string;
  uploadDate: string;
  teacher: string;
  year: string;
  semester: 'spring' | 'fall' | 'summer' | 'winter';
  views: number;
  downloads: number;
  favorites: number;
  tags?: string[];
  
  // 试卷资料特有属性
  fileSize?: number; // MB
  fileType?: string; // pdf, docx, etc.
  
  // 代码项目特有属性
  programmingLanguage?: ProgrammingLanguage;
  repoUrl?: string;
}

// 资料表单数据类型
export interface MaterialFormData {
  title: string;
  description: string;
  materialType: 'exam' | 'code';
  courseType: CourseType;
  file?: File;
  teacher: string;
  year: string;
  semester: 'spring' | 'fall' | 'summer' | 'winter';
  tags?: string[];
  
  // 代码项目特有属性
  programmingLanguage?: ProgrammingLanguage;
  repoUrl?: string;
}

// 课程类型
export type CourseType = 
  | 'dataStructure' // 数据结构
  | 'algorithms' // 算法
  | 'computerNetworks' // 计算机网络
  | 'operatingSystems' // 操作系统
  | 'databaseSystems' // 数据库系统
  | 'compilers' // 编译原理
  | 'computerArchitecture' // 计算机组成原理
  | 'softwareEngineering' // 软件工程
  | 'webDevelopment' // Web开发
  | 'mobileDevelopment' // 移动开发
  | 'artificialIntelligence' // 人工智能
  | 'machineLearning' // 机器学习
  | 'deepLearning' // 深度学习
  | 'computerVision' // 计算机视觉
  | 'naturalLanguageProcessing' // 自然语言处理
  | 'distributedSystems' // 分布式系统
  | 'cloudComputing' // 云计算
  | 'bigData' // 大数据
  | 'informationSecurity' // 信息安全
  | 'other'; // 其他

// 编程语言类型
export type ProgrammingLanguage = 
  | 'c'
  | 'cpp'
  | 'java'
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'go'
  | 'rust'
  | 'csharp'
  | 'php'
  | 'ruby'
  | 'swift'
  | 'kotlin'
  | 'scala'
  | 'r'
  | 'matlab'
  | 'assembly'
  | 'sql'
  | 'other';

// 筛选状态类型
export interface FilterState {
  materialType: 'all' | 'exam' | 'code';
  courseType: 'all' | CourseType;
  programmingLanguage?: 'all' | ProgrammingLanguage;
  year: 'all' | string;
  semester: 'all' | 'spring' | 'fall' | 'summer' | 'winter';
  teacher: 'all' | string;
}

// 排序选项类型
export type SortOption = 
  | 'latest' // 最新上传
  | 'oldest' // 最早上传
  | 'mostViewed' // 最多浏览
  | 'mostDownloaded' // 最多下载
  | 'mostFavorited' // 最多收藏
  | 'alphabetical'; // 字母顺序
