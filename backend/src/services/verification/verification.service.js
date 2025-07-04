const GeminiService = require('../geocoding/gemini.service'); // Re-using the Gemini service
const CacheService = require('../../utils/cache');

async function verifyImage(imageUrl) {
  const cacheKey = `verify_${imageUrl}`;
  const result = await CacheService.getOrFetch(
    cacheKey,
    async () => {
      const prompt = `Analyze this image for disaster authenticity. Check for signs of manipulation, context consistency, and disaster indicators. Return JSON: {"authentic": boolean, "confidence": number, "reasoning": string}`;
      // This assumes a method `callGeminiVision` exists in GeminiService
      // We will need to add it.
      return await GeminiService.callGeminiVision(prompt, imageUrl);
    },
    3600 // Cache for 1 hour
  );
  return result;
}

module.exports = {
  verifyImage,
};
