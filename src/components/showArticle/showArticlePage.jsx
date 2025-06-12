import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getArticleDetail,
  getArticleComments,
  submitArticleComment,
  isLoggedIn,
  addArticleToBookmarks, 
  getUserBookmarks, 
  removeArticleFromBookmarks, 
} from './showArticlePresenter'; 
import './show.css';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const userIsLoggedIn = isLoggedIn();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [bookmarkError, setBookmarkError] = useState(null);
  const [bookmarkMessage, setBookmarkMessage] = useState(null); 

  useEffect(() => {
    const fetchDetailData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getArticleDetail(id);
        setArticle(data);
      } catch (err) {
        setError(err.message || 'Gagal memuat artikel.');
      } finally {
        setLoading(false);
      }
    };

    const fetchCommentsData = async () => {
      setCommentsLoading(true);
      setCommentError(null);
      try {
        const commentsData = await getArticleComments(id);
        setComments(commentsData);
      } catch (err) {
        setCommentError(err.message || 'Gagal memuat komentar.');
      } finally {
        setCommentsLoading(false);
      }
    };


    const checkBookmarkStatus = async () => {
      if (userIsLoggedIn && id) {
        try {
          const userBookmarks = await getUserBookmarks();
          const bookmarked = userBookmarks.some((bookmark) => bookmark.article_id === parseInt(id));
          setIsBookmarked(bookmarked);
        } catch (err) {
          console.error('Error checking bookmark status:', err);
        }
      } else if (!userIsLoggedIn) {
        setIsBookmarked(false);
      }
    };

    if (id) {
      fetchDetailData();
      fetchCommentsData();
      checkBookmarkStatus(); 
    }
  }, [id, userIsLoggedIn]); 

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);

    if (!userIsLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    if (!commentText.trim()) {
      setCommentError('Komentar tidak boleh kosong.');
      return;
    }

    try {
      await submitArticleComment(id, commentText);
      setCommentText('');
      const updatedComments = await getArticleComments(id);
      setComments(updatedComments);
    } catch (err) {
      setCommentError(err.message || 'Gagal mengirim komentar.');
    }
  };

 
  const handleBookmarkToggle = async () => {
    setBookmarkLoading(true);
    setBookmarkError(null);
    setBookmarkMessage(null); 

    if (!userIsLoggedIn) {
      setShowLoginPopup(true);
      setBookmarkLoading(false); 
      return;
    }

    try {
      if (isBookmarked) {
        await removeArticleFromBookmarks(id);
        setIsBookmarked(false);
        setBookmarkMessage('Bookmark berhasil dihapus.');
      } else {
        await addArticleToBookmarks(id);
        setIsBookmarked(true);
        setBookmarkMessage('Artikel berhasil dibookmark.');
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      const errorMessage = err.message || 'Gagal mengubah status bookmark.';
      setBookmarkError(errorMessage);
    } finally {
      setBookmarkLoading(false);
      setTimeout(() => {
        setBookmarkMessage(null);
        setBookmarkError(null);
      }, 3000);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPopup(false);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-700 bg-[#f3f5f9]">
        Memuat artikel...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-red-500 bg-[#f3f5f9]">
        {error}
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-500 bg-[#f3f5f9]">
        Artikel tidak ditemukan.
      </div>
    );
  }

  return (
    <main className="max-w-full mx-auto px-4 py-10">
      <div className="pl-6">
        <button
          aria-label="Back to article list"
          className="mb-6 inline-flex items-center gap-2 text-black font-semibold hover:underline-anim transition"
          onClick={() => window.history.back()}
        >
          <i className="fas fa-arrow-left"></i> Kembali ke Artikel
        </button>
      </div>
      <article
        className="bg-white rounded-none shadow-none animate-fadeSlideUp max-w-4xl mx-auto"
        style={{ animationDelay: '0.05s' }}
      >
        <img
          alt={article.imageAlt}
          className="w-full max-h-80 object-cover img-hover-zoom rounded-b-lg"
          height="320"
          src={article.imageUrl}
          width="1600"
        />
        <div className="px-6 py-10 flex flex-col max-w-3xl mx-auto">
          <p className="text-[13px] text-black mb-3 select-none font-semibold">
            {article.author} • {article.date}
          </p>
          <h1 className="text-black text-4xl font-semibold mb-8 leading-tight">{article.title}</h1>
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-gray-700 mb-10 leading-relaxed text-lg break-words">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-12 max-w-none">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full px-4 py-1 select-none text-sm font-semibold"
                  style={{ backgroundColor: `#${tag.bgColor}`, color: `#${tag.textColor}` }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <div className="flex space-x-5 mb-14">
            {/* Tombol Bookmark - Sekarang selalu ditampilkan */}
            <button
              aria-label={isBookmarked ? 'Hapus dari bookmark' : 'Tambahkan ke bookmark'}
              className={`icon-btn transition ${
                isBookmarked && userIsLoggedIn
                  ? 'text-[#7cff36] hover:text-gray-600'
                  : 'text-gray-600 hover:text-[#7cff36]'
              } ${bookmarkLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleBookmarkToggle}
              disabled={bookmarkLoading}
            >
              <i
                className={`fas fa-bookmark fa-lg ${isBookmarked && userIsLoggedIn ? 'text-[#7cff36]' : ''}`}
              ></i>
            </button>
      
            {bookmarkMessage && (
              <p className="text-sm text-[#000000] self-center">{bookmarkMessage}</p>
            )}
            {bookmarkError && <p className="text-sm text-red-500 self-center">{bookmarkError}</p>}
          </div>
          ---
          <section aria-label="Comments section" className="border-t border-gray-300 pt-10">
            <h2 className="text-black text-3xl font-semibold mb-8">Komentar</h2>

            <form className="mb-10" id="commentForm" onSubmit={handleCommentSubmit}>
              <label
                className="block mb-3 font-semibold text-gray-800 text-lg"
                htmlFor="commentInput"
              >
                Tulis komentar Anda
              </label>
              <textarea
                aria-label="Write your comment"
                className="w-full rounded-md border border-gray-300 p-4 resize-y focus:outline-none focus:ring-2 focus:ring-[#7cff36] text-base"
                id="commentInput"
                placeholder="Tulis komentar di sini..."
                rows="5"
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              {commentError && <p className="text-red-500 text-sm mt-2">{commentError}</p>}
              <button
                className="mt-4 rounded-md bg-[#7cff36] px-6 py-3 font-semibold text-gray-900 hover:bg-[#5ecb2f] transition focus:outline-none focus:ring-2 focus:ring-[#5ecb2f]"
                type="submit"
              >
                Kirim Komentar
              </button>
            </form>

            <div id="commentsList" className="space-y-8 max-h-[448px] overflow-y-auto">
              {commentsLoading ? (
                <div className="text-center text-gray-500">Memuat komentar...</div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <article
                    key={comment.id}
                    className="bg-gray-100 rounded-lg p-6 shadow-sm max-w-full"
                  >
                    <header className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {comment.username || 'Anonim'}
                      </h3>
                      <time className="text-xs text-gray-500" dateTime={comment.created_at}>
                        {new Date(comment.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    </header>
                    <p className="text-gray-700 text-base leading-relaxed max-w-none">
                      {comment.content}
                    </p>
                  </article>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  Belum ada komentar untuk artikel ini.
                </div>
              )}
              {commentError && !commentsLoading && comments.length === 0 && !showLoginPopup && (
                <div className="text-center text-red-500">{commentError}</div>
              )}
            </div>
          </section>
        </div>
      </article>
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-sm w-full">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Anda Harus Login!</h3>
            <p className="text-gray-700 mb-6">Silakan login untuk dapat melakukan aksi ini.</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLoginPopup(false)}
                className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Nanti Saja
              </button>
              <button
                onClick={handleLoginRedirect}
                className="px-6 py-2 rounded-md bg-[#7cff36] text-gray-900 font-semibold hover:bg-[#5ecb2f] transition"
              >
                Login Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ArticleDetailPage;
