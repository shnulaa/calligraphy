import React, { useState, useEffect } from 'react';
import { KUAIXUE_SHIQING_TIE } from './constants';
import { DeepZoomViewer } from './components/DeepZoomViewer';
import { CuratorChat } from './components/CuratorChat';
import { ChevronDown, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [showViewer, setShowViewer] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lang, setLang] = useState<'en' | 'cn'>('cn'); // Default to Chinese

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax effect calculation
  const parallaxOffset = scrollY * 0.5;
  const blurAmount = Math.min(scrollY / 50, 4);

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-cinnabar selection:text-paper">
      
      {/* Navigation / Language Toggle */}
      <div className="fixed top-6 left-6 z-50">
        <button 
          onClick={() => setLang(l => l === 'en' ? 'cn' : 'en')}
          className="bg-white/90 backdrop-blur border border-ink/10 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-ink hover:text-paper transition-all shadow-lg font-serif text-sm"
        >
          <Globe size={16} />
          <span>{lang === 'en' ? '中文' : 'English'}</span>
        </button>
      </div>

      {/* Hero Section */}
      <header className="relative h-screen overflow-hidden flex items-center justify-center">
        {/* Background Parallax */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-75 ease-linear opacity-80"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1455589885822-4467be89b6f1?q=80&w=2938&auto=format&fit=crop')", // Winter/Snow landscape
            transform: `translateY(${parallaxOffset}px) scale(${1 + scrollY * 0.0005})`,
            filter: `blur(${blurAmount}px) grayscale(80%)`
          }}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-paper/30 via-paper/60 to-paper z-10"></div>

        {/* Content */}
        <div className="relative z-20 text-center flex flex-col items-center gap-8">
          <div className="flex flex-row-reverse gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-1000">
             {/* Red Seal */}
             <div className="w-16 h-16 border-4 border-cinnabar/80 text-cinnabar p-1 flex items-center justify-center rounded-sm">
                <span className="font-calligraphy text-4xl leading-none">三希</span>
             </div>
             
             {/* Title Vertical */}
             <h1 className="vertical-rl font-serif text-7xl md:text-9xl text-ink font-bold tracking-widest h-96">
                {KUAIXUE_SHIQING_TIE.title[lang]}
             </h1>
             
             {/* Subtitle Vertical */}
             <div className="vertical-rl h-64 flex justify-between py-2 opacity-80">
               <span className="font-song text-lg tracking-widest">
                  {KUAIXUE_SHIQING_TIE.artist[lang]} • {lang === 'cn' ? '书圣' : 'The Sage'}
               </span>
               <span className="font-serif text-sm italic tracking-wide text-stone-500">
                  {KUAIXUE_SHIQING_TIE.dynasty[lang]}
               </span>
             </div>
          </div>

          <div className="mt-12 opacity-0 animate-in fade-in duration-1000 delay-500 fill-mode-forwards">
            <p className="font-serif italic text-stone-600 mb-6">
              "{KUAIXUE_SHIQING_TIE.title.en}"
            </p>
            <button 
              onClick={() => {
                setShowViewer(true);
                document.getElementById('exhibition')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group border border-ink px-8 py-3 rounded-full hover:bg-ink hover:text-paper transition-all duration-500 flex items-center gap-2"
            >
              <span className="uppercase tracking-widest text-sm">
                {lang === 'cn' ? '进入展厅' : 'Enter Exhibition'}
              </span>
              <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Exhibition Area */}
      <main id="exhibition" className="relative z-30 min-h-screen bg-paper border-t border-stone-200">
        
        {/* Intro Text */}
        <div className="container mx-auto px-6 py-24 md:px-24 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 space-y-6">
            <h2 className="font-serif text-4xl text-ink">
              {lang === 'cn' ? '旷世神作' : 'The Masterpiece'}
            </h2>
            <div className="w-12 h-1 bg-cinnabar"></div>
          </div>
          <div className="md:col-span-8 font-song text-lg leading-loose text-stone-800 space-y-6">
            <p>{KUAIXUE_SHIQING_TIE.description[lang]}</p>
          </div>
        </div>

        {/* Background & Significance Sections */}
        <div className="container mx-auto px-6 pb-24 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
           {/* Background */}
           <div className="bg-rice-paper p-8 border-l-4 border-stone-300">
              <h3 className="font-serif text-2xl mb-4 text-ink flex items-center gap-2">
                 <span className="text-cinnabar">●</span> 
                 {lang === 'cn' ? '历史背景' : 'Historical Background'}
              </h3>
              <p className="font-song leading-relaxed text-stone-700">
                {KUAIXUE_SHIQING_TIE.background[lang]}
              </p>
           </div>
           
           {/* Significance */}
           <div className="bg-rice-paper p-8 border-l-4 border-cinnabar">
              <h3 className="font-serif text-2xl mb-4 text-ink flex items-center gap-2">
                 <span className="text-cinnabar">●</span>
                 {lang === 'cn' ? '艺术价值' : 'Artistic Significance'}
              </h3>
              <p className="font-song leading-relaxed text-stone-700">
                {KUAIXUE_SHIQING_TIE.significance[lang]}
              </p>
           </div>
        </div>

        {/* The Viewer Component */}
        <div className="h-[80vh] w-full bg-stone-100 shadow-inner relative">
          <DeepZoomViewer artifact={KUAIXUE_SHIQING_TIE} lang={lang} />
        </div>

        {/* Details Footer */}
        <div className="bg-ink text-paper py-16">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-2xl mb-2">Ink & Snow</h3>
              <p className="text-stone-500 text-sm">
                {lang === 'cn' ? '数字书法博物馆项目' : 'Digital Preservation Project'}
              </p>
            </div>
            <div className="flex gap-8 text-stone-400 font-song text-sm">
               <span>{lang === 'cn' ? '可视化' : 'Visualization'}</span>
               <span>{lang === 'cn' ? '图像分析' : 'Analysis'}</span>
               <span>{lang === 'cn' ? '数字修复' : 'Restoration'}</span>
            </div>
          </div>
        </div>

      </main>

      {/* Floating AI Chat */}
      <CuratorChat artifactContext={KUAIXUE_SHIQING_TIE.description[lang]} lang={lang} />

    </div>
  );
};

export default App;