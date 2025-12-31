const axios = require("axios");
const { BLOG_API_ALL, BLOG_API_UPDATE } = require("./config");

const { BASE_URL } = require("./config"); // Ensure this is http://localhost:8081/api



async function getAllArticles() {
    const res = await axios.get(BLOG_API_ALL);
    return res.data;
}

async function updateArticle(id, data) {
    try {
        const res = await axios.put(`${BASE_URL}/articles/${id}`, data);
        return res.data;
    } catch (error) {
        console.error(`❌ Failed to update article ${id}:`, error.response?.data || error.message);
        throw error;
    }
}

module.exports = { getAllArticles, updateArticle };
