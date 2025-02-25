const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.supplier = decoded; // Attach supplier info to the request
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
