const puppeteer = require('puppeteer');
const date = "2018/04/01";
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:4000/roadtrip/map/?embed=true&dates=' + date);
  await page.screenshot({path: date.split('/').join('_') + '.jpg'});
  await browser.close();
})();