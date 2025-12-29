// scraper.js
const axios = require("axios");
const cheerio = require("cheerio");
const slugify = require("slugify");

const BLOG_URL = "https://beyondchats.com/blogs/";
const API_URL = "http://localhost:8001/api/articles";

async function getOldestArticles() {
  const { data } = await axios.get(BLOG_URL);
  const $ = cheerio.load(data);

  const articles = [];

  $(".blog-card").each((i, el) => {
    const title = $(el).find("h2").text().trim();
    const link = $(el).find("a").attr("href");

    articles.push({ title, link });
  });

  // Last 5 = oldest
  return articles.slice(-5);
}
