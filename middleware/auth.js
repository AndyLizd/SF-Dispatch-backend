const jwt = require('jsonwebtoken');
const { token_private_key } = require('../secret.json');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    res.status(400).send('No token head is provided.')
    return;
  }

  try {
    const decoded = jwt.verify(token, token_private_key);
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
}