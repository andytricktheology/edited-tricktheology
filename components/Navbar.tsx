
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BRAND_LOGO_URL } from '../constants';
import { useData } from '../context/DataContext';
import { BlogPost, PodcastEpisode, Book, MerchItem } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNeuralLoading, setIsNeuralLoading] = useState(false);
  
  const [results, setResults] = useState<{
    posts: BlogPost[];
    podcasts: PodcastEpisode[];
    books: Book[];
    merch: MerchItem[];
  }>({ posts: [], podcasts: [], books: [], merch: [] });

  const [aiMatches, setAiMatches] = useState<{
    postIds: string[];
    podcastIds: string[];
    bookIds: string[];
    merchIds: string[];
  }>({ postIds: [], podcastIds: [], bookIds: [], merchIds: [] });

  const { posts, podcasts, books, merch } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: 'Podcast', path: '/podcast' },
    { name: 'Books', path: '/books' },
    { name: 'Merch', path: '/merch' },
    { name: 'About', path: '/about' },
    { name: 'Connect', path: '/connect' },
  ];

  const isActive = (path: string) => location.pathname === path;

  // Helper function to highlight matching keywords
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return (
      <>
        {parts.map((part, i) => 
          regex.test(part) ? (
            <span key={i} className="text-brand-start font-black bg-brand-start/10 rounded-sm px-0.5 underline decoration-brand-start/30 underline-offset-2">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Simple Keyword Search Logic
  useEffect(() => {
    if (searchQuery.length < 2) {
      setResults({ posts: [], podcasts: [], books: [], merch: [] });
      setAiMatches({ postIds: [], podcastIds: [], bookIds: [], merchIds: [] });
      return;
    }

    const q = searchQuery.toLowerCase();
    
    const filteredPosts = posts.filter(p => 
      p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
    ).slice(0, 3);

    const filteredPodcasts = podcasts.filter(p => 
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    ).slice(0, 3);

    const filteredBooks = books.filter(b => 
      b.title.toLowerCase().includes(q) || b.subtitle.toLowerCase().includes(q) || b.description.toLowerCase().includes(q)
    ).slice(0, 3);

    const filteredMerch = merch.filter(m => 
      m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    ).slice(0, 3);

    setResults({ posts: filteredPosts, podcasts: filteredPodcasts, books: filteredBooks, merch: filteredMerch });
  }, [searchQuery, posts, podcasts, books, merch]);

  // Deep Neural Search Logic using Gemini
  const performNeuralScan = async () => {
    if (searchQuery.length < 3) return;
    
    setIsNeuralLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const searchableContext = {
        posts: posts.map(p => ({ id: p.id, title: p.title, context: p.excerpt })),
        podcasts: podcasts.map(p => ({ id: p.id, title: p.title, context: p.description })),
        books: books.map(b => ({ id: b.id, title: b.title, context: b.subtitle })),
        merch: merch.map(m => ({ id: m.id, title: m.title, context: m.description }))
      };

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this theological query: "${searchQuery}". Match it against the following content archives and return only the IDs of the most relevant items in JSON format.
        
        Archives:
        ${JSON.stringify(searchableContext)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              postIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              podcastIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              bookIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              merchIds: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["postIds", "podcastIds", "bookIds", "merchIds"]
          }
        }
      });

      const aiResultsStr = response.text;
      if (aiResultsStr) {
        const aiResults = JSON.parse(aiResultsStr);
        setAiMatches(aiResults);

        const mergedPosts = Array.from(new Set([...posts.filter(p => aiResults.postIds.includes(p.id)), ...results.posts])).slice(0, 5);
        const mergedPodcasts = Array.from(new Set([...podcasts.filter(p => aiResults.podcastIds.includes(p.id)), ...results.podcasts])).slice(0, 5);
        const mergedBooks = Array.from(new Set([...books.filter(b => aiResults.bookIds.includes(b.id)), ...results.books])).slice(0, 5);
        const mergedMerch = Array.from(new Set([...merch.filter(m => aiResults.merchIds.includes(m.id)), ...results.merch])).slice(0, 5);

        setResults({ posts: mergedPosts, podcasts: mergedPodcasts, books: mergedBooks, merch: mergedMerch });
      }
    } catch (error) {
      console.error("Neural Scan failed:", error);
    } finally {
      setIsNeuralLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setAiMatches({ postIds: [], podcastIds: [], bookIds: [], merchIds: [] });
  };

  const navigateTo = (path: string) => {
    navigate(path);
    closeSearch();
  };

  const isAiMatched = (type: keyof typeof aiMatches, id: string) => aiMatches[type].includes(id);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 overflow-hidden rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900">
                <img 
                  src={BRAND_LOGO_URL} 
                  alt="Trick Theology Logo" 
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              <span className="font-orbitron font-bold text-lg hidden lg:block tracking-tighter uppercase">
                <span className="text-brand-start">TRICK</span> THEOLOGY
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative" ref={searchRef}>
              <div className={`flex items-center bg-slate-100 dark:bg-slate-900 rounded-full border transition-all duration-300 ${isSearchOpen ? 'w-64 border-brand-start/50' : 'w-10 border-transparent'}`}>
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-slate-500 hover:text-brand-start transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {isSearchOpen && (
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask a theological question..."
                    className="bg-transparent border-none outline-none text-xs font-orbitron font-bold text-slate-800 dark:text-white w-full pr-4 placeholder:text-slate-500"
                    onKeyDown={(e) => e.key === 'Enter' && performNeuralScan()}
                  />
                )}
              </div>

              {isSearchOpen && searchQuery.length >= 2 && (
                <div className="absolute top-12 right-0 w-[480px] bg-white dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl p-6 animate-wipe-in max-h-[85vh] overflow-y-auto custom-scrollbar">
                  
                  <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={performNeuralScan}
                      disabled={isNeuralLoading}
                      className={`w-full py-3 rounded-2xl flex items-center justify-center gap-3 font-orbitron font-bold text-[10px] tracking-widest transition-all ${
                        isNeuralLoading 
                          ? 'bg-brand-start/5 text-brand-start border border-brand-start/20 cursor-wait' 
                          : 'gradient-bg text-white hover:scale-[1.02] shadow-xl shadow-brand-start/20'
                      }`}
                    >
                      {isNeuralLoading ? (
                        <>
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-start animate-ping"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-start animate-ping delay-75"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-start animate-ping delay-150"></span>
                          </div>
                          NEURAL SCANNING ARCHIVES...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          ACTIVATE DEEP NEURAL SCAN
                        </>
                      )}
                    </button>
                    <p className="text-[8px] text-center mt-3 text-slate-500 font-bold uppercase tracking-widest opacity-50">AI-powered semantic matching of the archives</p>
                  </div>

                  <div className="space-y-10">
                    {/* Blog Results */}
                    {results.posts.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-orbitron font-black text-brand-start mb-4 tracking-[0.3em] uppercase opacity-50 flex items-center justify-between">
                          Blog Nodes
                        </h4>
                        <div className="space-y-6">
                          {results.posts.map(post => (
                            <button key={post.id} onClick={() => navigateTo('/blog')} className="w-full text-left group">
                              <div className="flex justify-between items-start gap-2 mb-1.5">
                                <div className="flex-grow">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[8px] font-black text-brand-start uppercase tracking-widest">{post.category}</span>
                                    {isAiMatched('postIds', post.id) && (
                                      <span className="bg-brand-start/10 text-brand-start text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-widest border border-brand-start/20 shrink-0">Neural Match</span>
                                    )}
                                  </div>
                                  <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-brand-start transition-colors uppercase leading-tight">
                                    {highlightText(post.title, searchQuery)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                                {highlightText(post.excerpt, searchQuery)}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Podcast Results */}
                    {results.podcasts.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-orbitron font-black text-brand-start mb-4 tracking-[0.3em] uppercase opacity-50">Audio Streams</h4>
                        <div className="space-y-6">
                          {results.podcasts.map(ep => (
                            <button key={ep.id} onClick={() => navigateTo('/podcast')} className="w-full text-left group">
                               <div className="flex justify-between items-start gap-2 mb-1.5">
                                <div className="flex-grow">
                                   <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Episode {ep.episodeNumber} • {ep.platform}</span>
                                    {isAiMatched('podcastIds', ep.id) && (
                                      <span className="bg-brand-start/10 text-brand-start text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-widest border border-brand-start/20 shrink-0">Neural Match</span>
                                    )}
                                  </div>
                                  <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-brand-start transition-colors uppercase leading-tight">
                                    {highlightText(ep.title, searchQuery)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 italic">
                                "{highlightText(ep.description, searchQuery)}"
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Book Results */}
                    {results.books.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-orbitron font-black text-brand-start mb-4 tracking-[0.3em] uppercase opacity-50">Authorized Manuscripts</h4>
                        <div className="space-y-6">
                          {results.books.map(book => (
                            <button key={book.id} onClick={() => navigateTo('/books')} className="w-full text-left group">
                              <div className="flex justify-between items-start gap-2 mb-1.5">
                                <div className="flex-grow">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Buy on {book.platform}</span>
                                    {isAiMatched('bookIds', book.id) && (
                                      <span className="bg-brand-start/10 text-brand-start text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-widest border border-brand-start/20 shrink-0">Neural Match</span>
                                    )}
                                  </div>
                                  <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-brand-start transition-colors uppercase leading-tight">
                                    {highlightText(book.title, searchQuery)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mb-1">
                                {highlightText(book.subtitle, searchQuery)}
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                {highlightText(book.description, searchQuery)}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Merch Results */}
                    {results.merch.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-orbitron font-black text-brand-start mb-4 tracking-[0.3em] uppercase opacity-50">Physical Artifacts</h4>
                        <div className="space-y-6">
                          {results.merch.map(item => (
                            <button key={item.id} onClick={() => navigateTo('/merch')} className="w-full text-left group">
                              <div className="flex justify-between items-start gap-2 mb-1.5">
                                <div className="flex-grow">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{item.platform} Collection</span>
                                    {isAiMatched('merchIds', item.id) && (
                                      <span className="bg-brand-start/10 text-brand-start text-[8px] px-2 py-0.5 rounded font-black uppercase tracking-widest border border-brand-start/20 shrink-0">Neural Match</span>
                                    )}
                                  </div>
                                  <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-brand-start transition-colors uppercase leading-tight">
                                    {highlightText(item.title, searchQuery)}
                                  </p>
                                </div>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                {highlightText(item.description, searchQuery)}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {(Object.values(results) as any[]).every(arr => arr.length === 0) && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-200 dark:border-slate-800">
                          <span className="text-2xl opacity-20">📡</span>
                        </div>
                        <p className="text-xs font-orbitron font-bold text-slate-500 uppercase tracking-widest">No signals detected in the archive.</p>
                        <p className="text-[9px] text-slate-600 mt-2 uppercase tracking-widest font-black">Try activating the Deep Neural Scan</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[10px] font-orbitron font-bold tracking-widest uppercase transition-colors hover:text-brand-start ${
                  isActive(link.path) ? 'text-brand-start' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-2"></div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-brand-start transition-colors"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
             <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-brand-start transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300"
            >
              {isDarkMode ? '🌞' : '🌙'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-white dark:bg-slate-950 p-6 animate-wipe-in overflow-y-auto">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="flex-grow flex items-center bg-slate-100 dark:bg-slate-900 rounded-2xl px-4 border border-brand-start/30">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask the unsealed..."
                  className="w-full bg-transparent p-4 outline-none font-orbitron font-bold text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && performNeuralScan()}
                />
              </div>
              <button onClick={closeSearch} className="text-slate-500 font-bold">✕</button>
            </div>
            
            <button 
              onClick={performNeuralScan}
              disabled={isNeuralLoading}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-orbitron font-bold text-[10px] tracking-widest transition-all ${
                isNeuralLoading 
                  ? 'bg-brand-start/5 text-brand-start border border-brand-start/20' 
                  : 'gradient-bg text-white'
              }`}
            >
              {isNeuralLoading ? 'SCANNING...' : 'ACTIVATE NEURAL SCAN'}
            </button>
          </div>

          <div className="space-y-10">
            {(Object.values(results) as any[]).some(arr => arr.length > 0) ? (
              <>
                {results.posts.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-orbitron font-black text-brand-start mb-6 tracking-[0.4em] uppercase">Blog Nodes</h4>
                    <div className="space-y-8">
                      {results.posts.map(post => (
                        <button key={post.id} onClick={() => navigateTo('/blog')} className="w-full text-left">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-bold uppercase text-brand-start text-[10px]">{post.category}</p>
                            {isAiMatched('postIds', post.id) && <span className="bg-brand-start/20 text-brand-start text-[8px] px-1.5 rounded font-black">AI Match</span>}
                          </div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white uppercase leading-tight mb-1">
                            {highlightText(post.title, searchQuery)}
                          </p>
                          <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">
                            {highlightText(post.excerpt, searchQuery)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {results.podcasts.length > 0 && (
                   <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-[10px] font-orbitron font-black text-brand-start mb-6 tracking-[0.4em] uppercase">Audio Streams</h4>
                    <div className="space-y-8">
                      {results.podcasts.map(ep => (
                        <button key={ep.id} onClick={() => navigateTo('/podcast')} className="w-full text-left">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">EPISODE {ep.episodeNumber} • {ep.platform}</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white uppercase leading-tight mb-1">
                            {highlightText(ep.title, searchQuery)}
                          </p>
                          <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 italic">
                            {highlightText(ep.description, searchQuery)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.books.length > 0 && (
                   <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-[10px] font-orbitron font-black text-brand-start mb-6 tracking-[0.4em] uppercase">Manuscripts</h4>
                    <div className="space-y-8">
                      {results.books.map(book => (
                        <button key={book.id} onClick={() => navigateTo('/books')} className="w-full text-left">
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{book.platform}</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white uppercase leading-tight mb-1">
                            {highlightText(book.title, searchQuery)}
                          </p>
                          <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">
                            {highlightText(book.description, searchQuery)}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-slate-500 font-orbitron font-bold text-[10px] uppercase tracking-widest pt-10">Search the Veil...</p>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 animate-wipe-in">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-xs font-orbitron font-bold uppercase tracking-[0.2em] transition-all ${
                  isActive(link.path)
                    ? 'bg-brand-start/10 text-brand-start'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
