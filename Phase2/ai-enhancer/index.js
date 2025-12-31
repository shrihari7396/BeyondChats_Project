// 🔥 THIS LINE MUST BE AT THE VERY TOP
require("dotenv").config();

const { getAllArticles, updateArticle } = require("./api");
const { searchGoogle } = require("./googleSearch");
const { scrapeContent } = require("./scraper");
const { generateWithAI } = require("./aiService");

(async function run() {
    console.log("🚀 Phase-2 started");

    const articles = await getAllArticles();

    for (const article of articles) {
        if (article.isUpdated) continue;

        console.log("🔍 Processing:", article.title);

        const links = await searchGoogle(article.title);
        if (links.length < 2) continue;

        const ref1 = await scrapeContent(links[0]);
        const ref2 = await scrapeContent(links[1]);

        const prompt = `
Rewrite the following article using better structure,
SEO formatting, and clarity, inspired by the reference articles.

Original Article:
${article.content}

Reference Article 1:
${ref1}

Reference Article 2:
${ref2}

Return HTML formatted content.
`;

        const aiContent = await generateWithAI(prompt);

        const finalContent = `
${aiContent}
<hr/>
<h3>References</h3>
<ul>
  <li><a href="${links[0]}">${links[0]}</a></li>
  <li><a href="${links[1]}">${links[1]}</a></li>
</ul>
`;

        await updateArticle(article.id, {
            ...article,
            content: finalContent,
            isUpdated: true
        });

        console.log("✅ Updated:", article.title);
    }

    console.log("🎉 Phase-2 completed");
})();
