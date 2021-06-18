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
    // await page.waitFor(4000);

    // await page.waitForSelector("#productTitle", { timeout: 4000 });
    await Promise.race([
      page.waitForSelector("#priceblock_ourprice"),
      page.waitForSelector("#priceblock_saleprice"),
      page.waitForSelector("#priceblock_dealprice"),
      page.waitForSelector("#price"),
      page.waitForSelector("#priceblock_ourprice"),
    ]);
    // await page.waitForSelector("#landingImage");
    console.log("fininished waiting");
    const html = await page.content();
    const $ = cheerio.load(html);

    const title = $("#productTitle").text();
    console.log("title", title);
    let price =
      $("#priceblock_ourprice").text() ||
      $("#priceblock_saleprice").text() ||
      $("#priceblock_dealprice").text() ||
      $("#price").text() ||
      $("#priceblock_ourprice").text();
    price = Number(price.replace(/[^0-9.-]+/g, ""));
    console.log("price", price);
    const imgEl = $("#landingImage") || $("#img-wrapper img");
    // console.log("--------imgEl[0]", imgEl === $("#img-wrapper img"));
    const img = imgEl ? imgEl[0].attribs.src : "";
    // const img = $("#landingImage")[0].attribs.src || $("#img-wrapper img")[0].attribs.src;
    // const img = $("#img-wrapper img")[0].attribs.src;
    console.log("----------img", img);

    await browser.close();
    console.log({ title, price, img });
    return { title, price, img, url };
  } catch {
    await browser.close();
    return null;
  }
};

module.exports = {
  getProductInfo,
};
