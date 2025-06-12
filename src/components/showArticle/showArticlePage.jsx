import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { getArticleDetail } from './showArticlePresenter'; 


const ArticleDetailPage = () => {
  const { id } = useParams(); 
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetailData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getArticleDetail(id);
        setArticle(data);
      } catch (err) {
        setError(err.message || 'Failed to load article.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetailData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-700 bg-[#f3f5f9]">
        Loading article...
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
        Article not found.
      </div>
    );
  }

  return (
    <div className="bg-[#f3f5f9] text-gray-700 font-montserrat min-h-screen py-10">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <article className="bg-white rounded-lg shadow-xl overflow-hidden p-6 md:p-8 animate-fadeSlideUp">
          <img
            alt={article.imageAlt}
            className="w-full h-80 object-cover rounded-md mb-6 shadow-md"
            src={article.imageUrl}
            height="600"
            width="1200"
          />
          <p className="text-[14px] text-[#7cff36] mb-2 font-semibold">
            {article.author} • {article.date}
          </p>
          <h1 className="text-black mb-6 text-3xl md:text-4xl font-bold leading-tight">
            {article.title}
          </h1>
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-gray-600 leading-relaxed break-words">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="rounded-full px-3 py-1"
                  style={{ backgroundColor: `#${tag.bgColor}`, color: `#${tag.textColor}` }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            >
              <i className="fas fa-arrow-left"></i>
              Back to Articles
            </button>
            <div className="flex space-x-3 text-gray-500">
              <button
                aria-label="Bookmark this article"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <i className="fas fa-bookmark text-lg"></i>
              </button>
              <button
                aria-label="Comment on this article"
                className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
              >
                <i className="fas fa-comment-alt text-lg"></i>
              </button>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default ArticleDetailPage;
