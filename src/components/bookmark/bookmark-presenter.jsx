// bookmarkPresenter.js
import { fetchUserBookmarks, deleteBookmark } from '../../services/Model.js';

export const getBookmarkedArticles = async () => {
  try {
    const response = await fetchUserBookmarks();

    let bookmarkedData = [];

    if (response && Array.isArray(response.data)) {
      bookmarkedData = response.data;
    } else if (Array.isArray(response)) {
      bookmarkedData = response;
    } else if (response && Array.isArray(response.bookmarks)) {
      bookmarkedData = response.bookmarks;
    }

    if (!Array.isArray(bookmarkedData)) {
      throw new TypeError('Data artikel yang disimpan tidak dalam format array yang diharapkan.');
    }

    const mappedArticles = bookmarkedData.map((item) => ({
      id: item.article_id || item.article?.id,
      title: item.title || item.article?.title || 'No Title',
      excerpt: item.excerpt || item.article?.content?.slice(0, 100) || '',
      imageUrl:
        item.image || item.article?.image || 'https://via.placeholder.com/600x320?text=No+Image',
      imageAlt: item.title || item.article?.title || 'Article Image',
      // Mengatur author secara statis menjadi 'admin@example.com'
      author: 'admin@example.com',
      date: item.created_at ? new Date(item.created_at).toLocaleDateString() : '',
      tags: item.tags || item.article?.tags || [],
    }));

    return mappedArticles;
  } catch (error) {
    console.error('Error in getBookmarkedArticles (Presenter):', error);
    throw new Error('Gagal memuat artikel yang disimpan: ' + error.message);
  }
};

export const removeBookmark = async (articleId) => {
  try {
    await deleteBookmark(articleId);
    return true;
  } catch (error) {
    console.error('Error in removeBookmark (Presenter):', error);
    throw new Error('Gagal menghapus bookmark: ' + error.message);
  }
};
