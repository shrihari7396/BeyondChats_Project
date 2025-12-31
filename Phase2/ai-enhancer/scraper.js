const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeContent(url) {
    const res = await axios.get(url, {
        headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(res.data);

    let content =
        $("article").text() ||
        $("main").text() ||
        $("body").text();

    return content.replace(/\s+/g, " ").trim().slice(0, 3500);
}

module.exports = { scrapeContent };
