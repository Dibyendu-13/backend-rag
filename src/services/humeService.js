const axios = require('axios');
const config = require('../config');

const humeClient = {
    configureEVI: async (extractedText) => {
        const configName = `Health Coach Config - ${Date.now()}`;
        const url = 'https://api.hume.ai/v0/evi/configs';
        const data = {
            evi_version: "2",
            name: configName,
            prompt: {
                id: "7d9347b1-74d8-42de-a968-f4da8508f531",
                version: 0,
                instructions: `You are a health coach based on Andrew Huberman. Here is some relevant information: "${extractedText}".`,
            },
            voice: {
                provider: "HUME_AI"
            },
            language_model: {
                model_provider: "ANTHROPIC",
                model_resource: "claude-3-5-sonnet-20240620",
                temperature: 1
            },
            event_messages: {
                on_new_chat: { enabled: false, text: "" },
                on_inactivity_timeout: { enabled: false, text: "" },
                on_max_duration_timeout: { enabled: false, text: "" }
            }
        };

        try {
            const response = await axios.post(url, data, {
                headers: {
                    'X-Hume-Api-Key': config.humeApiKey,
                    'Content-Type': 'application/json'
                }
            });
            console.log('EVI Configuration Response:', response.data);
        } catch (error) {
            console.error('Error configuring EVI:', error.response ? error.response.data : error.message);
        }
    }
};

module.exports = humeClient;
