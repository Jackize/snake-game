# 🐍 Snake Game — Trò Chơi Con Rắn (Web)

Game con rắn kinh điển chạy trực tiếp trên trình duyệt, không cần thư viện ngoài.

## 🚀 Cách chạy

Mở file `index.html` trực tiếp trên trình duyệt, hoặc dùng một local server:

```bash
# Python
python3 -m http.server 8000

# hoặc Node (npx)
npx serve .
```

Sau đó truy cập `http://localhost:8000`.

## 🎮 Cách chơi

- **Điều khiển:** phím mũi tên hoặc `W` `A` `S` `D`
- **Mục tiêu:** ăn thức ăn đỏ để ghi điểm, rắn **đi xuyên tường** (xuất hiện ở phía đối diện), chỉ thua khi tự cắn thân
- **Điểm:** +10 mỗi thức ăn, rắn tăng tốc dần
- **Kỷ lục:** lưu tự động bằng `localStorage`

## 📁 Cấu trúc dự án

```
snake-game-web/
├── index.html      # Giao diện chính
├── css/
│   └── style.css   # Styles
├── js/
│   └── game.js     # Logic game
└── README.md
```
