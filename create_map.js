const puppeteer = require('puppeteer');
const date = process.argv[2];
let params = '';
if(date) {
	params = '&dates=' + date;
	name = date.split('/').join('-');
}
else {
	name = "map-all";
}
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  await page.goto('http://localhost:4000/map/?embed=true)' + params);
  await page.waitForSelector('#map-loaded');
  const text = await page.evaluate(el => el.innerHTML, await page.$('#map-loaded'));
  await page.screenshot({path: name + '.jpg'});
  await browser.close();
})();