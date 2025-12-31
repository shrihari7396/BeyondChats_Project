const axios = require("axios");
const { SERP_API_KEY } = require("./config");

async function searchGoogle(title) {
    const res = await axios.get("https://serpapi.com/search", {
        params: {
            q: title,
            engine: "google",
            api_key: SERP_API_KEY,
            num: 5
        }
    });

    return res.data.organic_results
        .filter(r => r.link && !r.link.includes("beyondchats.com"))
        .slice(0, 2)
        .map(r => r.link);
}

module.exports = { searchGoogle };
