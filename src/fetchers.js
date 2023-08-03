import Parser from 'rss-parser';
import axios from 'axios';

const fetchTitle = async (link) => {
  try {
    const allOriginsUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`;
    const response = await fetch(allOriginsUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.contents) {
        const parser = new Parser();
        const feed = await parser.parseString(data.contents);
        if (feed.title) {
          return feed.title;
        }
      }
    }
    throw new Error('Title not found');
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};

const fetchDescription = async (link) => {
  try {
    const allOriginsUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`;
    const response = await fetch(allOriginsUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.contents) {
        const parser = new Parser();
        const feed = await parser.parseString(data.contents);
        if (feed.description) {
          return feed.description;
        }
      }
    }
    throw new Error('Title not found');
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};

const fetchEntries = async (link) => {
  try {
    const allOriginsUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`;
    const response = await fetch(allOriginsUrl);
    if (response.ok) {
      const data = await response.json();
      if (data.contents) {
        const parser = new Parser();
        const feed = await parser.parseString(data.contents);
        if (feed.items) {
          return feed.items;
        }
      }
    }
    throw new Error('Entries not found');
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};

export { fetchTitle, fetchDescription, fetchEntries };
