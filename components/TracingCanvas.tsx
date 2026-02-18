import React, { useRef, useEffect, useState } from 'react';
import { Eraser, PenTool, RefreshCw } from 'lucide-react';

interface TracingCanvasProps {
  width: number;
  height: number;
  isActive: boolean;
}

export const TracingCanvas: React.FC<TracingCanvasProps> = ({ width, height, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(26, 26, 26, 0.85)'; // Ink color
      ctx.lineWidth = 25; // Thicker stroke for better visibility
      // Add a slight shadow to simulate wet ink depth
      ctx.shadowBlur = 2;
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      contextRef.current = ctx;
    }
  }, [width, height]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    // Critical: stop propagation so the parent viewer doesn't try to pan
    e.preventDefault();
    e.stopPropagation();
    
    if (!isActive) return;
    const { offsetX, offsetY } = getCoordinates(e);
    
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDrawing || !isActive) return;
    const { offsetX, offsetY } = getCoordinates(e);
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const endStroke = (e: React.MouseEvent | React.TouchEvent) => {
     e.preventDefault();
     e.stopPropagation();
     setIsDrawing(false);
     // Removed closePath() to prevent strokes from connecting back to start
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const rect = canvas.getBoundingClientRect();
    // Calculate scale ratio between internal resolution and displayed size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      offsetX: (clientX - rect.left) * scaleX,
      offsetY: (clientY - rect.top) * scaleY
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-30 overflow-hidden pointer-events-none">
       {/* Controls */}
       <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto flex gap-4 bg-white/90 backdrop-blur px-6 py-2 rounded-full shadow-lg border border-stone-200">
          <div className="flex items-center gap-2 text-ink text-sm font-song">
            <PenTool size={16} />
            <span>Practice Mode</span>
          </div>
          <button onClick={clearCanvas} className="hover:text-cinnabar transition-colors" title="Clear Ink">
            <RefreshCw size={16} />
          </button>
       </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair pointer-events-auto"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endStroke}
        onMouseLeave={endStroke}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endStroke}
      />
    </div>
  );
};