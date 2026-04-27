const jwt = require('jsonwebtoken');
const db = require('../models');

module.exports = async (req, res, next) => {
  // The frontend normally sends the JWT through the HTTP-only cookie.
  // The Authorization header fallback is useful for manual API testing.
  const token = req.cookies?.jwt || (req.headers.authorization || '').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Please log in again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check the stored token too, so logout invalidates the old cookie value.
    const user = await db.users.findOne({
      where: { id: decoded.id, token },
      attributes: ['id', 'username']
    });

    if (!user) {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }

    req.user = { id: user.id, username: user.username };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired session token.' });
  }
};
