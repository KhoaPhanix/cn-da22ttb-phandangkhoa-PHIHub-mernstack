import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display flex flex-col">
      <Navbar />
      
      <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-col gap-6 p-4 mt-8">
            <h1 className="text-black dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              Điều khoản Sử dụng
            </h1>
            <p className="text-gray-600 dark:text-[#9db9ab]">
              Cập nhật lần cuối: 20/12/2025
            </p>

            <div className="bg-white dark:bg-[#1c3d2e] rounded-xl p-6 border border-gray-200 dark:border-[#3b5447] space-y-6">
              
              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">gavel</span>
                  1. Chấp nhận Điều khoản
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  Bằng việc truy cập hoặc sử dụng PHIHub, bạn đồng ý tuân thủ các Điều khoản sử dụng này. 
                  Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng dịch vụ.
                </p>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">description</span>
                  2. Mô tả Dịch vụ
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  PHIHub là nền tảng theo dõi sức khỏe cá nhân, cho phép người dùng:
                </p>
                <ul className="text-gray-700 dark:text-[#9db9ab] list-disc pl-6 mt-3 space-y-2">
                  <li>Ghi lại và theo dõi các chỉ số sức khỏe (cân nặng, huyết áp, nhịp tim...)</li>
                  <li>Quản lý dinh dưỡng và bữa ăn hàng ngày</li>
                  <li>Thiết lập và theo dõi mục tiêu sức khỏe</li>
                  <li>Ghi nhật ký tâm trạng</li>
                  <li>Đọc các bài viết kiến thức về sức khỏe</li>
                  <li>Nhận nhắc nhở về các hoạt động sức khỏe</li>
                </ul>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person_add</span>
                  3. Đăng ký Tài khoản
                </h2>
                <div className="text-gray-700 dark:text-[#9db9ab] space-y-3">
                  <p>Để sử dụng PHIHub, bạn cần đăng ký tài khoản với thông tin chính xác. Bạn có trách nhiệm:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Cung cấp thông tin đăng ký trung thực và cập nhật</li>
                    <li>Bảo mật mật khẩu và thông tin đăng nhập</li>
                    <li>Chịu trách nhiệm cho mọi hoạt động dưới tài khoản của bạn</li>
                    <li>Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                  4. Sử dụng Hợp lệ
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] mb-3">Bạn đồng ý:</p>
                <ul className="text-gray-700 dark:text-[#9db9ab] list-disc pl-6 space-y-2">
                  <li>Sử dụng PHIHub cho mục đích cá nhân, không thương mại</li>
                  <li>Không chia sẻ tài khoản với người khác</li>
                  <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                  <li>Không cố gắng hack, phá hoại hoặc xâm nhập hệ thống</li>
                  <li>Không thu thập thông tin của người dùng khác</li>
                  <li>Không tạo nhiều tài khoản để lạm dụng dịch vụ</li>
                </ul>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">medical_information</span>
                  5. Tuyên bố Y tế Quan trọng
                </h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">⚠️ QUAN TRỌNG:</p>
                  <ul className="text-yellow-800 dark:text-yellow-200 list-disc pl-6 space-y-2">
                    <li>PHIHub <strong>KHÔNG</strong> phải là dịch vụ y tế hoặc chăm sóc sức khỏe chuyên nghiệp</li>
                    <li>Thông tin và phân tích từ PHIHub chỉ mang tính tham khảo</li>
                    <li>Không sử dụng PHIHub để tự chẩn đoán hoặc tự điều trị</li>
                    <li>Luôn tham khảo ý kiến bác sĩ hoặc chuyên gia y tế cho các vấn đề sức khỏe</li>
                    <li>Trong trường hợp khẩn cấp, hãy gọi ngay 115 hoặc đến cơ sở y tế gần nhất</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">copyright</span>
                  6. Quyền Sở hữu Trí tuệ
                </h2>
                <div className="text-gray-700 dark:text-[#9db9ab] space-y-3">
                  <p>
                    <strong className="text-black dark:text-white">Nội dung của PHIHub:</strong> Logo, giao diện, mã nguồn, 
                    và nội dung bài viết là tài sản của PHIHub, được bảo vệ bởi luật sở hữu trí tuệ.
                  </p>
                  <p>
                    <strong className="text-black dark:text-white">Nội dung của bạn:</strong> Bạn giữ quyền sở hữu dữ liệu 
                    sức khỏe cá nhân mà bạn nhập vào hệ thống. Bằng việc sử dụng dịch vụ, bạn cấp cho chúng tôi 
                    quyền lưu trữ và xử lý dữ liệu này để cung cấp dịch vụ.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">block</span>
                  7. Chấm dứt
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  Chúng tôi có quyền tạm ngưng hoặc chấm dứt tài khoản của bạn nếu:
                </p>
                <ul className="text-gray-700 dark:text-[#9db9ab] list-disc pl-6 mt-3 space-y-2">
                  <li>Vi phạm Điều khoản sử dụng</li>
                  <li>Có hành vi gian lận hoặc lạm dụng hệ thống</li>
                  <li>Theo yêu cầu của cơ quan pháp luật</li>
                </ul>
                <p className="text-gray-700 dark:text-[#9db9ab] mt-3">
                  Bạn có thể xóa tài khoản bất cứ lúc nào trong phần Cài đặt. Sau khi xóa, dữ liệu của bạn 
                  sẽ được xóa khỏi hệ thống trong vòng 30 ngày.
                </p>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">shield</span>
                  8. Giới hạn Trách nhiệm
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  PHIHub được cung cấp "nguyên trạng" (as-is). Chúng tôi không đảm bảo:
                </p>
                <ul className="text-gray-700 dark:text-[#9db9ab] list-disc pl-6 mt-3 space-y-2">
                  <li>Dịch vụ hoạt động liên tục, không lỗi</li>
                  <li>Tính chính xác tuyệt đối của phân tích và thống kê</li>
                  <li>Kết quả cụ thể từ việc sử dụng ứng dụng</li>
                </ul>
                <p className="text-gray-700 dark:text-[#9db9ab] mt-3">
                  Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại trực tiếp, gián tiếp hoặc hậu quả 
                  nào phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.
                </p>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">update</span>
                  9. Thay đổi Điều khoản
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  Chúng tôi có thể sửa đổi Điều khoản này theo thời gian. Các thay đổi quan trọng sẽ được 
                  thông báo qua email hoặc trong ứng dụng ít nhất 7 ngày trước khi có hiệu lực. 
                  Việc tiếp tục sử dụng dịch vụ sau khi thay đổi đồng nghĩa với việc bạn chấp nhận điều khoản mới.
                </p>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">balance</span>
                  10. Luật Áp dụng
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  Điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam. 
                  Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án có thẩm quyền tại Việt Nam.
                </p>
              </section>

              <section>
                <h2 className="text-black dark:text-white text-xl font-bold mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">contact_support</span>
                  11. Liên hệ
                </h2>
                <p className="text-gray-700 dark:text-[#9db9ab] leading-relaxed">
                  Nếu bạn có câu hỏi về Điều khoản sử dụng này, vui lòng liên hệ:
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

            {/* Agreement Notice */}
            <div className="bg-primary/10 dark:bg-primary/20 rounded-xl p-6 border border-primary/30">
              <p className="text-gray-700 dark:text-[#9db9ab] text-center">
                Bằng việc sử dụng PHIHub, bạn xác nhận đã đọc, hiểu và đồng ý với các Điều khoản sử dụng này 
                cũng như <a href="/privacy" className="text-primary hover:underline font-semibold">Chính sách Bảo mật</a> của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;
