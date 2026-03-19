
import React, { useState, useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { BlogCategory, Page, BlogPost, Book, MerchItem, PodcastEpisode } from '../../types';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type } from "@google/genai";

// --- Shared Rich Text Editor Component ---
interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter Image URL:");
    if (!url) return;
    const align = prompt("Align (left, right, center):", "left");
    let style = "max-width: 40%; height: auto; border-radius: 1rem; margin: 1rem;";
    if (align === "left") style += " float: left; margin-left: 0;";
    else if (align === "right") style += " float: right; margin-right: 0;";
    else style = "max-width: 100%; display: block; margin: 1rem auto; float: none; border-radius: 1rem;";
    const imgTag = `<img src="${url}" style="${style}" alt="Blog Image" />`;
    exec("insertHTML", imgTag);
  };

  return (
    <div className="flex flex-col border border-slate-800 rounded-3xl overflow-hidden bg-slate-950">
      <div className="flex flex-wrap gap-1 p-3 bg-slate-900/50 border-b border-slate-800 backdrop-blur-xl sticky top-0 z-10">
        <button type="button" onClick={() => exec('bold')} title="Bold" className="w-8 h-8 flex items-center justify-center hover:bg-brand-start/20 rounded-lg transition-colors text-xs font-bold border border-slate-800">B</button>
        <button type="button" onClick={() => exec('italic')} title="Italic" className="w-8 h-8 flex items-center justify-center hover:bg-brand-start/20 rounded-lg transition-colors text-xs italic border border-slate-800">I</button>
        <button type="button" onClick={() => exec('underline')} title="Underline" className="w-8 h-8 flex items-center justify-center hover:bg-brand-start/20 rounded-lg transition-colors text-xs underline border border-slate-800">U</button>
        <button type="button" onClick={() => exec('strikeThrough')} title="Strikethrough" className="w-8 h-8 flex items-center justify-center hover:bg-brand-start/20 rounded-lg transition-colors text-xs line-through border border-slate-800">S</button>
        <div className="w-px h-6 bg-slate-800 self-center mx-2"></div>
        <button type="button" onClick={() => exec('formatBlock', 'H1')} className="px-2 h-8 flex items-center justify-center hover:bg-brand-start/20 rounded-lg transition-colors text-[10px] font-black border border-slate-800">H1</button>
        <button type="button" onClick={() => exec('formatBlock', 'H2')} className="px-2 h-8 flex items-center justify-center hover:bg-brand-start/20 rounded-lg transition-colors text-[10px] font-black border border-slate-800">H2</button>
        <button type="button" onClick={() => exec('formatBlock', 'H3')} className="px-2 h-8 flex items-center justify-center hover:bg-brand-start/20 rounded-lg transition-colors text-[10px] font-black border border-slate-800">H3</button>
        <div className="w-px h-6 bg-slate-800 self-center mx-2"></div>
        <button type="button" onClick={() => colorInputRef.current?.click()} className="px-2 h-8 flex items-center justify-center hover:bg-brand-start/20 rounded-lg transition-colors flex items-center gap-1 border border-slate-800">
          <div className="w-3 h-3 rounded-full bg-brand-start border border-white/20"></div>
          <input type="color" ref={colorInputRef} className="hidden" onChange={(e) => exec('foreColor', e.target.value)} />
        </button>
        <button type="button" onClick={insertImage} className="px-2 h-8 flex items-center justify-center hover:bg-brand-start/20 rounded-lg transition-colors text-[10px] font-black border border-slate-800">IMG</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className="min-h-[300px] p-8 text-slate-300 outline-none prose prose-invert prose-lg max-w-none prose-headings:font-orbitron prose-h1:text-brand-start"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

// --- Main Dashboard ---
const Dashboard: React.FC = () => {
  const { 
    posts, podcasts, books, merch, comments, pages, adminConfig, logout,
    addPost, updatePost, addPodcast, deleteItem, updateAdmin, updatePage, addPage, addBook, addMerch, updateCommentStatus
  } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<Tab>('analytics');
  
  // File Refs
  const blogFileRef = useRef<HTMLInputElement>(null);
  const pageFileRef = useRef<HTMLInputElement>(null);
  const merchFileRef = useRef<HTMLInputElement>(null);
  const bookFileRef = useRef<HTMLInputElement>(null);
  const podFileRef = useRef<HTMLInputElement>(null);

  // --- Form States ---
  const [blogForm, setBlogForm] = useState({ title: '', category: 'Wisdom' as BlogCategory, content: '', excerpt: '', image: '' });
  const [pageForm, setPageForm] = useState({ title: '', slug: '', content: '', featuredImage: '', seoExcerpt: '' });
  const [merchForm, setMerchForm] = useState({ title: '', description: '', image: '', link: '', platform: 'TeePublic' as any });
  const [bookForm, setBookForm] = useState({ title: '', subtitle: '', description: '', image: '', buyLink: '', platform: 'Amazon' as any });
  const [podcastForm, setPodcastForm] = useState({ title: '', description: '', thumbnail: '', episodeNumber: podcasts.length + 1, sourceUrl: '', embedUrl: '', platform: 'YouTube' as any });
  const [securityForm, setSecurityForm] = useState({ email: adminConfig?.email || '', password: '' });

  // --- Editing State ---
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // --- Loading States ---
  const [isGeneratingPageAI, setIsGeneratingPageAI] = useState(false);
  const [isGeneratingMerchAI, setIsGeneratingMerchAI] = useState(false);
  const [isGeneratingBookAI, setIsGeneratingBookAI] = useState(false);
  const [isGeneratingPodAI, setIsGeneratingPodAI] = useState(false);

  // Reset form when switching tabs
  useEffect(() => {
    setEditingPageId(null);
    setEditingPostId(null);
    setPageForm({ title: '', slug: '', content: '', featuredImage: '', seoExcerpt: '' });
    setBlogForm({ title: '', category: 'Wisdom' as BlogCategory, content: '', excerpt: '', image: '' });
  }, [activeTab]);

  // --- Embed Logic for Podcasts ---
  useEffect(() => {
    const resolveEmbed = (url: string, platform: string) => {
      if (!url) return '';
      let embed = '';
      if (platform === 'YouTube') {
        const vid = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*u\/\w\/|embed\/))([^#&?]*)/);
        if (vid && vid[1]) embed = `https://www.youtube.com/embed/${vid[1]}`;
      } else if (platform === 'Spotify') {
        const eid = url.match(/episode\/([a-zA-Z0-9]+)/);
        if (eid && eid[1]) embed = `https://open.spotify.com/embed/episode/${eid[1]}`;
      } else if (platform === 'RedCircle') {
        const rid = url.match(/episodes\/([a-zA-Z0-9-]+)/);
        if (rid && rid[1]) embed = `https://redcircle.com/episodes/${rid[1]}/embed`;
      }
      return embed;
    };
    const resolved = resolveEmbed(podcastForm.sourceUrl, podcastForm.platform);
    if (resolved) setPodcastForm(prev => ({ ...prev, embedUrl: resolved }));
  }, [podcastForm.sourceUrl, podcastForm.platform]);

  // --- AI Neural Generators ---
  const generateAI = async (type: 'page' | 'merch' | 'book' | 'pod') => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let prompt = '';
    let setter: any = null;

    if (type === 'page') {
      if (!pageForm.content) return;
      setIsGeneratingPageAI(true);
      prompt = `Summarize this text in 1 prophetic sentence for SEO: ${pageForm.content.replace(/<[^>]*>?/gm, '').substring(0, 1000)}`;
      setter = (val: string) => setPageForm(prev => ({ ...prev, seoExcerpt: val }));
    } else if (type === 'merch') {
      if (!merchForm.title) return;
      setIsGeneratingMerchAI(true);
      prompt = `Create a mysterious 2-sentence product description for apparel titled "${merchForm.title}" for a brand called Trick Theology.`;
      setter = (val: string) => setMerchForm(prev => ({ ...prev, description: val }));
    } else if (type === 'book') {
      if (!bookForm.title) return;
      setIsGeneratingBookAI(true);
      prompt = `Create a mysterious subtitle and a 2-sentence blurb for a book titled "${bookForm.title}" about biblical secrets.`;
      setter = (val: string) => setBookForm(prev => ({ ...prev, description: val }));
    } else if (type === 'pod') {
      if (!podcastForm.title) return;
      setIsGeneratingPodAI(true);
      prompt = `Create a compelling 2-sentence summary for a podcast episode titled "${podcastForm.title}".`;
      setter = (val: string) => setPodcastForm(prev => ({ ...prev, description: val }));
    }

    try {
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { text: { type: Type.STRING } }, required: ["text"] } }
      });
      const data = JSON.parse(res.text);
      setter(data.text);
      showToast("Neural sync complete.", "success");
    } catch (e) { showToast("Sync failed.", "error"); }
    finally { setIsGeneratingPageAI(false); setIsGeneratingMerchAI(false); setIsGeneratingBookAI(false); setIsGeneratingPodAI(false); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'blog' | 'page' | 'merch' | 'book' | 'pod') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const data = reader.result as string;
      if (target === 'blog') setBlogForm(prev => ({ ...prev, image: data }));
      else if (target === 'page') setPageForm(prev => ({ ...prev, featuredImage: data }));
      else if (target === 'merch') setMerchForm(prev => ({ ...prev, image: data }));
      else if (target === 'book') setBookForm(prev => ({ ...prev, image: data }));
      else if (target === 'pod') setPodcastForm(prev => ({ ...prev, thumbnail: data }));
      showToast("Asset buffered.", "info");
    };
    reader.readAsDataURL(file);
  };

  // --- Page Action Handlers ---
  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPageId) {
      updatePage(editingPageId, pageForm);
      showToast("Node re-synchronized.", "success");
      setEditingPageId(null);
    } else {
      addPage(pageForm);
      showToast("New node unsealed.", "success");
    }
    setPageForm({ title: '', slug: '', content: '', featuredImage: '', seoExcerpt: '' });
  };

  const startEditPage = (page: Page) => {
    setEditingPageId(page.id);
    setPageForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      featuredImage: page.featuredImage,
      seoExcerpt: page.seoExcerpt
    });
    showToast(`Neural link to "${page.title}" active.`, "info");
    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Blog Action Handlers ---
  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPostId) {
      updatePost(editingPostId, blogForm);
      showToast("Revelation updated.", "success");
      setEditingPostId(null);
    } else {
      addPost(blogForm);
      showToast("Broadcast unsealed.", "success");
    }
    setBlogForm({ title: '', category: 'Wisdom', content: '', excerpt: '', image: '' });
  };

  const startEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setBlogForm({
      title: post.title,
      category: post.category,
      content: post.content,
      excerpt: post.excerpt,
      image: post.image
    });
    showToast(`Archived stream "${post.title}" loaded.`, "info");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSystemPage = (slug: string) => ['about', 'privacy-policy', 'terms-of-service'].includes(slug);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10 font-exo">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-orbitron font-black text-4xl mb-2 tracking-tight uppercase">Command Center</h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Protocol: <span className="text-slate-300">VEIL_ACTIVE</span></p>
          </div>
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl overflow-x-auto border border-slate-800 custom-scrollbar">
            {(['analytics', 'blog', 'podcasts', 'books', 'merch', 'pages', 'comments', 'security'] as Tab[]).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-xl text-[10px] font-orbitron font-bold uppercase transition-all whitespace-nowrap ${activeTab === tab ? 'gradient-bg text-white' : 'text-slate-500 hover:text-white'}`}>{tab}</button>
            ))}
          </div>
          <button onClick={logout} className="px-6 py-2 bg-red-500/10 text-red-500 rounded-xl font-orbitron font-bold text-[10px] uppercase">De-sync</button>
        </header>

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-wipe-in">
             <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 p-8 rounded-[40px] h-[400px]">
              <h3 className="font-orbitron font-bold text-xs uppercase tracking-[0.4em] text-slate-500 mb-8">Engagement Intensity</h3>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[{n:'M',v:400},{n:'T',v:700},{n:'W',v:500},{n:'T',v:900},{n:'F',v:600},{n:'S',v:1100},{n:'S',v:1000}]}>
                  <defs><linearGradient id="col" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c900ff" stopOpacity={0.3}/><stop offset="95%" stopColor="#c900ff" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} /><XAxis dataKey="n" stroke="#64748b" fontSize={10} /><YAxis stroke="#64748b" fontSize={10} /><Tooltip /><Area type="monotone" dataKey="v" stroke="#c900ff" strokeWidth={3} fill="url(#col)" /></AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[40px] flex flex-col justify-center text-center">
              <h3 className="font-orbitron font-bold text-xs uppercase tracking-[0.4em] text-slate-500 mb-8">System Status</h3>
              <div className="text-4xl font-orbitron font-black text-brand-start mb-2">98.4%</div>
              <p className="text-[10px] text-slate-500 uppercase font-black">Archive Integrity Stable</p>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-wipe-in">
            <div className="xl:col-span-2 bg-slate-900/50 border border-slate-800 p-8 md:p-12 rounded-[48px]">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-orbitron font-black text-2xl uppercase tracking-widest text-brand-start">
                  {editingPostId ? `Updating Revelation: ${blogForm.title}` : "Transcribe Revelation"}
                </h3>
                {editingPostId && (
                  <button 
                    onClick={() => { setEditingPostId(null); setBlogForm({title:'', category:'Wisdom', content:'', excerpt:'', image:''}); }}
                    className="text-[10px] font-orbitron font-bold text-slate-500 hover:text-white uppercase tracking-widest"
                  >
                    Cancel Recalibration
                  </button>
                )}
              </div>
              <form onSubmit={handleBlogSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" placeholder="Title" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} required />
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value as any})}><option>Wisdom</option><option>Truth</option><option>Secrets</option><option>Theological Tricks</option><option>Prophecy</option><option>Global Politics</option><option>Names and Codes</option></select>
                </div>
                <RichTextEditor content={blogForm.content} onChange={html => setBlogForm({...blogForm, content: html})} />
                <div className="flex gap-2">
                  <input type="text" className="flex-grow bg-slate-950 border border-slate-800 rounded-xl p-4" placeholder="Cover URL" value={blogForm.image} onChange={e => setBlogForm({...blogForm, image: e.target.value})} />
                  <input type="file" ref={blogFileRef} className="hidden" onChange={e => handleFileUpload(e, 'blog')} />
                  <button type="button" onClick={() => blogFileRef.current?.click()} className="px-6 bg-slate-800 rounded-xl font-bold">UPLOAD</button>
                </div>
                <button type="submit" className="w-full py-6 gradient-bg rounded-3xl font-orbitron font-black text-sm uppercase">
                  {editingPostId ? "Commit Updates" : "Broadcast Revelation"}
                </button>
              </form>
            </div>
            <div className="space-y-4">
              <h3 className="font-orbitron font-bold text-xs uppercase tracking-[0.4em] text-slate-600 mb-6">Archive Registry</h3>
              {posts.map(p => (
                <div key={p.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex justify-between items-center group transition-all">
                  <div className="max-w-[70%]">
                    <p className={`font-bold uppercase text-xs truncate ${editingPostId === p.id ? 'text-brand-start' : 'text-white'}`}>{p.title}</p>
                    <p className="text-[8px] text-slate-500 uppercase tracking-widest">{p.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEditPost(p)} 
                      className="px-3 py-1 bg-slate-800 rounded-lg text-[8px] font-orbitron font-bold uppercase hover:bg-brand-start hover:text-white transition-all opacity-0 group-hover:opacity-100"
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteItem('posts', p.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'pages' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-wipe-in">
            <div className="xl:col-span-2 bg-slate-900/50 border border-slate-800 p-8 md:p-12 rounded-[48px]">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-orbitron font-black text-2xl uppercase tracking-widest text-brand-start">
                  {editingPageId ? `Updating Node: ${pageForm.title}` : "Initialize Page"}
                </h3>
                {editingPageId && (
                  <button 
                    onClick={() => { setEditingPageId(null); setPageForm({title:'', slug:'', content:'', featuredImage:'', seoExcerpt:''}); }}
                    className="text-[10px] font-orbitron font-bold text-slate-500 hover:text-white uppercase tracking-widest"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              <form onSubmit={handlePageSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input 
                    type="text" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" 
                    placeholder="Title" 
                    value={pageForm.title} 
                    onChange={e => setPageForm({...pageForm, title: e.target.value, slug: editingPageId ? pageForm.slug : e.target.value.toLowerCase().replace(/ /g, '-')})} 
                    required 
                  />
                  <input 
                    type="text" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 disabled:opacity-50" 
                    placeholder="Slug" 
                    value={pageForm.slug} 
                    onChange={e => setPageForm({...pageForm, slug: e.target.value})} 
                    required 
                    disabled={editingPageId ? isSystemPage(pages.find(pg => pg.id === editingPageId)?.slug || '') : false}
                  />
                </div>
                <RichTextEditor content={pageForm.content} onChange={html => setPageForm({...pageForm, content: html})} />
                <div className="flex items-center gap-2">
                  <textarea className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl p-4 h-20 resize-none" placeholder="SEO Excerpt" value={pageForm.seoExcerpt} onChange={e => setPageForm({...pageForm, seoExcerpt: e.target.value})} />
                  <button type="button" onClick={() => generateAI('page')} disabled={isGeneratingPageAI} className="p-4 bg-brand-start/10 text-brand-start rounded-xl font-bold uppercase text-[8px]">{isGeneratingPageAI ? 'SCANNING' : 'AI SEO'}</button>
                </div>
                <div className="flex gap-2">
                  <input type="text" className="flex-grow bg-slate-950 border border-slate-800 rounded-xl p-4" placeholder="Hero Image URL" value={pageForm.featuredImage} onChange={e => setPageForm({...pageForm, featuredImage: e.target.value})} />
                  <input type="file" ref={pageFileRef} className="hidden" onChange={e => handleFileUpload(e, 'page')} />
                  <button type="button" onClick={() => pageFileRef.current?.click()} className="px-6 bg-slate-800 rounded-xl font-bold">UPLOAD</button>
                </div>
                <button type="submit" className="w-full py-6 gradient-bg rounded-3xl font-orbitron font-black text-sm uppercase">
                  {editingPageId ? "Sync Updates" : "Initialize Node"}
                </button>
              </form>
            </div>
            <div className="space-y-4">
              <h3 className="font-orbitron font-bold text-xs uppercase tracking-[0.4em] text-slate-600 mb-6">Page Nodes</h3>
              {pages.map(p => (
                <div key={p.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-bold uppercase text-xs transition-colors ${editingPageId === p.id ? 'text-brand-start' : 'text-white'}`}>{p.title}</p>
                        {isSystemPage(p.slug) && (
                          <span className="bg-brand-start/10 text-brand-start text-[6px] px-1.5 py-0.5 rounded border border-brand-start/30 font-black tracking-widest uppercase">System</span>
                        )}
                      </div>
                      <p className="text-[8px] text-slate-500">/p/{p.slug}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEditPage(p)} 
                      className={`px-3 py-1 bg-slate-800 rounded-lg text-[8px] font-orbitron font-bold uppercase transition-all ${editingPageId === p.id ? 'bg-brand-start text-white opacity-100' : 'opacity-0 group-hover:opacity-100 hover:bg-brand-start hover:text-white'}`}
                    >
                      Edit
                    </button>
                    {isSystemPage(p.slug) ? (
                      <span className="w-8 h-8 flex items-center justify-center opacity-20" title="System Page Protected">🔒</span>
                    ) : (
                      <button onClick={() => deleteItem('pages', p.id)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-all">🗑</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'podcasts' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-wipe-in">
            <div className="xl:col-span-2 bg-slate-900/50 border border-slate-800 p-8 md:p-12 rounded-[48px]">
              <h3 className="font-orbitron font-black text-2xl uppercase tracking-widest text-brand-start mb-10">Neural Broadcast Console</h3>
              <form onSubmit={e => { e.preventDefault(); addPodcast(podcastForm); showToast("Broadcast synced.", "success"); }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" placeholder="Title" value={podcastForm.title} onChange={e => setPodcastForm({...podcastForm, title: e.target.value})} required />
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" value={podcastForm.platform} onChange={e => setPodcastForm({...podcastForm, platform: e.target.value as any})}><option>YouTube</option><option>Spotify</option><option>RedCircle</option></select>
                </div>
                <div className="flex items-center gap-2">
                  <textarea className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl p-4 h-24" placeholder="Abstract (Description)" value={podcastForm.description} onChange={e => setPodcastForm({...podcastForm, description: e.target.value})} />
                  <button type="button" onClick={() => generateAI('pod')} disabled={isGeneratingPodAI} className="p-4 bg-brand-start/10 text-brand-start rounded-xl font-bold text-[8px] uppercase">{isGeneratingPodAI ? 'SYNCING' : 'AI SYNC'}</button>
                </div>
                <input type="url" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" placeholder="Source URL (Public Link)" value={podcastForm.sourceUrl} onChange={e => setPodcastForm({...podcastForm, sourceUrl: e.target.value})} required />
                <div className="aspect-video bg-black rounded-3xl overflow-hidden border border-slate-800">
                  {podcastForm.embedUrl ? <iframe src={podcastForm.embedUrl} className="w-full h-full" /> : <div className="w-full h-full flex items-center justify-center opacity-20 uppercase font-orbitron font-black text-[10px]">Signal Pending</div>}
                </div>
                <button type="submit" className="w-full py-6 gradient-bg rounded-3xl font-orbitron font-black text-sm uppercase">Activate Broadcast</button>
              </form>
            </div>
            <div className="space-y-4">
              <h3 className="font-orbitron font-bold text-xs uppercase tracking-[0.4em] text-slate-600 mb-6">Broadcast Registry</h3>
              {podcasts.map(p => <div key={p.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex justify-between items-center group"><div><p className="font-bold uppercase text-xs">{p.title}</p><p className="text-[8px] text-slate-500">EP {p.episodeNumber} • {p.platform}</p></div><button onClick={() => deleteItem('podcasts', p.id)} className="text-red-500 opacity-0 group-hover:opacity-100">🗑</button></div>)}
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-wipe-in">
            <div className="xl:col-span-2 bg-slate-900/50 border border-slate-800 p-8 md:p-12 rounded-[48px]">
              <h3 className="font-orbitron font-black text-2xl uppercase tracking-widest text-brand-start mb-10">Unseal Manuscript</h3>
              <form onSubmit={e => { e.preventDefault(); addBook(bookForm); showToast("Manuscript unsealed.", "success"); }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" placeholder="Manuscript Title" value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} required />
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" placeholder="Subtitle" value={bookForm.subtitle} onChange={e => setBookForm({...bookForm, subtitle: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-orbitron font-bold text-slate-500 uppercase tracking-widest ml-1">Manuscript Blurb</label>
                    <button type="button" onClick={() => generateAI('book')} disabled={isGeneratingBookAI} className="text-[9px] text-brand-start uppercase font-black">{isGeneratingBookAI ? 'DECRYPTING...' : 'AI REVELATION'}</button>
                  </div>
                  <RichTextEditor content={bookForm.description} onChange={html => setBookForm({...bookForm, description: html})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" value={bookForm.platform} onChange={e => setBookForm({...bookForm, platform: e.target.value as any})}><option>Amazon</option><option>Google Play</option><option>PDF Download</option></select>
                   <input type="url" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" placeholder="Acquisition Link" value={bookForm.buyLink} onChange={e => setBookForm({...bookForm, buyLink: e.target.value})} />
                </div>
                <div className="flex gap-2">
                  <input type="text" className="flex-grow bg-slate-950 border border-slate-800 rounded-xl p-4" placeholder="Cover Image URL" value={bookForm.image} onChange={e => setBookForm({...bookForm, image: e.target.value})} />
                  <input type="file" ref={bookFileRef} className="hidden" onChange={e => handleFileUpload(e, 'book')} />
                  <button type="button" onClick={() => bookFileRef.current?.click()} className="px-6 bg-slate-800 rounded-xl font-bold">UPLOAD</button>
                </div>
                <button type="submit" className="w-full py-6 gradient-bg rounded-3xl font-orbitron font-black text-sm uppercase">Activate Manuscript</button>
              </form>
            </div>
            <div className="space-y-4">
              <h3 className="font-orbitron font-bold text-xs uppercase tracking-[0.4em] text-slate-600 mb-6">Manuscript Registry</h3>
              {books.map(b => <div key={b.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex justify-between items-center group"><div><p className="font-bold uppercase text-xs">{b.title}</p><p className="text-[8px] text-slate-500">{b.platform}</p></div><button onClick={() => deleteItem('books', b.id)} className="text-red-500 opacity-0 group-hover:opacity-100">🗑</button></div>)}
            </div>
          </div>
        )}

        {activeTab === 'merch' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 animate-wipe-in">
            <div className="xl:col-span-2 bg-slate-900/50 border border-slate-800 p-8 md:p-12 rounded-[48px]">
              <h3 className="font-orbitron font-black text-2xl uppercase tracking-widest text-brand-start mb-10">Fabricate Artifact</h3>
              <form onSubmit={e => { e.preventDefault(); addMerch(merchForm); showToast("Artifact authorized.", "success"); }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" placeholder="Artifact Title" value={merchForm.title} onChange={e => setMerchForm({...merchForm, title: e.target.value})} required />
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" value={merchForm.platform} onChange={e => setMerchForm({...merchForm, platform: e.target.value as any})}><option>TeePublic</option><option>Redbubble</option><option>Printful</option></select>
                </div>
                <div className="flex items-center gap-2">
                  <textarea className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl p-4 h-24" placeholder="Artifact Abstract" value={merchForm.description} onChange={e => setMerchForm({...merchForm, description: e.target.value})} />
                  <button type="button" onClick={() => generateAI('merch')} disabled={isGeneratingMerchAI} className="p-4 bg-brand-start/10 text-brand-start rounded-xl font-bold text-[8px] uppercase">{isGeneratingMerchAI ? 'FABRICATING' : 'AI GENERATE'}</button>
                </div>
                <input type="url" className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4" placeholder="Acquisition Link" value={merchForm.link} onChange={e => setMerchForm({...merchForm, link: e.target.value})} required />
                <div className="flex gap-2">
                  <input type="text" className="flex-grow bg-slate-950 border border-slate-800 rounded-xl p-4" placeholder="Asset Image URL" value={merchForm.image} onChange={e => setMerchForm({...merchForm, image: e.target.value})} />
                  <input type="file" ref={merchFileRef} className="hidden" onChange={e => handleFileUpload(e, 'merch')} />
                  <button type="button" onClick={() => merchFileRef.current?.click()} className="px-6 bg-slate-800 rounded-xl font-bold">UPLOAD</button>
                </div>
                <button type="submit" className="w-full py-6 gradient-bg rounded-3xl font-orbitron font-black text-sm uppercase">Authorize Artifact</button>
              </form>
            </div>
            <div className="space-y-4">
              <h3 className="font-orbitron font-bold text-xs uppercase tracking-[0.4em] text-slate-600 mb-6">Artifact Registry</h3>
              {merch.map(m => <div key={m.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex justify-between items-center group"><div><p className="font-bold uppercase text-xs">{m.title}</p><p className="text-[8px] text-slate-500">{m.platform}</p></div><button onClick={() => deleteItem('merch', m.id)} className="text-red-500 opacity-0 group-hover:opacity-100">🗑</button></div>)}
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-wipe-in">
            <h3 className="font-orbitron font-bold text-xs uppercase tracking-[0.4em] text-slate-600 mb-8">Signal Feedback</h3>
            {comments.map(c => (
              <div key={c.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex justify-between items-center">
                <div><p className="text-brand-start font-bold text-xs uppercase">{c.user}</p><p className="italic text-sm text-slate-300">"{c.text}"</p></div>
                <div className="flex gap-2">
                  {c.status === 'pending' && <button onClick={() => updateCommentStatus(c.id, 'approved')} className="px-4 py-2 bg-green-500/10 text-green-500 rounded-xl text-[10px] uppercase font-black">Approve</button>}
                  <button onClick={() => deleteItem('comments', c.id)} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[10px] uppercase font-black">Purge</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="max-w-xl mx-auto bg-slate-900/50 border border-slate-800 p-12 rounded-[48px] animate-wipe-in">
            <h3 className="text-center font-orbitron font-black text-2xl mb-10 text-brand-start uppercase">Neural Security</h3>
            <form onSubmit={e => { e.preventDefault(); updateAdmin({ email: securityForm.email, passwordHash: securityForm.password || adminConfig.passwordHash }); showToast("Cipher updated.", "success"); }} className="space-y-8">
              <input type="email" className="w-full bg-slate-950 p-4 border border-slate-800 rounded-2xl" value={securityForm.email} onChange={e => setSecurityForm({...securityForm, email: e.target.value})} required />
              <input type="password" placeholder="New Neural Cipher" className="w-full bg-slate-950 p-4 border border-slate-800 rounded-2xl" value={securityForm.password} onChange={e => setSecurityForm({...securityForm, password: e.target.value})} />
              <button className="w-full py-6 gradient-bg rounded-3xl font-orbitron font-black uppercase">Recalibrate Access</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

type Tab = 'analytics' | 'blog' | 'podcasts' | 'books' | 'merch' | 'comments' | 'pages' | 'security';

export default Dashboard;
