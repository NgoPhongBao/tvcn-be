chayne(20);

function chayne(a) {
  fetch("https://tvcn-be.vercel.app/data")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      chay(data, a);
    });
}

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
function chay(data, soCauDung = 300) {
  // Cuộn xuống để đảm bảo tất cả các câu hỏi được tải
  window.scrollTo(0, document.body.scrollHeight);

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
  }
}
