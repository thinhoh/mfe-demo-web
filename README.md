# Micro-frontend E-commerce Demo

Chào mừng bạn đến với dự án mẫu Micro-frontend (MFE) dành cho người mới bắt đầu! Ứng dụng này mô phỏng một trang thương mại điện tử đơn giản, được xây dựng bằng React, Vite, Tailwind CSS và Module Federation.

## Kiến trúc dự án

Dự án này chia làm 2 phần chính (và một phần dùng chung):

1.  App Shell: Đóng vai trò là "vỏ" bọc bên ngoài, quản lý Header, Giỏ hàng và điều phối các ứng dụng con.
2.  Product MFE: Quản lý danh sách sản phẩm và dữ liệu (đọc từ file JSON).
3.  Shared: Chứa các thành phần dùng chung như `EventBus` (để các app nói chuyện với nhau) và các `Types`.

---

## Hướng dẫn cài đặt và Chạy ứng dụng

Để chạy được dự án này trên máy cá nhân, bạn cần cài đặt Node.js và pnpm.

### Bước 1: Tải mã nguồn về máy
Sau khi bạn tải file ZIP hoặc Clone từ GitHub, hãy mở thư mục dự án bằng Visual Studio Code.

### Bước 2: Cài đặt các thư viện (Dependencies)
Mở Terminal trong thư mục gốc và gõ lệnh:
```bash
pnpm install
```

Chấp nhận một số packages để build:
```bash
pnpm approve-builds
```

### Bước 3: Chạy ứng dụng
Vì đây là kiến trúc Micro-frontend, chúng ta cần bật đồng thời cả Remote (để cung cấp dữ liệu) và Host (để hiển thị giao diện).

Cách 1: Chạy từng ứng dụng (Mở 2 cửa sổ Terminal)

*   Terminal 1 (Product MFE):
    ```bash
    cd packages/product-mfe pnpm build
    pnpm preview
    ```
*   Terminal 2 (App Shell):
    ```bash
    cd packages/app-shell pnpm dev
    ```

---

## Giải thích các dòng code quan trọng

### 1. Module Federation (Kết nối A với B)
Trong file `vite.config.ts`:
- Remote (Product MFE): Sử dụng lệnh `exposes` để "quảng cáo" file `ProductList.tsx` ra bên ngoài dưới tên gọi `./ProductList`.
- Host (App Shell): Sử dụng lệnh `remotes` để khai báo địa chỉ của Product MFE (localhost:3001) và đặt tên cho nó là `productApp`.

### 2. EventBus (Các app giao tiếp)
Vì Host và Remote là 2 thế giới riêng biệt, chúng không thể dùng chung State (như useState) một cách trực tiếp.
- Khi bạn ấn "Thêm vào giỏ" ở Product MFE, nó sẽ gọi `EventBus.emit('ADD_TO_CART', data)`.
- App Shell luôn lắng nghe: `EventBus.subscribe('ADD_TO_CART', ...)` để cập nhật số lượng giỏ hàng ngay lập tức.

### 3. Dữ liệu (Mock Data)
Dữ liệu nằm tại `packages/product-mfe/src/data.json`. Bạn có thể thay đổi giá tiền hoặc tên sản phẩm trong file này, giao diện sẽ tự động cập nhật.

---

### Dự án này là một bản demo frontend-only, nên hiện tại không chứa các thông tin nhạy cảm (như API Key của Backend thật).
