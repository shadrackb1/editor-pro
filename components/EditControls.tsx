
import React, { useState } from 'react';
import { PRESET_FILTERS } from '../constants';
import { Download, Check, Loader2 } from 'lucide-react';

interface EditControlsProps {
  onApplyEdit: (prompt: string) => void;
  onBatchDownload: () => void;
  isProcessing: boolean;
  hasSelection: boolean;
  hasEditedSelection: boolean;
}

const EditControls: React.FC<EditControlsProps> = ({ onApplyEdit, onBatchDownload, isProcessing, hasSelection, hasEditedSelection }) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onApplyEdit(customPrompt);
      setCustomPrompt('');
    }
  };
  
  const buttonBaseClass = "px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  const presetButtonClass = `${buttonBaseClass} bg-transparent border border-gray-700 text-gray-300 hover:border-white hover:text-white`;
  const primaryButtonClass = `${buttonBaseClass} bg-white text-black hover:bg-gray-200`;

  return (
    <div className="sticky bottom-0 z-10 w-full bg-black/90 backdrop-blur-md border-t border-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI is re-imagining your images... this may take a few moments.</span>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {PRESET_FILTERS.map(filter => (
            <button 
              key={filter.name} 
              onClick={() => onApplyEdit(filter.prompt)} 
              disabled={!hasSelection || isProcessing} 
              className={presetButtonClass}
            >
              {filter.name}
            </button>
          ))}
           <button 
             onClick={onBatchDownload} 
             disabled={!hasEditedSelection || isProcessing} 
             className={primaryButtonClass}
           >
              <Download className="w-4 h-4" />
              Batch Download
            </button>
        </div>
        <form onSubmit={handleCustomPromptSubmit} className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder="Describe your custom edit... (e.g., 'make the sky purple')"
            className="flex-grow bg-black border border-gray-800 text-white placeholder-gray-600 text-sm rounded-md focus:border-white focus:ring-0 p-2.5 outline-none"
            disabled={!hasSelection || isProcessing}
          />
          <button 
            type="submit" 
            disabled={!hasSelection || isProcessing || !customPrompt.trim()} 
            className={primaryButtonClass}
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Apply
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditControls;
