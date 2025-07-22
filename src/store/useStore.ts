import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminState, Material, FilterState, SortOption } from '../types';

interface StoreState {
  // 管理员状态
  admin: AdminState;
  setAdmin: (admin: AdminState) => void;
  logout: () => void;
  
  // 资料列表
  materials: Material[];
  setMaterials: (materials: Material[]) => void;
  addMaterial: (material: Material) => void;
  updateMaterial: (material: Material) => void;
  deleteMaterial: (id: string) => void;
  
  // 筛选状态
  filter: FilterState;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
  
  // 排序选项
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  
  // 搜索关键词
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  
  // 收藏列表
  favorites: string[];
  toggleFavorite: (id: string) => void;
  
  // 模态框状态
  isUploadModalOpen: boolean;
  toggleUploadModal: (isOpen: boolean) => void;
  
  isEditModalOpen: boolean;
  currentEditMaterial: Material | null;
  toggleEditModal: (isOpen: boolean, material?: Material) => void;
  
  isPdfModalOpen: boolean;
  currentPdfUrl: string | null;
  togglePdfModal: (isOpen: boolean, pdfUrl?: string) => void;
}

// 创建全局状态管理
export const useStore = create<StoreState>(
  persist(
    (set) => ({
      // 管理员状态
      admin: {
        isAdminMode: false,
        token: null,
        username: null
      },
      setAdmin: (admin) => set({ admin }),
      logout: () => set({ 
        admin: {
          isAdminMode: false,
          token: null,
          username: null
        }
      }),
      
      // 资料列表
      materials: [],
      setMaterials: (materials) => set({ materials }),
      addMaterial: (material) => set((state) => ({
        materials: [material, ...state.materials]
      })),
      updateMaterial: (material) => set((state) => ({
        materials: state.materials.map((m) => 
          m.id === material.id ? material : m
        )
      })),
      deleteMaterial: (id) => set((state) => ({
        materials: state.materials.filter((m) => m.id !== id)
      })),
      
      // 筛选状态
      filter: {
        materialType: 'all',
        courseType: 'all',
        programmingLanguage: 'all',
        year: 'all',
        semester: 'all'
      },
      setFilter: (filter) => set((state) => ({
        filter: { ...state.filter, ...filter }
      })),
      resetFilter: () => set({
        filter: {
          materialType: 'all',
          courseType: 'all',
          programmingLanguage: 'all',
          year: 'all',
          semester: 'all'
        },
        searchKeyword: ''
      }),
      
      // 排序选项
      sortOption: 'latest',
      setSortOption: (sortOption) => set({ sortOption }),
      
      // 搜索关键词
      searchKeyword: '',
      setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
      
      // 收藏列表
      favorites: [],
      toggleFavorite: (id) => set((state) => {
        const isFavorited = state.favorites.includes(id);
        return {
          favorites: isFavorited
            ? state.favorites.filter((favId) => favId !== id)
            : [...state.favorites, id]
        };
      }),
      
      // 模态框状态
      isUploadModalOpen: false,
      toggleUploadModal: (isOpen) => set({ isUploadModalOpen: isOpen }),
      
      isEditModalOpen: false,
      currentEditMaterial: null,
      toggleEditModal: (isOpen, material = null) => set({ 
        isEditModalOpen: isOpen,
        currentEditMaterial: material
      }),
      
      isPdfModalOpen: false,
      currentPdfUrl: null,
      togglePdfModal: (isOpen, pdfUrl = null) => set({
        isPdfModalOpen: isOpen,
        currentPdfUrl: pdfUrl
      })
    }),
    {
      name: 'campus-resources-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        admin: state.admin
      })
    }
  )
);
