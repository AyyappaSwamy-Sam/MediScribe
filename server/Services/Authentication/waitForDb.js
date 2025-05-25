const axios = require('axios');
require('dotenv').config();

const checkDatabaseConnection = async () => {
    const maxRetries = 30;
    const retryInterval = 2000; // 2 seconds
    let currentTry = 0;

    while (currentTry < maxRetries) {
        try {
            // Try to connect to the database service's health check endpoint
            const response = await axios.get(`${process.env.DATABASE_SERVICE_URL}/health`);
            
            if (response.data && response.data.status === 'connected') {
                console.log('Database service is ready!');
                process.exit(0);
            }
        } catch (error) {
            currentTry++;
            if (currentTry === maxRetries) {
                console.error('Failed to connect to database service after maximum retries');
                process.exit(1);
            }
            console.log(`Waiting for database service... (attempt ${currentTry}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, retryInterval));
        }
    }
};

checkDatabaseConnection();