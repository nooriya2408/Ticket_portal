const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    console.log('🔐 Token received:', token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Decoded:', decoded);
      req.user = decoded;
      next();
    } catch (err) {
      console.error('❌ Invalid token:', err.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    console.log('🚫 No token in header');
    return res.status(401).json({ message: 'No token provided' });
  }
};

module.exports = protect;
