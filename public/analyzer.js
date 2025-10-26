// analyzer.js
const API_URL = "https://lck-h7uu.onrender.com/analyze";

// Đảm bảo code chỉ chạy sau khi toàn bộ HTML đã tải xong
window.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const messageInput = document.getElementById("userMessage");
  const resultEl = document.getElementById("result");

  // Kiểm tra phần tử cần thiết
  if (!analyzeBtn || !messageInput || !resultEl) {
    console.error("❌ Không tìm thấy phần tử giao diện cần thiết (analyzeBtn, userMessage hoặc result).");
    return;
  }

  analyzeBtn.addEventListener("click", async () => {
    const message = messageInput.value.trim();
    if (!message) {
      alert("Vui lòng nhập nội dung cần phân tích!");
      return;
    }

    resultEl.textContent = "⏳ Đang phân tích bằng Gemini AI...";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
Bạn là AURA, một trí tuệ nhân tạo có nhiệm vụ phân tích mức độ an toàn của các tình huống được người dùng nhập vào. 
Mục tiêu của bạn là xác định xem tình huống đó có An toàn hay Nguy hiểm, kèm theo tỉ lệ phần trăm (%). 
Trả lời đúng định dạng:
An toàn/Nguy hiểm: [số%]
Lí do: [ngắn gọn].
Nếu khong phải là tình huống nguy hiểm, hãy trả lời Đây không phải là tình huống nguy hiểm

Tình huống người dùng nhập: "${message}"
`,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      console.log("🔹 Dữ liệu trả về từ server:", data);

      // Xử lý phản hồi từ Gemini
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        (data.error ? `❌ Lỗi: ${data.error.message}` : "Không nhận được phản hồi từ AI.");
      resultEl.textContent = reply;
    } catch (err) {
      resultEl.textContent = "⚠️ Lỗi khi gọi server: " + err.message;
      console.error(err);
    }
  });
});


const themeToggle = document.querySelector('.theme-toggle');

if (themeToggle) {
  themeToggle.textContent = '';
  let iconSpan = themeToggle.querySelector('span');
  if (!iconSpan) {
    iconSpan = document.createElement('span');
    themeToggle.appendChild(iconSpan);
  }

  // 🔹 Kiểm tra và áp dụng chế độ đã lưu trong localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.documentElement.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
    document.documentElement.classList.remove('dark-mode');
  }

  function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    iconSpan.textContent = isDark ? '🌙' : '🌞';
  }

  // Gán icon ban đầu
  updateThemeIcon();

  // 🔹 Khi người dùng nhấn nút chuyển chế độ
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.documentElement.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light'); // 🔸 Lưu trạng thái
    updateThemeIcon();
  });
}
