// articlePresenter.js
import { fetchPaginatedArticles } from '../../services/Model.js'; // Import the new function from Model.js

export const getArticles = async (page, limit) => {
  try {
    const response = await fetchPaginatedArticles(page, limit);
    const dataArr = response.data || response;
    const totalArticles = response.total || response.count || dataArr.length;

    const mappedArticles = dataArr.map((item) => ({
      id: item.id,
      title: item.title,
      excerpt: item.excerpt || item.content?.slice(0, 100) || '',
      imageUrl: item.image || 'https://via.placeholder.com/600x320?text=No+Image',
      imageAlt: item.title,
      author: item.author_email || 'Unknown',
      date: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
      tags: [], 
    }));

    return {
      articles: mappedArticles,
      totalArticles: totalArticles,
    };
  } catch (error) {
    console.error('Error in getArticles (Presenter):', error);
    throw new Error('Failed to load articles: ' + error.message);
  }
};
