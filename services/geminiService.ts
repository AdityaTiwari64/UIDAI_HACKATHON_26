
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

export const generateAIInsights = async (context: string) => {
  if (!API_KEY) return "AI Insights unavailable. Please provide an API key.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Based on the following data context for the UIDAI Data Management Portal, provide 3 short, actionable AI insights for infrastructure administrators.
      Context: ${context}
      Return the output as a clean list.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to fetch AI insights. Check system logs.";
  }
};

export const runSmartForecast = async (model: string, region: string, horizon: string) => {
  if (!API_KEY) return null;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: `Predict system traffic for a ${horizon} horizon in the ${region} region using the ${model} model. Return a JSON object with a 'dataPoints' array of 7 items, each having 'day', 'actual', 'predicted', and 'confidenceLow', 'confidenceHigh' properties (values 0-100).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dataPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  actual: { type: Type.NUMBER },
                  predicted: { type: Type.NUMBER },
                  confidenceLow: { type: Type.NUMBER },
                  confidenceHigh: { type: Type.NUMBER }
                }
              }
            },
            summary: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Forecasting Error:", error);
    return null;
  }
};
