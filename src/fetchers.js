import Parser from 'rss-parser';
import axios from 'axios';
import i18n from 'i18next';
import rus from './locales/rus.js';

const fetchInfo = async (link, info) => {
  try {
    const allOriginsUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`;
    const response = await fetch(allOriginsUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.contents) {
        const parser = new Parser();
        const feed = await parser.parseString(data.contents);
        switch (info) {
          case 'title':
            return feed.title;
          case 'description':
            return feed.description;
          case 'entries':
            return feed.items;
          default:
            throw new Error(`Info "${info}" not supported`);
        }
      }
      throw new Error('Title not found');
    }
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};
export default fetchInfo;
