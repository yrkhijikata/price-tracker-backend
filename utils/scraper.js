const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const getProductInfo = async (url) => {
  // const browser = await puppeteer.launch({
  //   headless: false,
  // });
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  // console.log("launched");

  try {
    await page.goto(url);
    console.log("Finished loading");
    // await page.waitFor(2000);

    await Promise.race([
      page.waitForSelector("#landingImage", { timeout: 4000 }),
      page.waitForSelector("#img-wrapper", { timeout: 4000 }),
    ]);
    // await page.waitForSelector("#landingImage");
    console.log("fininished waiting");
    const html = await page.content();
    const $ = cheerio.load(html);

    const title = $("#productTitle").text();
    // console.log("title", title);
    let price =
      $("#priceblock_ourprice").text() ||
      $("#priceblock_saleprice").text() ||
      $("#price").text();
    price = Number(price.replace(/[^0-9.-]+/g, ""));
    // console.log("price", price);
    const imgEl = $("#landingImage") || $("#img-wrapper img");
    // console.log("--------imgEl[0]", imgEl === $("#img-wrapper img"));
    const img = imgEl[0].attribs.src;
    // const img = $("#landingImage")[0].attribs.src || $("#img-wrapper img")[0].attribs.src;
    // const img = $("#img-wrapper img")[0].attribs.src;
    // console.log("----------img", img);

    await browser.close();
    console.log({ title, price, img });
    return { title, price, img, url };
  } catch {
    await browser.close();
    return null;
  }
};

// getProductInfo(
//   "https://www.amazon.co.jp/GTRACING-%E3%82%B2%E3%83%BC%E3%83%9F%E3%83%B3%E3%82%B0%E3%83%81%E3%82%A7%E3%82%A2-%E3%82%AA%E3%83%95%E3%82%A3%E3%82%B9%E3%83%81%E3%82%A7%E3%82%A2-%E3%82%B2%E3%83%BC%E3%83%A0%E7%94%A8%E3%83%81%E3%82%A7%E3%82%A2-%E3%83%A9%E3%83%B3%E3%83%90%E3%83%BC%E3%82%B5%E3%83%9D%E3%83%BC%E3%83%88/dp/B075S1TXFV/ref=sr_1_1_sspa?__mk_ja_JP=%E3%82%AB%E3%82%BF%E3%82%AB%E3%83%8A&dchild=1&keywords=%E3%82%B2%E3%83%BC%E3%83%9F%E3%83%B3%E3%82%B0%E3%83%81%E3%82%A7%E3%82%A2&qid=1623735819&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExS01UUEdFQ1NYVEpGJmVuY3J5cHRlZElkPUEwODg0NzgxMVowQkxGSEFRUUNGQSZlbmNyeXB0ZWRBZElkPUExMjY0TUdPWE1KTkpTJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ=="
// );

module.exports = {
  getProductInfo,
};
