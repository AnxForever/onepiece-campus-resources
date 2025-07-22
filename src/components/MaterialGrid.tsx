import React from 'react';
import { useStore } from '../store/useStore';
import MaterialCard from './MaterialCard';
import { FileX } from 'lucide-react';

const MaterialGrid: React.FC = () => {
  const { filteredMaterials, loading } = useStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">正在加载资料...</p>
        </div>
      </div>
    );
  }

  if (filteredMaterials.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <FileX className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            没有找到相关资料
          </h3>
          <p className="text-gray-500">
            尝试调整搜索条件或筛选器
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredMaterials.map((material) => (
        <MaterialCard key={material.id} material={material} />
      ))}
    </div>
  );
};

export default MaterialGrid;