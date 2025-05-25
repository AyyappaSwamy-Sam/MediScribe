const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./src/config/Config');
const AppoinmentRoute = require('./src/routes/AppointmentRoute');
const PatientRoutes = require('./src/routes/PatientRoute');
const specialtyRoutes = require('./src/routes/SpecialtyRoute');
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
// app.use('/home/subhash/Documents/MediScribe/Data', express.static(path.join(__dirname, './Data')));


// Routes

app.use('/api', specialtyRoutes);
app.use('/api/appointments', AppoinmentRoute);
app.use('/api/patient',PatientRoutes);



// Start server
const PORT = config.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});