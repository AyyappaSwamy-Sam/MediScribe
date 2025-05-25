const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Middleware for validating signup requests
const validateSignup = [
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('firstName', 'First name is required').notEmpty(),
  check('lastName', 'Last name is required').notEmpty(),
  // Custom validation for DOB object
  // check('dob').custom((dob, { req }) => {
  //   // Check if dob is an object
  //   if (typeof dob !== 'object' || dob === null || !dob.year || !dob.month || !dob.day) {
  //     logger.warn(`Middleware: DOB validation failed - Invalid structure: ${JSON.stringify(req.body.dob)}`);
  //     throw new Error('Date of birth must include valid year, month, and day as an object');
  //   }

  //   const { year, month, day } = dob;
    
  //   // Validate that year, month, and day are numbers
  //   if (typeof year !== 'number' || typeof month !== 'number' || typeof day !== 'number') {
  //     logger.warn(`Middleware: DOB validation failed - Year, month, and day must be numbers: ${JSON.stringify(dob)}`);
  //     throw new Error('Year, month, and day must be numbers');
  //   }

  //   const formattedDob = new Date(year, month - 1, day);
    
  //   // Check if the date is valid
  //   if (isNaN(formattedDob.getTime())) {
  //     logger.warn(`Middleware: DOB validation failed - Invalid date: ${JSON.stringify(dob)}`);
  //     throw new Error('Invalid date of birth');
  //   }

  //   return true; // If everything is valid
  // }),

  check('phoneNumber', 'Valid phone number is required').isMobilePhone(),
  check('emrSystem', 'EMR system is required').notEmpty(),
  check('gender', 'Gender is required').notEmpty(),
  
  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // logger.info(`Middleware: Validation failed during signup - ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    // logger.info('Middleware: Signup validation passed');
    next();
  }
];

// Middleware for validating login requests
const validateLogin = [
  check('email', 'Valid email is required').isEmail(),
  check('password', 'Password is required').exists(),
  check('userType', 'User type must be either "patient", "doctor", or "admin"').isIn(['patient', 'doctor', 'admin']),
  
  // Middleware to handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // logger.info(`Middleware: Validation failed during login - ${JSON.stringify(errors.array())}`);
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    // logger.info('Middleware: Login validation passed');
    next();
  }
];



// Export all middlewares
module.exports = { validateSignup, validateLogin };
