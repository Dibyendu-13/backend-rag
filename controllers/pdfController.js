const fs = require('fs');
const pdfParse = require('pdf-parse');
const embeddingService = require('../services/embeddingService');
const humeService = require('../services/humeService');
const pineconeService = require('../services/pineconeService');
const { v4: uuidv4 } = require('uuid');
const pdfController = {
    uploadPDF: async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const filePath = req.file.path; // Get the file path from multer

        try {
            // Extract text from the PDF
            const extractedText = await pdfParse(fs.readFileSync(filePath));
            console.log('Extracted Text:', extractedText.text);
            if (!extractedText.text) {
                return res.status(500).json({ success: false, message: 'Failed to extract text from PDF.' });
            }

            // Configure EVI with the extracted text
            await humeService.configureEVI(extractedText.text);

            // Generate embeddings for the extracted text
            const vector = await embeddingService.generateEmbeddings(extractedText.text);
            if (!vector || vector.length !== 4096) { // Match the dimensions (update if using a different model)
                console.error(`Error: Generated vector has a dimension of ${vector ? vector.length : 'undefined'}, expected 4096.`);
                return res.status(500).json({ success: false, message: 'Failed to generate embeddings.' });
            }

            // Generate a unique ID using uuid
            const uniqueId = uuidv4();

            // Upsert the vector into Pinecone
            await pineconeService.upsertVector(vector, uniqueId, req.file.originalname);

            // Optionally, delete the uploaded file after processing
            fs.unlinkSync(filePath); // Delete the temporary file
            
            res.json({ success: true, text: extractedText.text }); // Send success response to client
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error processing PDF and generating embeddings.' });
            console.error('Error:', error);
        }
    }
};

module.exports = pdfController;
