// 管理员状态
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
  materialType: 'exam' | 'code';
  courseType: CourseType;
  fileUrl?: string;
  repoUrl?: string;
  programmingLanguage?: ProgrammingLanguageType;
  thumbnailUrl?: string;
  uploadDate: string;
  teacher?: string;
  year?: string;
  semester?: SemesterType;
  views: number;
  downloads: number;
  favorites: number;
}

// 资料表单数据（用于上传和编辑）
export interface MaterialFormData {
  title: string;
  description: string;
  materialType: 'exam' | 'code';
  courseType: CourseType;
  fileUrl?: string;
  repoUrl?: string;
  programmingLanguage?: ProgrammingLanguageType;
  thumbnailUrl?: string;
  teacher?: string;
  year?: string;
  semester?: SemesterType;
}

// 课程类型
export type CourseType = 
  | 'dataStructure'
  | 'algorithms'
  | 'computerNetworks'
  | 'operatingSystems'
  | 'databaseSystems'
  | 'compilers'
  | 'computerArchitecture'
  | 'softwareEngineering'
  | 'webDevelopment'
  | 'mobileDevelopment'
  | 'artificialIntelligence'
  | 'machineLearning'
  | 'deepLearning'
  | 'computerVision'
  | 'naturalLanguageProcessing'
  | 'distributedSystems'
  | 'cloudComputing'
  | 'bigData'
  | 'informationSecurity'
  | 'other'
  | 'all';

// 编程语言类型
export type ProgrammingLanguageType = 
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
  | 'other'
  | 'all';

// 学期类型
export type SemesterType = 
  | 'spring'
  | 'fall'
  | 'summer'
  | 'winter'
  | 'all';

// 筛选状态
export interface FilterState {
  materialType: 'exam' | 'code' | 'all';
  courseType: CourseType;
  programmingLanguage?: ProgrammingLanguageType;
  year: string | 'all';
  semester: SemesterType;
}

// 排序选项
export type SortOption = 
  | 'latest'
  | 'oldest'
  | 'mostViewed'
  | 'mostDownloaded'
  | 'mostFavorited';
