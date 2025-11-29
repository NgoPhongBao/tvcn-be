const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const submitGoogleFormAndRecord = require("./formHandler");

const app = express();
app.use(cors());
app.use(express.json());


// INSERT_YOUR_CODE
app.get("/hello", (req, res) => {
  res.json({ message: "Hello World" });
});


// Endpoint chính: nhận dữ liệu, chạy Puppeteer, trả file mp4
app.post("/submit-form", async (req, res) => {
  const payload = req.body;
  try {
    const videoPath = await submitGoogleFormAndRecord(payload);

    // Trả file video để client tải về
    res.download(videoPath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
      // Sau khi gửi file xong (dù thành công hay lỗi), xóa file video
      fs.unlink(videoPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Lỗi khi xóa file video:", unlinkErr);
        }
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Lỗi khi xử lý form" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on port", PORT));
