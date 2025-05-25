const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4999;

// Health check endpoint
app.get('/health', (req, res) => {
    const state = mongoose.connection.readyState;
    if (state === 1) {
        res.json({ status: 'connected' });
    } else {
        res.status(503).json({ status: 'disconnected' });
    }
});

// MongoDB connection with retry logic
const connectWithRetry = async () => {
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                
                serverSelectionTimeoutMS: 5000
            });
            console.log('MongoDB connected successfully');
            return true;
        } catch (err) {
            retries++;
            console.error(`MongoDB connection attempt ${retries}/${maxRetries} failed:`, err.message);
            
            if (retries === maxRetries) {
                console.error('Max retries reached. Exiting...');
                return false;
            }
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    return false;
};

// Start server only after successful database connection
const startServer = async () => {
    const isConnected = await connectWithRetry();
    
    if (isConnected) {
        app.listen(PORT, () => {
            console.log(`Database service running on port ${PORT}`);
        });
    } else {
        process.exit(1);
    }
};

startServer();

// Handle MongoDB connection events
mongoose.connection.on('error', err => {
    console.error('MongoDB error after initial connection:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('Error closing MongoDB connection:', err);
        process.exit(1);
    }
});