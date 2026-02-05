import React, { useState } from 'react';
import { Sparkles, X, Loader } from 'lucide-react';
import { Artifact } from '../types';

interface AIAppraisalButtonProps {
  artifact: Artifact;
  lang: 'en' | 'cn';
}

export const AIAppraisalButton: React.FC<AIAppraisalButtonProps> = ({ artifact, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAppraising, setIsAppraising] = useState(false);
  const [appraisal, setAppraisal] = useState<string | null>(null);

  const handleAppraise = async () => {
    setIsOpen(true);
    setIsAppraising(true);
    setAppraisal(null);

    try {
      // 获取所有图片并发送到后端
      const imageUrls = artifact.images;
      
      // 使用第一张图片作为代表进行鉴定
      const firstImageUrl = imageUrls[0];
      
      // 将图片转换为 base64
      const response = await fetch(firstImageUrl);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.readAsDataURL(blob);
      });

      // 调用后端 API
      const apiResponse = await fetch('http://localhost:3001/api/analyze-calligraphy', {
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
        setAppraisal(data.analysis);
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Appraisal Error:', error);
      setAppraisal(
        lang === 'cn'
          ? '鉴宝过程中出现问题，请稍后再试。'
          : 'An error occurred during appraisal. Please try again.'
      );
    } finally {
      setIsAppraising(false);
    }
  };

  return (
    <>
      {/* Appraisal Button */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={handleAppraise}
          className="group bg-cinnabar hover:bg-cinnabar-dark text-paper px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 font-serif text-lg"
        >
          <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="font-bold tracking-wider">
            {lang === 'cn' ? 'AI 鉴宝' : 'AI Appraisal'}
          </span>
        </button>
      </div>

      {/* Appraisal Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-paper rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-cinnabar to-cinnabar-dark text-paper p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Sparkles size={24} className={isAppraising ? 'animate-pulse' : ''} />
                <h3 className="font-serif text-2xl font-bold tracking-wider">
                  {lang === 'cn' ? 'AI 鉴宝' : 'AI Appraisal'}
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Artifact Info */}
              <div className="mb-6 pb-6 border-b border-stone-200">
                <h4 className="font-song text-2xl text-ink mb-2">
                  {artifact.title[lang]}
                </h4>
                <p className="font-serif text-stone-500 text-sm">
                  {artifact.artist[lang]} · {artifact.dynasty[lang]}
                </p>
              </div>

              {/* Appraisal Status/Result */}
              <div className="min-h-[200px]">
                {isAppraising ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader size={48} className="text-cinnabar animate-spin" />
                    <p className="font-song text-lg text-stone-600 animate-pulse">
                      {lang === 'cn' ? '鉴宝中，请稍候...' : 'Appraising, please wait...'}
                    </p>
                  </div>
                ) : appraisal ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-cinnabar mb-4">
                      <Sparkles size={20} />
                      <span className="font-serif text-sm tracking-wider uppercase">
                        {lang === 'cn' ? '鉴定结果' : 'Appraisal Result'}
                      </span>
                    </div>
                    <div className="bg-gradient-to-br from-stone-50 to-white p-6 rounded-lg border border-stone-200 shadow-inner">
                      <p className="font-song text-base leading-relaxed text-ink whitespace-pre-wrap">
                        {appraisal}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Close Button */}
              {!isAppraising && appraisal && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-ink text-paper px-6 py-2 rounded-full hover:bg-cinnabar transition-colors font-serif"
                  >
                    {lang === 'cn' ? '关闭' : 'Close'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
