# Backend RAG with Hume, Pinecone, and Cohere

This project is a backend implementation for a retrieval-augmented generation (RAG) system with real-time audio processing and PDF text extraction capabilities. It integrates multiple services, including Hume AI, Cohere for embeddings, Pinecone for vector storage, and a WebSocket interface for real-time communication.

---

## Features

- **PDF Parsing:** Extract text from uploaded PDF files.
- **Text Embedding:** Generate embeddings for extracted text using Cohere.
- **Vector Storage:** Store embeddings in Pinecone for retrieval and RAG capabilities.
- **Real-Time Audio Processing:** Use Hume AI to process user inputs and generate empathic voice responses.
- **Queue Management:** Handle multiple requests in a queue to ensure seamless user interaction.
- **WebSocket Communication:** Enable real-time communication between the server and clients.

---

## Tech Stack

- **Node.js**: Backend runtime.
- **Express**: Web framework for handling REST API requests.
- **Socket.IO**: Real-time communication with WebSocket support.
- **Multer**: File upload handling for PDFs.
- **Hume AI SDK**: For empathic voice interactions.
- **Cohere API**: For text embedding.
- **Pinecone SDK**: For vector storage and retrieval.
- **uuid**: For generating unique IDs.

---

## Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/Dibyendu-13/backend-rag.git
   cd backend-rag
   ```
Install dependencies:

```
npm install
```

Create a .env file: Add your API keys and environment variables.

```
HUME_API_KEY=your_hume_api_key
HUME_SECRET_KEY=your_hume_secret_key
PINECONE_API_KEY=your_pinecone_api_key
COHERE_API_KEY=your_cohere_api_key
```

Run the application:
```
npm start
```
API Endpoints
1. Upload PDF
Endpoint: /upload-pdf
Method: POST
Description: Upload a PDF file, extract text, generate embeddings, and store them in Pinecone.
Headers: Content-Type: multipart/form-data
Body: A file under the key file.
Response:

json
```
{
  "success": true,
  "text": "Extracted text from PDF"
}
```

2. WebSocket: Real-Time Audio Processing
Connection: ws://localhost:4000
Events:
userInput (Client -> Server): Sends user input to be processed by Hume AI.
json

```
{
  "input": "User input text"
}
```
audioOutput (Server -> Client): Emits processed audio output as base64-encoded audio data.
