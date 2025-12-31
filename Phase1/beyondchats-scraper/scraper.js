// /**
//  * ✅ FINAL FIXED BeyondChats Blog Scraper
//  * - Filters pagination pages
//  * - Scrapes ONLY real articles
//  * - Saves exactly 5 valid oldest articles
//  */
//
// const axios = require("axios");
// const cheerio = require("cheerio");
// const https = require("https");
//
// // ===============================
// // CONFIG
// // ===============================
// const BLOG_LIST_URL = "https://beyondchats.com/blogs/";
// const API_URL = "http://localhost:8081/api/articles";
//
// const agent = new https.Agent({ keepAlive: true });
//
// const HEADERS = {
//   "User-Agent":
//       "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
//   Accept: "text/html",
// };
//
// // ===============================
// // UTILS
// // ===============================
// const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
//
// function generateSlug(title) {
//   return title
//       .toLowerCase()
//       .trim()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)/g, "");
// }
//
// // ✅ STRICT article URL validation
// function isValidArticleUrl(url) {
//   return (
//       /^https:\/\/beyondchats\.com\/blogs\/[^/]+\/$/.test(url) && // slug only
//       !url.includes("/page/") &&
//       !url.includes("/tag/") &&
//       !url.includes("/category/")
//   );
// }
//
// function isValidArticle(article) {
//   return (
//       article.title?.length > 10 &&
//       article.slug?.length > 5 &&
//       article.content?.length > 300
//   );
// }
//
// function generateExcerpt(content, len = 200) {
//   return content.substring(0, len) + "...";
// }
//
// // ===============================
// // FETCH ARTICLE LINKS
// // ===============================
// async function fetchArticleLinks() {
//   const res = await axios.get(BLOG_LIST_URL, {
//     headers: HEADERS,
//     httpsAgent: agent,
//   });
//
//   const $ = cheerio.load(res.data);
//   const links = new Set();
//
//   $("a[href]").each((_, el) => {
//     let href = $(el).attr("href");
//     if (!href) return;
//
//     if (!href.startsWith("http")) {
//       href = "https://beyondchats.com" + href;
//     }
//
//     if (isValidArticleUrl(href)) {
//       links.add(href);
//     }
//   });
//
//   // Oldest articles are near the end
//   return Array.from(links).slice(-5);
// }
//
// // ===============================
// // FETCH FULL ARTICLE
// // ===============================
// async function fetchArticle(url) {
//   const res = await axios.get(url, {
//     headers: HEADERS,
//     httpsAgent: agent,
//   });
//
//   const $ = cheerio.load(res.data);
//
//   const title = $("h1").first().text().trim();
//
//   const content = $(".entry-content")
//       .clone()
//       .find("script, style, iframe")
//       .remove()
//       .end()
//       .text()
//       .replace(/\s+/g, " ")
//       .trim();
//
//   return {
//     title,
//     slug: generateSlug(title),
//     content,
//     excerpt: generateExcerpt(content),
//     sourceUrl: url,
//     publishedAt: null,
//     isUpdated: false,
//   };
// }
//
// // ===============================
// // SAVE TO API
// // ===============================
// async function saveArticle(article) {
//   try {
//     const res = await axios.post(API_URL, article, {
//       headers: { "Content-Type": "application/json" },
//     });
//     console.log("✅ Saved:", res.data.id, "-", res.data.title);
//   } catch (err) {
//     console.error(
//         "❌ API rejected:",
//         err.response?.data || err.message
//     );
//   }
// }
//
// // ===============================
// // MAIN
// // ===============================
// (async function run() {
//   console.log("🚀 Scraper started");
//
//   const links = await fetchArticleLinks();
//   console.log(`🔗 Found ${links.length} valid articles`);
//
//   for (const link of links) {
//     console.log("📄 Scraping:", link);
//
//     const article = await fetchArticle(link);
//
//     if (!isValidArticle(article)) {
//       console.warn("⚠️ Skipped invalid article:", link);
//       continue;
//     }
//
//     await saveArticle(article);
//     await sleep(2500); // polite scraping
//   }
//
//   console.log("🎉 Scraping completed successfully");
// })();


/**
 * ✅ FINAL BeyondChats Scraper (FIXED)
 * - Handles short articles
 * - Fallback content extraction
 * - No false skips
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function generateSlug(title) {
  return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
}

function isValidArticleUrl(url) {
  return (
      /^https:\/\/beyondchats\.com\/blogs\/[^/]+\/$/.test(url) &&
      !url.includes("/page/")
  );
}

function generateExcerpt(content, len = 200) {
  return content.length > len ? content.slice(0, len) + "..." : content;
}

// ✅ Relaxed validation (REALISTIC)
function isValidArticle(article) {
  return (
      article.title &&
      article.title.length > 8 &&
      article.content &&
      article.content.length > 80
  );
}

// ===============================
// FETCH LINKS
// ===============================
async function fetchArticleLinks() {
  const res = await axios.get(BLOG_LIST_URL, {
    headers: HEADERS,
    httpsAgent: agent,
  });

  const $ = cheerio.load(res.data);
  const links = new Set();

  $("a[href]").each((_, el) => {
    let href = $(el).attr("href");
    if (!href) return;

    if (!href.startsWith("http")) {
      href = "https://beyondchats.com" + href;
    }

    if (isValidArticleUrl(href)) {
      links.add(href);
    }
  });

  return Array.from(links).slice(-5); // oldest 5
}

// ===============================
// FETCH ARTICLE
// ===============================
async function fetchArticle(url) {
  const res = await axios.get(url, {
    headers: HEADERS,
    httpsAgent: agent,
  });

  const $ = cheerio.load(res.data);

  const title = $("h1").first().text().trim();

  // ✅ FALLBACK STRATEGY
  let content =
      $(".entry-content").text().trim() ||
      $("article").text().trim() ||
      $(".container").text().trim();

  content = content.replace(/\s+/g, " ").trim();

  console.log(`🧪 Content length: ${content.length}`);

  return {
    title,
    slug: generateSlug(title),
    content,
    excerpt: generateExcerpt(content),
    sourceUrl: url,
    publishedAt: null,
    isUpdated: false,
  };
}

// ===============================
// SAVE
// ===============================
async function saveArticle(article) {
  try {
    const res = await axios.post(API_URL, article, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("✅ Saved:", res.data.id, "-", res.data.title);
  } catch (err) {
    console.error(
        "❌ API rejected:",
        err.response?.data || err.message
    );
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
    await sleep(2000);
  }

  console.log("🎉 Scraping completed successfully");
})();
