import { fetchArticleById } from '../.../../../services/Model.js';

export const getArticleDetail = async (id) => {
  try {
    const response = await fetchArticleById(id);
    const data = response.data || response;

    if (!data) throw new Error('Artikel tidak ditemukan');

    return {
      id: data.id,
      title: data.title,
      content: data.content,
      imageUrl: data.image || 'https://via.placeholder.com/1200x600?text=No+Image',
      imageAlt: data.title,
      author: data.author_email || 'Unknown',
      date: data.created_at ? new Date(data.created_at).toLocaleDateString() : '',
      tags: data.tags || [],
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
