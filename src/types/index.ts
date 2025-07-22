// 资料类型定义
export interface MaterialItem {
  id: string;
  courseName: string;  // 课程名称
  teacher: string;     // 教师
  year: string;        // 年份
  semester: string;    // 学期
  examType?: string;   // 考试类型（仅试卷类型需要）
  contentType: 'Paper' | 'Code';  // 内容类型：试卷或代码
  description?: string;  // 描述
  filePath?: string;     // 文件路径（试卷类型）
  repoUrl?: string;      // 仓库URL（代码类型）
  language?: string;     // 编程语言（代码类型）
  stars?: number;        // 星标数（代码类型）
  tags?: string[];       // 标签
  createdAt: string;     // 创建时间
  updatedAt: string;     // 更新时间
  views: number;         // 浏览次数
  downloads: number;     // 下载次数
  favorites: number;     // 收藏次数
}

// 筛选条件类型
export interface FilterState {
  contentType: string | null;
  year: string | null;
  semester: string | null;
  teacher: string | null;
  examType: string | null;
  language: string | null;
  searchTerm: string;
  sortBy: 'newest' | 'popular' | 'downloads' | 'favorites';
}

// 管理员状态类型
export interface AdminState {
  isAdminMode: boolean;
  password: string;
}

// PDF预览状态类型
export interface PdfState {
  isOpen: boolean;
  material: MaterialItem | null;
}

// 上传状态类型
export interface UploadState {
  isOpen: boolean;
  progress: number;
}

// 编辑状态类型
export interface EditState {
  isOpen: boolean;
  material: MaterialItem | null;
}

// 收藏状态类型
export interface FavoriteState {
  items: string[];
}
