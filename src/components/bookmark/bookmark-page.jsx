import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBookmarkedArticles, removeBookmark } from './bookmark-presenter';

const BookmarkPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotification, setShowNotification] = useState(false); // State baru untuk notifikasi
  const [notificationMessage, setNotificationMessage] = useState(''); // State baru untuk pesan notifikasi
  const [notificationType, setNotificationType] = useState(''); // State baru untuk tipe notifikasi (success/error)

  useEffect(() => {
    const fetchBookmarkData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedArticles = await getBookmarkedArticles();
        setArticles(fetchedArticles);
      } catch (err) {
        setError(err.message || 'Gagal memuat artikel yang disimpan.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkData();
  }, []);

  // Fungsi untuk menampilkan notifikasi
  const showTemporaryNotification = (message, type = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);

    // Sembunyikan notifikasi setelah 3 detik
    const timer = setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage('');
      setNotificationType('');
    }, 3000); // 3000ms = 3 detik

    return () => clearTimeout(timer); // Cleanup function
  };

  const handleRemoveBookmark = async (articleId) => {
    try {
      await removeBookmark(articleId);
      setArticles(articles.filter((article) => article.id !== articleId));
      showTemporaryNotification('Artikel berhasil dihapus!', 'success'); // Panggil notifikasi sukses
    } catch (err) {
      showTemporaryNotification(`Gagal menghapus bookmark: ${err.message}`, 'error'); // Panggil notifikasi error
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-700">
        Memuat artikel yang disimpan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen relative">
      {' '}
      {/* Tambahkan relative di sini */}
      {/* Pop-up Notifikasi */}
      {showNotification && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white text-center z-50 transition-all duration-300 transform ${
            notificationType === 'success' ? 'bg-green-500' : 'bg-red-500' // Sesuaikan warna
          } ${showNotification ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
          role="alert"
        >
          {notificationMessage}
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-gray-900 font-semibold text-2xl sm:text-3xl">
            Artikel Tersimpan Anda
          </h2>
          <Link
            to="/article"
            className="px-5 py-2.5 bg-[#7dd83f] text-white rounded-lg hover:bg-[#6cb935] transition-colors duration-300 flex items-center gap-2 text-sm sm:text-base whitespace-nowrap shadow-md"
          >
            <i className="fas fa-arrow-left"></i>
            Kembali ke Artikel
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="text-center text-gray-600 text-lg py-10">
            Belum ada artikel yang disimpan.
          </div>
        ) : (
          <section
            aria-label="Bookmarked article list"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {articles.map((article, index) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform transition-transform duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <img
                  alt={article.imageAlt}
                  className="w-full h-52 object-cover transition-transform duration-300 hover:scale-105"
                  height="320"
                  src={article.imageUrl}
                  width="600"
                />
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-xs text-[#7dd83f] mb-2 font-semibold uppercase tracking-wide">
                    {article.author} • {article.date}
                  </p>
                  <h3 className="text-gray-900 mb-3 text-xl font-bold leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-gray-700 flex-grow mb-4 leading-relaxed text-sm">
                    {article.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag) => (
                      <span
                        key={tag.name}
                        className={`rounded-full px-3 py-1 text-xs font-semibold`}
                        style={{ backgroundColor: `#${tag.bgColor}`, color: `#${tag.textColor}` }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <Link
                      to={`/article/${article.id}`}
                      className="inline-flex items-center gap-2 text-base font-semibold py-2 px-4 rounded-md text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Selengkapnya <i className="fas fa-arrow-right text-sm"></i>
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(article.id)}
                      className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      aria-label={`Hapus bookmark ${article.title}`}
                    >
                      <i className="fas fa-trash-alt text-lg"></i>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default BookmarkPage;
