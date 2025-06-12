import {
  fetchArticleById,
  fetchCommentsByArticleId,
  postCommentToArticle,
  addBookmark,
  fetchUserBookmarks,
  deleteBookmark,
} from '../../services/Model.js'; 

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

export const getArticleComments = async (articleId) => {
  try {
    const response = await fetchCommentsByArticleId(articleId);
    return response.comments || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const submitArticleComment = async (articleId, commentText) => {
  try {
    const response = await postCommentToArticle(articleId, commentText);
    
    return response.comment || response; 
  } catch (error) {
    console.error('Error submitting comment:', error);
    throw error;
  }
};


export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

export const addArticleToBookmarks = async (articleId) => {
  try {
    const response = await addBookmark(articleId);
    return response;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

export const getUserBookmarks = async () => {
  try {
    const response = await fetchUserBookmarks();
    return response.bookmarks || [];
  } catch (error) {
    console.error('Error fetching user bookmarks:', error);
    throw error;
  }
};

export const removeArticleFromBookmarks = async (articleId) => {
  try {
    const response = await deleteBookmark(articleId);
    return response;
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    throw error;
  }
};
