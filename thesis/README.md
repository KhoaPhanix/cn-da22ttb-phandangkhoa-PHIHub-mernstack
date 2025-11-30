# Thesis Documentation - PHIHub

> Thư mục chứa tài liệu văn bản đồ án

---

## 📂 Cấu trúc thư mục

```
thesis/
├── doc/                    # Tài liệu Word (.DOC/.DOCX)
├── pdf/                    # Tài liệu PDF
├── html/                   # Tài liệu web/HTML
├── abs/                    # Báo cáo tóm tắt (Abstract)
└── refs/                   # Tài liệu tham khảo
```

---

## 📄 doc/ - Tài liệu Word

Thư mục chứa các file tài liệu định dạng Microsoft Word (.DOC, .DOCX):

**Nên bao gồm:**
- `PHIHub_Thesis_Final.docx` - Báo cáo chính
- `PHIHub_Appendix.docx` - Phụ lục (nếu có)
- `PHIHub_UserManual.docx` - Hướng dẫn sử dụng

**Nội dung báo cáo nên có:**
1. Trang bìa
2. Lời cam đoan
3. Lời cảm ơn
4. Mục lục
5. Danh sách hình ảnh/bảng biểu
6. Chương 1: Giới thiệu
7. Chương 2: Cơ sở lý thuyết
8. Chương 3: Phân tích và thiết kế hệ thống
9. Chương 4: Cài đặt và triển khai
10. Chương 5: Kết quả và đánh giá
11. Chương 6: Kết luận và hướng phát triển
12. Tài liệu tham khảo
13. Phụ lục

---

## 📕 pdf/ - Tài liệu PDF

Thư mục chứa các file PDF (bản cuối cùng để nộp):

**Yêu cầu:**
- `PHIHub_Thesis_Final.pdf` - **BẮT BUỘC** - Báo cáo chính (export từ Word)
- `PHIHub_Poster.pdf` - Poster trình bày (nếu có)
- `PHIHub_Slides.pdf` - Slides thuyết trình (export từ PPT)

**Quy cách PDF:**
- Font chữ: Times New Roman 13pt (nội dung), 14pt (tiêu đề)
- Lề: Trái 3cm, Phải 2cm, Trên/Dưới 2.5cm
- Đánh số trang đầy đủ
- Bookmark/mục lục có thể click được

---

## 🌐 html/ - Tài liệu Web

Thư mục chứa tài liệu dạng web (HTML):

**Có thể bao gồm:**
- `index.html` - Trang chủ documentation
- `api-docs.html` - API documentation
- `user-guide.html` - Hướng dẫn sử dụng
- `architecture.html` - Kiến trúc hệ thống

**Ưu điểm:**
- Tương tác được (video demo, link)
- Dễ dàng điều hướng
- Có thể embed code examples

---

## 🎤 abs/ - Abstract/Báo cáo tóm tắt

Thư mục chứa các file trình bày và demo:

**Nên có:**
- `PHIHub_Presentation.pptx` - PowerPoint slides
- `PHIHub_Presentation.pdf` - PDF của slides
- `PHIHub_Demo.mp4` - Video demo hệ thống (nếu có)
- `PHIHub_Poster.pdf` - Poster A0/A1 (nếu có)
- `PHIHub_Abstract.pdf` - Tóm tắt 1-2 trang

**Quy cách PowerPoint:**
- Số slide: 15-25 slides
- Thời gian trình bày: 15-20 phút
- Nội dung chính:
  1. Giới thiệu đề tài (2-3 slides)
  2. Mục tiêu (1 slide)
  3. Công nghệ sử dụng (1-2 slides)
  4. Kiến trúc hệ thống (2-3 slides)
  5. Các chức năng chính (3-5 slides)
  6. Demo (screenshots/video)
  7. Kết quả đạt được (1-2 slides)
  8. Hạn chế và hướng phát triển (1 slide)
  9. Kết luận (1 slide)

---

## 📚 refs/ - Tài liệu tham khảo

Thư mục chứa các tài liệu, paper, sách đã tham khảo:

**Cách tổ chức:**

```
refs/
├── papers/
│   ├── [Tên tác giả]_[Năm]_[Tiêu đề ngắn].pdf
│   └── ...
├── books/
│   ├── NodeJS_Design_Patterns.pdf
│   ├── React_Up_and_Running.pdf
│   └── ...
├── online-resources/
│   └── links.md              # Danh sách link tham khảo
└── README.md                 # Danh mục tài liệu tham khảo
```

**Quy tắc đặt tên file tham khảo:**

Theo chuẩn IEEE/APA:
- Format: `[Tác giả]_[Năm]_[KeyWords].pdf`
- Ví dụ: `Smith_2023_MERN_Stack_Architecture.pdf`

**File `refs/links.md` mẫu:**

```markdown
# Tài liệu tham khảo online

## Documentation chính thức
1. React Official Docs - https://react.dev
2. Express.js Guide - https://expressjs.com
3. MongoDB Manual - https://docs.mongodb.com

## Tutorials & Courses
1. Node.js Best Practices - https://github.com/goldbergyoni/nodebestpractices
2. React Patterns - https://reactpatterns.com

## Research Papers
1. [1] J. Smith, "Microservices Architecture", IEEE 2023
2. [2] M. Johnson, "JWT Security Best Practices", ACM 2022
```

---

## ✅ Checklist trước khi nộp

- [ ] File PDF báo cáo chính đã được xuất và kiểm tra kỹ
- [ ] Tất cả hình ảnh/biểu đồ hiển thị rõ ràng
- [ ] Đánh số trang đầy đủ
- [ ] Mục lục và references đúng format
- [ ] File PowerPoint đã được review
- [ ] Tài liệu tham khảo đầy đủ và đúng format citation
- [ ] File README.md trong mỗi thư mục con đã được cập nhật

---

## 📝 Ghi chú

- Tất cả file nên được backup nhiều nơi (Google Drive, GitHub, USB)
- Version control cho file Word: đặt tên có date (e.g., `PHIHub_Thesis_v2_20250115.docx`)
- Nên có ít nhất 2 người review trước khi nộp chính thức

---

**Cập nhật cuối:** [Ngày cập nhật]  
**Người thực hiện:** [Tên sinh viên]
