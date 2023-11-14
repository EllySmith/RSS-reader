import fetchInfo from './fetchers.js';

const newFeed = async (state, rsslink) => {
  const allOriginsUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(rssLink)}`;
  const response = await fetch(allOriginsUrl);

  if (!response.ok) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = `${i18n.t('error.notanrss')}`;
  }

  const contentType = response.headers.get('content-type'); 
  if (!isXmlContentType(contentType)) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = `${i18n.t('error.notanrss')}`;
  }

  const newtitle = await fetchInfo(allOriginsUrl, 'title');
  const newentries = await fetchInfo(allOriginsUrl, 'entries');
  const newdescription = await fetchInfo(allOriginsUrl, 'description');
  state.feedLinks.push(rsslink);
  return {
    link: rsslink,
    title: newtitle,
    id: state.feeds.length + 1,
    entries: newentries,
    description: newdescription,
  };
};

export default newFeed;
