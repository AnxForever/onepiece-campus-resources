import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Material, AdminState, FilterState, SortOption } from '../types';

interface StoreState {
  // 资料列表
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  
  // 筛选状态
  filter: FilterState;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
  
  // 排序选项
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  
  // 搜索关键词
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  
  // 管理员状态
  admin: AdminState;
  setAdmin: (admin: AdminState) => void;
  logoutAdmin: () => void;
  
  // 模态框状态
  isLoginModalOpen: boolean;
  toggleLoginModal: (isOpen?: boolean) => void;
  
  isPdfModalOpen: boolean;
  currentPdfUrl: string | null;
  togglePdfModal: (isOpen?: boolean, pdfUrl?: string | null) => void;
  
  isUploadModalOpen: boolean;
  toggleUploadModal: (isOpen?: boolean) => void;
  
  isEditModalOpen: boolean;
  currentEditMaterial: Material | null;
  toggleEditModal: (isOpen?: boolean, material?: Material | null) => void;
  
  // 上传进度
  uploadProgress: number;
  setUploadProgress: (progress: number) => void;
  
  // 收藏的资料
  favorites: string[];
  toggleFavorite: (materialId: string) => void;
  
  // 更新资料
  updateMaterial: (materialId: string, updates: Partial<Material>) => void;
  addMaterial: (material: Material) => void;
  deleteMaterial: (materialId: string) => void;
}

// 默认筛选状态
const defaultFilter: FilterState = {
  materialType: 'all',
  courseType: 'all',
  programmingLanguage: 'all',
  year: 'all',
  semester: 'all',
  teacher: 'all',
};

// 创建状态管理
export const useStore = create<StoreState>(
  persist(
    (set) => ({
      // 资料列表
      materials: [],
      setMaterials: (materials) => set({ materials }),
      
      // 筛选状态
      filter: { ...defaultFilter },
      setFilter: (filter) => set((state) => ({ filter: { ...state.filter, ...filter } })),
      resetFilter: () => set({ filter: { ...defaultFilter } }),
      
      // 排序选项
      sortOption: 'latest',
      setSortOption: (option) => set({ sortOption: option }),
      
      // 搜索关键词
      searchTerm: '',
      setSearchTerm: (term) => set({ searchTerm: term }),
      
      // 管理员状态
      admin: {
        isAdminMode: false,
        token: null,
        username: null,
      },
      setAdmin: (admin) => set({ admin }),
      logoutAdmin: () => set({ 
        admin: {
          isAdminMode: false,
          token: null,
          username: null,
        }
      }),
      
      // 登录模态框
      isLoginModalOpen: false,
      toggleLoginModal: (isOpen) => set((state) => ({ 
        isLoginModalOpen: isOpen !== undefined ? isOpen : !state.isLoginModalOpen 
      })),
      
      // PDF预览模态框
      isPdfModalOpen: false,
      currentPdfUrl: null,
      togglePdfModal: (isOpen, pdfUrl) => set((state) => ({
        isPdfModalOpen: isOpen !== undefined ? isOpen : !state.isPdfModalOpen,
        currentPdfUrl: pdfUrl !== undefined ? pdfUrl : state.currentPdfUrl
      })),
      
      // 上传模态框
      isUploadModalOpen: false,
      toggleUploadModal: (isOpen) => set((state) => ({
        isUploadModalOpen: isOpen !== undefined ? isOpen : !state.isUploadModalOpen
      })),
      
      // 编辑模态框
      isEditModalOpen: false,
      currentEditMaterial: null,
      toggleEditModal: (isOpen, material) => set((state) => ({
        isEditModalOpen: isOpen !== undefined ? isOpen : !state.isEditModalOpen,
        currentEditMaterial: material !== undefined ? material : state.currentEditMaterial
      })),
      
      // 上传进度
      uploadProgress: 0,
      setUploadProgress: (progress) => set({ uploadProgress: progress }),
      
      // 收藏的资料
      favorites: [],
      toggleFavorite: (materialId) => set((state) => {
        const isFavorited = state.favorites.includes(materialId);
        return {
          favorites: isFavorited
            ? state.favorites.filter(id => id !== materialId)
            : [...state.favorites, materialId]
        };
      }),
      
      // 更新资料
      updateMaterial: (materialId, updates) => set((state) => ({
        materials: state.materials.map(material =>
          material.id === materialId ? { ...material, ...updates } : material
        )
      })),
      
      // 添加资料
      addMaterial: (material) => set((state) => ({
        materials: [material, ...state.materials]
      })),
      
      // 删除资料
      deleteMaterial: (materialId) => set((state) => ({
        materials: state.materials.filter(material => material.id !== materialId)
      })),
    }),
    {
      name: 'onepiece-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        admin: state.admin,
      }),
    }
  )
);
