import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize, Eye, PenTool, Sparkles } from 'lucide-react';
import { INITIAL_ZOOM, MAX_ZOOM, MIN_ZOOM } from '../constants';
import { Artifact } from '../types';
import { TracingCanvas } from './TracingCanvas';
import { analyzeCalligraphyImage } from '../services/geminiService';

interface DeepZoomViewerProps {
  artifact: Artifact;
  lang: 'en' | 'cn';
  onViewChange?: (viewState: string) => void;
  onAppraisalResult?: (analysis: string) => void;
}

export const DeepZoomViewer: React.FC<DeepZoomViewerProps> = ({ artifact, lang, onViewChange, onAppraisalResult }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(INITIAL_ZOOM);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<'view' | 'trace' | 'microscope'>('view');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingImageIndex, setAnalyzingImageIndex] = useState<number | null>(null);

  // Helper: Handle Zoom Logic (Zoom to Point)
  const handleZoom = (targetScale: number, clientX?: number, clientY?: number) => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Clamp scale
    const newScale = Math.min(Math.max(targetScale, MIN_ZOOM), MAX_ZOOM);
    if (Math.abs(newScale - scale) < 0.001) return;

    // 2. Calculate scaling ratio
    const ratio = newScale / scale;

    // 3. Get container metrics
    const rect = container.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // 4. Determine focal point (mouse position or center) relative to container center
    // If clientX is provided, map it to offset from center. Otherwise 0 (center).
    const focalX = clientX !== undefined ? clientX - rect.left - cx : 0;
    const focalY = clientY !== undefined ? clientY - rect.top - cy : 0;

    // 5. Calculate new position to keep focal point stationary
    // Formula: newPos = focal - (focal - oldPos) * ratio
    const newX = focalX - (focalX - position.x) * ratio;
    const newY = focalY - (focalY - position.y) * ratio;

    setScale(newScale);
    setPosition({ x: newX, y: newY });
  };

  // Native wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (mode === 'trace') return;

      // Multiplicative zoom for smoother feel
      // deltaY is usually ~100. 100 * -0.001 = -0.1. 1 - 0.1 = 0.9.
      const zoomFactor = 1 - e.deltaY * 0.001;
      handleZoom(scale * zoomFactor, e.clientX, e.clientY);
    };

    container.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, [mode, scale, position]); // Add dependencies to ensure state is fresh

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

  // AI Analysis - Capture current view and send to Gemini
  const handleAiAnalysis = async () => {
    const container = containerRef.current;
    if (!container || isAnalyzing) return;

    setIsAnalyzing(true);
    setAiAnalysis(null);

    try {
      // Use html2canvas to capture the current view
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(container, {
        backgroundColor: '#F4F1DE',
        scale: 1,
        logging: false,
      });

      const imageDataUrl = canvas.toDataURL('image/png');
      
      // Send to Gemini for analysis
      const analysis = await analyzeCalligraphyImage(
        imageDataUrl,
        artifact.title[lang],
        lang
      );
      
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('AI Analysis Error:', error);
      setAiAnalysis(
        lang === 'cn' 
          ? '赏析过程中出现问题，请稍后再试。' 
          : 'An error occurred during analysis. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analyze individual image
  const handleImageAnalysis = async (imageIndex: number) => {
    if (isAnalyzing) return;

    setAnalyzingImageIndex(imageIndex);
    setIsAnalyzing(true);

    // 立即触发策展人对话框打开并显示用户消息
    const userMessage = lang === 'cn' ? '请鉴宝当前图片' : 'Please appraise this image';
    onAppraisalResult?.(`USER_MESSAGE:${userMessage}`);

    try {
      const imageUrl = artifact.images[imageIndex];
      
      // 直接读取图片文件并转换为 base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // 将 blob 转换为 base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      console.log('图片读取完成，大小:', (base64.length / 1024).toFixed(2), 'KB');

      // 显示loading状态
      onAppraisalResult?.('LOADING');

      // 动态获取后端URL
      const getBackendUrl = () => {
        const backendHost = process.env.VITE_BACKEND_HOST;
        const backendPort = process.env.VITE_BACKEND_PORT;
        
        if (backendHost && backendPort) {
          const protocol = backendHost.includes('localhost') || backendHost.includes('127.0.0.1') 
            ? 'http' 
            : window.location.protocol.replace(':', '');
          return `${protocol}://${backendHost}:${backendPort}`;
        }
        
        return `${window.location.protocol}//${window.location.hostname}:33001`;
      };
      
      const backendUrl = getBackendUrl();

      // Call backend API
      const apiResponse = await fetch(`${backendUrl}/api/analyze-calligraphy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: base64,
          artifactTitle: artifact.title[lang],
          lang: lang
        })
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        // 将结果发送到策展人对话框
        onAppraisalResult?.(`AI_RESPONSE:${data.analysis}`);
      } else {
        const errorData = await apiResponse.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'API request failed');
      }
    } catch (error) {
      console.error('Image Analysis Error:', error);
      const errorMsg = lang === 'cn' 
        ? '鉴宝过程中出现问题，请稍后再试。' 
        : 'An error occurred during appraisal. Please try again.';
      onAppraisalResult?.(`AI_RESPONSE:${errorMsg}`);
    } finally {
      setIsAnalyzing(false);
      setAnalyzingImageIndex(null);
    }
  };

  const microscopeStyle = mode === 'microscope' ? {
    filter: 'contrast(1.2) brightness(1.1) sepia(0.2)',
    cursor: 'zoom-in',
  } : {};

  return (
    <div className="relative w-full h-full bg-paper overflow-hidden select-none border-t border-b border-stone-300 shadow-inner group touch-none">
      
      {/* Texture Overlay */}
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
             onClick={() => { setMode('trace'); setScale(1.5); setPosition({x:0, y:0}); }} 
             className={`p-2 rounded transition-colors ${mode === 'trace' ? 'bg-ink text-paper' : 'hover:bg-stone-100 text-ink'}`}
             title={lang === 'cn' ? "临摹模式" : "Tracing Mode"}
          >
            <PenTool size={20} />
          </button>
          <button 
             onClick={() => { setMode('microscope'); handleZoom(4); }} 
             className={`p-2 rounded transition-colors ${mode === 'microscope' ? 'bg-ink text-paper' : 'hover:bg-stone-100 text-ink'}`}
             title={lang === 'cn' ? "微观赏析" : "Microscope View"}
          >
            <Maximize size={20} />
          </button>
          <div className="h-px bg-stone-200 my-1"></div>
          <button 
             onClick={handleAiAnalysis}
             disabled={isAnalyzing}
             className={`p-2 rounded transition-colors ${isAnalyzing ? 'bg-stone-100 text-stone-400' : 'hover:bg-cinnabar hover:text-paper text-cinnabar'}`}
             title={lang === 'cn' ? "AI 赏析" : "AI Analysis"}
          >
            <Sparkles size={20} className={isAnalyzing ? 'animate-pulse' : ''} />
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur p-2 rounded-lg shadow-lg border border-stone-200 flex flex-col gap-2">
          <button onClick={() => handleZoom(scale + 0.5)} className="p-2 hover:bg-stone-100 rounded text-ink"><ZoomIn size={20}/></button>
          <button onClick={() => handleZoom(scale - 0.5)} className="p-2 hover:bg-stone-100 rounded text-ink"><ZoomOut size={20}/></button>
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
            transition: isDragging ? 'none' : 'transform 0.1s ease-out', // Faster transition for zoom
            ...microscopeStyle
          }}
          className="relative shadow-2xl flex flex-row shrink-0"
        >
          {/* Render Multiple Images for Handscroll Effect */}
          <div className="relative flex flex-col shrink-0">
            <div className="flex flex-row">
              {artifact.images.map((imgSrc, index) => (
                <div key={index} className="relative shrink-0">
                  <img 
                    src={imgSrc} 
                    alt={`${artifact.title[lang]} - Part ${index + 1}`}
                    className="h-[60vh] w-auto object-cover pointer-events-none block" 
                    draggable={false}
                    style={{ marginRight: -1 }}
                  />
                  
                  {/* AI Appraisal Button for each image */}
                  {mode === 'view' && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
                      <button
                        onClick={() => handleImageAnalysis(index)}
                        disabled={isAnalyzing}
                        className={`bg-cinnabar/90 hover:bg-cinnabar text-paper px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all text-sm font-serif ${
                          isAnalyzing && analyzingImageIndex === index ? 'animate-pulse' : ''
                        } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                      >
                        <Sparkles size={16} className={analyzingImageIndex === index ? 'animate-spin' : ''} />
                        <span>{lang === 'cn' ? 'AI鉴宝' : 'AI Appraise'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Hotspots Overlay - positioned relative to the scroll width */}
            {mode === 'view' && artifact.hotspots.map(hs => {
              // Calculate position based on scroll width (sum of all images)
              const scrollWidth = artifact.dimensions.width;
              const scrollHeight = artifact.dimensions.height;
              
              return (
                <div 
                  key={hs.id}
                  className="absolute z-20 group/hotspot"
                  style={{ 
                    top: `${hs.y}%`, 
                    left: `${hs.x}%` 
                  }}
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
                    className={`absolute bottom-8 left-1/2 -translate-x-1/2 w-64 bg-ink/90 backdrop-blur-sm text-paper p-4 rounded-sm shadow-xl pointer-events-none transition-all duration-300 z-50 ${
                      activeHotspot === hs.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                  >
                    <h4 className="font-serif font-bold text-cinnabar mb-1">{hs.title[lang]}</h4>
                    <p className="text-xs leading-relaxed font-song text-stone-200">{hs.content[lang]}</p>
                  </div>
                </div>
              );
            })}

            {/* Seals Overlay - positioned relative to scroll dimensions */}
            {mode === 'view' && artifact.seals.map(seal => {
              return (
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
              );
            })}

            {/* Tracing Layer */}
            <TracingCanvas 
              width={artifact.dimensions.width} 
              height={artifact.dimensions.height} 
              isActive={mode === 'trace'}
            />
          </div>

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

      {/* AI Analysis Panel */}
      {aiAnalysis && (
        <div className="absolute top-6 left-6 max-w-md bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-2xl border border-stone-200 z-40 animate-in fade-in slide-in-from-left duration-300">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-cinnabar" />
              <h3 className="font-serif font-bold text-ink">
                {lang === 'cn' ? 'AI 赏析' : 'AI Analysis'}
              </h3>
            </div>
            <button 
              onClick={() => setAiAnalysis(null)}
              className="text-stone-400 hover:text-ink transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="text-sm leading-relaxed text-ink/80 font-song whitespace-pre-wrap">
            {aiAnalysis}
          </div>
        </div>
      )}

    </div>
  );
};