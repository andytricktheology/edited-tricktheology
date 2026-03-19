
import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { BlogCategory, BlogPost, Comment } from '../types';
import NeuralSpeechPlayer from '../components/NeuralSpeechPlayer';
import { GoogleGenAI } from "@google/genai";

const categories: BlogCategory[] = [
  'Wisdom', 'Truth', 'Secrets', 'Theological Tricks', 'Prophecy', 'Global Politics', 'Names and Codes'
];

const Blog: React.FC = () => {
  const { posts, comments, addComment } = useData();
  const { showToast } = useToast();
  const [activeCategory, setActiveCategory] = useState<BlogCategory | 'All'>('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // AI Summary state
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Comment form state
  const [commentForm, setCommentForm] = useState({ user: '', text: '' });

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const postComments = selectedPost 
    ? comments.filter(c => c.postId === selectedPost.id && c.status === 'approved') 
    : [];

  useEffect(() => {
    // Reset summary when selected post changes
    setSummary(null);
  }, [selectedPost]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost) return;
    
    addComment({
      postId: selectedPost.id,
      user: commentForm.user,
      text: commentForm.text
    });
    
    setCommentForm({ user: '', text: '' });
    showToast("Signal Buffered. Awaiting Admin Clearance for your insight.", "success");
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const generateNeuralSummary = async () => {
    if (!selectedPost) return;
    
    setIsSummarizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const cleanContent = stripHtml(selectedPost.content);
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a senior theological analyst. Create a 2-sentence SEO-active summary of the following biblical revelation titled "${selectedPost.title}". Focus on the core 'unsealed' truth and use high-impact prophetic language suitable for metadata. 
        
        Content: ${cleanContent.substring(0, 4000)}`,
        config: {
          temperature: 0.7,
          topP: 0.8,
        }
      });

      const text = response.text;
      if (text) {
        setSummary(text);
        showToast("Neural Abstract Decrypted.", "success");
      }
    } catch (error) {
      console.error("Summarization failed:", error);
      showToast("Neural link unstable. Could not decrypt summary.", "error");
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen">
      <header className="mb-16 text-center">
        <h1 className="font-orbitron font-black text-5xl mb-4 wipe-text inline-block uppercase text-white">THE BLOG</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Deep dives into biblical mysteries, world events, and theological revelations.
        </p>
      </header>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeCategory === 'All' 
            ? 'gradient-bg text-white shadow-lg' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          All Posts
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === cat 
              ? 'gradient-bg text-white shadow-lg' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <article 
            key={post.id} 
            onClick={() => setSelectedPost(post)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden hover:-translate-y-2 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-brand-start/10"
          >
            <div className="aspect-video overflow-hidden relative">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="p-8">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-[10px] font-orbitron font-bold text-brand-start uppercase tracking-widest">{post.category}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">• {new Date(post.date).toLocaleDateString()}</span>
              </div>
              <h3 className="font-orbitron font-bold text-xl mb-4 leading-snug group-hover:text-brand-start transition-colors uppercase tracking-tight">
                {post.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <button className="text-[10px] font-orbitron font-black text-brand-start group-hover:underline flex items-center tracking-widest uppercase">
                DECRYPT FULL DATA
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Post Modal / Slide-over */}
      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-wipe-in">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setSelectedPost(null)}></div>
          <div className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 z-[110] w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-white hover:bg-brand-start transition-all flex items-center justify-center font-bold"
            >
              ✕
            </button>
            
            <div className="overflow-y-auto custom-scrollbar">
              <div className="relative h-64 md:h-96">
                <img src={selectedPost.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <div className="absolute bottom-12 left-8 md:left-12 right-12">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="px-4 py-1 gradient-bg text-white rounded-full text-[10px] font-orbitron font-bold uppercase tracking-widest">
                      {selectedPost.category}
                    </span>
                    <NeuralSpeechPlayer text={selectedPost.content} title={selectedPost.title} />
                  </div>
                  <h2 className="font-orbitron font-black text-3xl md:text-5xl text-white uppercase tracking-tighter leading-none">
                    {selectedPost.title}
                  </h2>
                </div>
              </div>
              
              <div className="p-8 md:p-16 max-w-4xl mx-auto">
                
                {/* AI Summary Section */}
                <div className="mb-12 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-lg shadow-brand-start/20">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="text-[10px] font-orbitron font-black text-brand-start uppercase tracking-[0.3em]">Neural Decryption Hub</span>
                    </div>
                    
                    {!summary && (
                      <button 
                        onClick={generateNeuralSummary}
                        disabled={isSummarizing}
                        className={`text-[9px] font-orbitron font-bold px-4 py-2 border rounded-full transition-all ${
                          isSummarizing 
                          ? 'border-brand-start/20 text-brand-start animate-pulse cursor-wait' 
                          : 'border-brand-start/50 text-brand-start hover:bg-brand-start hover:text-white'
                        } uppercase tracking-widest`}
                      >
                        {isSummarizing ? 'Scanning Archives...' : 'Generate Neural Summary'}
                      </button>
                    )}
                  </div>

                  {summary ? (
                    <aside 
                      role="doc-abstract"
                      className="relative bg-slate-900/50 border border-brand-start/30 p-8 rounded-3xl backdrop-blur-md animate-wipe-in overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                         <svg className="w-16 h-16 text-brand-start" fill="currentColor" viewBox="0 0 24 24">
                           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                         </svg>
                      </div>
                      <h4 className="text-[10px] font-orbitron font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-brand-start animate-ping"></span>
                        Decrypted Abstract:
                      </h4>
                      <p className="text-lg md:text-xl text-slate-300 font-light leading-relaxed italic relative z-10">
                        "{summary}"
                      </p>
                      <div className="mt-6 pt-6 border-t border-slate-800 flex justify-between items-center">
                        <span className="text-[8px] font-orbitron font-bold text-slate-600 uppercase tracking-widest">SEO Status: Metadata Active</span>
                        <button onClick={() => setSummary(null)} className="text-[8px] font-bold text-slate-500 hover:text-brand-start uppercase tracking-widest">Re-Scan</button>
                      </div>
                    </aside>
                  ) : (
                    <div className="text-xl text-brand-start font-light italic mb-12 leading-relaxed border-l-4 border-brand-start pl-6 opacity-60">
                      {selectedPost.excerpt}
                    </div>
                  )}
                </div>

                <div 
                  className="prose prose-invert prose-lg max-w-none 
                    prose-headings:font-orbitron prose-headings:uppercase prose-headings:tracking-tight 
                    prose-h1:text-brand-start prose-h2:text-white prose-p:text-slate-400 dark:prose-p:text-slate-400
                    prose-p:leading-relaxed prose-a:text-brand-start hover:prose-a:text-white transition-colors
                    prose-img:rounded-[32px] prose-img:shadow-2xl mb-20"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />

                {/* Feedback Matrix Section */}
                <section className="mt-20 pt-16 border-t border-slate-800">
                  <h3 className="font-orbitron font-bold text-2xl mb-8 uppercase tracking-widest text-white">Community Insights</h3>
                  
                  {/* Submission Form */}
                  <div className="bg-slate-950/50 border border-slate-800 rounded-3xl p-8 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-start/10 rounded-full blur-3xl"></div>
                    
                    <h4 className="font-orbitron font-bold text-sm mb-6 text-brand-start uppercase tracking-[0.2em]">Add to Signal Chain</h4>
                    
                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Your Identity (Name/Email)" 
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-brand-start outline-none transition-all"
                        value={commentForm.user}
                        onChange={e => setCommentForm({...commentForm, user: e.target.value})}
                        required
                      />
                      <textarea 
                        placeholder="Share your theological perspective..." 
                        rows={4}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 text-white focus:ring-2 focus:ring-brand-start outline-none transition-all resize-none"
                        value={commentForm.text}
                        onChange={e => setCommentForm({...commentForm, text: e.target.value})}
                        required
                      ></textarea>
                      <button 
                        type="submit" 
                        className="w-full py-4 gradient-bg text-white font-orbitron font-bold rounded-xl hover:scale-[1.01] transition-all shadow-xl shadow-brand-start/20 uppercase tracking-widest text-[10px]"
                      >
                        Authorize Insight Submission
                      </button>
                    </form>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {postComments.length === 0 ? (
                      <p className="text-slate-500 italic text-center py-8 border border-dashed border-slate-800 rounded-3xl uppercase text-[10px] tracking-widest">
                        No cleared signals in this node. Be the first to broadcast.
                      </p>
                    ) : (
                      postComments.map(comment => (
                        <div key={comment.id} className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-3xl backdrop-blur-md">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-orbitron font-bold text-brand-start text-xs uppercase tracking-widest">{comment.user}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{new Date(comment.date).toLocaleDateString()}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-brand-start/10 flex items-center justify-center text-brand-start text-xs">💬</div>
                          </div>
                          <p className="text-slate-300 italic leading-relaxed">"{comment.text}"</p>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
