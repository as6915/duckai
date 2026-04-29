Enterimport express from "express";
import { chromium } from "playwright";

const app = express();
app.use(express.json());

app.post("/duck", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ success: false, error: "message required" });
  }

  let browser;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto("https://duck.ai/", { waitUntil: "domcontentloaded" });

    await page.waitForSelector("textarea");

    await page.fill("textarea", message);
    await page.keyboard.press("Enter");

    await page.waitForTimeout(6000);

    const reply = await page.evaluate(() => {
      const msgs = document.querySelectorAll('[data-testid="message"]');
      return msgs[msgs.length - 1]?.innerText || "";
    });

    await browser.close();

    res.json({
      success: true,
      message: reply
    });

  } catch (err) {
    if (browser) await browser.close();

    res.json({
      success: false,
      error: err.message
    });
  }
});

app.listen(3000, () => console.log("running"));
