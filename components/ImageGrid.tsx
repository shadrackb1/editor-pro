
import React from 'react';
import type { UploadedImage } from '../types';
import ImageCard from './ImageCard';

interface ImageGridProps {
  images: UploadedImage[];
  selectedImageIds: string[];
  onSelectImage: (id: string) => void;
  onResetImage: (id: string) => void;
  onDownloadImage: (image: UploadedImage) => void;
  onGetCaption: (id: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, selectedImageIds, onSelectImage, onResetImage, onDownloadImage, onGetCaption }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4 md:p-8">
      {images.map(image => (
        <ImageCard
          key={image.id}
          image={image}
          isSelected={selectedImageIds.includes(image.id)}
          onSelect={onSelectImage}
          onReset={onResetImage}
          onDownload={onDownloadImage}
          onGetCaption={onGetCaption}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
