const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const { db } = require("../firebase");

async function getProducts() {
  const productObjs = [];
  await db
    .collection("products")
    .get()
    .then((snapshot) => {
      snapshot.forEach((d) => {
        console.log(d.data());
        // console.log("------id", d.id);
        const productObj = {
          id: d.id,
          price: d.data().price,
          url: d.data().url,
          history: d.data().history,
        };
        productObjs.push(productObj);
      });
    });
  console.log(productObjs);

  return productObjs;
}

async function autoscraper(productObjs) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (let i = 0; i < productObjs.length; i++) {
    // console.log(productObjs[i].url);
    await page.goto(productObjs[i].url);
    page.waitFor(1000);
    const html = await page.content();
    const $ = cheerio.load(html);
    let price =
      $("#priceblock_ourprice").text() ||
      $("#priceblock_saleprice").text() ||
      $("#price").text();

    price = Number(price.replace(/[^0-9.-]+/g, ""));

    // console.log("price--------", price);
    await page.goBack();

    await db
      .collection("products")
      .doc(productObjs[i].id)
      .update({
        price: price,
        history: [...productObjs[i].history, { price: price, updated_at: new Date() }],
      })
      .then(() => console.log("price successfully updated"))
      .catch(() => {
        console.log("something went wronng!!");
      });
  }
  //   return newPrices;
  await browser.close();
}

(async function main() {
  const productObjs = await getProducts();
  // autoscraper(productObjs);
  const key = setInterval(() => autoscraper(productObjs), 600000);
  setTimeout(() => {
    clearInterval(key);
  }, 1800000);
})();