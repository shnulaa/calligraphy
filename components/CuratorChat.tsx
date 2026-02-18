import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { generateCuratorResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface CuratorChatProps {
  artifactContext: string;
  lang: 'en' | 'cn';
  externalMessage?: string | null;
  onMessageDisplayed?: () => void;
}

export const CuratorChat: React.FC<CuratorChatProps> = ({ artifactContext, lang, externalMessage, onMessageDisplayed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 拖动和调整大小的状态
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 384, height: 500 }); // 默认 w-96 = 384px
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // 初始化位置（右下角）
  useEffect(() => {
    if (isOpen && position.x === 0 && position.y === 0) {
      setPosition({
        x: window.innerWidth - 384 - 24,
        y: window.innerHeight - 500 - 24
      });
    }
  }, [isOpen]);

  // 处理外部消息（AI鉴宝结果）
  useEffect(() => {
    if (externalMessage) {
      // 处理用户消息
      if (externalMessage.startsWith('USER_MESSAGE:')) {
        const userText = externalMessage.replace('USER_MESSAGE:', '');
        const userMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          text: userText
        };
        setMessages(prev => [...prev, userMsg]);
        setIsOpen(true); // 自动打开对话框
        onMessageDisplayed?.();
        // 延迟滚动，确保DOM已更新
        setTimeout(scrollToBottom, 100);
      }
      // 处理loading状态
      else if (externalMessage === 'LOADING') {
        setIsThinking(true);
        onMessageDisplayed?.();
        setTimeout(scrollToBottom, 100);
      }
      // 处理AI回复
      else if (externalMessage.startsWith('AI_RESPONSE:')) {
        const aiText = externalMessage.replace('AI_RESPONSE:', '');
        const modelMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'model',
          text: aiText
        };
        setMessages(prev => [...prev, modelMsg]);
        setIsThinking(false);
        onMessageDisplayed?.();
        setTimeout(scrollToBottom, 100);
      }
    }
  }, [externalMessage, onMessageDisplayed]);

  // Initialize greeting when lang changes
  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'model',
      text: lang === 'cn' 
        ? '您好，我是这里的策展人。关于这幅作品的笔法、历史或意境，您有什么想了解的吗？'
        : 'Greetings. I am the curator of this exhibit. Feel free to ask about the brushwork, history, or the emotions hidden within the ink.'
    }]);
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isThinking]); // 添加 isThinking 依赖

  // 处理拖动
  const handleMouseDownDrag = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMoveDrag = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUpDrag = () => {
    setIsDragging(false);
  };

  // 处理调整大小 - 保持左上角固定
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  const handleMouseMoveResize = (e: MouseEvent) => {
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      // 只改变尺寸，不改变位置（左上角固定）
      setSize({
        width: Math.max(300, resizeStart.width + deltaX),
        height: Math.max(400, resizeStart.height + deltaY)
      });
    }
  };

  const handleMouseUpResize = () => {
    setIsResizing(false);
  };

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMoveDrag);
      window.addEventListener('mouseup', handleMouseUpDrag);
      return () => {
        window.removeEventListener('mousemove', handleMouseMoveDrag);
        window.removeEventListener('mouseup', handleMouseUpDrag);
      };
    }
  }, [isDragging, dragStart, position]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMoveResize);
      window.addEventListener('mouseup', handleMouseUpResize);
      return () => {
        window.removeEventListener('mousemove', handleMouseMoveResize);
        window.removeEventListener('mouseup', handleMouseUpResize);
      };
    }
  }, [isResizing, resizeStart]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const contextWithLang = artifactContext;
    const responseText = await generateCuratorResponse(input, contextWithLang, lang);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsThinking(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      
      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className="pointer-events-auto bg-paper shadow-2xl rounded-lg border border-stone-300 overflow-hidden flex flex-col"
          style={{
            position: 'fixed',
            width: `${size.width}px`,
            height: `${size.height}px`,
            top: `${position.y || window.innerHeight - 500 - 24}px`,
            left: `${position.x || window.innerWidth - 384 - 24}px`,
            cursor: isDragging ? 'grabbing' : 'default'
          }}
        >
          {/* Header - 可拖动区域 */}
          <div 
            className="bg-ink text-paper p-4 flex justify-between items-center cursor-move select-none"
            onMouseDown={handleMouseDownDrag}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cinnabar" />
              <span className="font-serif font-bold tracking-wider">{lang === 'cn' ? 'AI 策展人' : 'AI Curator'}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-cinnabar transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-rice-paper">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 text-sm leading-relaxed rounded-lg border ${
                    msg.role === 'user'
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-white/80 text-ink border-stone-200 shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words font-song">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-white/80 p-3 rounded-lg text-xs text-stone-500 italic flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-cinnabar rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-cinnabar rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-cinnabar rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  {lang === 'cn' ? '思考中...' : 'Contemplating...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-stone-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'cn' ? "向策展人提问..." : "Ask about the artwork..."}
              className="flex-1 bg-transparent border-none focus:ring-0 text-ink placeholder-stone-400 font-song text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="p-2 text-ink hover:text-cinnabar disabled:opacity-30 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>

          {/* 调整大小手柄 */}
          <div 
            className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleMouseDownResize}
            style={{
              background: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%)'
            }}
          />
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto fixed bottom-6 right-6 group flex items-center gap-3 bg-ink text-paper py-3 px-5 rounded-full shadow-lg hover:bg-zinc-800 transition-all hover:scale-105"
      >
        <span className={`font-serif text-sm tracking-widest transition-all duration-300 ${isOpen ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
          {lang === 'cn' ? '咨询策展人' : 'ASK CURATOR'}
        </span>
        <MessageSquare size={20} className="group-hover:text-cinnabar transition-colors" />
      </button>
    </div>
  );
};