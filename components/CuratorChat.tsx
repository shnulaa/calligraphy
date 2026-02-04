import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { generateCuratorResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface CuratorChatProps {
  artifactContext: string;
  lang: 'en' | 'cn';
}

export const CuratorChat: React.FC<CuratorChatProps> = ({ artifactContext, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  }, [messages, isOpen]);

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

    const contextWithLang = `${artifactContext} (Please answer in ${lang === 'cn' ? 'Chinese' : 'English'})`;
    const responseText = await generateCuratorResponse(input, contextWithLang);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsThinking(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none md:pointer-events-auto ${isOpen ? 'w-full md:w-96' : 'w-auto'}`}>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto bg-paper shadow-2xl rounded-lg border border-stone-300 w-full mb-4 overflow-hidden flex flex-col h-[500px] transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-ink text-paper p-4 flex justify-between items-center">
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
                  {msg.text}
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
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group flex items-center gap-3 bg-ink text-paper py-3 px-5 rounded-full shadow-lg hover:bg-zinc-800 transition-all hover:scale-105"
      >
        <span className={`font-serif text-sm tracking-widest transition-all duration-300 ${isOpen ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
          {lang === 'cn' ? '咨询策展人' : 'ASK CURATOR'}
        </span>
        <MessageSquare size={20} className="group-hover:text-cinnabar transition-colors" />
      </button>
    </div>
  );
};