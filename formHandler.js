const puppeteer = require("puppeteer");
const { PuppeteerScreenRecorder } = require("puppeteer-screen-recorder");
const path = require("path");
const fs = require("fs");
const chay = require("./dapAn");

const INPUT_SELECT = "input.whsOnd.zHQkBf";
const BTN1_SELECT = ".l4V7wb.Fxmcue";
const BTN2_SELECT = ".uArJ5e.UQuaGc.Y5sE8d.VkkpIf.QvWxOd .NPEfkd.RveJvd.snByac";

const URL_DE_1 = "https://forms.gle/UBYZhrHMmh8qoCKR9";
const URL_DE_2 = "https://forms.gle/UdXKwFC5qtoa7Tp3A";
const URL_DE_3 = "https://forms.gle/J8njVp4iWApvv3Mn7";
const URL_KHAU_LENH =
  "https://docs.google.com/forms/d/e/1FAIpQLScTDH5yqcdqdlbIzv79rUX-sSn7C7ccwGZj_BjuADGZUiqgtg/viewform";

const steps = [URL_DE_1, URL_DE_2, URL_DE_3, URL_KHAU_LENH];

// Helper: typeIfSelector
async function typeIfSelector(sel, value) {
  if (!sel) return;
  try {
    await page.waitForSelector(sel, { timeout: 3000 });
    await page.type(sel, value + "");
  } catch (e) {
    // Nếu không tìm thấy selector thì log, nhưng tiếp tục để tránh crash
    console.warn(`Selector not found: ${sel}`);
  }
}

async function submitGoogleFormAndRecord(payload) {
  const { name, className, de1, de2, de3, khauLenh } = payload;

  // Tạo thư mục lưu video
  const recordDir = path.join(__dirname, "record");
  if (!fs.existsSync(recordDir)) fs.mkdirSync(recordDir, { recursive: true });

  const videoPath = path.join(recordDir, `form-${Date.now()}.mp4`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  const recorder = new PuppeteerScreenRecorder(page);
  await recorder.start(videoPath);

  for (let i = 0; i < steps.length; i++) {
    const url = steps[i];
    await page.goto(url, { waitUntil: "networkidle2" });

    // Nhập tên, lớp
    const inputs = await page.$$(INPUT_SELECT);
    for (let i = 0; i < inputs.length; i++) {
      const element = inputs[i];
      // INSERT_YOUR_CODE
      // Lấy giá trị lần lượt từ payload: name, lop, truong
      const values = [name, className, "Sei Jin"];
      if (i < values.length) {
        await element.type(values[i] ? values[i].toString() : "");
      }
    }
    // INSERT_YOUR_CODE
    await new Promise((r) => setTimeout(r, 1500));
    await page.waitForSelector(BTN1_SELECT, { timeout: 3000 });
    await page.click(BTN1_SELECT);

    await new Promise((r) => setTimeout(r, 3000));

    const dataArr = [de1, de2, de3, khauLenh];
    if (dataArr[i]) {
      await chay(page, Number(dataArr[i]), i);
    }


    await new Promise((r) => setTimeout(r, 1500));
    // await page.waitForSelector(BTN2_SELECT, { timeout: 3000 });
    // await page.click(BTN2_SELECT);
    await new Promise((r) => setTimeout(r, 3000));
  }

  // Một khoảng đợi ngắn để user có thể thấy (và để video ghi lại)
  await new Promise((r) => setTimeout(r, 3500));

  await recorder.stop();
  await browser.close();

  return videoPath;
}

module.exports = submitGoogleFormAndRecord;
