export interface MaterialItem {
  id: string;
  contentType: 'Paper' | 'Code';
  materialType: string;
  courseName: string;
  year: string;
  semester: string;
  teacher: string;
  description: string;
  fileUrl: string;
  downloadCount: number;
  // Paper specific fields
  examType?: string;
  filePath?: string;
  thumbnailPath?: string;
  // Code specific fields
  repoUrl?: string;
  language?: string;
  stars?: number;
  // Metadata
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
  uploadDate?: string;
  downloads?: number;
  views?: number;
  favorites?: number;
}

export interface Filters {
  searchQuery: string;
  materialType: string;
  teacher: string;
  year: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface AdminState {
  isAdminMode: boolean;
  isEditModalOpen: boolean;
  isUploadModalOpen: boolean;
  isLoginModalOpen: boolean;
  editingMaterial: MaterialItem | null;
  uploadProgress: number;
}

export interface UploadFormData {
  contentType: 'Paper' | 'Code';
  courseName: string;
  year: number;
  semester: string;
  teacher: string;
  description: string;
  examType?: string;
  repoUrl?: string;
  language?: string;
  file?: File;
}