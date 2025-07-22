import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { MaterialItem } from '../types';

export const useMaterials = () => {
  const { setMaterials, setLoading } = useStore();

  useEffect(() => {
    const fetchMaterials = async () => {
      setLoading(true);
      try {
        const response = await fetch('/index.json');
        if (!response.ok) {
          throw new Error('Failed to fetch materials');
        }
        const data: MaterialItem[] = await response.json();
        setMaterials(data);
      } catch (error) {
        console.error('Error fetching materials:', error);
        // 设置模拟数据作为fallback
        const mockData: MaterialItem[] = [
          {
            id: '1',
            courseName: '数据结构与算法',
            teacher: '张教授',
            year: '2023',
            semester: '春季',
            materialType: 'Exam',
            contentType: 'Paper',
            examType: '期末考试',
            description: '数据结构与算法期末考试试卷，包含链表、树、图等核心内容',
            fileUrl: '/mock-exam.pdf',
            downloadCount: 156,
            createdAt: '2023-06-15T10:00:00Z',
            updatedAt: '2023-06-15T10:00:00Z'
          },
          {
            id: '2',
            courseName: 'Web开发技术',
            teacher: '李老师',
            year: '2023',
            semester: '秋季',
            materialType: 'Project',
            contentType: 'Code',
            description: 'React + TypeScript 开发的在线商城项目，包含完整的前后端代码',
            fileUrl: '/mock-project.zip',
            downloadCount: 89,
            createdAt: '2023-12-10T14:30:00Z',
            updatedAt: '2023-12-10T14:30:00Z'
          },
          {
            id: '3',
            courseName: '计算机网络',
            teacher: '王教授',
            year: '2024',
            semester: '春季',
            materialType: 'Exam',
            contentType: 'Paper',
            examType: '期中考试',
            description: '计算机网络期中考试，涵盖OSI模型、TCP/IP协议栈等重点内容',
            fileUrl: '/mock-midterm.pdf',
            downloadCount: 203,
            createdAt: '2024-04-20T09:15:00Z',
            updatedAt: '2024-04-20T09:15:00Z'
          }
        ];
        setMaterials(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [setMaterials, setLoading]);
};