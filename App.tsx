import React, { useState, useEffect } from 'react';
import { ARTIFACTS } from './constants';
import { DeepZoomViewer } from './components/DeepZoomViewer';
import { CuratorChat } from './components/CuratorChat';
import { ChevronDown, Globe, ScrollText, ArrowRight, Grid, Feather } from 'lucide-react';

const App: React.FC = () => {
  const [showViewer, setShowViewer] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [lang, setLang] = useState<'en' | 'cn'>('cn');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [appraisalMessage, setAppraisalMessage] = useState<string | null>(null);

  const currentArtifact = ARTIFACTS[currentIndex];

  const handleAppraisalResult = (analysis: string) => {
    setAppraisalMessage(analysis);
  };

  const handleMessageDisplayed = () => {
    setAppraisalMessage(null); // 清空消息，准备接收下一个
  };

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
      <div className="fixed top-6 left-6 z-50 flex flex-col items-start gap-4">
        <div className="flex gap-4">
          <button 
            onClick={() => setLang(l => l === 'en' ? 'cn' : 'en')}
            className="bg-white/90 backdrop-blur border border-ink/10 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-ink hover:text-paper transition-all shadow-lg font-serif text-sm"
          >
            <Globe size={16} />
            <span>{lang === 'en' ? '中文' : 'English'}</span>
          </button>
          
          <button 
            onClick={() => setShowTopMenu(!showTopMenu)}
            className="bg-white/90 backdrop-blur border border-ink/10 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-ink hover:text-paper transition-all shadow-lg font-serif text-sm"
          >
            <Grid size={16} />
            <span>{lang === 'cn' ? '目录' : 'Catalog'}</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${showTopMenu ? 'rotate-180' : ''}`}/>
          </button>
        </div>
        
        {/* Top Dropdown Menu */}
        <div className={`transition-all duration-300 origin-top-left ${showTopMenu ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="bg-paper/95 backdrop-blur border border-stone-200 shadow-xl rounded-xl overflow-hidden w-64">
            {ARTIFACTS.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowTopMenu(false);
                }}
                className={`w-full text-left px-5 py-3 hover:bg-ink/5 flex flex-col gap-0.5 border-b border-stone-100 last:border-0 transition-colors ${currentIndex === index ? 'bg-cinnabar/5' : ''}`}
              >
                <span className={`font-song text-base ${currentIndex === index ? 'text-cinnabar font-bold' : 'text-ink'}`}>
                  {item.title[lang]}
                </span>
                <span className="text-xs font-serif text-stone-500 uppercase tracking-wider">
                  {item.artist[lang]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <header className="relative h-screen overflow-hidden flex items-center justify-center transition-colors duration-1000">
        {/* Background Parallax */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 ease-in-out opacity-80"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1455589885822-4467be89b6f1?q=80&w=2938&auto=format&fit=crop')", // Consistent Winter/Ink theme base
            transform: `translateY(${parallaxOffset}px) scale(${1 + scrollY * 0.0005})`,
            filter: `blur(${blurAmount}px) grayscale(80%)`
          }}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-paper/30 via-paper/60 to-paper z-10"></div>

        {/* Decorative Watermark & Lines - Fills the empty space */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none select-none">
           {/* Large background character */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] text-ink blur-sm transform rotate-12 scale-150">
              <span className="font-calligraphy text-[60vh] md:text-[80vh] leading-none whitespace-nowrap">
                {currentArtifact.title.cn.charAt(0)}
              </span>
           </div>
           
           {/* Vertical Guidelines */}
           <div className="absolute inset-0 flex justify-between px-8 md:px-32 opacity-[0.08]">
             <div className="h-full w-px bg-ink/50 dashed-line"></div>
             <div className="h-full w-px bg-ink/30 hidden md:block"></div>
             <div className="h-full w-px bg-ink/50 dashed-line"></div>
           </div>
        </div>

        {/* Content */}
        <div key={currentArtifact.id} className="relative z-20 text-center flex flex-col items-center gap-8 w-full max-w-7xl px-8">
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center md:items-start justify-between animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full">
             
             {/* Title Vertical - Center/Right */}
             <div className="flex flex-col items-center md:mr-16">
               <h1 className="md:vertical-rl font-serif text-5xl md:text-8xl text-ink font-bold tracking-widest md:h-[60vh] leading-tight mb-4 md:mb-0 drop-shadow-sm select-none">
                  {currentArtifact.title[lang]}
               </h1>
             </div>
             
             {/* Metadata & Bio - Left Side (Fills the empty space) */}
             <div className="flex flex-col text-left md:items-start md:text-left max-w-sm opacity-90 pt-4 md:pt-0 pl-4 md:pl-0 md:pr-4 self-center md:self-end md:mb-12">
                {/* Name & Dynasty Header */}
                <div className="mb-5 border-b border-ink/20 pb-4 w-full">
                    <div className="flex flex-col gap-1">
                        <span className="font-song text-4xl font-bold text-ink">{currentArtifact.artist[lang]}</span>
                        <span className="font-serif text-sm italic text-stone-500 tracking-wider uppercase">{currentArtifact.dynasty[lang]}</span>
                    </div>
                </div>
                
                {/* Detailed Bio (Visible on Desktop) */}
                <div className="hidden md:block space-y-4">
                    <p className="font-song text-sm leading-7 text-stone-700 text-justify tracking-wide">
                        {currentArtifact.artistBio[lang]}
                    </p>
                    
                    {/* Achievement Quote */}
                    <div className="pl-4 border-l-[3px] border-cinnabar bg-gradient-to-r from-cinnabar/5 to-transparent py-3 pr-2 rounded-r-lg">
                         <p className="font-serif text-xs italic text-stone-600 leading-relaxed font-medium">
                            "{currentArtifact.artistAchievement[lang]}"
                         </p>
                    </div>
                </div>
             </div>
          </div>

          <div className="mt-4 md:absolute md:bottom-12 md:left-1/2 md:-translate-x-1/2 opacity-0 animate-in fade-in duration-1000 delay-500 fill-mode-forwards flex flex-col items-center gap-4">
            <button 
              onClick={() => {
                setShowViewer(true);
                document.getElementById('exhibition')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-4 group border border-ink/80 px-8 py-3 rounded-full hover:bg-ink hover:text-paper transition-all duration-500 flex items-center gap-2 bg-paper/50 backdrop-blur-sm"
            >
              <span className="uppercase tracking-widest text-sm font-semibold">
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
              {lang === 'cn' ? '作品详情' : 'Artifact Details'}
            </h2>
            <div className="w-12 h-1 bg-cinnabar"></div>
          </div>
          <div className="md:col-span-8 font-song text-lg leading-loose text-stone-800 space-y-6">
            <p>{currentArtifact.description[lang]}</p>
          </div>
        </div>

        {/* Highlight Card - (Previous Master Section, kept as supplementary) */}
        <div className="container mx-auto px-6 pb-24 md:px-24">
          <div className="bg-ink text-paper p-8 md:p-12 rounded-sm shadow-2xl relative overflow-hidden transition-all duration-500 group">
             {/* Decorative faint background char */}
            <div className="absolute -right-24 -top-24 text-white/5 font-calligraphy text-[20rem] pointer-events-none select-none rotate-12 group-hover:rotate-6 transition-transform duration-700">
              {currentArtifact.artist[lang].charAt(0)}
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-4">
                 <div className="flex items-center gap-3 text-cinnabar mb-2">
                    <Feather size={20} />
                    <span className="font-serif tracking-widest text-xs uppercase opacity-80">{lang === 'cn' ? '深度阅读' : 'In-Depth'}</span>
                 </div>
                 <h3 className="font-serif text-2xl md:text-3xl tracking-wide text-paper font-bold">
                    {lang === 'cn' ? '关于作者' : 'About the Artist'}
                 </h3>
                 <p className="font-song text-paper/80 leading-relaxed text-justify">
                    {currentArtifact.artistBio[lang]}
                 </p>
              </div>
              <div className="md:w-px md:h-32 bg-white/10 hidden md:block"></div>
              <div className="flex-1 italic text-paper/70 font-song text-lg border-l-2 border-cinnabar pl-6 md:border-l-0 md:pl-0">
                 "{currentArtifact.artistAchievement[lang]}"
              </div>
            </div>
          </div>
        </div>

        {/* Background & Significance Sections */}
        <div className="container mx-auto px-6 pb-24 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-16">
           {/* Background */}
           <div className="bg-rice-paper p-8 border-l-4 border-stone-300 hover:bg-white transition-colors duration-500 shadow-sm">
              <h3 className="font-serif text-2xl mb-4 text-ink flex items-center gap-2">
                 <span className="text-cinnabar">●</span> 
                 {lang === 'cn' ? '历史背景' : 'Historical Background'}
              </h3>
              <p className="font-song leading-relaxed text-stone-700">
                {currentArtifact.background[lang]}
              </p>
           </div>
           
           {/* Significance */}
           <div className="bg-rice-paper p-8 border-l-4 border-cinnabar hover:bg-white transition-colors duration-500 shadow-sm">
              <h3 className="font-serif text-2xl mb-4 text-ink flex items-center gap-2">
                 <span className="text-cinnabar">●</span>
                 {lang === 'cn' ? '艺术价值' : 'Artistic Significance'}
              </h3>
              <p className="font-song leading-relaxed text-stone-700">
                {currentArtifact.significance[lang]}
              </p>
           </div>
        </div>

        {/* The Viewer Component */}
        {/* Key forces remount when artifact changes to reset zoom */}
        <div className="h-[80vh] w-full bg-stone-100 shadow-inner relative">
          <DeepZoomViewer 
            key={currentArtifact.id} 
            artifact={currentArtifact} 
            lang={lang}
            onAppraisalResult={handleAppraisalResult}
          />
        </div>

        {/* Catalog Navigation (Bottom Bar) */}
        <div className="sticky bottom-0 left-0 right-0 z-40 bg-ink/95 backdrop-blur-md text-paper py-4 border-t border-stone-700">
           <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
             <div className="flex items-center gap-8 min-w-max px-4">
                <span className="text-stone-500 font-serif text-xs tracking-widest uppercase flex items-center gap-2">
                   <ScrollText size={14} />
                   {lang === 'cn' ? '馆藏目录' : 'Collection'}
                </span>
                
                {ARTIFACTS.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`group relative flex flex-col gap-1 px-4 py-2 transition-all duration-300 ${
                      currentIndex === index 
                        ? 'text-paper scale-105' 
                        : 'text-stone-500 hover:text-stone-300'
                    }`}
                  >
                    <span className="font-song text-lg whitespace-nowrap">
                      {item.title[lang]}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-serif opacity-60 group-hover:opacity-100">
                      {item.artist[lang]}
                    </span>
                    
                    {/* Active Indicator */}
                    {currentIndex === index && (
                      <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-cinnabar animate-in zoom-in slide-in-from-left duration-300"></div>
                    )}
                  </button>
                ))}
                
                <div className="text-stone-600 text-xs flex items-center gap-1">
                   <span>Scroll</span> <ArrowRight size={12}/>
                </div>
             </div>
           </div>
        </div>

      </main>

      {/* Floating AI Chat */}
      <CuratorChat 
        key={`chat-${currentArtifact.id}`} // Reset chat when artifact changes
        artifactContext={`${currentArtifact.title.en} by ${currentArtifact.artist.en}. ${currentArtifact.description.en}`} 
        lang={lang}
        externalMessage={appraisalMessage}
        onMessageDisplayed={handleMessageDisplayed}
      />

    </div>
  );
};

export default App;