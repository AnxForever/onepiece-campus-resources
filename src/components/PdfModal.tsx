import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';
import { getFileUrl, downloadFile, getFileName } from '../utils/fileUtils';
import { toast } from 'sonner';

// 设置PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfModal: React.FC = () => {
  const { selectedPdf, isPdfModalOpen, closePdfModal } = useStore();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);

  if (!isPdfModalOpen || !selectedPdf) return null;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF加载失败:', error);
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages, prev + 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(2.0, prev + 0.2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.2));
  };

  const handleDownload = () => {
    if (selectedPdf.filePath) {
      const fileName = getFileName(selectedPdf.filePath) || `${selectedPdf.courseName}-${selectedPdf.examType || 'document'}.pdf`;
      downloadFile(selectedPdf.filePath, fileName);
      toast.success(`开始下载：${fileName}`);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closePdfModal();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-purple-900 bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-xl max-w-6xl max-h-full w-full flex flex-col overflow-hidden shadow-2xl border border-purple-200">
        {/* 头部工具栏 */}
        <div className="flex items-center justify-between p-4 border-b border-purple-200">
          <div>
            <h2 className="text-xl font-bold text-purple-800">
              {selectedPdf.courseName}
            </h2>
            <p className="text-purple-600 text-sm">
              {selectedPdf.examType} - {selectedPdf.teacher}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 缩放控制 */}
            <button
              onClick={zoomOut}
              className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-colors"
              title="缩小"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <span className="text-purple-600 text-sm min-w-16 text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <button
              onClick={zoomIn}
              className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-colors"
              title="放大"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            
            {/* 页面导航 */}
            <div className="flex items-center gap-2 mx-4">
              <button
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  pageNumber <= 1
                    ? 'text-purple-300 cursor-not-allowed'
                    : 'text-purple-600 hover:text-purple-800 hover:bg-purple-100'
                )}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <span className="text-purple-600 text-sm min-w-20 text-center">
                {pageNumber} / {numPages}
              </span>
              
              <button
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                className={clsx(
                  'p-2 rounded-lg transition-colors',
                  pageNumber >= numPages
                    ? 'text-purple-300 cursor-not-allowed'
                    : 'text-purple-600 hover:text-purple-800 hover:bg-purple-100'
                )}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* 下载按钮 */}
            <button
              onClick={handleDownload}
              className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-colors"
              title="下载PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            
            {/* 关闭按钮 */}
            <button
              onClick={closePdfModal}
              className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* PDF内容区域 */}
        <div className="flex-1 overflow-auto bg-purple-50 flex items-center justify-center">
          {loading && (
            <div className="text-purple-800 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p>正在加载PDF...</p>
            </div>
          )}
          
          {selectedPdf.filePath && (() => {
            const fileUrl = getFileUrl(selectedPdf.filePath);
            return fileUrl ? (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={null}
                error={
                  <div className="text-red-600 text-center p-8">
                    <p className="mb-2">PDF加载失败</p>
                    <p className="text-sm text-purple-600">请检查文件是否存在或重新上传</p>
                  </div>
                }
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  loading={null}
                  error={null}
                  className="shadow-lg"
                />
              </Document>
            ) : (
              <div className="text-red-600 text-center p-8">
                <p className="mb-2">文件不存在</p>
                <p className="text-sm text-purple-600">文件可能已被删除或移动</p>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default PdfModal;