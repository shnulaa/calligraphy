import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || '';
const BACKEND_URL = 'http://localhost:3001';

// Safely initialize API
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateCuratorResponse = async (
  query: string, 
  context: string,
  lang: 'en' | 'cn' = 'en'
): Promise<string> => {
  // 优先使用后端 API
  try {
    const response = await fetch(`${BACKEND_URL}/api/curator-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, context, lang })
    });

    if (response.ok) {
      const data = await response.json();
      return data.answer;
    }
  } catch (error) {
    console.log('Backend unavailable, falling back to Gemini:', error);
  }

  // 后备方案：使用 Gemini
  if (!ai) {
    return lang === 'cn'
      ? "抱歉，我目前无法访问博物馆档案（API Key 缺失）。"
      : "I apologize, but I am currently unable to access the museum archives (API Key missing).";
  }

  try {
    const model = 'gemini-2.0-flash-exp';
    const systemInstruction = lang === 'cn'
      ? `你是一位中国书法博物馆的资深策展人。你的语气优雅、学术但易懂——就像一位智慧的教授带领客人参观私人收藏。
         
         关注重点：
         1. 美学欣赏（笔法、墨色、构图）
         2. 历史背景（朝代、艺术家传记）
         3. 哲学深度（道家思想、自然、情感）

         当前正在欣赏的作品：${context}
         
         除非被要求详细讲解历史，否则请保持回答简洁（150字以内）。
         使用"我们"来指代博物馆。`
      : `You are an expert curator at a prestigious digital museum of Chinese Calligraphy. 
         Your tone is elegant, scholarly, yet accessible—like a wise professor showing a guest around a private collection.
         
         Focus on:
         1. Aesthetic appreciation (brushwork, ink tone, composition).
         2. Historical context (dynasties, artist biography).
         3. Philosophical depth (Taoism, nature, emotion).

         The current artifact being viewed is described as: ${context}.
         
         Keep answers concise (under 150 words) unless asked for a detailed history. 
         Use "We" to refer to the museum.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: query,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || (lang === 'cn' ? '我静默沉思中。（未生成回复）' : 'I remain silent in contemplation. (No response generated)');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return lang === 'cn'
      ? '笔墨精灵今日静默，请稍后再试。'
      : 'The spirits of the ink are quiet today. Please try asking again later.';
  }
};

export const analyzeCalligraphyImage = async (
  imageDataUrl: string,
  artifactTitle: string,
  lang: 'en' | 'cn'
): Promise<string> => {
  // 优先使用后端 API
  try {
    const imageBase64 = imageDataUrl.split(',')[1];
    
    const response = await fetch(`${BACKEND_URL}/api/analyze-calligraphy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageBase64, artifactTitle, lang })
    });

    if (response.ok) {
      const data = await response.json();
      return data.analysis;
    }
  } catch (error) {
    console.log('Backend unavailable, falling back to Gemini:', error);
  }

  // 后备方案：使用 Gemini
  if (!ai) {
    return lang === 'cn' 
      ? "抱歉，AI 赏析功能暂时无法使用（缺少 API Key）。" 
      : "I apologize, but AI analysis is currently unavailable (API Key missing).";
  }

  try {
    const model = 'gemini-2.0-flash-exp';
    
    const systemInstruction = lang === 'cn' 
      ? `你是一位资深的中国书法鉴赏专家和艺术评论家。请从以下角度分析这幅书法作品：
         1. 笔法特点（用笔、结构、章法）
         2. 墨色变化与意境
         3. 艺术价值与历史意义
         4. 情感表达与文化内涵
         
         作品名称：${artifactTitle}
         
         请用优雅、学术但易懂的语言，控制在200字以内。`
      : `You are a senior expert in Chinese calligraphy appreciation and art criticism. Please analyze this calligraphy work from the following perspectives:
         1. Brushwork characteristics (stroke technique, structure, composition)
         2. Ink tone variations and artistic conception
         3. Artistic value and historical significance
         4. Emotional expression and cultural connotations
         
         Artwork title: ${artifactTitle}
         
         Please use elegant, scholarly yet accessible language, within 200 words.`;

    const base64Data = imageDataUrl.split(',')[1];
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        {
          role: 'user',
          parts: [
            { text: lang === 'cn' ? '请赏析这幅书法作品的画面内容：' : 'Please analyze this calligraphy artwork:' },
            { 
              inlineData: {
                mimeType: 'image/png',
                data: base64Data
              }
            }
          ]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || (lang === 'cn' ? '墨韵无言，静待品味。' : 'The ink speaks in silence.');
  } catch (error) {
    console.error("Gemini Vision API Error:", error);
    return lang === 'cn' 
      ? '笔墨精灵今日静默，请稍后再试。' 
      : 'The spirits of the ink are quiet today. Please try again later.';
  }
};
