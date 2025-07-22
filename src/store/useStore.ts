import { create } from 'zustand';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  year: string;
  fileType: string;
  fileSize: string;
  downloadCount: number;
  uploadDate: string;
  tags: string[];
  fileUrl: string;
  thumbnailUrl: string;
  isFavorite: boolean;
}

interface FilterState {
  searchQuery: string;
  selectedCategories: string[];
  selectedSubjects: string[];
  selectedYears: string[];
  selectedFileTypes: string[];
  sortBy: 'newest' | 'oldest' | 'popular' | 'size';
  showFavoritesOnly: boolean;
}

interface PDFPreviewState {
  isOpen: boolean;
  currentPDF: string | null;
  currentTitle: string | null;
}

interface FavoriteState {
  favorites: string[];
}

interface AdminState {
  isAdminMode: boolean;
  isLoginModalOpen: boolean;
  isEditModalOpen: boolean;
  isUploadModalOpen: boolean;
  currentEditResource: Resource | null;
}

interface UploadState {
  uploadProgress: number;
  isUploading: boolean;
}

interface AppState {
  resources: Resource[];
  isLoading: boolean;
  filter: FilterState;
  pdfPreview: PDFPreviewState;
  favorites: FavoriteState;
  admin: AdminState;
  upload: UploadState;
  
  // 资料筛选相关
  setSearchQuery: (query: string) => void;
  toggleCategory: (category: string) => void;
  toggleSubject: (subject: string) => void;
  toggleYear: (year: string) => void;
  toggleFileType: (fileType: string) => void;
  setSortBy: (sortBy: 'newest' | 'oldest' | 'popular' | 'size') => void;
  toggleFavoritesOnly: () => void;
  resetFilters: () => void;
  
  // PDF预览相关
  openPDFPreview: (pdfUrl: string, title: string) => void;
  closePDFPreview: () => void;
  
  // 加载状态
  setLoading: (isLoading: boolean) => void;
  
  // 收藏相关
  toggleFavorite: (resourceId: string) => void;
  
  // 管理员相关
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  openEditModal: (resource: Resource) => void;
  closeEditModal: () => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  
  // 资料管理
  updateResource: (resource: Resource) => void;
  addResource: (resource: Resource) => void;
  deleteResource: (resourceId: string) => void;
  
  // 上传进度
  setUploadProgress: (progress: number) => void;
}

export const useStore = create<AppState>((set) => ({
  resources: [
    {
      id: '1',
      title: '数据结构期末试卷',
      description: '2023年春季学期数据结构期末考试真题及答案解析',
      category: '考试资料',
      subject: '数据结构',
      year: '2023',
      fileType: 'PDF',
      fileSize: '2.5MB',
      downloadCount: 156,
      uploadDate: '2023-07-15',
      tags: ['期末考试', '数据结构', '答案解析'],
      fileUrl: '/samples/sample.pdf',
      thumbnailUrl: '/samples/thumbnail1.jpg',
      isFavorite: false,
    },
    {
      id: '2',
      title: '计算机网络实验指导书',
      description: '计算机网络课程实验指导手册，包含5个综合实验',
      category: '实验资料',
      subject: '计算机网络',
      year: '2023',
      fileType: 'PDF',
      fileSize: '4.8MB',
      downloadCount: 89,
      uploadDate: '2023-09-05',
      tags: ['实验', '计算机网络', '指导书'],
      fileUrl: '/samples/sample.pdf',
      thumbnailUrl: '/samples/thumbnail2.jpg',
      isFavorite: true,
    },
    {
      id: '3',
      title: '操作系统课程笔记',
      description: '操作系统课程完整笔记，包含进程管理、内存管理、文件系统等内容',
      category: '学习笔记',
      subject: '操作系统',
      year: '2022',
      fileType: 'PDF',
      fileSize: '3.2MB',
      downloadCount: 210,
      uploadDate: '2022-12-20',
      tags: ['笔记', '操作系统', '进程管理'],
      fileUrl: '/samples/sample.pdf',
      thumbnailUrl: '/samples/thumbnail3.jpg',
      isFavorite: false,
    },
  ],
  isLoading: false,
  
  filter: {
    searchQuery: '',
    selectedCategories: [],
    selectedSubjects: [],
    selectedYears: [],
    selectedFileTypes: [],
    sortBy: 'newest',
    showFavoritesOnly: false,
  },
  
  pdfPreview: {
    isOpen: false,
    currentPDF: null,
    currentTitle: null,
  },
  
  favorites: {
    favorites: ['2'],
  },
  
  admin: {
    isAdminMode: false,
    isLoginModalOpen: false,
    isEditModalOpen: false,
    isUploadModalOpen: false,
    currentEditResource: null,
  },
  
  upload: {
    uploadProgress: 0,
    isUploading: false,
  },
  
  // 资料筛选相关
  setSearchQuery: (query) => set((state) => ({
    filter: { ...state.filter, searchQuery: query },
  })),
  
  toggleCategory: (category) => set((state) => {
    const selectedCategories = state.filter.selectedCategories.includes(category)
      ? state.filter.selectedCategories.filter((c) => c !== category)
      : [...state.filter.selectedCategories, category];
    
    return { filter: { ...state.filter, selectedCategories } };
  }),
  
  toggleSubject: (subject) => set((state) => {
    const selectedSubjects = state.filter.selectedSubjects.includes(subject)
      ? state.filter.selectedSubjects.filter((s) => s !== subject)
      : [...state.filter.selectedSubjects, subject];
    
    return { filter: { ...state.filter, selectedSubjects } };
  }),
  
  toggleYear: (year) => set((state) => {
    const selectedYears = state.filter.selectedYears.includes(year)
      ? state.filter.selectedYears.filter((y) => y !== year)
      : [...state.filter.selectedYears, year];
    
    return { filter: { ...state.filter, selectedYears } };
  }),
  
  toggleFileType: (fileType) => set((state) => {
    const selectedFileTypes = state.filter.selectedFileTypes.includes(fileType)
      ? state.filter.selectedFileTypes.filter((f) => f !== fileType)
      : [...state.filter.selectedFileTypes, fileType];
    
    return { filter: { ...state.filter, selectedFileTypes } };
  }),
  
  setSortBy: (sortBy) => set((state) => ({
    filter: { ...state.filter, sortBy },
  })),
  
  toggleFavoritesOnly: () => set((state) => ({
    filter: { ...state.filter, showFavoritesOnly: !state.filter.showFavoritesOnly },
  })),
  
  resetFilters: () => set((state) => ({
    filter: {
      ...state.filter,
      searchQuery: '',
      selectedCategories: [],
      selectedSubjects: [],
      selectedYears: [],
      selectedFileTypes: [],
      sortBy: 'newest',
      showFavoritesOnly: false,
    },
  })),
  
  // PDF预览相关
  openPDFPreview: (pdfUrl, title) => set({
    pdfPreview: {
      isOpen: true,
      currentPDF: pdfUrl,
      currentTitle: title,
    },
  }),
  
  closePDFPreview: () => set({
    pdfPreview: {
      isOpen: false,
      currentPDF: null,
      currentTitle: null,
    },
  }),
  
  // 加载状态
  setLoading: (isLoading) => set({ isLoading }),
  
  // 收藏相关
  toggleFavorite: (resourceId) => set((state) => {
    const updatedResources = state.resources.map((resource) => {
      if (resource.id === resourceId) {
        return { ...resource, isFavorite: !resource.isFavorite };
      }
      return resource;
    });
    
    const favorites = state.favorites.favorites.includes(resourceId)
      ? state.favorites.favorites.filter((id) => id !== resourceId)
      : [...state.favorites.favorites, resourceId];
    
    return {
      resources: updatedResources,
      favorites: { favorites },
    };
  }),
  
  // 管理员相关
  openLoginModal: () => set((state) => ({
    admin: { ...state.admin, isLoginModalOpen: true },
  })),
  
  closeLoginModal: () => set((state) => ({
    admin: { ...state.admin, isLoginModalOpen: false },
  })),
  
  loginAdmin: () => set((state) => ({
    admin: { ...state.admin, isAdminMode: true, isLoginModalOpen: false },
  })),
  
  logoutAdmin: () => set((state) => ({
    admin: { ...state.admin, isAdminMode: false },
  })),
  
  openEditModal: (resource) => set((state) => ({
    admin: {
      ...state.admin,
      isEditModalOpen: true,
      currentEditResource: resource,
    },
  })),
  
  closeEditModal: () => set((state) => ({
    admin: {
      ...state.admin,
      isEditModalOpen: false,
      currentEditResource: null,
    },
  })),
  
  openUploadModal: () => set((state) => ({
    admin: { ...state.admin, isUploadModalOpen: true },
  })),
  
  closeUploadModal: () => set((state) => ({
    admin: { ...state.admin, isUploadModalOpen: false },
  })),
  
  // 资料管理
  updateResource: (updatedResource) => set((state) => {
    const updatedResources = state.resources.map((resource) => {
      if (resource.id === updatedResource.id) {
        return updatedResource;
      }
      return resource;
    });
    
    return { resources: updatedResources };
  }),
  
  addResource: (newResource) => set((state) => ({
    resources: [...state.resources, newResource],
  })),
  
  deleteResource: (resourceId) => set((state) => ({
    resources: state.resources.filter((resource) => resource.id !== resourceId),
  })),
  
  // 上传进度
  setUploadProgress: (progress) => set((state) => ({
    upload: {
      ...state.upload,
      uploadProgress: progress,
      isUploading: progress < 100,
    },
  })),
}));
