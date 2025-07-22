import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AdminState, FilterState, Material, SortOption, SortDirection, SortState } from '../types';
import { getMaterials } from '../api';

interface StoreState {
  // 管理员状态
  admin: AdminState;
  setAdmin: (admin: Partial<AdminState>) => void;
  logout: () => void;
  
  // 资料列表
  materials: Material[];
  fetchMaterials: () => Promise<void>;
  setMaterials: (materials: Material[]) => void;
  
  // 筛选状态
  filter: FilterState;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
  
  // 排序状态
  sort: SortState;
  setSort: (option: SortOption, direction: SortDirection) => void;
  
  // 搜索状态
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // 模态框状态
  isLoginModalOpen: boolean;
  setLoginModalOpen: (isOpen: boolean) => void;
  
  isUploadModalOpen: boolean;
  setUploadModalOpen: (isOpen: boolean) => void;
  
  isEditModalOpen: boolean;
  setEditModalOpen: (isOpen: boolean) => void;
  
  currentEditingMaterial: Material | null;
  setCurrentEditingMaterial: (material: Material | null) => void;
  
  // 收藏功能
  toggleFavorite: (id: string) => void;
  toggleStar: (id: string) => void;
}

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // 管理员状态初始值
        admin: {
          isAdminMode: false,
          token: null,
          username: null
        },
        setAdmin: (admin) => set((state) => ({
          admin: { ...state.admin, ...admin }
        })),
        logout: () => set({
          admin: {
            isAdminMode: false,
            token: null,
            username: null
          }
        }),
        
        // 资料列表初始值
        materials: [],
        fetchMaterials: async () => {
          try {
            const response = await getMaterials();
            if (response.success) {
              set({ materials: response.data });
            }
          } catch (error) {
            console.error('获取资料列表失败:', error);
          }
        },
        setMaterials: (materials) => set({ materials }),
        
        // 筛选状态初始值
        filter: {
          materialType: null,
          courseType: null,
          programmingLanguage: null,
          year: null,
          semester: null,
          teacher: null
        },
        setFilter: (filter) => set((state) => ({
          filter: { ...state.filter, ...filter }
        })),
        resetFilter: () => set({
          filter: {
            materialType: null,
            courseType: null,
            programmingLanguage: null,
            year: null,
            semester: null,
            teacher: null
          }
        }),
        
        // 排序状态初始值
        sort: {
          option: 'uploadDate',
          direction: 'desc'
        },
        setSort: (option, direction) => set({
          sort: { option, direction }
        }),
        
        // 搜索状态初始值
        searchQuery: '',
        setSearchQuery: (searchQuery) => set({ searchQuery }),
        
        // 模态框状态初始值
        isLoginModalOpen: false,
        setLoginModalOpen: (isLoginModalOpen) => set({ isLoginModalOpen }),
        
        isUploadModalOpen: false,
        setUploadModalOpen: (isUploadModalOpen) => set({ isUploadModalOpen }),
        
        isEditModalOpen: false,
        setEditModalOpen: (isEditModalOpen) => set({ isEditModalOpen }),
        
        currentEditingMaterial: null,
        setCurrentEditingMaterial: (currentEditingMaterial) => set({ currentEditingMaterial }),
        
        // 收藏功能
        toggleFavorite: (id) => set((state) => ({
          materials: state.materials.map(material => 
            material.id === id 
              ? { ...material, isFavorited: !material.isFavorited }
              : material
          )
        })),
        
        toggleStar: (id) => set((state) => ({
          materials: state.materials.map(material => 
            material.id === id 
              ? { ...material, isStarred: !material.isStarred }
              : material
          )
        }))
      }),
      {
        name: 'campus-resources-storage',
        partialize: (state) => ({
          admin: state.admin,
          materials: state.materials
        })
      }
    )
  )
);
