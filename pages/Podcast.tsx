
import React from 'react';
import { useData } from '../context/DataContext';

const Podcast: React.FC = () => {
  const { podcasts } = useData();
  
  // Sort podcasts by episode number descending
  const sortedPodcasts = [...podcasts].sort((a, b) => b.episodeNumber - a.episodeNumber);

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
      <header className="mb-24 text-center animate-wipe-in">
        <div className="inline-block p-1 mb-6 rounded-full gradient-bg">
          <div className="px-6 py-1 bg-white dark:bg-slate-950 rounded-full">
            <span className="text-[10px] font-orbitron font-black tracking-[0.4em] text-brand-start uppercase">Neural Transmissions</span>
          </div>
        </div>
        <h1 className="font-orbitron font-black text-5xl md:text-7xl mb-6 wipe-text block tracking-tighter uppercase">NEURAL STREAM</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto uppercase text-[10px] md:text-xs tracking-[0.3em] font-bold leading-relaxed">
          Direct broadcasts unsealing ancient secrets. Decrypting reality through the audio frequency.
        </p>
      </header>

      <div className="grid gap-20 max-w-5xl mx-auto">
        {sortedPodcasts.length === 0 ? (
          <div className="py-32 text-center bg-slate-900/20 rounded-[40px] border border-dashed border-slate-800 animate-wipe-in">
             <h3 className="font-orbitron font-bold text-xl text-slate-500 uppercase tracking-widest mb-4">No Signals Detected</h3>
             <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">The command center has not authorized any neural broadcasts yet.</p>
          </div>
        ) : (
          sortedPodcasts.map((ep, idx) => (
            <div 
              key={ep.id} 
              className="group bg-white dark:bg-slate-900/40 backdrop-blur-3xl rounded-[40px] overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-brand-start/50 transition-all duration-700 shadow-2xl animate-wipe-in"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex flex-col lg:flex-row h-full">
                {/* Visual Identity */}
                <div className="lg:w-2/5 relative h-64 lg:h-auto overflow-hidden bg-slate-950">
                  <img 
                    src={ep.thumbnail || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=2070'} 
                    alt={ep.title} 
                    className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  <div className="absolute top-8 left-8">
                    <div className="w-16 h-16 rounded-2xl bg-brand-start/20 backdrop-blur-xl border border-brand-start/40 flex items-center justify-center font-orbitron font-black text-brand-start text-xl shadow-2xl">
                      #{ep.episodeNumber}
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8">
                     <span className="px-3 py-1 bg-slate-900/90 border border-slate-800 text-[9px] font-orbitron font-bold text-brand-start rounded-full tracking-widest uppercase mb-4 inline-block">
                      Broadcast Hub: {ep.platform}
                    </span>
                    <h3 className="font-orbitron font-black text-2xl text-white uppercase tracking-tight group-hover:text-brand-start transition-colors">
                      {ep.title}
                    </h3>
                  </div>
                </div>

                {/* Content & Playback */}
                <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-between bg-white/50 dark:bg-transparent">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="h-px w-8 bg-brand-start/30"></span>
                      <span className="text-[10px] font-orbitron font-bold text-slate-500 uppercase tracking-widest">Signal Decryption</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed italic line-clamp-6">
                      "{ep.description}"
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="aspect-video w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black shadow-inner">
                      <iframe
                        src={ep.embedUrl}
                        title={ep.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        ))}
        
        <div className="mt-20 p-12 rounded-[50px] bg-slate-950 border border-brand-start/20 text-center relative overflow-hidden animate-wipe-in">
          <div className="absolute top-0 left-0 w-full h-1 gradient-bg opacity-30"></div>
          <div className="relative z-10">
            <h4 className="font-orbitron font-black text-3xl mb-4 text-white uppercase tracking-tighter">Sync your Neural Node</h4>
            <p className="text-slate-500 text-xs mb-10 font-bold uppercase tracking-widest">Available across all verified theological frequencies.</p>
            <div className="flex flex-wrap justify-center gap-8">
              {['Apple Podcasts', 'Spotify', 'YouTube', 'RedCircle'].map(plat => (
                <a key={plat} href="#" className="flex items-center gap-3 text-[10px] font-orbitron font-bold text-slate-400 hover:text-brand-start transition-all uppercase tracking-[0.2em] group">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-brand-start transition-colors"></span>
                  {plat}
                </a>
              ))}
            </div>
          </div>
          <div className="absolute bottom-[-50px] right-[-50px] w-48 h-48 bg-brand-start/10 rounded-full blur-[80px]"></div>
        </div>
      </div>
    </div>
  );
};

export default Podcast;
