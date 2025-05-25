const jwt = require('jsonwebtoken');

const AuthenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
  
  console.log(token); // To debug token value

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // No need to split again here
    req.user = decoded; // Attach decoded user data to request object
    next(); // Continue to the next middleware or route handler
  } catch (err) {
    console.error(err); // Log the actual error for debugging
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = AuthenticateToken;
