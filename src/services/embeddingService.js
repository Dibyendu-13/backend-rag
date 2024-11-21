const axios = require('axios');
const config = require('../config');

const embeddingService = {
    generateEmbeddings: async (text) => {
        try {
            const response = await axios.post('https://api.cohere.ai/v1/embed', {
                texts: [text],
                model: 'embed-english-v2.0' // Ensure this model outputs 4096-dimensional vectors
            }, {
                headers: {
                    'Authorization': `Bearer ${config.cohereApiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.embeddings[0]; // Return the first embedding
        } catch (error) {
            console.error('Error generating embeddings:', error);
            return null;
        }
    }
};

module.exports = embeddingService;
