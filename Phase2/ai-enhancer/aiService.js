const axios = require("axios");
// Ensure config.js has AI_SERVICE_URL = "http://localhost:8082/api/ai/generate"
const { AI_SERVICE_URL } = require("./config");

/**
 * Sends a prompt to the local Spring Boot AI service.
 * Added error handling to catch common 400/404/500 errors.
 */
async function generateWithAI(prompt) {
    try {
        // Tip: Some Spring Boot setups require a trailing slash if defined that way
        // If it still fails, try changing AI_SERVICE_URL to end with /
        const response = await axios.post(
            AI_SERVICE_URL,
            { prompt: prompt }, // Sending as JSON body
            {
                headers: { "Content-Type": "application/json" },
                timeout: 30000 // AI can take time, increased to 30s
            }
        );

        // Based on typical AI wrappers, return the 'response' field or the whole data
        return response.data.response || response.data;

    } catch (error) {
        if (error.response) {
            // Server responded with a status code out of 2xx range
            console.error("❌ AI Service Error:", error.response.status);
            console.error("📄 Server Message:", error.response.data);

            if (error.response.status === 400) {
                console.warn("💡 Hint: Check if your Spring Boot Controller expects @RequestBody.");
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error("❌ No response from AI service. Is the backend running on port 8082?");
        } else {
            console.error("❌ Request Setup Error:", error.message);
        }
        throw error; // Re-throw to handle it in index.js
    }
}

module.exports = { generateWithAI };