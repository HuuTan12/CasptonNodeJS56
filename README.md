# Dự Án Cuối Khóa NodeJS 56 - Backend API Airbnb (CyberSoft)

Hệ thống RESTful API đặt phòng du lịch Airbnb theo chuẩn **Clean Architecture (3 Layers)** và tài liệu Swagger của CyberSoft.

---

## 🚀 Công Nghệ Sử Dụng

- **Ngôn ngữ & Runtime:** Node.js (v22+) & ExpressJS 5 (ES Modules)
- **Database & ORM:** MySQL 8 (Docker) & Prisma ORM 6
- **Xác thực & Bảo mật:** JSON Web Token (JWT), bcryptjs (mã hóa 10 rounds), Phân quyền Role-based (`ADMIN` & `USER`)
- **Upload File:** Multer (xử lý hình ảnh avatar, hình phòng, hình vị trí; tự động xóa ảnh cũ khi cập nhật hoặc xóa dữ liệu)
- **Tài liệu & Kiểm thử:** Swagger UI (`/swagger`), Postman Collection (`Airbnb_Postman_Collection.json`)
- **Docker:** Cung cấp sẵn `Dockerfile` & `docker-compose.yml`

---

## 📁 Cấu Trúc Thư Mục Chuẩn Clean Code

```text
CasptonNodeJS56/
├── prisma/
│   ├── schema.prisma                  # Định nghĩa 5 Models: NguoiDung, ViTri, Phong, DatPhong, BinhLuan
│   └── seed.js                        # Nạp sẵn tài khoản Admin, User, 8 Vị trí, 10 Phòng, Đặt phòng & Bình luận
├── public/
│   └── images/                        # Nơi lưu trữ file ảnh upload
├── src/
│   ├── common/
│   │   ├── constants/
│   │   │   └── app.constant.js        # Cấu hình biến môi trường PORT, JWT_SECRET, ROLES
│   │   ├── helpers/
│   │   │   ├── exception.helper.js    # Khởi tạo các class lỗi 400, 401, 403, 404
│   │   │   ├── handle-error.helper.js # Bắt lỗi tập trung (Prisma, JWT, Multer, JSON)
│   │   │   ├── pagination.helper.js   # Phân trang chuẩn format CyberSoft
│   │   │   ├── permission.helper.js   # Kiểm tra quyền ADMIN hoặc chính chủ
│   │   │   ├── request.helper.js      # Parse & Validate ID, Date, Fields bắt buộc
│   │   │   ├── response.helper.js     # Chuẩn hóa JSON trả về { statusCode, message, content, dateTime }
│   │   │   └── upload.helper.js       # Helper upload và thay thế ảnh dùng chung
│   │   ├── middleware/
│   │   │   └── protect.middleware.js  # Middleware xác thực JWT và kiểm tra quyền
│   │   ├── multer/
│   │   │   └── local.multer.js        # Multer cấu hình lưu ảnh cục bộ & dọn rác
│   │   ├── prisma/
│   │   │   └── init.prisma.js         # Khởi tạo Prisma Client (tự động omit password)
│   │   └── swagger/
│   │       ├── airbnb-swagger.json    # File đặc tả Swagger đã bỏ tokenCybersoft
│   │       └── init.swagger.js        # Tích hợp Swagger UI vào endpoint /swagger
│   ├── controllers/                   # Nhận Request và trả Response qua helper
│   ├── services/                      # Xử lý logic nghiệp vụ và truy vấn Prisma
│   └── routers/                       # Định nghĩa đường dẫn và gắn middleware
├── .env                               # Cấu hình môi trường bí mật
├── Airbnb_Postman_Collection.json     # File import vào Postman test 36 API
├── docker-compose.yml                 # Khởi chạy MySQL Database trên cổng 3307
├── Dockerfile                         # Đóng gói ứng dụng chạy container
└── server.js                          # Entry point khởi chạy server
```

---

## 🔑 Tài Khoản Mẫu Để Test (Seed Data)

Mật khẩu mặc định cho tất cả tài khoản mẫu là: `123456`

| Email | Vai trò (Role) | Chức năng có thể test |
| :--- | :---: | :--- |
| `admin@gmail.com` | **ADMIN** | Quản lý toàn bộ hệ thống: thêm/sửa/xóa Vị trí, Phòng, xem danh sách User, xóa đơn Đặt phòng |
| `user@gmail.com` | **USER** | Đặt phòng, chỉnh sửa thông tin cá nhân, bình luận, upload avatar |
| `binh@gmail.com` | **USER** | Tài khoản phụ test đặt phòng và bình luận |

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Khởi động Database MySQL (qua Docker)
```bash
docker compose up -d
```

### 2. Đẩy cấu trúc bảng vào Database & Nạp dữ liệu mẫu
```bash
npm run db:push
npm run db:seed
```

### 3. Khởi động Server (ở chế độ development tự reload)
```bash
npm run dev
```

- **Trang chủ Server:** `http://localhost:3069/api`
- **Tài liệu Swagger UI:** `http://localhost:3069/swagger`

---

## 📋 Danh Sách Đầy Đủ 36 APIs Theo Chuẩn CyberSoft

### 1. Auth (2 APIs)
- `POST /api/auth/signup` – Đăng ký tài khoản (tự động cấp role `USER`, mã hóa mật khẩu)
- `POST /api/auth/signin` – Đăng nhập (trả về thông tin người dùng và JWT Token)

### 2. Người Dùng - Users (8 APIs)
- `GET /api/users` – Lấy danh sách toàn bộ người dùng *(Chỉ ADMIN)*
- `POST /api/users` – Thêm người dùng mới *(Chỉ ADMIN)*
- `DELETE /api/users?id={id}` – Xóa người dùng *(Chỉ ADMIN, chặn tự xóa chính mình)*
- `GET /api/users/phan-trang-tim-kiem` – Phân trang và tìm kiếm người dùng *(Chỉ ADMIN)*
- `GET /api/users/{id}` – Xem chi tiết người dùng *(Chính chủ hoặc ADMIN)*
- `PUT /api/users/{id}` – Cập nhật người dùng *(Chính chủ hoặc ADMIN, User thường không thể tự sửa role)*
- `GET /api/users/search/{TenNguoiDung}` – Tìm kiếm người dùng theo tên *(Chỉ ADMIN)*
- `POST /api/users/upload-avatar` – Upload avatar cá nhân *(Tự động xóa ảnh cũ)*

### 3. Vị Trí (7 APIs)
- `GET /api/vi-tri` – Lấy danh sách vị trí
- `POST /api/vi-tri` – Thêm vị trí mới *(Chỉ ADMIN)*
- `GET /api/vi-tri/phan-trang-tim-kiem` – Phân trang & tìm kiếm vị trí
- `GET /api/vi-tri/{id}` – Lấy chi tiết vị trí theo ID
- `PUT /api/vi-tri/{id}` – Cập nhật vị trí *(Chỉ ADMIN)*
- `DELETE /api/vi-tri/{id}` – Xóa vị trí *(Chỉ ADMIN, tự động dọn ảnh trên đĩa)*
- `POST /api/vi-tri/upload-hinh-vitri?maViTri={id}` – Upload hình ảnh vị trí *(Chỉ ADMIN)*

### 4. Phòng Thuê (8 APIs)
- `GET /api/phong-thue` – Lấy danh sách phòng
- `POST /api/phong-thue` – Thêm phòng mới *(Chỉ ADMIN, kiểm tra ràng buộc maViTri)*
- `GET /api/phong-thue/lay-phong-theo-vi-tri?maViTri={id}` – Lấy danh sách phòng theo mã vị trí
- `GET /api/phong-thue/phan-trang-tim-kiem` – Phân trang và tìm kiếm phòng
- `GET /api/phong-thue/{id}` – Xem chi tiết phòng theo ID
- `PUT /api/phong-thue/{id}` – Cập nhật phòng *(Chỉ ADMIN)*
- `DELETE /api/phong-thue/{id}` – Xóa phòng *(Chỉ ADMIN, xóa kèm đơn đặt phòng & bình luận)*
- `POST /api/phong-thue/upload-hinh-phong?maPhong={id}` – Upload hình phòng *(Chỉ ADMIN)*

### 5. Đặt Phòng (6 APIs)
- `GET /api/dat-phong` – Lấy danh sách toàn bộ đơn đặt phòng *(Chỉ ADMIN)*
- `POST /api/dat-phong` – Tạo đơn đặt phòng mới *(Kiểm tra ngày đến trước ngày đi, không ở quá khứ, kiểm tra số khách <= sức chứa, chặn trùng lịch)*
- `GET /api/dat-phong/{id}` – Xem chi tiết đơn đặt phòng *(Chính chủ hoặc ADMIN)*
- `PUT /api/dat-phong/{id}` – Cập nhật đơn đặt phòng *(Chính chủ hoặc ADMIN)*
- `DELETE /api/dat-phong/{id}` – Hủy đơn đặt phòng *(Chính chủ hoặc ADMIN)*
- `GET /api/dat-phong/lay-theo-nguoi-dung/{MaNguoiDung}` – Lịch sử đặt phòng của một người dùng

### 6. Bình Luận (5 APIs)
- `GET /api/binh-luan` – Lấy danh sách bình luận
- `POST /api/binh-luan` – Viết bình luận cho phòng *(Sao từ 1 đến 5)*
- `GET /api/binh-luan/lay-binh-luan-theo-phong/{MaPhong}` – Lấy danh sách bình luận của 1 phòng
- `PUT /api/binh-luan/{id}` – Chỉnh sửa bình luận *(Chính chủ hoặc ADMIN)*
- `DELETE /api/binh-luan/{id}` – Xóa bình luận *(Chính chủ hoặc ADMIN)*

---

## 🎯 Kế Hoạch Phân Chia Task (Báo Cáo Trello / Excel theo Slide 5)

| Giai đoạn | Nội dung công việc | Kết quả bàn giao |
| :--- | :--- | :--- |
| **Ngày 1** | Phân tích Swagger & ERD; Setup Docker MySQL, Prisma ORM, cấu trúc 3 tầng Clean Architecture | `schema.prisma`, `docker-compose.yml`, `src/common` |
| **Ngày 2** | Xây dựng Module **Auth** (JWT, bcrypt) và Module **Người Dùng** (CRUD, phân trang, upload avatar) | `auth.service.js`, `user.service.js`, `protect.middleware.js` |
| **Ngày 3** | Xây dựng Module **Vị Trí** và Module **Phòng Thuê** (lọc theo vị trí, phân trang, upload hình) | `viTri.service.js`, `phong.service.js`, helper upload |
| **Ngày 4** | Xây dựng Module **Đặt Phòng** (ràng buộc lịch, số khách) và Module **Bình Luận** | `datPhong.service.js`, `binhLuan.service.js` |
| **Ngày 5** | Tích hợp **Swagger UI**, xuất **Postman Collection**, kiểm thử 100% API, viết README và quay video demo | `Airbnb_Postman_Collection.json`, video demo |

---

## 🎥 Gợi Ý Kịch Bản Quay Video Demo YouTube (5 - 8 Phút)

1. **Phút 0:00 - 1:00:** Giới thiệu bản thân, đề tài (Capstone API Airbnb NodeJS 56 CyberSoft) và kiến trúc Clean Architecture 3 tầng (Router -> Controller -> Service).
2. **Phút 1:00 - 2:00:** Mở TablePlus giới thiệu Database gồm 5 bảng đã chuẩn hóa khóa chính, khóa ngoại.
3. **Phút 2:00 - 4:00:** Mở trình duyệt vào `http://localhost:3069/swagger`:
   - Bấm Authorize nhập Token sau khi gọi API `/api/auth/signin`.
   - Test các API xem danh sách phòng, lọc phòng theo vị trí, phân trang tìm kiếm.
4. **Phút 4:00 - 6:00:** Mở Postman test:
   - Đặt phòng mới (thể hiện server chặn khi ngày đến ở quá khứ hoặc số khách vượt quá sức chứa phòng).
   - Upload hình ảnh phòng hoặc avatar người dùng (chỉ vào thư mục `public/images` để thấy file được lưu và file cũ được dọn dẹp sạch).
5. **Phút 6:00 - 7:00:** Tổng kết các tính năng Clean Code và điểm cộng mở rộng (Middleware bắt lỗi tập trung, bảo vệ dữ liệu mật khẩu, Docker).

