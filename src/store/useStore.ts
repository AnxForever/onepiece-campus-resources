import { create } from 'zustand';
import { MaterialItem, FilterState, AdminState, PdfState, UploadState, EditState, FavoriteState } from '../types';
import { addMaterial, updateMaterial, deleteMaterial } from '../api';

// 应用状态接口
interface AppState {
  // 资料数据
  materials: MaterialItem[];
  filteredMaterials: MaterialItem[];
  setMaterials: (materials: MaterialItem[]) => void;
  
  // 筛选状态
  filter: FilterState;
  setContentTypeFilter: (contentType: string | null) => void;
  setYearFilter: (year: string | null) => void;
  setSemesterFilter: (semester: string | null) => void;
  setTeacherFilter: (teacher: string | null) => void;
  setExamTypeFilter: (examType: string | null) => void;
  setLanguageFilter: (language: string | null) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSortBy: (sortBy: 'newest' | 'popular' | 'downloads' | 'favorites') => void;
  resetFilters: () => void;
  
  // PDF预览状态
  pdf: PdfState;
  openPdfModal: (material: MaterialItem) => void;
  closePdfModal: () => void;
  
  // 加载状态
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  
  // 收藏状态
  favorites: FavoriteState;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  
  // 管理员状态
  admin: AdminState;
  toggleLoginModal: (isOpen: boolean) => void;
  isLoginModalOpen: boolean;
  setAdminMode: (isAdminMode: boolean) => void;
  logoutAdmin: () => void;
  
  // 编辑状态
  edit: EditState;
  openEditModal: (material: MaterialItem) => void;
  closeEditModal: () => void;
  updateMaterialItem: (id: string, updates: Partial<MaterialItem>) => Promise<MaterialItem | null>;
  
  // 上传状态
  upload: UploadState;
  toggleUploadModal: (isOpen: boolean) => void;
  setUploadProgress: (progress: number) => void;
  addMaterialItem: (material: Omit<MaterialItem, 'id'>) => Promise<MaterialItem | null>;
  deleteMaterialItem: (id: string) => Promise<boolean>;
}

// 初始筛选状态
const initialFilterState: FilterState = {
  contentType: null,
  year: null,
  semester: null,
  teacher: null,
  examType: null,
  language: null,
  searchTerm: '',
  sortBy: 'newest'
};

// 初始管理员状态
const initialAdminState: AdminState = {
  isAdminMode: false,
  password: 'admin123' // 默认管理员密码
};

// 初始PDF预览状态
const initialPdfState: PdfState = {
  isOpen: false,
  material: null
};

// 初始上传状态
const initialUploadState: UploadState = {
  isOpen: false,
  progress: 0
};

// 初始编辑状态
const initialEditState: EditState = {
  isOpen: false,
  material: null
};

// 初始收藏状态
const initialFavoriteState: FavoriteState = {
  items: []
};

// 创建状态管理器
export const useStore = create<AppState>((set, get) => ({
  // 资料数据
  materials: [],
  filteredMaterials: [],
  setMaterials: (materials) => {
    set({ materials });
    // 应用当前筛选条件
    const { filter } = get();
    const filtered = filterMaterials(materials, filter);
    set({ filteredMaterials: filtered });
  },
  
  // 筛选状态
  filter: initialFilterState,
  setContentTypeFilter: (contentType) => {
    const newFilter = { ...get().filter, contentType };
    set({ filter: newFilter });
    const filtered = filterMaterials(get().materials, newFilter);
    set({ filteredMaterials: filtered });
  },
  setYearFilter: (year) => {
    const newFilter = { ...get().filter, year };
    set({ filter: newFilter });
    const filtered = filterMaterials(get().materials, newFilter);
    set({ filteredMaterials: filtered });
  },
  setSemesterFilter: (semester) => {
    const newFilter = { ...get().filter, semester };
    set({ filter: newFilter });
    const filtered = filterMaterials(get().materials, newFilter);
    set({ filteredMaterials: filtered });
  },
  setTeacherFilter: (teacher) => {
    const newFilter = { ...get().filter, teacher };
    set({ filter: newFilter });
    const filtered = filterMaterials(get().materials, newFilter);
    set({ filteredMaterials: filtered });
  },
  setExamTypeFilter: (examType) => {
    const newFilter = { ...get().filter, examType };
    set({ filter: newFilter });
    const filtered = filterMaterials(get().materials, newFilter);
    set({ filteredMaterials: filtered });
  },
  setLanguageFilter: (language) => {
    const newFilter = { ...get().filter, language };
    set({ filter: newFilter });
    const filtered = filterMaterials(get().materials, newFilter);
    set({ filteredMaterials: filtered });
  },
  setSearchTerm: (searchTerm) => {
    const newFilter = { ...get().filter, searchTerm };
    set({ filter: newFilter });
    const filtered = filterMaterials(get().materials, newFilter);
    set({ filteredMaterials: filtered });
  },
  setSortBy: (sortBy) => {
    const newFilter = { ...get().filter, sortBy };
    set({ filter: newFilter });
    const filtered = filterMaterials(get().materials, newFilter);
    set({ filteredMaterials: filtered });
  },
  resetFilters: () => {
    set({ filter: initialFilterState });
    const filtered = filterMaterials(get().materials, initialFilterState);
    set({ filteredMaterials: filtered });
  },
  
  // PDF预览状态
  pdf: initialPdfState,
  openPdfModal: (material) => set({ pdf: { isOpen: true, material } }),
  closePdfModal: () => set({ pdf: { isOpen: false, material: null } }),
  
  // 加载状态
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  
  // 收藏状态
  favorites: initialFavoriteState,
  toggleFavorite: (id) => {
    const { favorites } = get();
    const items = favorites.items.includes(id)
      ? favorites.items.filter(itemId => itemId !== id)
      : [...favorites.items, id];
    set({ favorites: { items } });
  },
  isFavorite: (id) => get().favorites.items.includes(id),
  
  // 管理员状态
  admin: initialAdminState,
  isLoginModalOpen: false,
  toggleLoginModal: (isOpen) => set({ isLoginModalOpen: isOpen }),
  setAdminMode: (isAdminMode) => set({ admin: { ...get().admin, isAdminMode } }),
  logoutAdmin: () => set({ admin: { ...get().admin, isAdminMode: false } }),
  
  // 编辑状态
  edit: initialEditState,
  openEditModal: (material) => set({ edit: { isOpen: true, material } }),
  closeEditModal: () => set({ edit: { isOpen: false, material: null } }),
  updateMaterialItem: async (id, updates) => {
    const result = await updateMaterial(id, updates);
    if (result) {
      // 更新本地状态
      const materials = get().materials.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      set({ materials });
      // 重新应用筛选
      const filtered = filterMaterials(materials, get().filter);
      set({ filteredMaterials: filtered });
    }
    return result;
  },
  
  // 上传状态
  upload: initialUploadState,
  toggleUploadModal: (isOpen) => set({ upload: { ...get().upload, isOpen } }),
  setUploadProgress: (progress) => set({ upload: { ...get().upload, progress } }),
  addMaterialItem: async (material) => {
    const result = await addMaterial(material);
    if (result) {
      // 更新本地状态
      const materials = [result, ...get().materials];
      set({ materials });
      // 重新应用筛选
      const filtered = filterMaterials(materials, get().filter);
      set({ filteredMaterials: filtered });
    }
    return result;
  },
  deleteMaterialItem: async (id) => {
    const result = await deleteMaterial(id);
    if (result) {
      // 更新本地状态
      const materials = get().materials.filter(item => item.id !== id);
      set({ materials });
      // 重新应用筛选
      const filtered = filterMaterials(materials, get().filter);
      set({ filteredMaterials: filtered });
    }
    return result;
  }
}));

// 筛选资料的辅助函数
const filterMaterials = (materials: MaterialItem[], filter: FilterState): MaterialItem[] => {
  let filtered = [...materials];
  
  // 应用内容类型筛选
  if (filter.contentType) {
    filtered = filtered.filter(item => item.contentType === filter.contentType);
  }
  
  // 应用年份筛选
  if (filter.year) {
    filtered = filtered.filter(item => item.year === filter.year);
  }
  
  // 应用学期筛选
  if (filter.semester) {
    filtered = filtered.filter(item => item.semester === filter.semester);
  }
  
  // 应用教师筛选
  if (filter.teacher) {
    filtered = filtered.filter(item => item.teacher === filter.teacher);
  }
  
  // 应用考试类型筛选（仅对试卷类型）
  if (filter.examType) {
    filtered = filtered.filter(item => 
      item.contentType === 'Paper' && item.examType === filter.examType
    );
  }
  
  // 应用编程语言筛选（仅对代码类型）
  if (filter.language) {
    filtered = filtered.filter(item => 
      item.contentType === 'Code' && item.language === filter.language
    );
  }
  
  // 应用搜索词筛选
  if (filter.searchTerm) {
    const searchLower = filter.searchTerm.toLowerCase();
    filtered = filtered.filter(item => 
      item.courseName.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.teacher.toLowerCase().includes(searchLower) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  }
  
  // 应用排序
  switch (filter.sortBy) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'popular':
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
      break;
    case 'downloads':
      filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      break;
    case 'favorites':
      filtered.sort((a, b) => (b.favorites || 0) - (a.favorites || 0));
      break;
  }
  
  return filtered;
};
