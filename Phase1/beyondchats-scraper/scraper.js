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

async function scrapeArticleDetail(article) {
  const { data } = await axios.get(article.link);
  const $ = cheerio.load(data);

  const content = $(".blog-content").html();

  return {
    title: article.title,
    slug: slugify(article.title, { lower: true }),
    content,
    source_url: article.link,
    published_at: new Date()
  };
}

async function sendToAPI(payload) {
  try {
    await axios.post(API_URL, payload);
    console.log("Stored:", payload.title);
  } catch (err) {
    console.log("Skipped (already exists):", payload.title);
  }
}

async function runScraper() {
  const articles = await getOldestArticles();

  for (const article of articles) {
    const payload = await scrapeArticleDetail(article);
    await sendToAPI(payload);
  }

  console.log("✅ Scraping finished");
}

runScraper();

