const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');
const audioController = require('./controllers/audioController');

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    }
});

// Flag to check if a message is being processed
let isProcessing = false;

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('userInput', async (input) => {
        await audioController.handleUserInput(socket, input, isProcessing);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
server.listen(5001, () => {
    console.log('Server is running on http://localhost:5001');
});
