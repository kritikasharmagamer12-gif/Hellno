import { GoogleGenAI } from "@google/genai";
import { GroundingChunk } from '../types';

const getClient = () => {
    // In a real app, strict env check. For this demo, we assume process.env.API_KEY is available.
    // If not, this will throw.
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const findNearestRestaurants = async (
  latitude: number,
  longitude: number,
  customQuery?: string
): Promise<{ text: string; locations: GroundingChunk[] }> => {
  try {
    const ai = getClient();
    const modelId = "gemini-2.5-flash"; // Required model for Maps grounding

    const prompt = customQuery 
      ? `Find Singh's Chaap India outlets near ${customQuery}. If none found, find highly rated North Indian restaurants near ${customQuery}. Provide a list.`
      : "Find the nearest Singh's Chaap India restaurant. If strictly none are found under that exact name nearby, find the best rated North Indian Chaap restaurants near my location.";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude,
              longitude
            }
          }
        }
      }
    });

    const text = response.text || "No details found.";
    // Extract grounding chunks which contain the map data/links
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Filter mainly for maps chunks, but web chunks are okay too if maps fail
    const locations = groundingChunks.filter(chunk => chunk.maps || chunk.web);

    return { text, locations };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
        text: "Unable to fetch location data at this moment. Please try searching on Google Maps directly.", 
        locations: [] 
    };
  }
};