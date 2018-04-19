const puppeteer = require('puppeteer');
const date = process.argv[2];
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  await page.goto('http://localhost:4000/map/?embed=true&dates=' + date);
  await page.waitForSelector('#map-loaded');
  const text = await page.evaluate(el => el.innerHTML, await page.$('#map-loaded'));
  console.log(text);
  await page.screenshot({path: date.split('/').join('-') + '.jpg'});
  await browser.close();
})();