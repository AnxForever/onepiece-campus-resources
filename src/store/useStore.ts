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
  
  // 当前选中的资料（用于编辑）
  currentMaterial: Material | null;
  setCurrentMaterial: (material: Material | null) => void;
  
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
  
  // 模态框状态
  showLoginModal: boolean;
  toggleLoginModal: (show?: boolean) => void;
  
  showUploadModal: boolean;
  toggleUploadModal: (show?: boolean) => void;
  
  showEditModal: boolean;
  toggleEditModal: (show?: boolean) => void;
  
  showPdfModal: boolean;
  togglePdfModal: (show?: boolean) => void;
  
  // 收藏功能
  toggleFavorite: (materialId: string) => void;
}

// 默认筛选状态
const defaultFilter: FilterState = {
  materialType: 'all',
  courseType: 'all',
  programmingLanguage: 'all',
  year: 'all',
  semester: 'all'
};

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
      
      // 当前选中的资料
      currentMaterial: null,
      setCurrentMaterial: (material) => set({ currentMaterial: material }),
      
      // 筛选状态
      filter: defaultFilter,
      setFilter: (filter) => set((state) => ({
        filter: { ...state.filter, ...filter }
      })),
      resetFilter: () => set({ 
        filter: defaultFilter,
        searchKeyword: ''
      }),
      
      // 排序选项
      sortOption: 'latest',
      setSortOption: (option) => set({ sortOption: option }),
      
      // 搜索关键词
      searchKeyword: '',
      setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
      
      // 模态框状态
      showLoginModal: false,
      toggleLoginModal: (show) => set((state) => ({
        showLoginModal: show !== undefined ? show : !state.showLoginModal
      })),
      
      showUploadModal: false,
      toggleUploadModal: (show) => set((state) => ({
        showUploadModal: show !== undefined ? show : !state.showUploadModal
      })),
      
      showEditModal: false,
      toggleEditModal: (show) => set((state) => ({
        showEditModal: show !== undefined ? show : !state.showEditModal
      })),
      
      showPdfModal: false,
      togglePdfModal: (show) => set((state) => ({
        showPdfModal: show !== undefined ? show : !state.showPdfModal
      })),
      
      // 收藏功能
      toggleFavorite: (materialId) => set((state) => {
        const updatedMaterials = state.materials.map(material => {
          if (material.id === materialId) {
            // 切换收藏状态
            const isFavorited = !material.isFavorited;
            
            // 更新收藏数量
            const favorites = isFavorited 
              ? material.favorites + 1 
              : Math.max(0, material.favorites - 1);
            
            return { ...material, isFavorited, favorites };
          }
          return material;
        });
        
        return { materials: updatedMaterials };
      })
    }),
    {
      name: 'onepiece-storage',
      partialize: (state) => ({
        // 只持久化管理员状态和收藏状态
        admin: state.admin,
        materials: state.materials.map(material => ({
          id: material.id,
          isFavorited: material.isFavorited
        }))
      }),
      merge: (persistedState: any, currentState) => {
        // 合并持久化的状态和当前状态
        const mergedState = { ...currentState };
        
        // 合并管理员状态
        if (persistedState.admin) {
          mergedState.admin = persistedState.admin;
        }
        
        // 合并收藏状态
        if (persistedState.materials && currentState.materials.length > 0) {
          const favoriteMap = new Map();
          persistedState.materials.forEach((item: any) => {
            if (item.id && item.isFavorited) {
              favoriteMap.set(item.id, item.isFavorited);
            }
          });
          
          mergedState.materials = currentState.materials.map(material => {
            if (favoriteMap.has(material.id)) {
              return { ...material, isFavorited: favoriteMap.get(material.id) };
            }
            return material;
          });
        }
        
        return mergedState;
      }
    }
  )
);
