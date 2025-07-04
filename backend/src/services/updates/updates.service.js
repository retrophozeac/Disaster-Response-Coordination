const axios = require('axios');
const cheerio = require('cheerio');
const CacheService = require('../../utils/cache');

const FEMA_URL = 'https://www.fema.gov/disasters';
const RED_CROSS_URL = 'https://www.redcross.org/about-us/news-and-events/news.html';

async function fetchFemaUpdates() {
  try {
    const { data } = await axios.get(FEMA_URL);
    const $ = cheerio.load(data);
    const updates = [];
    $('.usa-card__container').each((i, el) => {
      const title = $(el).find('.usa-card__heading').text().trim();
      const link = $(el).find('a').attr('href');
      if (title && link) {
        updates.push({
          title,
          link: `https://www.fema.gov${link}`,
          source: 'FEMA',
        });
      }
    });
    return updates;
  } catch (error) {
    console.error('Error fetching FEMA updates:', error);
    return [];
  }
}

async function fetchRedCrossUpdates() {
  try {
    const { data } = await axios.get(RED_CROSS_URL);
    const $ = cheerio.load(data);
    const updates = [];
    $('.newsroom-feed-item').each((i, el) => {
      const title = $(el).find('.title a').text().trim();
      const link = $(el).find('.title a').attr('href');
      if (title && link) {
        updates.push({
          title,
          link: `https://www.redcross.org${link}`,
          source: 'Red Cross',
        });
      }
    });
    return updates;
  } catch (error) {
    console.error('Error fetching Red Cross updates:', error);
    return [];
  }
}

async function fetchUpdates() {
  const cacheKey = 'official_updates';
  const updates = await CacheService.getOrFetch(cacheKey, async () => {
    const femaUpdates = await fetchFemaUpdates();
    const redCrossUpdates = await fetchRedCrossUpdates();
    return [...femaUpdates, ...redCrossUpdates];
  }, 3600); // Cache for 1 hour
  return updates;
}

module.exports = {
  fetchUpdates,
};
