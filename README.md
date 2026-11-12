# 纸间 · Chinese Novel Lab

Một trang web tĩnh để đọc truyện ngắn và luyện dịch tiếng Trung theo hai hướng:

- **Trung → Việt:** đọc nguyên văn tiếng Trung, tự viết tiếng Việt rồi mới mở bản dịch tham khảo.
- **Việt → Trung:** đọc bản tiếng Việt, tự viết lại bằng tiếng Trung rồi mới mở nguyên văn.

## Chạy trên máy

Mở `index.html` trong trình duyệt. Không cần cài đặt hoặc máy chủ.

## Đưa lên GitHub Pages

Repo này được cấu hình deploy tự động bằng GitHub Actions. Vào **Settings → Pages**, chọn **GitHub Actions** làm Build and deployment source. Sau khi workflow chạy xong, website sẽ ở:

`https://johnson4208.github.io/chinese-novel-lab/`

## Thêm truyện

Chọn **Thêm đoạn truyện**, điền tên truyện và đoạn, rồi dán nguyên văn tiếng Trung cùng bản dịch tiếng Việt. Nếu bạn gửi ảnh chụp cho trợ lý để dịch trước, hãy dán phần văn bản nhận diện được và bản dịch vào biểu mẫu này. Website hiện không tự đọc chữ từ ảnh.

Các truyện tự thêm, bản dịch của bạn và dấu trang được lưu bằng `localStorage` trong trình duyệt hiện tại; chúng không đồng bộ giữa thiết bị và sẽ mất nếu xóa dữ liệu trang web.
