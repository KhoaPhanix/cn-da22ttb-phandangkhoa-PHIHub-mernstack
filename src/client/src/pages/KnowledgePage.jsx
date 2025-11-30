import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import Footer from '../components/Footer';
import { getArticles } from '../services/articleService';

const KnowledgePage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'Dinh dưỡng', label: 'Dinh dưỡng' },
    { id: 'Thể chất', label: 'Tập luyện' },
    { id: 'Tinh thần', label: 'Sức khỏe tinh thần' },
    { id: 'Chung', label: 'Bệnh thường gặp' },
  ];

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = selectedCategory === 'all' ? {} : { category: selectedCategory };
      const response = await getArticles(params);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      <Navbar />
      
      <main className="flex flex-col gap-8 max-w-6xl mx-auto px-4 py-10">
        {/* PageHeading */}
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <p className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em] min-w-72">
            Thư viện Kiến thức
          </p>
        </div>

        {/* SearchBar */}
        <div className="px-4 py-3">
          <label className="flex flex-col min-w-40 h-14 w-full">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
              <div className="text-gray-400 dark:text-gray-400 flex border-none bg-white/10 dark:bg-white/10 items-center justify-center pl-4 rounded-l-xl border-r-0">
                <span className="material-symbols-outlined !text-2xl">search</span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-black dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-white/10 dark:bg-white/10 h-full placeholder:text-gray-400 dark:placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                placeholder="Tìm kiếm bài viết, triệu chứng..."
              />
            </div>
          </label>
        </div>

        {/* Category Chips */}
        <div className="flex gap-3 p-3 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(1);
              }}
              className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg px-4 ${
                selectedCategory === category.id
                  ? 'bg-primary text-background-dark'
                  : 'bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 text-black dark:text-white'
              }`}
            >
              <p className="text-sm font-${selectedCategory === category.id ? 'bold' : 'medium'} leading-normal">
                {category.label}
              </p>
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {currentArticles.map((article) => (
                <Link
                  key={article._id}
                  to={`/article/${article._id}`}
                  className="flex flex-col gap-4 pb-3 rounded-xl bg-white dark:bg-transparent border border-gray-200 dark:border-[#3b5447] overflow-hidden group hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  <div
                    className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                    style={{
                      backgroundImage: `url(${article.imageUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'})`,
                    }}
                  />
                  <div className="px-4 flex flex-col gap-2">
                    <p className="text-black dark:text-white text-base font-bold leading-normal line-clamp-2">
                      {article.title}
                    </p>
                    <p className="text-gray-600 dark:text-white text-sm font-normal leading-normal line-clamp-3">
                      {article.summary || article.content?.substring(0, 150)}
                    </p>
                    <p className="text-primary dark:text-primary text-sm font-medium leading-normal">
                      #{article.category || 'Chung'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 p-4 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center size-10 rounded-lg bg-white/10 dark:bg-white/10 text-black dark:text-white hover:bg-white/20 dark:hover:bg-white/20 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex items-center justify-center size-10 rounded-lg font-bold ${
                      currentPage === page
                        ? 'bg-primary text-background-dark'
                        : 'bg-white/10 dark:bg-white/10 text-black dark:text-white hover:bg-white/20 dark:hover:bg-white/20'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                {totalPages > 5 && (
                  <>
                    <span className="text-black dark:text-white">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="flex items-center justify-center size-10 rounded-lg bg-white/10 dark:bg-white/10 text-black dark:text-white hover:bg-white/20 dark:hover:bg-white/20 font-bold"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center size-10 rounded-lg bg-white/10 dark:bg-white/10 text-black dark:text-white hover:bg-white/20 dark:hover:bg-white/20 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default KnowledgePage;
