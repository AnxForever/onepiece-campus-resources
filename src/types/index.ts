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
  materialType: 'exam' | 'code' | 'note' | 'other';
  courseType: CourseType;
  teacher?: string;
  year?: string;
  semester?: 'spring' | 'fall' | 'summer' | 'winter';
  programmingLanguage?: ProgrammingLanguage;
  repoUrl?: string;
  uploadDate: string;
  views: number;
  downloads: number;
  favorites: number;
  rating: number;
  isStarred: boolean;
  isFavorited: boolean;
}

// 资料表单数据类型（用于创建/更新资料）
export interface MaterialFormData {
  title: string;
  description: string;
  materialType: 'exam' | 'code' | 'note' | 'other';
  courseType: CourseType;
  teacher?: string;
  year?: string;
  semester?: 'spring' | 'fall' | 'summer' | 'winter';
  programmingLanguage?: ProgrammingLanguage;
  repoUrl?: string;
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
  | 'artificialIntelligence' 
  | 'machineLearning' 
  | 'distributedSystems' 
  | 'computerGraphics' 
  | 'other';

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
  | 'other';

// 筛选状态
export interface FilterState {
  materialType: string | null;
  courseType: string | null;
  programmingLanguage: string | null;
  year: string | null;
  semester: string | null;
  teacher: string | null;
}

// 排序选项
export type SortOption = 
  | 'uploadDate' 
  | 'views' 
  | 'downloads' 
  | 'favorites' 
  | 'rating';

// 排序方向
export type SortDirection = 'asc' | 'desc';

// 排序状态
export interface SortState {
  option: SortOption;
  direction: SortDirection;
}
