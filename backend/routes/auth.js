const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const twilioClient = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// In-memory OTP storage (use Redis or database in production)
const otpStore = new Map();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP with expiry (10 minutes)
const storeOTP = (identifier, otp) => {
  otpStore.set(identifier, {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0
  });
};

// Verify OTP
const verifyStoredOTP = (identifier, otp) => {
  const stored = otpStore.get(identifier);
  
  if (!stored) {
    return { success: false, message: 'OTP expired or not found' };
  }
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(identifier);
    return { success: false, message: 'OTP has expired' };
  }
  
  if (stored.attempts >= 3) {
    otpStore.delete(identifier);
    return { success: false, message: 'Too many failed attempts' };
  }
  
  if (stored.otp !== otp) {
    stored.attempts++;
    return { success: false, message: 'Invalid OTP' };
  }
  
  otpStore.delete(identifier);
  return { success: true };
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// 1. Send Email OTP
router.post('/send-email-otp', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const otp = generateOTP();
    
    // Store OTP
    storeOTP(email, otp);

    // Send email via SendGrid
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Your Law Bandhu OTP Code',
      text: `Your OTP code is: ${otp}. Valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Law Bandhu - Verification Code</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #2563eb; font-size: 32px; letter-spacing: 8px;">${otp}</h1>
          <p style="color: #666;">This code will expire in 10 minutes.</p>
          <p style="color: #999; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    };

    await sgMail.send(msg);

    res.json({
      success: true,
      message: 'OTP sent to your email'
    });
  } catch (error) {
    console.error('Send Email OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 2. Verify Email OTP
router.post('/verify-email-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;
    
    const result = verifyStoredOTP(email, otp);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Generate JWT token
    const userId = email; // Use email as user ID (in production, use database ID)
    const token = generateToken(userId);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      userId,
      email,
      token
    });
  } catch (error) {
    console.error('Verify Email OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

// 3. Send Phone OTP (Twilio)
router.post('/send-otp', [
  body('phone').isMobilePhone()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone } = req.body;

    // Option A: Use Twilio Verify Service (Recommended)
    if (process.env.TWILIO_VERIFY_SERVICE_SID) {
      await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({ to: phone, channel: 'sms' });

      res.json({
        success: true,
        message: 'OTP sent to your phone'
      });
    } else {
      // Option B: Manual OTP (if Verify Service not set up)
      const otp = generateOTP();
      storeOTP(phone, otp);

      await twilioClient.messages.create({
        body: `Your Law Bandhu verification code is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });

      res.json({
        success: true,
        message: 'OTP sent to your phone'
      });
    }
  } catch (error) {
    console.error('Send Phone OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// 4. Verify Phone OTP (Twilio)
router.post('/verify-otp', [
  body('phone').isMobilePhone(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { phone, otp } = req.body;

    // Option A: Use Twilio Verify Service (Recommended)
    if (process.env.TWILIO_VERIFY_SERVICE_SID) {
      const verification = await twilioClient.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({ to: phone, code: otp });

      if (verification.status === 'approved') {
        const userId = phone;
        const token = generateToken(userId);

        res.json({
          success: true,
          message: 'OTP verified successfully',
          userId,
          phone,
          token
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Invalid OTP'
        });
      }
    } else {
      // Option B: Manual verification
      const result = verifyStoredOTP(phone, otp);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      const userId = phone;
      const token = generateToken(userId);

      res.json({
        success: true,
        message: 'OTP verified successfully',
        userId,
        phone,
        token
      });
    }
  } catch (error) {
    console.error('Verify Phone OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

module.exports = router;
