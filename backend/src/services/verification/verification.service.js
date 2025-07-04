const GeminiService = require('../geocoding/gemini.service'); // Re-using the Gemini service
const CacheService = require('../../utils/cache');

async function verifyImage(imageUrl,content) {
  const cacheKey = `verify_${imageUrl}`;
  console.log('Verifying image:', imageUrl);
  const result = await CacheService.getOrFetch(
    cacheKey,
    async () => {
      const prompt = `Analyze the image at this url "${imageUrl}" for disaster authenticity. Check for signs of manipulation, context consistency, and disaster indicators. Return JSON: {"authentic": boolean, "confidence": number, "reasoning": string}`;
      // This assumes a method `callGeminiVision` exists in GeminiService
      // We will need to add it.
      return await GeminiService.geminiVerifyImage(prompt);
    },
    3600 // Cache for 1 hour
  );
  return result;
}

module.exports = {
  verifyImage,
};
