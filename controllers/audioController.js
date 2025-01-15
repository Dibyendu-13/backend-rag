const delay = require('../utils/delay');
const humeService = require('../services/humeService'); // Import the humeClient from your service

//change
const { HumeClient } = require('hume');

const humeClient = new HumeClient({
    apiKey: process.env.HUME_API_KEY,
    secretKey: process.env.HUME_SECRET_KEY,
});

const audioController = {
    isProcessing: false,
    requestQueue: [], // Queue to manage incoming requests

    handleUserInput: async (socket, input, extractedText = '') => {
        // Configure EVI with extracted text for context (if available)
        if (extractedText) {
            await humeService.configureEVI(extractedText);
        }

        audioController.requestQueue.push({ socket, input });
        audioController.processQueue(); // Start processing the queue
    },

    processQueue: async () => {
        if (audioController.isProcessing || audioController.requestQueue.length === 0) {
            return; // Skip if already processing or the queue is empty
        }

        audioController.isProcessing = true;
        const { socket, input } = audioController.requestQueue.shift(); // Get the next request

        try {
            await delay(1500); // Initial delay before processing to slow down overall flow

            const response = await humeClient.empathicVoice.chat.connect();
            await response.tillSocketOpen();

            const promptWithContext = `As a health coach based on Andrew Huberman, ${input}`;
            response.sendUserInput(promptWithContext);

            response.on('message', async (message) => {
                console.log('Received message from Hume:', message);

                if (message.type === 'audio_output') {
                    const audioBuffer = Buffer.from(message.data, 'base64');
                    const responseText = audioBuffer.toString('base64');

                    socket.emit('audioOutput', responseText); // Emit audio output

                    // Wait for a longer delay between sentences to prevent overlap and create a more natural flow
                    await delay(3000); // Adjust delay duration as needed for more spacing between outputs
                } else if (message.type === 'assistant_end') {
                    // Add an additional delay after the conversation ends to ensure separation between full responses
                    await delay(2000);

                    audioController.isProcessing = false; // Reset when assistant finishes

                    // Process the next item in the queue if available
                    if (audioController.requestQueue.length > 0) {
                        audioController.processQueue();
                    }
                }
            });
        } catch (error) {
            console.error('Error in Hume connection:', error);
            socket.emit('error', 'An error occurred while processing your request.');
            audioController.isProcessing = false; // Reset on error

            // Process the next item in the queue if available
            if (audioController.requestQueue.length > 0) {
                audioController.processQueue();
            }
        }
    }
};

module.exports = audioController;
