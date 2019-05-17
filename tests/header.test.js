const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("header has correct text", async () => {
  const text = await page.getContentsOf("a.brand-logo");

  return expect(text).toEqual("Blogster");
});

test("clicking login starts oauth flow", async () => {
  await page.click(".right a");
  const url = await page.url();
  
  return expect(url).toMatch(/accounts\.google\.com/);
});

test("when signed in show login button", async () => {
  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', e => e.innerHTML);

  return expect(text).toEqual("Logout");
});
