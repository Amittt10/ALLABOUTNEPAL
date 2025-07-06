import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../utils/mailer.js';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const registerUser = async (req, res) => {
  const { fullname, username, email, password } = req.body;
  const emailLower = email.toLowerCase();
  const usersCollection = req.db.usersCollection;

  try {
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: emailLower });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = {
      fullname,
      username,
      email: emailLower,
      password: hashedPassword,
      verified: false,
      verificationToken,
      role: 'user',
      createdAt: new Date(),  // manually add createdAt
      updatedAt: new Date(),  // manually add updatedAt
    };

    // Insert new user into MongoDB
    await usersCollection.insertOne(newUser);

    // Prepare verification URL
    const verifyURL = `http://localhost:5173/verify?token=${verificationToken}&email=${emailLower}`;

    // Send verification email
    await sendVerificationEmail(emailLower, verifyURL);

    res.status(201).json({ message: 'Signup successful. Please check your email.' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const loginUser = async (req, res) => {
  const email = req.body.email.toLowerCase();
  const { password } = req.body;
  const usersCollection = req.db.usersCollection;

  try {
    // Admin login shortcut
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, user: { email, role: 'admin' } });
    }

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ✅ Update lastLogin timestamp
    await usersCollection.updateOne(
      { email },
      { $set: { lastLogin: new Date(), updatedAt: new Date() } }
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { email: user.email, id: user._id, role: 'user' } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  const usersCollection = req.db.usersCollection;

  try {
    // Find user with matching email and verification token
    const user = await usersCollection.findOne({ email, verificationToken: token });
    if (!user) return res.status(400).send('Invalid or expired verification link.');

    // Update verified flag and updatedAt, remove verificationToken
    await usersCollection.updateOne(
      { email },
      {
        $set: { verified: true, updatedAt: new Date() },
        $unset: { verificationToken: "" },
      }
    );

    res.send("✅ Email verified successfully.");
  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).send("Email verification failed.");
  }
};

export const verifyToken = async (req, res) => {
  try {
    // `req.user` is set by your JWT middleware (authenticateJWT)
    const { user } = req;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    // Return decoded user info
    res.status(200).json({ user });
  } catch (err) {
    console.error('Verify token error:', err);
    res.status(500).json({ error: 'Token verification failed' });
  }
};
