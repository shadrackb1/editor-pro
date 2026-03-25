
import React, { useState, useCallback, useEffect } from 'react';
import type { UploadedImage } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImageGrid from './components/ImageGrid';
import EditControls from './components/EditControls';
import ImageGenerator from './components/ImageGenerator';
import { editImageWithGemini, generateCaptionWithGemini } from './services/geminiService';
import { downloadImage } from './utils/imageUtils';
import { AlertCircle, XCircle } from 'lucide-react';

const App: React.FC = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'generator'>('editor');
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      console.error("GEMINI_API_KEY is missing. Please set it in your environment variables.");
      setApiKeyError(true);
    }
  }, []);

  const handleUpload = useCallback((files: File[]) => {
    const newImages: UploadedImage[] = files.map(file => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      originalUrl: URL.createObjectURL(file),
      editedUrl: null,
      isLoading: false,
      isGettingCaption: false,
    }));
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleSelectImage = useCallback((id: string) => {
    setSelectedImageIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  }, []);

  const handleResetImage = useCallback((id: string) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, editedUrl: null } : img));
  }, []);

  const handleDownloadImage = useCallback((image: UploadedImage) => {
    const url = image.editedUrl || image.originalUrl;
    const originalName = image.file.name.substring(0, image.file.name.lastIndexOf('.'));
    const extension = image.file.name.substring(image.file.name.lastIndexOf('.'));
    const filename = image.editedUrl ? `${originalName}-edited${extension}` : image.file.name;
    downloadImage(url, filename);
  }, []);
  
  const handleApplyEdit = useCallback(async (prompt: string) => {
    if (selectedImageIds.length === 0) return;

    const imagesToEdit = images.filter(img => selectedImageIds.includes(img.id));
    
    setIsProcessing(true);
    setImages(prev => prev.map(img => 
        selectedImageIds.includes(img.id) ? { ...img, isLoading: true } : img
    ));

    const results = await Promise.allSettled(
      imagesToEdit.map(img => editImageWithGemini(img.file, prompt))
    );

    const resultsMap = new Map<string, { status: 'fulfilled' | 'rejected'; value?: string; reason?: any }>();
    results.forEach((result, index) => {
        const imageId = imagesToEdit[index].id;
        if (result.status === 'fulfilled') {
            resultsMap.set(imageId, { status: 'fulfilled', value: result.value });
        } else {
            resultsMap.set(imageId, { status: 'rejected', reason: result.reason });
            console.error(`Failed to edit image ${imagesToEdit[index].file.name}:`, result.reason);
        }
    });

    setImages(prevImages => prevImages.map(img => {
        if (resultsMap.has(img.id)) {
            const result = resultsMap.get(img.id)!;
            return {
                ...img,
                isLoading: false,
                editedUrl: result.status === 'fulfilled' ? result.value : img.editedUrl,
            };
        }
        return img;
    }));

    setIsProcessing(false);
  }, [images, selectedImageIds]);

  const handleGetCaption = useCallback(async (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image) return;

    setImages(prev => prev.map(img => img.id === id ? { ...img, isGettingCaption: true } : img));

    try {
        const caption = await generateCaptionWithGemini(image.file);
        setImages(prev => prev.map(img => img.id === id ? { ...img, caption, isGettingCaption: false } : img));
    } catch (error) {
        console.error("Failed to get caption:", error);
        setImages(prev => prev.map(img => img.id === id ? { ...img, isGettingCaption: false, caption: 'Error fetching caption.' } : img));
    }
  }, [images]);

  const handleBatchDownload = useCallback(() => {
    images.forEach(image => {
      if (selectedImageIds.includes(image.id) && image.editedUrl) {
        handleDownloadImage(image);
      }
    });
  }, [images, selectedImageIds, handleDownloadImage]);

  const hasEditedSelection = selectedImageIds.some(id => images.find(img => img.id === id)?.editedUrl);

  if (apiKeyError) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <XCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-black uppercase tracking-widest mb-2">Configuration Error</h1>
        <p className="text-gray-500 text-center max-w-md mb-8">
          The Gemini API key is missing. Please ensure you have set the <code className="bg-white/10 px-2 py-1 rounded">GEMINI_API_KEY</code> environment variable in your Vercel project settings.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-white text-black font-bold uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-all"
        >
          Check Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow flex flex-col">
        {activeTab === 'editor' ? (
          <>
            {images.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center p-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4">Professional AI Editor</h2>
                  <p className="text-gray-500 max-w-lg mx-auto text-lg">Upload your assets to begin the transformation process. One tap, endless possibilities.</p>
                </div>
                <ImageUploader onUpload={handleUpload} />
              </div>
            ) : (
              <div className="pb-40">
                <div className="max-w-7xl mx-auto px-4 py-8 flex justify-between items-center border-b border-gray-900 mb-8">
                  <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Workspace / {images.length} Assets</h2>
                  <button 
                    onClick={() => setImages([])} 
                    className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <ImageGrid
                  images={images}
                  selectedImageIds={selectedImageIds}
                  onSelectImage={handleSelectImage}
                  onResetImage={handleResetImage}
                  onDownloadImage={handleDownloadImage}
                  onGetCaption={handleGetCaption}
                />
              </div>
            )}
            {images.length > 0 && (
              <EditControls
                onApplyEdit={handleApplyEdit}
                onBatchDownload={handleBatchDownload}
                isProcessing={isProcessing}
                hasSelection={selectedImageIds.length > 0}
                hasEditedSelection={hasEditedSelection}
              />
            )}
          </>
        ) : (
          <div className="flex-grow py-12">
            <ImageGenerator />
          </div>
        )}
      </main>
      
      {/* Global Status Bar */}
      <footer className="bg-black border-t border-gray-900 p-2 text-[10px] uppercase tracking-[0.2em] text-gray-700 font-bold flex justify-between items-center px-6">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><div className="w-1 h-1 bg-green-500 rounded-full"></div> System Ready</span>
          <span className="flex items-center gap-1"><div className="w-1 h-1 bg-white rounded-full"></div> Gemini 2.5 Active</span>
        </div>
        <div>&copy; 2026 QUICKEDIT ENGINE</div>
      </footer>
    </div>
  );
};

export default App;
