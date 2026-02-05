// 获取后端配置
const getBackendUrl = () => {
  if (typeof window !== 'undefined') {
    const port = window.location.port;
    // 只要不是直接访问开发端口 33000/33001，都通过代理
    const isDevelopment = port === '33000' || port === '33001';
    
    if (!isDevelopment) {
      // 使用相对路径，通过 Nginx 代理
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
