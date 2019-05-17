const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000")
});

afterEach(async () => {
  await page.close();
});

describe("While logged in", () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a.btn-floating");
  });

  it("can see blog create form", async () => {
    const label = await page.getContentsOf("form label");

    return expect(label).toEqual("Blog Title");
  });

  describe("and entering valid inputs into form.", () => {
    beforeEach(async () => {
      await page.type(".title input", "My Title");
      await page.type(".content input", "My content");
      await page.click("form button");
    });

    test("Submitting takes user to review screen", async () => {
      const text = await page.getContentsOf("h5")
      return expect(text).toEqual("Please confirm your entries");
    });

    test("Submitting then saving adds blog to index page", async () => {
      await page.click("button.green");
      await page.waitFor(".card");
      const title = await page.getContentsOf(".card-title");
      const content = await page.getContentsOf("p");

      expect(title).toEqual("My Title");
      return expect(content).toEqual("My content");
    });

  });

  describe("And entering invalid inputs into form", () => {

    beforeEach(async () => {
      await page.click("form button")
    });

    it("shows an error message", async () => {
      const titleError = await page.getContentsOf(".title .red-text");
      const contentError = await page.getContentsOf(".content .red-text");

      expect(titleError).toEqual("You must provide a value");
      return expect(contentError).toEqual("You must provide a value");
    });
  });
});

describe("When user is not logged in", () => {
  it("cannot create blog post", async () => {
    const result = await page.evaluate(() =>
      fetch("/api/blogs", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ title: "My Title", content: "My content" })
      }).then(res => res.json())
    );

    return expect(result).toMatchObject({ error: "You must log in!" });
  });

  it("cannot get list of posts", async () => {
    const result = await page.evaluate(() => 
      fetch("/api/blogs", {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.json())
    );

    return expect(result).toMatchObject({ error: "You must log in!" });
  });
});