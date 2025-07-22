// 文件处理工具函数
export const uploadFile = async (file: File, type: 'pdf' | 'image'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // 在实际应用中，这里应该上传到服务器
      // 现在我们将文件存储在localStorage中作为演示
      const fileId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(`file_${fileId}`, result);
      localStorage.setItem(`file_${fileId}_name`, file.name);
      localStorage.setItem(`file_${fileId}_type`, file.type);
      resolve(fileId);
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
};

export const getFileUrl = (fileId: string): string | null => {
  return localStorage.getItem(`file_${fileId}`);
};

export const getFileName = (fileId: string): string | null => {
  return localStorage.getItem(`file_${fileId}_name`);
};

export const downloadFile = (fileId: string, filename?: string) => {
  const fileData = getFileUrl(fileId);
  const fileName = filename || getFileName(fileId) || 'download';
  
  if (fileData) {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const deleteFile = (fileId: string) => {
  localStorage.removeItem(`file_${fileId}`);
  localStorage.removeItem(`file_${fileId}_name`);
  localStorage.removeItem(`file_${fileId}_type`);
};

// 验证文件类型和大小
export const validateFile = (file: File, allowedTypes: string[], maxSize: number): string | null => {
  if (!allowedTypes.includes(file.type)) {
    return `不支持的文件类型。支持的类型：${allowedTypes.join(', ')}`;
  }
  
  if (file.size > maxSize) {
    return `文件大小超过限制。最大允许：${(maxSize / 1024 / 1024).toFixed(1)}MB`;
  }
  
  return null;
};

// 生成缩略图
export const generateThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          // 设置缩略图尺寸
          const maxWidth = 200;
          const maxHeight = 200;
          let { width, height } = img;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        };
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error('图片读取失败'));
      reader.readAsDataURL(file);
    } else {
      // 对于非图片文件，返回默认缩略图
      resolve('/thumbnails/default.png');
    }
  });
};

// GitHub仓库验证
export const validateGitHubUrl = (url: string): boolean => {
  const githubPattern = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/;
  return githubPattern.test(url);
};

// 获取GitHub仓库信息
export const getGitHubRepoInfo = async (url: string) => {
  try {
    const match = url.match(/github\.com\/([\w.-]+)\/([\w.-]+)/);
    if (!match) throw new Error('无效的GitHub URL');
    
    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('仓库不存在或无法访问');
    
    const data = await response.json();
    return {
      name: data.name,
      description: data.description,
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
      updated: data.updated_at
    };
  } catch (error) {
    console.error('获取GitHub仓库信息失败:', error);
    return null;
  }
};