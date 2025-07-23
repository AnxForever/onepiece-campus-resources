import { create } from 'zustand';
import { MaterialItem, Filters, AdminState, UploadFormData } from '../types';

interface AppState {
  // 资料数据
  materials: MaterialItem[];
  filteredMaterials: MaterialItem[];
  loading: boolean;
  
  // 筛选状态
  filters: Filters;
  
  // PDF预览状态
  selectedPdf: MaterialItem | null;
  isPdfModalOpen: boolean;
  
  // 收藏状态
  favorites: string[];
  
  // 管理员状态
  admin: AdminState;
  
  // Actions
  setMaterials: (materials: MaterialItem[]) => void;
  setFilters: (filters: Partial<Filters>) => void;
  filterMaterials: () => void;
  openPdfModal: (material: MaterialItem) => void;
  closePdfModal: () => void;
  setLoading: (loading: boolean) => void;
  toggleFavorite: (materialId: string) => void;
  
  // Admin Actions
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  openEditModal: (material: MaterialItem) => void;
  closeEditModal: () => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
  updateMaterial: (id: string, updates: Partial<MaterialItem>) => void;
  addMaterial: (material: MaterialItem) => void;
  deleteMaterial: (id: string) => boolean;
  setUploadProgress: (progress: number) => void;
}

export const useStore = create<AppState>((set, get) => ({
  materials: [],
  filteredMaterials: [],
  loading: false,
  
  filters: {
    searchQuery: '',
    materialType: 'All',
    teacher: '',
    year: '',
    sortBy: 'newest',
    sortOrder: 'desc'
  },
  
  selectedPdf: null,
  isPdfModalOpen: false,
  
  favorites: [],
  
  admin: {
    isAdminMode: false,
    isEditModalOpen: false,
    isUploadModalOpen: false,
    editingMaterial: null,
    uploadProgress: 0,
    isLoginModalOpen: false
  },
  
  setMaterials: (materials) => {
    set({ materials });
    get().filterMaterials();
  },
  
  setFilters: (newFilters) => {
    set(state => ({
      filters: { ...state.filters, ...newFilters }
    }));
    get().filterMaterials();
  },
  
  filterMaterials: () => {
    const { materials, filters } = get();
    
    let filtered = materials.filter(material => {
      // 搜索查询过滤
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          material.courseName.toLowerCase().includes(query) ||
          material.teacher.toLowerCase().includes(query) ||
          material.description.toLowerCase().includes(query) ||
          (material.examType && material.examType.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }
      
      // 材料类型过滤
      if (filters.materialType && filters.materialType !== 'All' && material.materialType !== filters.materialType) {
        return false;
      }
      
      // 教师过滤
      if (filters.teacher && material.teacher !== filters.teacher) {
        return false;
      }
      
      // 年份过滤
      if (filters.year && material.year !== filters.year) {
        return false;
      }
      
      return true;
    });
    
    // 应用排序
    filtered = filtered.sort((a, b) => {
      const { sortBy, sortOrder } = filters;
      let comparison = 0;
      
      switch (sortBy) {
        case 'newest':
          comparison = new Date(b.uploadDate || '').getTime() - new Date(a.uploadDate || '').getTime();
          if (comparison === 0) {
            comparison = parseInt(b.year) - parseInt(a.year);
          }
          break;
        case 'name':
          comparison = a.courseName.localeCompare(b.courseName, 'zh-CN');
          break;
        case 'popular':
          const aPopularity = (a.stars || 0) + (a.downloads || 0) * 0.1;
          const bPopularity = (b.stars || 0) + (b.downloads || 0) * 0.1;
          comparison = bPopularity - aPopularity;
          break;
        case 'downloads':
          comparison = (b.downloads || 0) - (a.downloads || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });
    
    set({ filteredMaterials: filtered });
  },
  
  openPdfModal: (material) => {
    set({ selectedPdf: material, isPdfModalOpen: true });
  },
  
  closePdfModal: () => {
    set({ selectedPdf: null, isPdfModalOpen: false });
  },
  
  setLoading: (loading) => {
    set({ loading });
  },
  
  toggleFavorite: (materialId) => {
    set(state => {
      const isFavorited = state.favorites.includes(materialId);
      const newFavorites = isFavorited
        ? state.favorites.filter(id => id !== materialId)
        : [...state.favorites, materialId];
      return { favorites: newFavorites };
    });
  },
  
  // Admin Actions
  openLoginModal: () => {
    set(state => ({
      admin: { ...state.admin, isLoginModalOpen: true }
    }));
  },

  closeLoginModal: () => {
    set(state => ({
      admin: { ...state.admin, isLoginModalOpen: false }
    }));
  },

  loginAdmin: () => {
    set(state => ({
      admin: { ...state.admin, isAdminMode: true, isLoginModalOpen: false }
    }));
  },

  logoutAdmin: () => {
    set(state => ({
      admin: {
        ...state.admin,
        isAdminMode: false,
        isEditModalOpen: false,
        isUploadModalOpen: false,
        editingMaterial: null,
        uploadProgress: 0
      }
    }));
  },
  
  openEditModal: (material) => {
    set(state => ({
      admin: {
        ...state.admin,
        isEditModalOpen: true,
        editingMaterial: material
      }
    }));
  },
  
  closeEditModal: () => {
    set(state => ({
      admin: {
        ...state.admin,
        isEditModalOpen: false,
        editingMaterial: null
      }
    }));
  },
  
  openUploadModal: () => {
    set(state => ({
      admin: { ...state.admin, isUploadModalOpen: true, uploadProgress: 0 }
    }));
  },
  
  closeUploadModal: () => {
    set(state => ({
      admin: { ...state.admin, isUploadModalOpen: false, uploadProgress: 0 }
    }));
  },
  
  updateMaterial: (id, updates) => {
    set(state => {
      const updatedMaterials = state.materials.map(material =>
        material.id === id
          ? { ...material, ...updates, updatedAt: new Date().toISOString() }
          : material
      );
      return { materials: updatedMaterials };
    });
    get().filterMaterials();
  },
  
  addMaterial: (material) => {
    const newMaterial = {
      ...material,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set(state => ({
      materials: [...state.materials, newMaterial]
    }));
    get().filterMaterials();
  },
  
  deleteMaterial: (id) => {
    set(state => ({
      materials: state.materials.filter(material => material.id !== id)
    }));
    // 如果删除的是当前预览的PDF，关闭预览
    if (get().selectedPdf?.id === id) {
      get().closePdfModal();
    }
    get().filterMaterials();
    return true;
  },
  
  setUploadProgress: (progress) => {
    set(state => ({
      admin: { ...state.admin, uploadProgress: progress }
    }));
  }
}));