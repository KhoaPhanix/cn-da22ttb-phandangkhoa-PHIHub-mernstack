import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      <Navbar />
      
      <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-col gap-6 p-4 mt-8">
            <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Chính sách Bảo mật
            </h1>
            <p className="text-gray-600 dark:text-[#9db9ab]">
              Cập nhật lần cuối: 20/12/2025
            </p>

            <div className="bg-white dark:bg-[#1c3d2e] rounded-xl p-6 border border-gray-200 dark:border-[#3b5447] space-y-6">
              
              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">privacy_tip</span>
                  1. Giới thiệu
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  PHIHub ("chúng tôi", "của chúng tôi") cam kết bảo vệ quyền riêng tư của người dùng. 
                  Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ 
                  thông tin cá nhân của bạn khi sử dụng dịch vụ PHIHub.
                </p>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">database</span>
                  2. Thông tin chúng tôi thu thập
                </h2>
                <div className="text-gray-700 dark:text-[#9db9ab] space-y-3">
                  <div>
                    <h3 className="font-semibold text-black dark:text-white">2.1 Thông tin bạn cung cấp:</h3>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Thông tin đăng ký: họ tên, email, mật khẩu</li>
                      <li>Thông tin hồ sơ: ngày sinh, giới tính, chiều cao, cân nặng</li>
                      <li>Dữ liệu sức khỏe: nhịp tim, huyết áp, giấc ngủ, số bước chân, dinh dưỡng...</li>
                      <li>Nhật ký tâm trạng và ghi chú cá nhân</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black dark:text-white">2.2 Thông tin tự động thu thập:</h3>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Địa chỉ IP, loại trình duyệt, thiết bị sử dụng</li>
                      <li>Thời gian truy cập và các trang đã xem</li>
                      <li>Cookie và dữ liệu phiên làm việc</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">settings_suggest</span>
                  3. Cách chúng tôi sử dụng thông tin
                </h2>
                <ul className="text-gray-700 dark:text-[#9db9ab] list-disc pl-6 space-y-2">
                  <li>Cung cấp, duy trì và cải thiện dịch vụ PHIHub</li>
                  <li>Hiển thị thống kê và phân tích sức khỏe cá nhân</li>
                  <li>Gửi nhắc nhở và thông báo theo cài đặt của bạn</li>
                  <li>Phản hồi yêu cầu hỗ trợ và giải đáp thắc mắc</li>
                  <li>Phát hiện và ngăn chặn các hoạt động gian lận</li>
                  <li>Tuân thủ các yêu cầu pháp lý</li>
                </ul>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">share</span>
                  4. Chia sẻ thông tin
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] mb-3">
                  Chúng tôi <strong className="text-red-500">KHÔNG</strong> bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn 
                  với bên thứ ba cho mục đích marketing. Thông tin chỉ được chia sẻ trong các trường hợp:
                </p>
                <ul className="text-gray-700 dark:text-[#9db9ab] list-disc pl-6 space-y-2">
                  <li>Khi có sự đồng ý của bạn</li>
                  <li>Với đối tác cung cấp dịch vụ hỗ trợ (hosting, email) - đã ký thỏa thuận bảo mật</li>
                  <li>Khi được yêu cầu bởi pháp luật hoặc cơ quan có thẩm quyền</li>
                  <li>Để bảo vệ quyền lợi và an toàn của PHIHub hoặc người dùng khác</li>
                </ul>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">lock</span>
                  5. Bảo mật dữ liệu
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành để bảo vệ dữ liệu của bạn:
                </p>
                <ul className="text-gray-700 dark:text-[#9db9ab] list-disc pl-6 mt-3 space-y-2">
                  <li><strong>Mã hóa:</strong> Mật khẩu được mã hóa bcrypt, dữ liệu truyền qua HTTPS</li>
                  <li><strong>Xác thực:</strong> Sử dụng JWT token với thời hạn và HTTP-only cookies</li>
                  <li><strong>Kiểm soát truy cập:</strong> Chỉ bạn mới có thể xem dữ liệu của mình</li>
                  <li><strong>Sao lưu:</strong> Dữ liệu được sao lưu định kỳ để tránh mất mát</li>
                </ul>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">manage_accounts</span>
                  6. Quyền của bạn
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] mb-3">Bạn có quyền:</p>
                <ul className="text-gray-700 dark:text-[#9db9ab] list-disc pl-6 space-y-2">
                  <li><strong>Truy cập:</strong> Xem toàn bộ dữ liệu đã nhập trong ứng dụng</li>
                  <li><strong>Chỉnh sửa:</strong> Cập nhật thông tin cá nhân và dữ liệu sức khỏe</li>
                  <li><strong>Xóa:</strong> Yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan</li>
                  <li><strong>Xuất dữ liệu:</strong> Tải về file CSV chứa dữ liệu của bạn</li>
                  <li><strong>Rút lại đồng ý:</strong> Tắt các nhắc nhở và thông báo bất cứ lúc nào</li>
                </ul>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">cookie</span>
                  7. Cookie
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  PHIHub sử dụng cookie cần thiết để duy trì phiên đăng nhập và ghi nhớ tùy chọn của bạn 
                  (như chế độ sáng/tối). Chúng tôi không sử dụng cookie theo dõi hoặc quảng cáo.
                </p>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">update</span>
                  8. Thay đổi chính sách
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Mọi thay đổi quan trọng 
                  sẽ được thông báo qua email hoặc thông báo trong ứng dụng. Việc tiếp tục sử dụng dịch vụ 
                  sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận chính sách mới.
                </p>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">contact_support</span>
                  9. Liên hệ
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  Nếu bạn có câu hỏi về Chính sách bảo mật này hoặc muốn thực hiện quyền của mình, vui lòng liên hệ:
                </p>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-[#283930] rounded-lg">
                  <p className="text-black dark:text-white font-semibold">PHIHub - Personal Health Intelligence Hub</p>
                  <p className="text-gray-600 dark:text-[#9db9ab]">
                    Email: <a href="mailto:khoadangphan307@gmail.com" className="text-primary hover:underline">khoadangphan307@gmail.com</a>
                  </p>
                  <p className="text-gray-600 dark:text-[#9db9ab]">
                    Địa chỉ: Đại học Trà Vinh, Việt Nam
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
