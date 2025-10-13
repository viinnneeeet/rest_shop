const puppeteer = require('puppeteer');

async function generatePDF(htmlContent) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
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
