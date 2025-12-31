const axios = require("axios");
const cheerio = require("cheerio");

// ===============================
// CONFIG
// ===============================
const BLOG_URL = "https://beyondchats.com/blogs/";
const API_URL = "http://localhost:8081/api/articles";

// ===============================
// UTILS
// ===============================
function generateSlug(title) {
  return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
}

// ===============================
// FETCH FULL BLOG CONTENT
// ===============================
async function fetchFullContent(articleUrl) {
  try {
    const res = await axios.get(articleUrl);
    const $ = cheerio.load(res.data);

    // ✅ Extract ONLY main article content
    const content = $(".entry-content")
        .clone()               // clone to safely modify
        .find("script, style") // remove unwanted tags
        .remove()
        .end()
        .text()
        .replace(/\s+/g, " ")
        .trim();

    return content;
  } catch (err) {
    console.error("Failed to fetch full content:", articleUrl);
    return "";
  }
}


// ===============================
// MAIN
// ===============================
async function scrapeAndSaveArticles() {
  try {
    const mainRes = await axios.get(BLOG_URL);
    const $ = cheerio.load(mainRes.data);

    // Find last page
    let lastPageUrl = BLOG_URL;
    $(".pagination a").each((_, el) => {
      const text = $(el).text().toLowerCase();
      if (text.includes("last") || text.includes(">>")) {
        lastPageUrl = $(el).attr("href");
      }
    });

    if (!lastPageUrl.startsWith("http")) {
      lastPageUrl = "https://beyondchats.com" + lastPageUrl;
    }

    const lastPageRes = await axios.get(lastPageUrl);
    const $$ = cheerio.load(lastPageRes.data);

    const articles = [];

    $$("article, .blog-card, .post").each((_, el) => {
      if (articles.length === 5) return false;

      const title = $$(el).find("h2, h3").first().text().trim();
      const link = $$(el).find("a").attr("href");
      const excerpt = $$(el).find("p").first().text().trim();

      if (!title || !link) return;

      const fullUrl = link.startsWith("http")
          ? link
          : "https://beyondchats.com" + link;

      articles.push({
        title,
        slug: generateSlug(title),
        excerpt,
        sourceUrl: fullUrl
      });
    });

    // Fetch full content + save
    let saved = 0;

    for (const art of articles) {
      const fullContent = await fetchFullContent(art.sourceUrl);

      const payload = {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: fullContent,
        sourceUrl: art.sourceUrl,
        publishedAt: null,
        isUpdated: false
      };

      const ok = await saveArticle(payload);
      if (ok) saved++;
    }

    console.log(`✅ ${saved}/5 articles saved with FULL content`);
  } catch (err) {
    console.error("❌ Scraping failed:", err.message);
  }
}

// ===============================
// SAVE API
// ===============================
async function saveArticle(article) {
  try {
    await axios.post(API_URL, article, {
      headers: { "Content-Type": "application/json" }
    });
    console.log("Saved:", article.title);
    return true;
  } catch (err) {
    console.error(
        `Failed to save "${article.title}"`,
        err.response?.data || err.message
    );
    return false;
  }
}

// ===============================
// RUN
// ===============================
scrapeAndSaveArticles();
