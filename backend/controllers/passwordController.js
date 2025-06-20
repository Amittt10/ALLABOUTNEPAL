import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const usersCollection = req.db.usersCollection;

  try {
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate reset token and expiry (valid 1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

    await usersCollection.updateOne(
      { email: email.toLowerCase() },
      { $set: { resetToken, resetTokenExpiry } }
    );

    const resetURL = `http://localhost:5173/reset-password?token=${resetToken}&email=${email}`;

    // Send email with reset URL - use your existing mailer
    await req.sendVerificationEmail(email, resetURL);

    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Password reset request error:', err);
    res.status(500).json({ message: 'Failed to request password reset' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;
  const usersCollection = req.db.usersCollection;

  try {
    const user = await usersCollection.findOne({ 
      email: email.toLowerCase(),
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await usersCollection.updateOne(
      { email: email.toLowerCase() },
      { $set: { password: hashedPassword }, $unset: { resetToken: "", resetTokenExpiry: "" } }
    );

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Password reset failed' });
  }
};
