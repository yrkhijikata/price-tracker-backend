require("dotenv").config();
const express = require("express");
const { getProductInfo } = require("./utils/scraper");
const { autoscraper } = require("./utils/autoscraper");

const app = express();

const port = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(express.static("client/build"));

app.post("/product", async (req, res) => {
  console.log("request received with url---------", req.body.url);
  const productInfo = await getProductInfo(req.body.url);
  console.log("product info received---------", productInfo);
  res.json(productInfo);
});

app.get("/", (_, res) => {
  res.send("application runninng");
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// autoscraper();
