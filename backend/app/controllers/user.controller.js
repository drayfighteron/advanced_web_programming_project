const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const { validateRegisterInput, validateLoginInput } = require('../utils/validation');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const COOKIE_NAME = 'jwt';

function createToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function setAuthCookie(res, token) {
  // HTTP-only keeps JavaScript from reading the JWT directly in the browser.
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function safeUser(user) {
  return { id: user.id, username: user.username };
}

exports.register = async (req, res) => {
  const validation = validateRegisterInput(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });

  const { username, password } = validation.value;

  try {
    const existingUser = await db.users.findOne({ where: { username } });
    if (existingUser) return res.status(409).json({ error: 'Username already taken' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await db.users.create({ username, password_hash });
    const token = createToken(user);

    await user.update({ token });
    setAuthCookie(res, token);

    res.status(201).json({ user: safeUser(user) });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const validation = validateLoginInput(req.body);
  if (validation.error) return res.status(400).json({ error: validation.error });

  const { username, password } = validation.value;

  try {
    const user = await db.users.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = createToken(user);

    await user.update({ token });
    setAuthCookie(res, token);

    res.json({ user: safeUser(user) });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.logout = async (req, res) => {
  try {
    if (req.user?.id) {
      await db.users.update({ token: null }, { where: { id: req.user.id } });
    }
  } catch (err) {
    console.error('Logout cleanup error:', err);
  }

  res.clearCookie(COOKIE_NAME);
  res.json({ message: 'Logged out successfully' });
};
