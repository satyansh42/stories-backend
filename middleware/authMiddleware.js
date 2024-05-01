const jwt = require('jsonwebtoken');
const errorHandler = require('../utils/errorHandler');

module.exports = (req, res, next) => {
    try {
      // Get the authorization header from the request
      const authHeader = req.headers.authorization;
      
      // Check if the authorization header exists
      if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
      }

      // Check if the authorization header starts with 'Bearer '
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header invalid' });
      }
    const token = authHeader.split(' ')[1]; // Extract token from Authorization header
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decodedToken.userId };
    next();
  } catch (error) {
    errorHandler(res, error);
  }
};