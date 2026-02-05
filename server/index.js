import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// NVIDIA API 配置
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_API_URL = process.env.NVIDIA_API_URL;
const NVIDIA_MODEL = process.env.NVIDIA_MODEL;

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// AI 分析书法图片
app.post('/api/analyze-calligraphy', async (req, res) => {
  try {
    const { imageBase64, artifactTitle, lang } = req.body;

    if (!imageBase64 || !artifactTitle) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 压缩图片：将base64转换为buffer，然后重新编码为较小的base64
    // 注意：这里我们直接使用原始图片，因为浏览器端的Canvas压缩有CORS问题
    // 如果图片太大，可以考虑在这里添加sharp库进行服务端压缩
    
    console.log('收到图片，大小:', (imageBase64.length / 1024).toFixed(2), 'KB');

    const systemPrompt = lang === 'cn' 
      ? `你是一位资深的中国书法鉴赏专家和古文字研究学者。
         
         用户正在欣赏《${artifactTitle}》这幅书法作品的局部图片。
         
         请按以下顺序分析这个局部画面：
         1. **释文**：识别并写出图片中的文字内容（从右至左，从上至下）
         2. **文意**：解释这段文字的含义和背景
         3. **题跋信息**（如适用）：如果是后人题跋，请说明题跋者身份、朝代
         4. **书法特点**：简要点评笔法、墨色、结构等艺术特色
         
         请用优雅、学术但易懂的语言，控制在250字以内。
         注意：这是作品的局部图片，请针对这个局部进行分析。`
      : `You are a senior expert in Chinese calligraphy appreciation and classical Chinese literature.
         
         The user is viewing a partial image of the calligraphy work "${artifactTitle}".
         
         Please analyze this partial view in the following order:
         1. **Transcription**: Identify and write out the characters in the image (right to left, top to bottom)
         2. **Meaning**: Explain the meaning and context of this text
         3. **Inscription Info** (if applicable): If this is a later inscription, identify the inscriber and dynasty
         4. **Calligraphy Features**: Briefly comment on brushwork, ink tone, structure, etc.
         
         Please use elegant, scholarly yet accessible language, within 250 words.
         Note: This is a partial image of the work, please analyze this specific section.`;

    const userPrompt = lang === 'cn' 
      ? `请识别并赏析《${artifactTitle}》这个局部的文字内容和书法艺术：` 
      : `Please identify and analyze the text content and calligraphy art of this section from "${artifactTitle}":`;

    // 调用 NVIDIA API (OpenAI 兼容格式)
    const response = await fetch(`${NVIDIA_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 16000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API Error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    const analysis = data.choices?.[0]?.message?.content || 
      (lang === 'cn' ? '墨韵无言，静待品味。' : 'The ink speaks in silence.');

    console.log('Analysis result:', analysis);
    res.json({ analysis });

  } catch (error) {
    console.error('Analysis Error:', error);
    res.status(500).json({ 
      error: lang === 'cn' 
        ? '笔墨精灵今日静默，请稍后再试。' 
        : 'The spirits of the ink are quiet today. Please try again later.'
    });
  }
});

// 策展人对话
app.post('/api/curator-chat', async (req, res) => {
  try {
    const { query, context, lang } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Missing query' });
    }

    const systemPrompt = lang === 'cn'
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

    const response = await fetch(`${NVIDIA_API_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 3000,
        temperature: 0.8
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API Error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 
      (lang === 'cn' ? '我静默沉思中。（未生成回复）' : 'I remain silent in contemplation. (No response generated)');

    res.json({ answer });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ 
      error: lang === 'cn'
        ? '笔墨精灵今日静默，请稍后再试。'
        : 'The spirits of the ink are quiet today. Please try again later.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🎨 Calligraphy Museum API Server running on http://localhost:${PORT}`);
  console.log(`📝 Using model: ${NVIDIA_MODEL}`);
});
