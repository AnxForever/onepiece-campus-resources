import React from 'react';
import { FileX, Search } from 'lucide-react';
import { clsx } from 'clsx';

interface EmptyProps {
  message?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Empty: React.FC<EmptyProps> = ({ 
  message = '暂无数据', 
  description = '当前没有可显示的内容', 
  icon,
  className 
}) => {
  return (
    <div className={clsx(
      'flex flex-col items-center justify-center py-16 px-8 text-center',
      className
    )}>
      <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
        {icon || <FileX className="w-8 h-8 text-neutral-400" />}
      </div>
      <h3 className="text-lg font-medium text-neutral-800 mb-2">{message}</h3>
      <p className="text-neutral-500 max-w-md">{description}</p>
    </div>
  );
};

export default Empty;