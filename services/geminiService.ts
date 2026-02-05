// 获取后端配置
const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    // 检查是否通过反向代理访问（没有端口号或标准端口，或者是48888端口）
    const port = window.location.port;
    const isProxied = port === '' || 
                      port === '80' || 
                      port === '443' ||
                      port === '48888';
    
    if (isProxied) {
      // 使用相对路径，Nginx会代理到后端
      return '';
    }
    
    // 开发环境：直接访问后端端口
    return `${window.location.protocol}//${window.location.hostname}:33001`;
  }
  
  return 'http://localhost:33001';
};

const BACKEND_URL = getBackendUrl();

export const generateCuratorResponse = async (
  query: string, 
  context: string,
  lang: 'en' | 'cn' = 'en'
): Promise<string> => {
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
    } else {
      throw new Error('API request failed');
    }
  } catch (error) {
    console.error('Backend API error:', error);
    return lang === 'cn'
      ? "抱歉，我目前无法访问博物馆档案。请稍后再试。"
      : "I apologize, but I am currently unable to access the museum archives. Please try again later.";
  }
};

export const analyzeCalligraphyImage = async (
  imageDataUrl: string,
  artifactTitle: string,
  lang: 'en' | 'cn' = 'en'
): Promise<string> => {
  try {
    const base64 = imageDataUrl.split(',')[1];
    
    const response = await fetch(`${BACKEND_URL}/api/analyze-calligraphy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageBase64: base64,
        artifactTitle,
        lang
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.analysis;
    } else {
      throw new Error('API request failed');
    }
  } catch (error) {
    console.error('Image analysis error:', error);
    return lang === 'cn'
      ? "赏析过程中出现问题，请稍后再试。"
      : "An error occurred during analysis. Please try again.";
  }
};
