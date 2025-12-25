import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import { getArticleById } from '../services/articleService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ArticleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await getArticleById(id);
      setArticle(response.data);
    } catch (error) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">article</span>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Bài viết không tồn tại.</p>
            <button
              onClick={() => navigate('/knowledge')}
              className="mt-4 px-6 py-2 bg-primary text-black font-semibold rounded-lg hover:opacity-90"
            >
              Quay lại Góc kiến thức
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col">
      <Navbar />
      
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate('/knowledge')}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-[#9db9ab] hover:text-primary transition-colors group"
        >
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span>Quay lại Góc kiến thức</span>
        </button>

        <article className="bg-white dark:bg-[#1c3d2e] rounded-2xl overflow-hidden border border-gray-200 dark:border-[#3b5447] shadow-lg">
          {/* Hero Image */}
          <div className="relative">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-72 sm:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-primary text-black rounded-full mb-3">
                {article.category}
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                {article.title}
              </h1>
            </div>
          </div>
          
          {/* Article Meta */}
          <div className="px-6 sm:px-8 py-4 border-b border-gray-200 dark:border-[#3b5447] bg-gray-50 dark:bg-[#283930]">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-[#9db9ab]">
              {article.author && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">person</span>
                  <span className="font-medium text-gray-900 dark:text-white">{article.author}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
                <span>{format(new Date(article.publishedAt), 'dd MMMM, yyyy', { locale: vi })}</span>
              </div>
              {article.views > 0 && (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">visibility</span>
                  <span>{article.views.toLocaleString()} lượt xem</span>
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="p-6 sm:p-8">
            <div 
              className="article-content prose prose-lg dark:prose-invert max-w-none
                prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-[#3b5447] prose-h2:pb-2
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-primary
                prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
                prose-p:text-gray-800 dark:prose-p:text-white prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                prose-ul:my-4 prose-ul:pl-6
                prose-ol:my-4 prose-ol:pl-6
                prose-li:text-gray-800 dark:prose-li:text-white prose-li:mb-2
                prose-table:border-collapse prose-table:w-full prose-table:my-6
                prose-th:bg-gray-100 dark:prose-th:bg-[#283930] prose-th:p-3 prose-th:text-left prose-th:border prose-th:border-gray-200 dark:prose-th:border-[#3b5447] prose-th:text-gray-900 dark:prose-th:text-white
                prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-[#3b5447] prose-td:text-gray-800 dark:prose-td:text-white
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Source */}
            {article.source && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-[#3b5447]">
                <p className="text-sm text-gray-600 dark:text-[#9db9ab]">
                  <span className="font-medium">Nguồn:</span>{' '}
                  <a href={article.source} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {article.source}
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* Share & Actions */}
          <div className="px-6 sm:px-8 py-4 border-t border-gray-200 dark:border-[#3b5447] bg-gray-50 dark:bg-[#283930]">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/knowledge')}
                className="flex items-center gap-2 text-gray-600 dark:text-[#9db9ab] hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                <span>Xem thêm bài viết</span>
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="p-2 rounded-full bg-gray-200 dark:bg-[#3b5447] text-gray-600 dark:text-white hover:bg-primary hover:text-black transition-colors"
                  title="Lên đầu trang"
                >
                  <span className="material-symbols-outlined">arrow_upward</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default ArticleDetailPage;
