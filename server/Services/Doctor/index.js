const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./src/config/Config');
const DoctorRoutes = require('./src/routes/DoctorRoutes');


const app = express();

const DbConnect = require('./src/config/DatabaseConnection')
DbConnect();



// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware
app.use(helmet());
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));


// Routes
app.use('/api',DoctorRoutes);



// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});