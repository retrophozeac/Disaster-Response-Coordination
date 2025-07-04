const { GoogleGenerativeAI } = require("@google/generative-ai");
const cache = require('../../utils/cache');
const crypto = require('crypto');
const axios = require('axios');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const extractLocation = async (description) => {
  const cacheKey = `location_${crypto.createHash('md5').update(description).digest('hex')}`;
  
  return cache.getOrFetch(cacheKey, async () => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
      const prompt = `Extract the specific location name from this disaster description. Return only the location (e.g., "Area, City, State/Country") or "NONE" if no location can be clearly identified. Do not add any extra explanation. Description: "${description}"`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
      
      return text === 'NONE' ? null : text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // In a real production app, you might want to throw the error
      // or handle it more gracefully (e.g., return a default value).
      return null;
    }
  });
};

const geminiVerifyImage = async (prompt) => {
  try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Gemini response:', text);
      const parsed = extractJsonFromLLMResponse(text);
      console.log('Parsed JSON:', parsed);
      return parsed === 'NONE' ? null : parsed;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // In a real production app, you might want to throw the error
      // or handle it more gracefully (e.g., return a default value).
      return null;
    }
};
function extractJsonFromLLMResponse(text) {
  // Extract content between ```json and ```
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) throw new Error("JSON block not found");

  const jsonString = match[1];

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw new Error("Failed to parse JSON: " + err.message);
  }
}

module.exports = {
  extractLocation,
  geminiVerifyImage,
};
