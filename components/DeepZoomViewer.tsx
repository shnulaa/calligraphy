import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, Eye, PenTool } from 'lucide-react';
import { INITIAL_ZOOM, MAX_ZOOM, MIN_ZOOM } from '../constants';
import { Artifact } from '../types';
import { TracingCanvas } from './TracingCanvas';

interface DeepZoomViewerProps {
  artifact: Artifact;
  lang: 'en' | 'cn';
  onViewChange?: (viewState: string) => void;
}

export const DeepZoomViewer: React.FC<DeepZoomViewerProps> = ({ artifact, lang, onViewChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(INITIAL_ZOOM);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<'view' | 'trace' | 'microscope'>('view');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Native wheel event listener to prevent page scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (mode === 'trace') return;

      const scaleAdjustment = e.deltaY * -0.001;
      setScale(prev => Math.min(Math.max(prev + scaleAdjustment, MIN_ZOOM), MAX_ZOOM));
    };

    // { passive: false } is required to use preventDefault() on wheel events
    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [mode]);

  // Handle Pan (Mouse)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (mode === 'trace') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || mode === 'trace') return;
    e.preventDefault();
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Handle Pan (Touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (mode === 'trace') return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
     if (!isDragging || mode === 'trace') return;
     const touch = e.touches[0];
     setPosition({
       x: touch.clientX - dragStart.x,
       y: touch.clientY - dragStart.y
     });
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Reset view
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Microscope Effect style
  const microscopeStyle = mode === 'microscope' ? {
    filter: 'contrast(1.2) brightness(1.1) sepia(0.2)',
    cursor: 'zoom-in',
  } : {};

  return (
    <div className="relative w-full h-full bg-paper overflow-hidden select-none border-t border-b border-stone-300 shadow-inner group touch-none">
      
      {/* Texture Overlay (Paper Grain) */}
      <div className="absolute inset-0 pointer-events-none opacity-30 z-10 bg-rice-paper mix-blend-multiply"></div>

      {/* Toolbar */}
      <div className="absolute top-6 right-6 z-40 flex flex-col gap-3">
        <div className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg border border-stone-200 flex flex-col gap-2">
          <button 
            onClick={() => setMode('view')} 
            className={`p-2 rounded transition-colors ${mode === 'view' ? 'bg-ink text-paper' : 'hover:bg-stone-100 text-ink'}`}
            title={lang === 'cn' ? "浏览模式" : "View Mode"}
          >
            <Eye size={20} />
          </button>
          <button 
             onClick={() => { setMode('trace'); setScale(1.5); }} 
             className={`p-2 rounded transition-colors ${mode === 'trace' ? 'bg-ink text-paper' : 'hover:bg-stone-100 text-ink'}`}
             title={lang === 'cn' ? "临摹模式" : "Tracing Mode"}
          >
            <PenTool size={20} />
          </button>
          <button 
             onClick={() => { setMode('microscope'); setScale(MAX_ZOOM / 2); }} 
             className={`p-2 rounded transition-colors ${mode === 'microscope' ? 'bg-ink text-paper' : 'hover:bg-stone-100 text-ink'}`}
             title={lang === 'cn' ? "微观赏析" : "Microscope View"}
          >
            <Maximize size={20} />
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg border border-stone-200 flex flex-col gap-2">
          <button onClick={() => setScale(s => Math.min(s + 0.5, MAX_ZOOM))} className="p-2 hover:bg-stone-100 rounded text-ink"><ZoomIn size={20}/></button>
          <button onClick={() => setScale(s => Math.max(s - 0.5, MIN_ZOOM))} className="p-2 hover:bg-stone-100 rounded text-ink"><ZoomOut size={20}/></button>
          <button onClick={resetView} className="p-2 hover:bg-stone-100 rounded text-ink text-xs font-serif">1:1</button>
        </div>
      </div>

      {/* Main Content Transformation Container */}
      <div 
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-100 ease-out"
        style={{ cursor: mode === 'trace' ? 'default' : isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center',
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            ...microscopeStyle
          }}
          className="relative shadow-2xl flex flex-row shrink-0"
        >
          {/* Render Multiple Images for Handscroll Effect */}
          {artifact.images.map((imgSrc, index) => (
            <img 
              key={index}
              src={imgSrc} 
              alt={`${artifact.title[lang]} - Part ${index + 1}`}
              className="h-[60vh] w-auto object-cover pointer-events-none block shrink-0" 
              draggable={false}
              style={{ marginRight: -1 }}
            />
          ))}

          {/* Hotspots Overlay */}
          {mode === 'view' && artifact.hotspots.map(hs => (
            <div 
              key={hs.id}
              className="absolute z-20 group/hotspot"
              style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
            >
              <button 
                onClick={() => setActiveHotspot(activeHotspot === hs.id ? null : hs.id)}
                className="w-6 h-6 -ml-3 -mt-3 rounded-full bg-cinnabar/80 border border-paper shadow-lg flex items-center justify-center animate-pulse hover:animate-none hover:scale-110 transition-transform"
                onTouchEnd={(e) => { e.stopPropagation(); setActiveHotspot(activeHotspot === hs.id ? null : hs.id); }}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </button>
              
              {/* Tooltip */}
              <div 
                className={`absolute top-8 left-1/2 -translate-x-1/2 w-64 bg-ink/90 backdrop-blur-sm text-paper p-4 rounded-sm shadow-xl pointer-events-none transition-all duration-300 ${
                  activeHotspot === hs.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                }`}
              >
                <h4 className="font-serif font-bold text-cinnabar mb-1">{hs.title[lang]}</h4>
                <p className="text-xs leading-relaxed font-song text-stone-200">{hs.content[lang]}</p>
              </div>
            </div>
          ))}

          {/* Seals Overlay */}
           {mode === 'view' && artifact.seals.map(seal => (
             <div 
                key={seal.id}
                className="absolute border border-cinnabar/30 hover:border-cinnabar hover:bg-cinnabar/10 transition-colors cursor-help rounded-sm"
                style={{ 
                  top: `${seal.y}%`, 
                  left: `${seal.x}%`, 
                  width: `${seal.size}%`, 
                  height: `${seal.size * 2}%`
                }}
                title={seal.name[lang]}
             />
           ))}

          {/* Tracing Layer */}
          <TracingCanvas 
            width={artifact.dimensions.width} 
            height={artifact.dimensions.height} 
            isActive={mode === 'trace'}
          />

        </div>
      </div>

      {/* Mode Indicator */}
      <div className="absolute bottom-6 left-6 pointer-events-none">
        <h2 className="text-6xl text-stone-200/20 font-serif font-bold tracking-tighter uppercase pointer-events-none">
          {mode}
        </h2>
      </div>

      {/* Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-ink/40 text-xs font-serif tracking-widest uppercase animate-pulse pointer-events-none">
        {mode === 'view' 
           ? (lang === 'cn' ? '拖拽移动 • 滚轮缩放' : 'Drag to Pan • Scroll to Zoom')
           : mode === 'trace' 
              ? (lang === 'cn' ? '跟随笔触 临摹书法' : 'Draw over the strokes')
              : (lang === 'cn' ? '赏析纸墨纹理' : 'Examining Texture')}
      </div>

    </div>
  );
};