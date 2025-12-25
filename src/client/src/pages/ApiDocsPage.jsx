import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ApiDocsPage = () => {
  const endpoints = [
    {
      category: 'Xác thực (Authentication)',
      apis: [
        { method: 'POST', path: '/api/auth/register', desc: 'Đăng ký tài khoản mới', body: '{ name, email, password }' },
        { method: 'POST', path: '/api/auth/login', desc: 'Đăng nhập, nhận JWT token', body: '{ email, password }' },
        { method: 'POST', path: '/api/auth/logout', desc: 'Đăng xuất, xóa cookie', body: '-' },
        { method: 'GET', path: '/api/auth/profile', desc: 'Lấy thông tin người dùng hiện tại', body: '-' },
        { method: 'PUT', path: '/api/auth/profile', desc: 'Cập nhật thông tin hồ sơ', body: '{ name, dateOfBirth, gender, ... }' },
      ]
    },
    {
      category: 'Chỉ số Sức khỏe (Metrics)',
      apis: [
        { method: 'GET', path: '/api/metrics', desc: 'Lấy danh sách metrics (có filter)', body: 'Query: metricType, startDate, endDate, limit' },
        { method: 'GET', path: '/api/metrics/:id', desc: 'Lấy chi tiết một metric', body: '-' },
        { method: 'POST', path: '/api/metrics', desc: 'Thêm metric mới', body: '{ metricType, value, unit, timestamp, notes }' },
        { method: 'PUT', path: '/api/metrics/:id', desc: 'Cập nhật metric', body: '{ value, unit, timestamp, notes }' },
        { method: 'DELETE', path: '/api/metrics/:id', desc: 'Xóa metric', body: '-' },
        { method: 'GET', path: '/api/metrics/stats/:type', desc: 'Thống kê theo loại metric', body: 'Query: days (default: 30)' },
        { method: 'GET', path: '/api/metrics/today', desc: 'Lấy tất cả metrics hôm nay', body: '-' },
      ]
    },
    {
      category: 'Dinh dưỡng (Nutrition)',
      apis: [
        { method: 'GET', path: '/api/nutrition', desc: 'Lấy nutrition logs', body: 'Query: date, startDate, endDate' },
        { method: 'GET', path: '/api/nutrition/daily/:date', desc: 'Lấy tổng hợp dinh dưỡng ngày', body: '-' },
        { method: 'POST', path: '/api/nutrition', desc: 'Thêm bữa ăn mới', body: '{ mealType, foodItems[], notes }' },
        { method: 'PUT', path: '/api/nutrition/:id', desc: 'Cập nhật bữa ăn', body: '{ mealType, foodItems[], notes }' },
        { method: 'DELETE', path: '/api/nutrition/:id', desc: 'Xóa bữa ăn', body: '-' },
        { method: 'GET', path: '/api/nutrition/weekly', desc: 'Thống kê tuần (calories, macros)', body: '-' },
      ]
    },
    {
      category: 'Mục tiêu (Goals)',
      apis: [
        { method: 'GET', path: '/api/goals', desc: 'Lấy tất cả mục tiêu', body: '-' },
        { method: 'GET', path: '/api/goals/:id', desc: 'Lấy chi tiết mục tiêu', body: '-' },
        { method: 'POST', path: '/api/goals', desc: 'Tạo mục tiêu mới', body: '{ title, category, targetValue, targetUnit, startDate, endDate }' },
        { method: 'PUT', path: '/api/goals/:id', desc: 'Cập nhật mục tiêu', body: '{ title, targetValue, ... }' },
        { method: 'PUT', path: '/api/goals/:id/progress', desc: 'Cập nhật tiến độ', body: '{ progress }' },
        { method: 'DELETE', path: '/api/goals/:id', desc: 'Xóa mục tiêu', body: '-' },
      ]
    },
    {
      category: 'Tâm trạng (Mood)',
      apis: [
        { method: 'GET', path: '/api/mood', desc: 'Lấy mood logs', body: 'Query: startDate, endDate, limit' },
        { method: 'POST', path: '/api/mood', desc: 'Thêm mood log', body: '{ mood, energy, factors[], notes }' },
        { method: 'PUT', path: '/api/mood/:id', desc: 'Cập nhật mood log', body: '{ mood, energy, factors[], notes }' },
        { method: 'DELETE', path: '/api/mood/:id', desc: 'Xóa mood log', body: '-' },
        { method: 'GET', path: '/api/mood/stats', desc: 'Thống kê tâm trạng', body: 'Query: days' },
      ]
    },
    {
      category: 'Bài viết (Articles)',
      apis: [
        { method: 'GET', path: '/api/articles', desc: 'Lấy danh sách bài viết', body: 'Query: category, page, limit' },
        { method: 'GET', path: '/api/articles/:id', desc: 'Lấy chi tiết bài viết', body: '-' },
      ]
    },
    {
      category: 'Nhắc nhở (Reminders)',
      apis: [
        { method: 'GET', path: '/api/reminders', desc: 'Lấy tất cả reminders', body: '-' },
        { method: 'POST', path: '/api/reminders', desc: 'Tạo reminder mới', body: '{ title, type, time, repeat, enabled }' },
        { method: 'PUT', path: '/api/reminders/:id', desc: 'Cập nhật reminder', body: '{ title, time, ... }' },
        { method: 'DELETE', path: '/api/reminders/:id', desc: 'Xóa reminder', body: '-' },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      <Navbar />
      
      <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
          <div className="flex flex-col gap-6 p-4 mt-8">
            <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              API Documentation
            </h1>
            <p className="text-gray-600 dark:text-[#9db9ab] text-lg">
              Tài liệu API cho PHIHub - Personal Health Intelligence Hub. 
              API sử dụng REST architecture và trả về dữ liệu JSON.
            </p>

            {/* Overview */}
            <section className="bg-white dark:bg-[#1c3d2e] rounded-xl p-6 border border-gray-200 dark:border-[#3b5447]">
              <h2 className="text-black dark:text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                Thông tin Chung
              </h2>
              <div className="grid md:grid-cols-2 gap-4 text-gray-700 dark:text-[#9db9ab]">
                <div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">Base URL</h3>
                  <code className="bg-gray-100 dark:bg-[#283930] px-3 py-1 rounded text-sm">
                    http://localhost:5000/api
                  </code>
                </div>
                <div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">Authentication</h3>
                  <p className="text-sm">JWT Token via HTTP-only Cookie hoặc Bearer Token</p>
                </div>
                <div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">Content-Type</h3>
                  <code className="bg-gray-100 dark:bg-[#283930] px-3 py-1 rounded text-sm">
                    application/json
                  </code>
                </div>
                <div>
                  <h3 className="font-semibold text-black dark:text-white mb-2">Response Format</h3>
                  <code className="bg-gray-100 dark:bg-[#283930] px-3 py-1 rounded text-sm">
                    {'{ success: boolean, data: any, message?: string }'}
                  </code>
                </div>
              </div>
            </section>

            {/* Authentication Guide */}
            <section className="bg-white dark:bg-[#1c3d2e] rounded-xl p-6 border border-gray-200 dark:border-[#3b5447]">
              <h2 className="text-black dark:text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">key</span>
                Xác thực
              </h2>
              <div className="text-gray-700 dark:text-[#9db9ab] space-y-4">
                <p>PHIHub sử dụng JWT (JSON Web Token) để xác thực. Có 2 cách để gửi token:</p>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 dark:bg-[#283930] rounded-lg">
                    <h3 className="font-semibold text-black dark:text-white mb-2">1. HTTP-only Cookie (Khuyến nghị)</h3>
                    <p className="text-sm">Token tự động được gửi trong cookie sau khi đăng nhập. An toàn hơn với XSS.</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-[#283930] rounded-lg">
                    <h3 className="font-semibold text-black dark:text-white mb-2">2. Authorization Header</h3>
                    <code className="text-sm">Authorization: Bearer {'<your-jwt-token>'}</code>
                  </div>
                </div>
              </div>
            </section>

            {/* Endpoints */}
            {endpoints.map((group, idx) => (
              <section key={idx} className="bg-white dark:bg-[#1c3d2e] rounded-xl p-6 border border-gray-200 dark:border-[#3b5447]">
                <h2 className="text-black dark:text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">api</span>
                  {group.category}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-[#3b5447]">
                        <th className="py-2 px-3 text-black dark:text-white font-semibold">Method</th>
                        <th className="py-2 px-3 text-black dark:text-white font-semibold">Endpoint</th>
                        <th className="py-2 px-3 text-black dark:text-white font-semibold">Mô tả</th>
                        <th className="py-2 px-3 text-black dark:text-white font-semibold">Body / Query</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-700 dark:text-[#9db9ab]">
                      {group.apis.map((api, apiIdx) => (
                        <tr key={apiIdx} className="border-b border-gray-100 dark:border-[#3b5447]/50 hover:bg-gray-50 dark:hover:bg-[#283930]">
                          <td className="py-2 px-3">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                              api.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                              api.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                              api.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              {api.method}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            <code className="text-primary text-xs">{api.path}</code>
                          </td>
                          <td className="py-2 px-3">{api.desc}</td>
                          <td className="py-2 px-3">
                            <code className="text-xs text-gray-500 dark:text-gray-400">{api.body}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}

            {/* Error Codes */}
            <section className="bg-white dark:bg-[#1c3d2e] rounded-xl p-6 border border-gray-200 dark:border-[#3b5447]">
              <h2 className="text-black dark:text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">error</span>
                Mã lỗi HTTP
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <span className="text-green-500 font-mono font-bold">200</span>
                  <span className="text-gray-700 dark:text-[#9db9ab]">OK - Thành công</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <span className="text-green-500 font-mono font-bold">201</span>
                  <span className="text-gray-700 dark:text-[#9db9ab]">Created - Tạo mới thành công</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <span className="text-yellow-500 font-mono font-bold">400</span>
                  <span className="text-gray-700 dark:text-[#9db9ab]">Bad Request - Dữ liệu không hợp lệ</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <span className="text-yellow-500 font-mono font-bold">401</span>
                  <span className="text-gray-700 dark:text-[#9db9ab]">Unauthorized - Chưa đăng nhập</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <span className="text-yellow-500 font-mono font-bold">403</span>
                  <span className="text-gray-700 dark:text-[#9db9ab]">Forbidden - Không có quyền</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <span className="text-red-500 font-mono font-bold">404</span>
                  <span className="text-gray-700 dark:text-[#9db9ab]">Not Found - Không tìm thấy</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <span className="text-red-500 font-mono font-bold">500</span>
                  <span className="text-gray-700 dark:text-[#9db9ab]">Internal Server Error - Lỗi hệ thống</span>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-6 border border-primary/20">
              <h2 className="text-black dark:text-white text-xl font-bold mb-2">Cần hỗ trợ kỹ thuật?</h2>
              <p className="text-gray-600 dark:text-[#9db9ab] mb-4">
                Nếu bạn gặp vấn đề hoặc có câu hỏi về API, hãy liên hệ với đội ngũ phát triển.
              </p>
              <div className="flex gap-3">
                <a 
                  href="mailto:khoadangphan307@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined">mail</span>
                  Email
                </a>
                <a 
                  href="https://github.com/KhoaPhanix/cn-da22ttb-phandangkhoa-PHIHub-mernstack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1c3d2e] text-gray-900 dark:text-white font-semibold rounded-lg border border-gray-300 dark:border-[#3b5447] hover:bg-gray-50 dark:hover:bg-[#283930] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApiDocsPage;
