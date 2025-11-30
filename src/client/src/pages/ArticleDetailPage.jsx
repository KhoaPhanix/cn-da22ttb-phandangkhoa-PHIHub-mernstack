import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getArticleById } from '../services/articleService';
import { format } from 'date-fns';

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
      console.error('Error fetching article:', error);
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
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-600 dark:text-gray-400">Bài viết không tồn tại.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/knowledge')}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary"
        >
          ← Quay lại
        </button>

        <article className="bg-white dark:bg-[#111814] rounded-xl overflow-hidden border border-gray-200 dark:border-[#3b5447]">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-96 object-cover"
          />
          
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-2 text-sm font-medium bg-primary/20 text-primary rounded-full">
                {article.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(article.publishedAt), 'dd/MM/yyyy')}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {article.views} lượt xem
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {article.title}
            </h1>

            <div 
              className="prose dark:prose-invert max-w-none text-gray-700 dark:text-white prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-white prose-strong:text-gray-900 dark:prose-strong:text-white prose-li:text-gray-700 dark:prose-li:text-white"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {article.source && (
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nguồn: <a href={article.source} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {article.source}
                  </a>
                </p>
              </div>
            )}
          </div>
        </article>
      </main>
    </div>
  );
};

export default ArticleDetailPage;
