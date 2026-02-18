import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import sharp from 'sharp';

dotenv.config();

const app = express();
const PORT = 33001;  // 固定端口

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 请求日志中间件
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyLog = { ...req.body };
    // 隐藏敏感信息
    if (bodyLog.imageBase64) {
      bodyLog.imageBase64 = `[Base64 Image: ${(bodyLog.imageBase64.length / 1024).toFixed(2)} KB]`;
    }
    console.log(`[${timestamp}] Request body:`, JSON.stringify(bodyLog, null, 2));
  }
  next();
});

// API 配置 - 支持多个 API Key 轮询
const API_KEYS = process.env.API_KEY.split(',').map(key => key.trim()).filter(key => key.length > 0);
const API_URL = process.env.API_URL;
const MODEL = process.env.MODEL;

let currentKeyIndex = 0;
const failedKeys = new Set(); // 记录失败的 key
const keyFailureTime = new Map(); // 记录每个 key 失败的时间
const KEY_RETRY_INTERVAL = 5 * 60 * 1000; // 5分钟后重试失败的 key

// 定期清理过期的失败记录（每分钟检查一次）
setInterval(() => {
  const now = Date.now();
  let clearedCount = 0;
  
  for (const [key, failTime] of keyFailureTime.entries()) {
    if (now - failTime > KEY_RETRY_INTERVAL) {
      failedKeys.delete(key);
      keyFailureTime.delete(key);
      clearedCount++;
    }
  }
  
  if (clearedCount > 0) {
    console.log(`🔄 [API Key] 已恢复 ${clearedCount} 个失败的 Key，当前失败: ${failedKeys.size}/${API_KEYS.length}`);
  }
}, 60 * 1000); // 每分钟检查一次

// 获取下一个可用的 API Key（轮询，跳过失败的）
function getNextApiKey() {
  const maxAttempts = API_KEYS.length;
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const key = API_KEYS[currentKeyIndex];
    const keyNumber = currentKeyIndex + 1;
    
    // 移动到下一个索引
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    
    // 如果这个 key 没有失败过，使用它
    if (!failedKeys.has(key)) {
      console.log(`🔑 [API Key] 使用第 ${keyNumber} 个 Key (共 ${API_KEYS.length} 个, 失败: ${failedKeys.size} 个)`);
      return { key, index: keyNumber - 1, allFailed: false };
    }
    
    attempts++;
  }
  
  // 所有 key 都失败了
  console.log(`❌ [API Key] 所有 Key 都已失败 (${failedKeys.size}/${API_KEYS.length})`);
  return { key: null, index: -1, allFailed: true };
}

// 标记 API Key 为失败
function markKeyAsFailed(keyIndex) {
  if (keyIndex >= 0 && keyIndex < API_KEYS.length) {
    const key = API_KEYS[keyIndex];
    failedKeys.add(key);
    keyFailureTime.set(key, Date.now());
    console.log(`❌ [API Key] 标记第 ${keyIndex + 1} 个 Key 为失败 (失败总数: ${failedKeys.size}/${API_KEYS.length}，将在 5 分钟后重试)`);
  }
}

// 图片压缩函数
async function compressImage(base64Image, maxWidth = 1024, quality = 80) {
  try {
    // 移除 data:image/xxx;base64, 前缀（如果有）
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    const originalSize = imageBuffer.length;
    console.log(`📸 [压缩] 原始图片大小: ${(originalSize / 1024).toFixed(2)} KB`);
    
    // 使用 sharp 压缩图片
    const compressedBuffer = await sharp(imageBuffer)
      .resize(maxWidth, null, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality })
      .toBuffer();
    
    const compressedSize = compressedBuffer.length;
    const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
    console.log(`✅ [压缩] 压缩后大小: ${(compressedSize / 1024).toFixed(2)} KB (压缩率: ${compressionRatio}%)`);
    
    return compressedBuffer.toString('base64');
  } catch (error) {
    console.error('❌ [压缩] 图片压缩失败:', error.message);
    // 如果压缩失败，返回原图
    return base64Image.replace(/^data:image\/\w+;base64,/, '');
  }
}

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// AI 分析书法图片
app.post('/api/analyze-calligraphy', async (req, res) => {
  const startTime = Date.now();
  console.log('📸 [AI鉴宝] 开始处理图片分析请求...');
  
  const { imageBase64, artifactTitle, lang = 'cn' } = req.body;
  
  try {

    if (!imageBase64 || !artifactTitle) {
      console.log('❌ [AI鉴宝] 缺少必需字段');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(`📝 [AI鉴宝] 作品: ${artifactTitle}, 语言: ${lang}`);
    console.log(`📊 [AI鉴宝] 原始图片大小: ${(imageBase64.length / 1024).toFixed(2)} KB`);

    // 压缩图片
    const compressedImage = await compressImage(imageBase64);

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

    console.log(`🚀 [AI鉴宝] 调用 API: ${API_URL}`);
    console.log(`🤖 [AI鉴宝] 使用模型: ${MODEL}`);

    // 获取轮询的 API Key
    const { key: apiKey, index: keyIndex, allFailed } = getNextApiKey();
    
    // 如果所有 key 都失败了，返回额度用完提示
    if (allFailed) {
      console.log('💸 [AI鉴宝] 所有 API Key 额度已用完');
      return res.status(503).json({ 
        error: lang === 'cn' 
          ? '您的额度已经用完，暂时不能鉴宝了，请稍后再试！' 
          : 'Your quota has been exhausted. Please try again later.'
      });
    }

    // 调用 Gemini API
    const apiEndpoint = `${API_URL}/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    
    let response;
    try {
      response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt + '\n\n' + userPrompt
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: compressedImage
                  }
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 16000,
            temperature: 0.7
          }
        }),
        // 添加超时设置
        signal: AbortSignal.timeout(60000) // 60秒超时
      });
    } catch (fetchError) {
      console.error('❌ [AI鉴宝] 网络请求失败:', fetchError.message);
      
      // 如果是网络错误，标记这个 key 为失败
      if (fetchError.name === 'AbortError' || fetchError.code === 'ECONNRESET' || fetchError.message.includes('network')) {
        markKeyAsFailed(keyIndex);
      }
      
      throw new Error(`Network error: ${fetchError.message}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [AI鉴宝] API错误:', errorText);
      
      // 标记这个 key 为失败
      markKeyAsFailed(keyIndex);
      
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const elapsedTime = Date.now() - startTime;
    console.log(`✅ [AI鉴宝] API响应成功 (耗时: ${elapsedTime}ms)`);
    console.log(`📊 [AI鉴宝] Token使用: prompt=${data.usageMetadata?.promptTokenCount}, completion=${data.usageMetadata?.candidatesTokenCount}`);
    
    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      (lang === 'cn' ? '墨韵无言，静待品味。' : 'The ink speaks in silence.');

    console.log(`📝 [AI鉴宝] 分析结果长度: ${analysis.length} 字符`);
    res.json({ analysis });

  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error(`❌ [AI鉴宝] 处理失败 (耗时: ${elapsedTime}ms):`, error.message);
    
    // 根据错误类型返回不同的提示
    let errorMessage;
    if (error.message.includes('Network error') || error.message.includes('ECONNRESET')) {
      errorMessage = lang === 'cn'
        ? '网络连接失败，请检查网络设置或稍后再试。'
        : 'Network connection failed. Please check your network settings or try again later.';
    } else {
      errorMessage = lang === 'cn' 
        ? '笔墨精灵今日静默，请稍后再试。' 
        : 'The spirits of the ink are quiet today. Please try again later.';
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

// 策展人对话
app.post('/api/curator-chat', async (req, res) => {
  const startTime = Date.now();
  console.log('💬 [策展人] 开始处理对话请求...');
  
  const { query, context, lang = 'cn' } = req.body;
  
  try {

    if (!query) {
      console.log('❌ [策展人] 缺少查询内容');
      return res.status(400).json({ error: 'Missing query' });
    }

    console.log(`📝 [策展人] 问题: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}`);
    console.log(`🎨 [策展人] 上下文: ${context.substring(0, 50)}...`);
    console.log(`🌐 [策展人] 语言: ${lang}`);

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

    console.log(`🚀 [策展人] 调用 API: ${API_URL}`);
    console.log(`🤖 [策展人] 使用模型: ${MODEL}`);

    // 获取轮询的 API Key
    const { key: apiKey, index: keyIndex, allFailed } = getNextApiKey();
    
    // 如果所有 key 都失败了，返回额度用完提示
    if (allFailed) {
      console.log('💸 [策展人] 所有 API Key 额度已用完');
      return res.status(503).json({ 
        error: lang === 'cn' 
          ? '您的额度已经用完，暂时不能对话了，请稍后再试！' 
          : 'Your quota has been exhausted. Please try again later.'
      });
    }

    // 调用 Gemini API
    const apiEndpoint = `${API_URL}/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    
    let response;
    try {
      response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: systemPrompt + '\n\n' + query
                }
              ]
            }
          ],
          generationConfig: {
            maxOutputTokens: 3000,
            temperature: 0.8
          }
        }),
        // 添加超时设置
        signal: AbortSignal.timeout(30000) // 30秒超时
      });
    } catch (fetchError) {
      console.error('❌ [策展人] 网络请求失败:', fetchError.message);
      
      // 如果是网络错误，标记这个 key 为失败
      if (fetchError.name === 'AbortError' || fetchError.code === 'ECONNRESET' || fetchError.message.includes('network')) {
        markKeyAsFailed(keyIndex);
      }
      
      throw new Error(`Network error: ${fetchError.message}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [策展人] API错误:', errorText);
      
      // 标记这个 key 为失败
      markKeyAsFailed(keyIndex);
      
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const elapsedTime = Date.now() - startTime;
    console.log(`✅ [策展人] API响应成功 (耗时: ${elapsedTime}ms)`);
    console.log(`📊 [策展人] Token使用: prompt=${data.usageMetadata?.promptTokenCount}, completion=${data.usageMetadata?.candidatesTokenCount}`);
    
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      (lang === 'cn' ? '我静默沉思中。（未生成回复）' : 'I remain silent in contemplation. (No response generated)');

    console.log(`📝 [策展人] 回答长度: ${answer.length} 字符`);
    res.json({ answer });

  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error(`❌ [策展人] 处理失败 (耗时: ${elapsedTime}ms):`, error.message);
    
    // 根据错误类型返回不同的提示
    let errorMessage;
    if (error.message.includes('Network error') || error.message.includes('ECONNRESET')) {
      errorMessage = lang === 'cn'
        ? '网络连接失败，请检查网络设置或稍后再试。'
        : 'Network connection failed. Please check your network settings or try again later.';
    } else {
      errorMessage = lang === 'cn'
        ? '笔墨精灵今日静默，请稍后再试。'
        : 'The spirits of the ink are quiet today. Please try again later.';
    }
    
    res.status(500).json({ error: errorMessage });
  }
});

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🎨 书法博物馆 API 服务器');
  console.log('='.repeat(60));
  console.log(`📡 服务地址: http://localhost:${PORT}`);
  console.log(`🤖 AI模型: ${MODEL}`);
  console.log(`🔗 API地址: ${API_URL}`);
  console.log(`🔑 API Keys: ${API_KEYS.length} 个（轮询模式）`);
  console.log(`🔄 失败重试: 5 分钟后自动恢复`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log('='.repeat(60));
  console.log('');
});
