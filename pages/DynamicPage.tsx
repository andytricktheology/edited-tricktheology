
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import NeuralSpeechPlayer from '../components/NeuralSpeechPlayer';

interface DynamicPageProps {
  slugOverride?: string;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ slugOverride }) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const { pages } = useData();
  
  const currentSlug = slugOverride || paramSlug;
  const page = pages.find(p => p.slug === currentSlug);

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={page.featuredImage} 
            alt={page.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="inline-block px-4 py-1 border border-brand-start/30 rounded-full bg-brand-start/5">
              <span className="text-[10px] font-orbitron font-bold tracking-[0.3em] text-brand-start uppercase">AUTHORIZED BROADCAST</span>
            </div>
            
            <h1 className="font-orbitron font-black text-4xl md:text-7xl text-white uppercase tracking-tighter mb-4 leading-none">{page.title}</h1>
            
            <p className="text-slate-300 font-light text-lg md:text-xl max-w-2xl mx-auto italic mb-8">
              {page.seoExcerpt}
            </p>

            <NeuralSpeechPlayer text={page.content} title={page.title} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 py-20">
        <section className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 md:p-12 shadow-inner">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-orbitron font-bold text-sm text-brand-start uppercase tracking-[0.2em] mb-1">Neural Audio Stream</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">Listen to the unsealed manuscript</p>
            </div>
            <NeuralSpeechPlayer text={page.content} title={page.title} />
          </div>

          <div 
            className="prose prose-invert prose-lg max-w-none 
              prose-headings:font-orbitron prose-headings:uppercase prose-headings:tracking-tight 
              prose-h1:text-brand-start prose-h2:text-slate-900 dark:prose-h2:text-white 
              prose-p:text-slate-700 dark:prose-p:text-slate-400
              prose-a:text-brand-start hover:prose-a:text-brand-start/80 transition-colors
              prose-img:rounded-[32px] prose-img:shadow-2xl"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </section>
        
        <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 font-bold uppercase tracking-widest">
          <span>Signal Strength: Stable</span>
          <span>Last Verified: {new Date(page.lastModified).toLocaleDateString()}</span>
        </div>
      </article>
    </div>
  );
};

export default DynamicPage;
