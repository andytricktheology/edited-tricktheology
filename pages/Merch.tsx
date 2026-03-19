
import React from 'react';
import { useData } from '../context/DataContext';

const Merch: React.FC = () => {
  const { merch } = useData();
  
  // Ensure merch is always treated as an array and filter out any potential corrupt data
  const validMerch = Array.isArray(merch) ? merch : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
      <header className="mb-20 text-center animate-wipe-in">
        <div className="inline-block p-1 mb-6 rounded-full gradient-bg">
          <div className="px-6 py-1 bg-white dark:bg-slate-950 rounded-full">
            <span className="text-[10px] font-orbitron font-black tracking-[0.4em] text-brand-start uppercase">Physical Assets</span>
          </div>
        </div>
        <h1 className="font-orbitron font-black text-4xl md:text-6xl mb-4 wipe-text inline-block tracking-tighter uppercase">ARTIFACT ARCHIVE</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto uppercase text-[10px] md:text-xs tracking-[0.3em] font-bold">
          High-performance theological apparel. Physical artifacts of the digital prophecy.
        </p>
      </header>

      {validMerch.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center animate-wipe-in">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 flex items-center justify-center text-4xl mb-8 opacity-50">
            📦
          </div>
          <h3 className="font-orbitron font-bold text-xl mb-2 text-slate-400 uppercase tracking-widest">No Artifacts Detected</h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest max-w-xs">
            The neural network has not yet broadcasted any physical assets.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 animate-wipe-in">
          {validMerch.map((item) => (
            <div 
              key={item.id || Math.random().toString()} 
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(201,0,255,0.2)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
            >
              <div className="aspect-[4/5] overflow-hidden bg-slate-100 dark:bg-slate-950 relative">
                <div className="absolute inset-0 bg-brand-start/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                <img 
                  src={item.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000'} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1000';
                  }}
                />
                <div className="absolute top-4 right-4 z-20">
                  <span className="px-3 py-1 bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[9px] font-orbitron font-bold text-brand-start rounded-full tracking-widest uppercase shadow-lg">
                    {item.platform || 'Verified Hub'}
                  </span>
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h3 className="font-orbitron font-bold text-lg mb-3 tracking-tight group-hover:text-brand-start transition-colors uppercase truncate">
                  {item.title || 'Untitled Artifact'}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-8 leading-relaxed italic line-clamp-2 flex-grow">
                  "{item.description || 'No data transmission for this artifact.'}"
                </p>
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center w-full py-4 bg-slate-950 border border-brand-start/20 text-brand-start font-orbitron font-black text-[10px] tracking-[0.2em] rounded-2xl hover:bg-brand-start hover:text-white hover:border-brand-start transition-all shadow-lg active:scale-95 uppercase"
                >
                  Acquire on {(item.platform || 'Platform').toUpperCase()}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Merch;
