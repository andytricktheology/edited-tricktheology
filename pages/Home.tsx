
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const headlines = [
  "Unlocking Biblical Secrets",
  "Unsealing Biblical Secrets",
  "Unlocking Biblical Truths",
  "Exposing Theological Tricks",
  "Liberating the Masses"
];

const Home: React.FC = () => {
  const { merch, posts } = useData();
  const [displayText, setDisplayText] = useState("");
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const latestPosts = posts.slice(0, 4);

  useEffect(() => {
    const currentHeadline = headlines[headlineIndex];
    const typeSpeed = isDeleting ? 50 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentHeadline.length) {
        setDisplayText(prev => prev + currentHeadline[charIndex]);
        setCharIndex(prev => prev + 1);
      } else if (isDeleting && charIndex > 0) {
        setDisplayText(prev => prev.slice(0, -1));
        setCharIndex(prev => prev - 1);
      } else if (!isDeleting && charIndex === currentHeadline.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setHeadlineIndex(prev => (prev + 1) % headlines.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, headlineIndex]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-start/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-end/30 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-orbitron font-black text-5xl md:text-8xl mb-8 leading-tight tracking-tighter">
            <span className="wipe-text block animate-wipe-in">
              {displayText}
              <span className="typing-cursor"></span>
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            The Bible is clear; the theology is the trick. Reject religious assumptions, and the truth will rain like a torrent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/blog" className="px-8 py-4 gradient-bg text-white font-orbitron font-bold rounded-full hover:scale-105 transition-transform shadow-xl shadow-brand-start/20">
              EXPLORE TRUTH
            </Link>
            <Link to="/books" className="px-8 py-4 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-orbitron font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
              VIEW BOOKS
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 w-full animate-wipe-in">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 className="font-orbitron font-bold text-xs tracking-[0.4em] text-brand-start mb-2 uppercase">Neural Intel Feed</h2>
            <h3 className="font-orbitron font-black text-4xl md:text-5xl uppercase tracking-tighter">Latest Revelations</h3>
          </div>
          <Link to="/blog" className="group flex items-center gap-3 text-[10px] font-orbitron font-bold text-slate-500 hover:text-brand-start transition-all uppercase tracking-widest bg-slate-100 dark:bg-slate-900/50 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-800">
            Access Full Archives
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestPosts.map((post) => (
            <Link 
              key={post.id} 
              to="/blog" 
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] overflow-hidden hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-brand-start/15"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                   <span className="text-[8px] font-orbitron font-bold text-brand-start uppercase tracking-widest mb-1">DECRYPTING...</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                   <span className="text-[9px] font-orbitron font-bold text-brand-start/80 uppercase tracking-widest">{post.category}</span>
                   <span className="text-[8px] text-slate-500 font-bold uppercase">{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <h4 className="font-orbitron font-bold text-base mb-3 leading-snug group-hover:text-brand-start transition-colors uppercase tracking-tight line-clamp-2">
                  {post.title}
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-orbitron font-black text-brand-start uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform flex items-center gap-2">
                    READ MORE
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>

                <div className="mt-4 h-0.5 w-0 group-hover:w-full bg-brand-start transition-all duration-500"></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Merch Strip */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24 overflow-hidden border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 mb-12 flex justify-between items-end">
          <div>
            <h2 className="font-orbitron font-bold text-xs tracking-[0.4em] text-brand-start mb-2 uppercase">Physical Artifacts</h2>
            <h3 className="font-orbitron font-black text-3xl uppercase tracking-tighter">Trick Theology Apparel</h3>
          </div>
          <Link to="/merch" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-brand-start transition-colors border-b border-slate-300 dark:border-slate-700 pb-1">Browse All</Link>
        </div>
        
        <div className="relative flex whitespace-nowrap overflow-hidden">
          <div className="flex animate-slide-left hover:[animation-play-state:paused]">
            {[...merch, ...merch].map((item, idx) => (
              <a
                key={`${item.id}-${idx}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mx-4 w-64 md:w-80 bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-lg card-glow transition-all border border-slate-200 dark:border-slate-800"
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold text-lg leading-tight mb-1">{item.title}</p>
                    <p className="text-brand-start font-orbitron font-bold text-[10px] uppercase tracking-widest">
                      View on {item.platform}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 max-w-5xl mx-auto px-4 text-center">
        <div className="inline-block p-1 mb-8 rounded-full gradient-bg">
          <div className="px-4 py-1 bg-white dark:bg-slate-950 rounded-full">
            <span className="text-xs font-orbitron font-bold tracking-[0.3em] text-brand-start uppercase">VISION</span>
          </div>
        </div>
        <h2 className="font-orbitron font-bold text-4xl mb-6">Inspired to Unseal the ancient Secrets.</h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed italic font-light">
          "The secrets of the ages were sealed in ancient Israel. They are encoded in the fabric of our reality, waiting for the true Israelites with the keys to unseal them. They were sealed by our ancestors, waiting to be unsealed by modern Israelites."
        </p>
      </section>
    </div>
  );
};

export default Home;
