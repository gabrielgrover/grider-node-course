const puppeteer = require("puppeteer");

test("we can launch a browser", async () => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();
  await page.goto("localhost:3000");
  const text = await page.$eval("a.brand-logo", el => el.innerHTML);

  return expect(text).toEqual("Blogster");
});