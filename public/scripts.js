// Dữ liệu câu hỏi và đáp án (giữ nguyên)
const data = [
  // 1
  {
    cau_hoi: "Chậu nước, cái xô trong tiếng Nhật là gì?",
    dap_an_dung: "バケツ",
  },
  { cau_hoi: "Chổi trong tiếng Nhật là gì?", dap_an_an_dung: "ほうき" },
  { cau_hoi: "Đồ hốt rác trong tiếng Nhật là gì?", dap_an_dung: "ちりとり" },
  { cau_hoi: "Xọt rác trong tiếng Nhật là gì?", dap_an_dung: "ごみばこ" },
  {
    cau_hoi: "Túi đựng rác trong tiếng Nhật là gì?",
    dap_an_dung: "ゴミぶくろ",
  },
  { cau_hoi: "Nơi đổ rác trong tiếng Nhật là gì?", dap_an_dung: "ごみおきば" },
  {
    cau_hoi: "Nơi tập kết rác trong tiếng Nhật là gì?",
    dap_an_dung: "ごみあつめところ",
  },
];

/**
 * Hàm: Tìm và click đáp án đúng trên trang.
 * Thay thế cho việc dùng page.evaluate.
 * @param {string} g - Nội dung câu hỏi.
 * @param {string} t - Đáp án đúng.
 * @returns {boolean} - Trạng thái click thành công hay không.
 */
function clickCorrectAnswer(g, t) {
  let clicked = false;
  const questionBlocks = document.querySelectorAll(".Qr7Oae"); // Selector khối câu hỏi

  questionBlocks.forEach((questionBlock) => {
    // Tìm phần tử chứa nội dung câu hỏi
    const questionElement = questionBlock.querySelector(".M7eMe");
    const currentQuestionText = questionElement
      ? questionElement.textContent.trim()
      : "";

    // Tìm câu hỏi khớp
    if (!clicked && currentQuestionText === g) {
      // Tìm các tùy chọn đáp án
      const options = questionBlock.querySelectorAll(
        ".aDTYNe.snByac.OvPDhc.OIC90c"
      );

      // Lặp qua các tùy chọn để tìm đáp án đúng
      for (const answerOption of options) {
        if (answerOption.textContent.trim() === t) {
          answerOption.click();
          clicked = true;
          return; // Thoát khỏi forEach sau khi click
        }
      }
    }
  });

  return clicked;
}

/**
 * Hàm: Tìm và click một đáp án BẤT KỲ KHÁC đáp án đúng.
 * Thay thế cho việc dùng page.evaluate.
 * @param {string} g - Nội dung câu hỏi.
 * @param {string} t - Đáp án đúng.
 * @returns {boolean} - Trạng thái click thành công hay không.
 */
function clickWrongAnswer(g, t) {
  let clicked = false;
  const questionBlocks = document.querySelectorAll(".Qr7Oae");

  questionBlocks.forEach((questionBlock) => {
    // Tìm phần tử chứa nội dung câu hỏi
    const questionElement = questionBlock.querySelector(".M7eMe");
    const currentQuestionText = questionElement
      ? questionElement.textContent.trim()
      : "";

    // Tìm câu hỏi khớp
    if (!clicked && currentQuestionText === g) {
      const options = questionBlock.querySelectorAll(
        ".aDTYNe.snByac.OvPDhc.OIC90c"
      );

      // Tìm đáp án SAI đầu tiên để click
      for (const answerOption of options) {
        if (answerOption.textContent.trim() !== t) {
          answerOption.click(); // Click đáp án sai
          clicked = true;
          return; // Thoát khỏi forEach sau khi click
        }
      }

      // Cảnh báo nếu không tìm được đáp án sai (có thể chỉ có 1 tùy chọn)
      if (!clicked) {
        console.warn(
          `[Cảnh báo] KHÔNG THỂ chọn đáp án SAI cho: "${g}". Có thể chỉ có một tùy chọn.`
        );
      }
    }
  });

  return clicked;
}

// --- Hàm Chính ---

/**
 * Hàm chính: Chạy quá trình tự động chọn đáp án.
 * Vì không dùng Puppeteer, hàm này không nhận đối tượng 'page'.
 * @param {number} [soCauDung=300] - Số lượng câu hỏi tối đa được chọn đáp án đúng.
 */
async function chay(soCauDung = 300) {
  // Cuộn xuống để đảm bảo tất cả các câu hỏi được tải
  window.scrollTo(0, document.body.scrollHeight);
  await new Promise((r) => setTimeout(r, 500)); // Đợi một chút để tải

  let soLuongDaClickDung = 0;
  console.log(
    `🎯 Bắt đầu quá trình chọn đáp án. Giới hạn câu đúng: ${soCauDung}`
  );

  console.log(`--- Tổng số câu trong dữ liệu: ${data.length} ---`);

  // Lặp qua dữ liệu câu hỏi
  for (let index = 0; index < data.length; index++) {
    const n = data[index];
    const g = n.cau_hoi;
    const t = n.dap_an_dung;

    // 1. CHỌN ĐÚNG (nếu chưa đạt giới hạn)
    if (soLuongDaClickDung < soCauDung) {
      const clicked = clickCorrectAnswer(g, t); // Gọi hàm DOM trực tiếp

      if (clicked) {
        soLuongDaClickDung++;
        console.log(
          `✅ Câu ${
            index + 1
          }: ĐÃ CHỌN ĐÚNG. (Tổng đúng: ${soLuongDaClickDung}/${soCauDung})`
        );
      } else {
        console.log(
          `⚠️ Câu ${
            index + 1
          }: Không tìm thấy câu hỏi/đáp án đúng cho "${g}" trên form.`
        );
      }

      // 2. CHỌN SAI (nếu đã đạt giới hạn)
    } else {
      const clickedWrong = clickWrongAnswer(g, t); // Gọi hàm DOM trực tiếp

      if (clickedWrong) {
        console.log(
          `❌ Câu ${index + 1}: ĐÃ CHỌN SAI (theo giới hạn). Câu hỏi: "${g}".`
        );
      } else {
        console.warn(`⚠️ Câu ${index + 1}: KHÔNG THỂ CHỌN SAI cho "${g}".`);
      }
    }

    // Tạm dừng một chút sau mỗi hành động để mô phỏng người dùng
    await new Promise((r) => setTimeout(r, 50));
  }

  console.log("--- Quá trình hoàn tất ---");
  console.log(
    `Tổng cộng: ${soLuongDaClickDung} câu hỏi đã được click đáp án đúng.`
  );
}

// Để chạy script này trên trang Google Form:
// 1. Mở trang Google Form trong trình duyệt.
// 2. Mở Console (F12 hoặc Ctrl+Shift+J/Cmd+Option+J).
// 3. Dán toàn bộ code (bao gồm data, clickCorrectAnswer, clickWrongAnswer, và chay) vào Console và nhấn Enter.
// 4. Gọi hàm chay() để bắt đầu, ví dụ: chay(5); // Chỉ chọn 5 câu đúng.
// chay(); // Chọn tất cả các câu đúng trong data (giới hạn mặc định 300)
// console.log("Hàm chay đã sẵn sàng. Gõ chay() để thực thi.");