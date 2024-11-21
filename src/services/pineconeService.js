const { Pinecone } = require('@pinecone-database/pinecone');
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique IDs
const config = require('../config');

const pc = new Pinecone({ apiKey: config.pineconeApiKey });

const pineconeService = {
    upsertVector: async (vector, source) => {
        const index = pc.Index('huberman-vectors');

        // Generate a unique ID using uuid
        const uniqueId = uuidv4();

        await index.upsert([
            {
                id: uniqueId,
                values: vector,
                metadata: { source } // Store the original PDF file name in metadata
            }
        ], { namespace: 'ns1' });

        console.log('Vector upserted successfully with ID:', uniqueId);
        return uniqueId; // Optionally return the unique ID for further use
    }
};

module.exports = pineconeService;
