import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const UserGuidePage = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      <Navbar />
      
      <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-col gap-6 p-4 mt-8">
            <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Hướng dẫn sử dụng PHIHub
            </h1>
            <p className="text-gray-600 dark:text-[#9db9ab] text-lg">
              Chào mừng bạn đến với PHIHub - Personal Health Intelligence Hub. 
              Hướng dẫn này sẽ giúp bạn sử dụng ứng dụng một cách hiệu quả nhất.
            </p>

            {/* Bắt đầu */}
            <section className="bg-white dark:bg-[#1c3d2e] rounded-xl p-6 border border-gray-200 dark:border-[#3b5447]">
              <h2 className="text-black dark:text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">rocket_launch</span>
                Bắt đầu với PHIHub
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-[#9db9ab]">
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">1. Đăng ký tài khoản</h3>
                  <p>Truy cập trang đăng ký, điền đầy đủ thông tin: họ tên, email, mật khẩu và nhấn "Đăng ký". Mật khẩu cần có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">2. Đăng nhập</h3>
                  <p>Sử dụng email và mật khẩu đã đăng ký để đăng nhập. Hệ thống sẽ ghi nhớ phiên đăng nhập trong 7 ngày.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black dark:text-white mb-2">3. Thiết lập hồ sơ</h3>
                  <p>Sau khi đăng nhập, hãy vào trang Hồ sơ để cập nhật thông tin cá nhân: ngày sinh, giới tính, chiều cao, cân nặng hiện tại.</p>
                </div>
              </div>
            </section>

            {/* Các tính năng chính */}
            <section className="bg-white dark:bg-[#1c3d2e] rounded-xl p-6 border border-gray-200 dark:border-[#3b5447]">
              <h2 className="text-black dark:text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">dashboard</span>
                Các tính năng chính
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-500">monitor_heart</span>
                    Bảng điều khiển
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-[#9db9ab]">
                    Xem tổng quan sức khỏe: nhịp tim, số bước chân, calories, giấc ngủ trong ngày và tuần.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500">edit_note</span>
                    Nhập liệu thủ công
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-[#9db9ab]">
                    Ghi lại các chỉ số: cân nặng, huyết áp, đường huyết, giấc ngủ, bước chân, nước uống...
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange-500">restaurant</span>
                    Dinh dưỡng
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-[#9db9ab]">
                    Theo dõi bữa ăn hàng ngày, tính calories và macros (đạm, tinh bột, chất béo).
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-500">flag</span>
                    Mục tiêu
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-[#9db9ab]">
                    Đặt mục tiêu sức khỏe: giảm cân, số bước/ngày, uống nước... và theo dõi tiến độ.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-yellow-500">mood</span>
                    Nhật ký tâm trạng
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-[#9db9ab]">
                    Ghi lại cảm xúc và tâm trạng hàng ngày, phát hiện xu hướng và yếu tố ảnh hưởng.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-cyan-500">history</span>
                    Lịch sử dữ liệu
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-[#9db9ab]">
                    Xem lại toàn bộ dữ liệu sức khỏe đã nhập theo thời gian, xuất file CSV.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-pink-500">menu_book</span>
                    Góc kiến thức
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-[#9db9ab]">
                    Đọc các bài viết về sức khỏe: dinh dưỡng, thể chất, tinh thần từ chuyên gia.
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <h3 className="font-bold text-black dark:text-white mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-500">notifications</span>
                    Nhắc nhở
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-[#9db9ab]">
                    Thiết lập lời nhắc: uống nước, tập thể dục, ngủ nghỉ đúng giờ...
                  </p>
                </div>
              </div>
            </section>

            {/* Nhập liệu */}
            <section className="bg-white dark:bg-[#1c3d2e] rounded-xl p-6 border border-gray-200 dark:border-[#3b5447]">
              <h2 className="text-black dark:text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                Hướng dẫn nhập liệu
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-[#9db9ab]">
                <p><strong className="text-black dark:text-white">Bước 1:</strong> Vào trang "Nhập liệu thủ công" từ menu điều hướng.</p>
                <p><strong className="text-black dark:text-white">Bước 2:</strong> Chọn loại dữ liệu cần nhập (cân nặng, huyết áp, nhịp tim...).</p>
                <p><strong className="text-black dark:text-white">Bước 3:</strong> Điền giá trị, chọn thời gian và thêm ghi chú nếu cần.</p>
                <p><strong className="text-black dark:text-white">Bước 4:</strong> Nhấn "Lưu" để ghi lại dữ liệu.</p>
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    <strong>💡 Mẹo:</strong> Nhập dữ liệu đều đặn mỗi ngày để có số liệu chính xác cho việc phân tích xu hướng.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section className="bg-white dark:bg-[#1c3d2e] rounded-xl p-6 border border-gray-200 dark:border-[#3b5447]">
              <h2 className="text-black dark:text-white text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">help</span>
                Câu hỏi thường gặp
              </h2>
              <div className="space-y-4">
                <details className="group">
                  <summary className="cursor-pointer text-black dark:text-white font-semibold flex items-center justify-between">
                    Làm sao để đổi mật khẩu?
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="mt-2 text-gray-600 dark:text-[#9db9ab] pl-4">
                    Vào Hồ sơ → Cài đặt tài khoản → Đổi mật khẩu. Nhập mật khẩu cũ và mật khẩu mới.
                  </p>
                </details>

                <details className="group">
                  <summary className="cursor-pointer text-black dark:text-white font-semibold flex items-center justify-between">
                    Dữ liệu của tôi có được bảo mật không?
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="mt-2 text-gray-600 dark:text-[#9db9ab] pl-4">
                    Có. Tất cả dữ liệu được mã hóa và chỉ bạn mới có quyền truy cập. Xem thêm tại Chính sách bảo mật.
                  </p>
                </details>

                <details className="group">
                  <summary className="cursor-pointer text-black dark:text-white font-semibold flex items-center justify-between">
                    Tôi có thể xuất dữ liệu ra file không?
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="mt-2 text-gray-600 dark:text-[#9db9ab] pl-4">
                    Có. Vào trang Lịch sử → nhấn nút Xuất file (biểu tượng download) để tải file CSV.
                  </p>
                </details>

                <details className="group">
                  <summary className="cursor-pointer text-black dark:text-white font-semibold flex items-center justify-between">
                    Làm sao để liên hệ hỗ trợ?
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                  </summary>
                  <p className="mt-2 text-gray-600 dark:text-[#9db9ab] pl-4">
                    Gửi email đến <a href="mailto:khoadangphan307@gmail.com" className="text-primary hover:underline">khoadangphan307@gmail.com</a> hoặc liên hệ qua mạng xã hội.
                  </p>
                </details>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-xl p-6 border border-primary/20">
              <h2 className="text-black dark:text-white text-xl font-bold mb-2">Cần hỗ trợ thêm?</h2>
              <p className="text-gray-600 dark:text-[#9db9ab] mb-4">
                Đội ngũ PHIHub luôn sẵn sàng hỗ trợ bạn. Liên hệ ngay!
              </p>
              <a 
                href="mailto:khoadangphan307@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined">mail</span>
                Gửi email hỗ trợ
              </a>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserGuidePage;
