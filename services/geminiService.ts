import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

// Safely initialize API
let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateCuratorResponse = async (
  query: string, 
  context: string
): Promise<string> => {
  if (!ai) {
    return "I apologize, but I am currently unable to access the museum archives (API Key missing).";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = `
      You are an expert curator at a prestigious digital museum of Chinese Calligraphy. 
      Your tone is elegant, scholarly, yet accessible—like a wise professor showing a guest around a private collection.
      
      Focus on:
      1. Aesthetic appreciation (brushwork, ink tone, composition).
      2. Historical context (dynasties, artist biography).
      3. Philosophical depth (Taoism, nature, emotion).

      The current artifact being viewed is described as: ${context}.
      
      Keep answers concise (under 150 words) unless asked for a detailed history. 
      Use "We" to refer to the museum.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: query,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "I remain silent in contemplation. (No response generated)";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The spirits of the ink are quiet today. Please try asking again later.";
  }
};