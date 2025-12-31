/**
 * FINAL BeyondChats Scraper
 * Handles tag pages, duplicates & validation
 */

const axios = require("axios");
const cheerio = require("cheerio");
const https = require("https");

const BLOG_LIST_URL = "https://beyondchats.com/blogs/";
const API_URL = "http://localhost:8081/api/articles";

const agent = new https.Agent({ keepAlive: true });

const HEADERS = {
  "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
  Accept: "text/html",
};

// ===============================
// UTILS
// ===============================
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function generateSlug(title) {
  return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
}

function isValidArticleUrl(url) {
  return (
      url.startsWith("https://beyondchats.com/blogs/") &&
      !url.includes("/tag/") &&
      !url.includes("/category/") &&
      !url.endsWith("/blogs/")
  );
}

function isValidArticle(article) {
  return (
      article.title &&
      article.title.length > 5 &&
      article.slug &&
      article.slug.length > 5 &&
      article.content &&
      article.content.length > 100
  );
}

function generateExcerpt(content, len = 200) {
  return content.length > len
      ? content.substring(0, len) + "..."
      : content;
}

// ===============================
// FETCH ARTICLE LINKS
// ===============================
async function fetchArticleLinks() {
  const res = await axios.get(BLOG_LIST_URL, {
    headers: HEADERS,
    httpsAgent: agent,
  });

  const $ = cheerio.load(res.data);
  const links = new Set();

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (href && isValidArticleUrl(href)) {
      links.add(href);
    }
  });

  return Array.from(links).slice(-5);
}

// ===============================
// FETCH FULL ARTICLE
// ===============================
async function fetchArticle(url) {
  const res = await axios.get(url, {
    headers: HEADERS,
    httpsAgent: agent,
  });

  const $ = cheerio.load(res.data);

  const title = $("h1").first().text().trim();

  const content = $(".entry-content")
      .clone()
      .find("script, style")
      .remove()
      .end()
      .text()
      .replace(/\s+/g, " ")
      .trim();

  return {
    title,
    slug: generateSlug(title),
    content,
    excerpt: generateExcerpt(content),
    sourceUrl: url,
    isUpdated: false,
  };
}

// ===============================
// SAVE TO API
// ===============================
async function saveArticle(article) {
  try {
    const res = await axios.post(API_URL, article);
    console.log("✅ Saved:", res.data.id, "-", res.data.title);
  } catch (err) {
    console.error("❌ API rejected:", err.response?.data?.message);
  }
}

// ===============================
// MAIN
// ===============================
(async function run() {
  console.log("🚀 Scraper started");

  const links = await fetchArticleLinks();
  console.log(`🔗 Found ${links.length} valid articles`);

  for (const link of links) {
    console.log("📄 Scraping:", link);

    const article = await fetchArticle(link);

    if (!isValidArticle(article)) {
      console.warn("⚠️ Skipped invalid article:", link);
      continue;
    }

    await saveArticle(article);
    await sleep(3000);
  }

  console.log("🎉 Scraping completed");
})();
