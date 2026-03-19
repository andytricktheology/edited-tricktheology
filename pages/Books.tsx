
import React from 'react';
import { useData } from '../context/DataContext';

const Books: React.FC = () => {
  const { books } = useData();
  
  const getButtonLabel = (platform: string) => {
    switch(platform) {
      case 'Amazon': return 'BUY ON AMAZON KDP';
      case 'Google Play': return 'GET ON GOOGLE PLAY';
      case 'PDF Download': return 'DOWNLOAD MANUSCRIPT';
      default: return 'GET THE REVELATION';
    }
  };

  const shareOnTwitter = (title: string) => {
    const text = encodeURIComponent(`I just discovered a profound revelation in "${title}" from Trick Theology. Unseal the truth here:`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareOnLinkedIn = (title: string) => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <header className="mb-24 text-center">
        <div className="inline-block p-1 mb-6 rounded-full gradient-bg">
          <div className="px-6 py-1 bg-white dark:bg-slate-950 rounded-full">
            <span className="text-[10px] font-orbitron font-black tracking-[0.4em] text-brand-start uppercase">Authorized Manuscripts</span>
          </div>
        </div>
        <h1 className="font-orbitron font-black text-6xl mb-6 wipe-text block uppercase tracking-tighter">BIBLICAL INTEL</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto uppercase text-xs tracking-[0.2em] font-bold leading-relaxed">
          Prophetic scripts and deep-dive research unsealing the truth for the final generation.
        </p>
      </header>

      <div className="space-y-32">
        {books.map((book, idx) => (
          <div 
            key={book.id} 
            className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16`}
          >
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative group">
                {/* Holographic Aura */}
                <div className="absolute -inset-10 bg-brand-start/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-start/40 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity rounded-lg"></div>
                
                <img 
                  src={book.image} 
                  alt={book.title} 
                  className="relative z-10 w-full max-w-[340px] rounded-xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.9)] transform group-hover:scale-[1.03] group-hover:-rotate-1 transition-all duration-500 border border-white/5" 
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <div className="mb-4 flex items-center justify-center md:justify-start gap-3">
                <span className="h-px w-8 bg-brand-start"></span>
                <span className="text-brand-start font-orbitron font-bold text-[10px] tracking-[0.5em] uppercase">Archive {idx + 1}</span>
              </div>
              <h2 className="font-orbitron font-black text-5xl mb-3 tracking-tight uppercase leading-none">{book.title}</h2>
              <h3 className="font-orbitron text-lg text-slate-400 mb-8 font-medium uppercase tracking-[0.3em] border-b border-slate-800 pb-4 inline-block">{book.subtitle}</h3>
              
              <div 
                className="text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-light prose prose-invert max-w-none prose-p:text-slate-400 dark:prose-p:text-slate-400 prose-headings:font-orbitron prose-headings:uppercase prose-p:mb-4"
                dangerouslySetInnerHTML={{ __html: book.description }}
              />
              
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-6">
                <a 
                  href={book.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-10 py-5 gradient-bg text-white font-orbitron font-bold rounded-2xl hover:scale-105 transition-all flex items-center overflow-hidden shadow-2xl shadow-brand-start/30"
                >
                  <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10 mr-3 tracking-[0.15em]">{getButtonLabel(book.platform)}</span>
                  <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-orbitron font-bold text-slate-600 uppercase tracking-widest mr-2 hidden sm:block">Broadcast:</span>
                  
                  {/* Twitter */}
                  <button 
                    onClick={() => shareOnTwitter(book.title)}
                    className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-brand-start hover:text-brand-start transition-all group/share"
                    title="Share on X (Twitter)"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </button>

                  {/* Facebook */}
                  <button 
                    onClick={() => shareOnFacebook()}
                    className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-brand-start hover:text-brand-start transition-all group/share"
                    title="Share on Facebook"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>

                  {/* LinkedIn */}
                  <button 
                    onClick={() => shareOnLinkedIn(book.title)}
                    className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:border-brand-start hover:text-brand-start transition-all group/share"
                    title="Share on LinkedIn"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
