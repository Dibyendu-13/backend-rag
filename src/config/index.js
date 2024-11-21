require('dotenv').config();

const config = {
    humeApiKey: process.env.HUME_API_KEY,
    humeSecretKey: process.env.HUME_SECRET_KEY,
    pineconeApiKey: process.env.PINECONE_API_KEY,
    cohereApiKey: process.env.COHERE_API_KEY,
};

module.exports = config;
