const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./src/config/config');
const authRoutes = require('./src/routes/authRoutes');
const path = require('path'); // Import the path module

const specialtyRoutes = require('./src/routes/specialityRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes');

const app = express();

const doctorRoutes1 = require('./src/routes/appointmentRoute');

const doctorPageRoutes = require('./src/routes/doctorPageRoutes');


const PatientRoutes = require('./src/routes/patientRoute');
// Middleware
app.use(helmet());
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
// app.use('/home/subhash/Documents/MediScribe/Data', express.static(path.join(__dirname, './Data')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: config.mongoURI }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('', authRoutes);
app.use('/api/specialties', specialtyRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', doctorRoutes1);
app.use('/api',doctorPageRoutes);
app.use('/api/patient',PatientRoutes);



// Database connection
mongoose.connect(config.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});