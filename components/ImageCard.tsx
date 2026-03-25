import React from 'react';
import type { UploadedImage } from '../types';
import { RefreshCw, Download, Type, Check, Loader2 } from 'lucide-react';

interface ImageCardProps {
  image: UploadedImage;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onReset: (id: string) => void;
  onDownload: (image: UploadedImage) => void;
  onGetCaption: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, isSelected, onSelect, onReset, onDownload, onGetCaption }) => {
  const imageUrl = image.editedUrl || image.originalUrl;
  
  const IconButton: React.FC<{ onClick: () => void; children: React.ReactNode; label: string, disabled?: boolean }> = ({ onClick, children, label, disabled }) => (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        disabled={disabled}
        aria-label={label}
        className="p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-black border border-gray-800 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {children}
      </button>
  );

  return (
    <div 
      className={`relative group aspect-square bg-black border rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${isSelected ? 'border-white ring-1 ring-white' : 'border-gray-800'}`}
      onClick={() => onSelect(image.id)}
    >
      <img
        src={imageUrl}
        alt={image.file.name}
        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${image.isLoading ? 'opacity-30 grayscale' : ''}`}
      />

      {image.isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300">
          <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
          <div className="text-center px-4">
            <p className="text-xs font-black uppercase tracking-widest text-white mb-1">Processing</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">AI is applying changes...</p>
          </div>
        </div>
      )}

      {!image.isLoading && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className={`absolute top-4 left-4 h-6 w-6 rounded-md border flex items-center justify-center transition-all duration-200 ${
                isSelected ? 'bg-white border-white' : 'bg-black/40 border-gray-500'
              }`}
            >
              {isSelected && <Check className="w-4 h-4 text-black" />}
            </div>

            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              {image.editedUrl && (
                <IconButton onClick={() => onReset(image.id)} label="Reset image">
                  <RefreshCw className="w-4 h-4" />
                </IconButton>
              )}
               <IconButton onClick={() => onDownload(image)} label="Download image">
                  <Download className="w-4 h-4" />
              </IconButton>
              <IconButton onClick={() => onGetCaption(image.id)} label="Generate caption" disabled={image.isGettingCaption}>
                {image.isGettingCaption ? <Loader2 className="w-4 h-4 animate-spin" /> : <Type className="w-4 h-4" />}
              </IconButton>
            </div>
            
            <div className="absolute bottom-0 left-0 p-4 w-full">
              <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate mb-1">{image.file.name}</p>
              {image.caption && (
                <div className="bg-white/10 backdrop-blur-md p-2 rounded border border-white/10">
                  <p className="text-white text-[10px] leading-tight italic">&ldquo;{image.caption}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
          {isSelected && (
            <div className="absolute top-4 left-4 h-6 w-6 rounded-md bg-white border border-white flex items-center justify-center">
              <Check className="w-4 h-4 text-black" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageCard;
