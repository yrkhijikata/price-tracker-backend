const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const getProductInfo = async (url) => {
  // const browser = await puppeteer.launch({
  //   headless: false,
  // });

  const chromeOptions = {
    headless: true,
    defaultViewport: null,
    args: [
      // "--incognito",
      "--no-sandbox",
      // "--disable-setuid-sandbox",
      // "--single-process",
      // "--no-zygote",
      "--lang=ja",
    ],
  };

  const browser = await puppeteer.launch(chromeOptions);

  const page = await browser.newPage();
  await page.setGeolocation({ latitude: 35.1815, longitude: 136.9066 });
  // await page.setUserAgent(
  //   "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  // );
  // console.log("launched");

  try {
    await page.goto(url);
    console.log("Finished loading");
    await page.waitForTimeout(10000);

    // await page.waitForSelector("#productTitle", { timeout: 4000 });
    // await Promise.race([
    //   page.waitForSelector("#priceblock_ourprice"),
    //   page.waitForSelector("#priceblock_saleprice"),
    //   page.waitForSelector("#priceblock_dealprice"),
    //   page.waitForSelector("#price"),
    //   page.waitForSelector("#priceblock_ourprice"),
    // ]);
    // await page.waitForSelector("#landingImage");
    console.log("fininished waiting");
    const html = await page.content();
    const $ = cheerio.load(html);
    console.log("html---------", html);

    const title = $("#productTitle").text();
    console.log("title", title);
    let price =
      $("#priceblock_ourprice").text() ||
      $("#priceblock_saleprice").text() ||
      $("#priceblock_dealprice").text() ||
      $("#price").text() ||
      $("#priceblock_ourprice").text();
    console.log("-------price", price);
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
  } catch (err) {
    await browser.close();
    console.log(err.message);
    return null;
  }
};

module.exports = {
  getProductInfo,
};
