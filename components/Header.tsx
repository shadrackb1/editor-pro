
import React from 'react';
import { Sparkles, Image as ImageIcon, Wand2 } from 'lucide-react';

type ActiveTab = 'editor' | 'generator';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const inactiveTabClass = "cursor-pointer py-2 px-4 text-gray-500 hover:text-white transition-colors duration-200 text-sm font-medium";
  const activeTabClass = "cursor-pointer py-2 px-4 text-white border-b-2 border-white transition-colors duration-200 text-sm font-bold";

  return (
    <header className="bg-black/90 backdrop-blur-md sticky top-0 z-20 w-full p-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-white" />
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase">
            QUICK<span className="text-gray-500">EDIT</span>
          </h1>
        </div>
        <nav className="flex space-x-2 md:space-x-4">
          <button 
            onClick={() => setActiveTab('editor')} 
            className={activeTab === 'editor' ? activeTabClass : inactiveTabClass}
          >
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Editor</span>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('generator')} 
            className={activeTab === 'generator' ? activeTabClass : inactiveTabClass}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Generator</span>
            </div>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
