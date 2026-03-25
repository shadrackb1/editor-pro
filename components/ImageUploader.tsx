
import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onUpload(Array.from(event.target.files));
    }
  };

  const handleDragEnter = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      onUpload(Array.from(event.dataTransfer.files));
      event.dataTransfer.clearData();
    }
  }, [onUpload]);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 text-center">
      <input
        type="file"
        id="file-upload"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="file-upload"
        className={`flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isDragging ? 'border-white bg-white/5' : 'border-gray-800 hover:border-gray-600 bg-black hover:bg-white/5'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
           <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center border border-gray-800 group-hover:border-white transition-all">
             <Upload className="w-8 h-8 text-white" />
           </div>
          <p className="mb-2 text-lg font-bold tracking-tight text-white uppercase">
            Upload Assets
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop or <span className="text-white underline underline-offset-4">browse files</span>
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600 font-medium uppercase tracking-widest">
            <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> JPG</span>
            <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> PNG</span>
            <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> WEBP</span>
          </div>
        </div>
      </label>
    </div>
  );
};

export default ImageUploader;
