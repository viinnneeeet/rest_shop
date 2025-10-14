const chromium = require('@sparticuz/chromium');
const puppeteer = require('puppeteer-core');
const os = require('os');

async function generatePDF(htmlContent) {
  const isWindows = os.platform() === 'win32';

  const executablePath = isWindows
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' // Adjust your local Chrome path
    : await chromium.executablePath();

  const browser = await puppeteer.launch({
    args: isWindows ? [] : chromium.args,
    defaultViewport: isWindows ? null : chromium.defaultViewport,
    executablePath,
    headless: true,
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, {
    waitUntil: 'networkidle0',
    timeout: 60000,
  });
  await page.evaluateHandle('document.fonts.ready');
  await page.emulateMediaType('screen');

  const height = await page.evaluate(() => {
    const body = document.body;
    const html = document.documentElement;
    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  });

  let pdfBuffer = await page.pdf({
    printBackground: true,
    width: '210mm',
    height: `${height}px`,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
  });

  // 🧠 Fix for Uint8Array return types in Puppeteer 21+
  if (!(pdfBuffer instanceof Buffer)) {
    console.warn('⚠️ Converting non-Buffer PDF output to Buffer');
    pdfBuffer = Buffer.from(pdfBuffer);
  }

  await browser.close();
  return pdfBuffer;
}

module.exports = { generatePDF };
