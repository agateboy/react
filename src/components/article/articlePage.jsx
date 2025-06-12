import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getArticles } from './articlePresenter';
import './article.css';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return { isLoggedIn, setIsLoggedIn };
};

const ArticlePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const articlesPerPage = 3;

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticleData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { articles: fetchedArticles, totalArticles: fetchedTotalArticles } =
          await getArticles(currentPage, articlesPerPage);
        setArticles(fetchedArticles);
        setTotalArticles(fetchedTotalArticles);
      } catch (err) {
        setError(err.message || 'Failed to load articles.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleData();
  }, [currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalArticles / articlesPerPage));

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSavedArticlesClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginPopup(true);
    }
  };

  const closeLoginPopup = () => {
    setShowLoginPopup(false);
  };

  const confirmLoginRedirect = () => {
    closeLoginPopup();
    navigate('/login');
  };

  const renderPaginationButtons = () => {
    const pageNumbers = [];
    if (totalPages > 0) {
      pageNumbers.push(1);
      if (totalPages >= 2) pageNumbers.push(2);
    }
    if (currentPage > 3 && totalPages > 5) {
      pageNumbers.push('...');
    }
    const start = Math.max(3, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);
    for (let i = start; i <= end; i++) {
      if (!pageNumbers.includes(i) && i > 0) {
        pageNumbers.push(i);
      }
    }
    if (currentPage < totalPages - 2 && totalPages > 5) {
      if (!pageNumbers.includes(totalPages - 1) && !pageNumbers.includes(totalPages)) {
        pageNumbers.push('...');
      }
    }
    if (totalPages >= 2 && !pageNumbers.includes(totalPages - 1)) {
      if (
        totalPages > 2 &&
        totalPages - 1 > pageNumbers[pageNumbers.length - 1] &&
        pageNumbers[pageNumbers.length - 1] !== '...'
      ) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages - 1);
    }
    if (totalPages >= 1 && !pageNumbers.includes(totalPages)) {
      if (
        totalPages > 1 &&
        totalPages > pageNumbers[pageNumbers.length - 1] &&
        pageNumbers[pageNumbers.length - 1] !== '...'
      ) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((number, index) => (
      <li key={index}>
        {number === '...' ? (
          <span className="select-none text-sm font-normal text-gray-500">...</span>
        ) : (
          <button
            aria-current={currentPage === number ? 'page' : undefined}
            onClick={() => handlePageClick(number)}
            className={`pagination-btn ${currentPage === number ? 'aria-[current=page]' : ''}`}
            disabled={currentPage === number}
          >
            {number}
          </button>
        )}
      </li>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg font-semibold">
        Loading articles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">{error}</div>
    );
  }

  return (
    <div className="bg-[#f3f5f9] text-gray-700 min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-black select-none font-semibold text-2xl sm:text-3xl">
            Narastocks Article
          </h2>
          <Link
            to="/saved-articles"
            onClick={handleSavedArticlesClick}
            className="px-5 py-2.5 bg-[#7cff36] text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
          >
            <i className="fas fa-bookmark"></i>
            Artikel Tersimpan
          </Link>
        </div>

        <section aria-label="Article list" className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <article
              key={article.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col card-hover animate-fadeSlideUp"
              style={{ animationDelay: `${0.05 * index}s` }}
            >
              <img
                alt={article.imageAlt}
                className="w-full h-52 object-cover img-hover-zoom"
                height="320"
                src={article.imageUrl}
                width="600"
              />
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs text-[#7cff36] mb-2 select-none font-semibold uppercase tracking-wide">
                  {article.author} • {article.date}
                </p>
                <h3 className="text-black mb-3 text-xl font-bold leading-tight">{article.title}</h3>
                <p className="text-gray-600 flex-grow mb-4 leading-relaxed text-sm">
                  {article.excerpt}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag) => (
                    <span
                      key={tag.name}
                      className={`rounded-full px-3 py-1 text-xs font-semibold select-none`}
                      style={{ backgroundColor: `#${tag.bgColor}`, color: `#${tag.textColor}` }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <Link
                  to={`/article/${article.id}`}
                  className="selengkapnya-btn mt-auto self-start focus:outline-none text-base font-semibold py-2 px-4 rounded-md inline-flex items-center gap-2 transition-colors duration-300"
                >
                  Selengkapnya <i className="fas fa-arrow-right text-sm"></i>
                </Link>
              </div>
            </article>
          ))}
        </section>

        <nav
          aria-label="Pagination"
          className="flex flex-col sm:flex-row justify-between items-center text-gray-500 text-sm mt-12 px-2 select-none gap-4"
        >
          <button
            aria-label="Previous"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 hover:text-[#7cff36] transition transform hover:scale-105 text-base focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md border border-gray-300 hover:border-[#7cff36]"
          >
            <i className="fas fa-chevron-left"></i>
            Previous
          </button>
          <ul className="flex flex-wrap justify-center items-center gap-3 text-center font-semibold text-base">
            {renderPaginationButtons()}
          </ul>
          <button
            aria-label="Next"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 hover:text-[#7cff36] transition transform hover:scale-105 text-base focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-md border border-gray-300 hover:border-[#7cff36]"
          >
            Next
            <i className="fas fa-chevron-right"></i>
          </button>
        </nav>
      </main>

      {showLoginPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Login Diperlukan</h3>
            <p className="text-gray-700 mb-6">
              Untuk menyimpan artikel, Anda perlu login terlebih dahulu.
            </p>
            <div className="flex justify-around gap-4">
              <button
                onClick={closeLoginPopup}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLoginRedirect}
                className="px-6 py-2 bg-[#7cff36] text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Login Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticlePage;
