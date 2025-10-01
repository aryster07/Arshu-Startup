import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { User, UserRole } from '@/models/User';
import { asyncHandler } from '@/middleware/errorHandler';
import { logger, securityLogger } from '@/utils/logger';

const router = Router();

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.includes('/verify-email'), // Don't rate limit email verification
});

// Validation middleware
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('role')
    .isIn(Object.values(UserRole))
    .withMessage('Invalid role specified'),
  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Helper function to generate JWT tokens
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRE || '15m',
      issuer: 'arshu-legal',
      audience: 'arshu-users'
    }
  );

  const refreshToken = jwt.sign(
    { sub: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
      issuer: 'arshu-legal',
      audience: 'arshu-users'
    }
  );

  return { accessToken, refreshToken };
};

// Helper function to set secure cookies
const setTokenCookies = (res: Response, tokens: { accessToken: string; refreshToken: string }) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  res.cookie('accessToken', tokens.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', tokens.refreshToken, cookieOptions);
};

// @route   POST /api/v1/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', authLimiter, registerValidation, asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  const { email, password, firstName, lastName, role, phoneNumber } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    securityLogger.warn('Registration attempt with existing email', {
      email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
    
    return res.status(409).json({
      success: false,
      error: 'User with this email already exists'
    });
  }

  // Create new user
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    role,
    phoneNumber,
    registrationDate: new Date()
  });

  await user.save();

  // Generate tokens
  const tokens = generateTokens(user._id);
  setTokenCookies(res, tokens);

  securityLogger.info('New user registered', {
    userId: user._id,
    email: user.email,
    role: user.role,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    },
    tokens
  });
}));

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', authLimiter, loginValidation, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }

  passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: info?.message || 'Authentication failed'
      });
    }

    // Generate tokens
    const tokens = generateTokens(user._id);
    setTokenCookies(res, tokens);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorAuth?.enabled || false
      },
      tokens
    });
  })(req, res, next);
}));

// @route   GET /api/v1/auth/google
// @desc    Google OAuth login
// @access  Public
router.get('/google', (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.query;
  
  // Store role in session for post-OAuth processing
  req.session = req.session || {};
  (req.session as any).authRole = role || 'client';
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    state: role as string
  })(req, res, next);
});

// @route   GET /api/v1/auth/google/callback
// @desc    Google OAuth callback
// @access  Public
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as any;
    
    // Update role if specified during OAuth initiation
    const requestedRole = req.query.state as string;
    if (requestedRole && Object.values(UserRole).includes(requestedRole as UserRole)) {
      user.role = requestedRole;
      await user.save();
    }

    const tokens = generateTokens(user._id);
    setTokenCookies(res, tokens);

    // Redirect to appropriate dashboard
    const redirectUrl = user.role === UserRole.LAWYER 
      ? `${process.env.LAWYER_PORTAL_URL}?auth=success`
      : `${process.env.CLIENT_URL}?auth=success`;

    res.redirect(redirectUrl);
  })
);

// @route   GET /api/v1/auth/facebook
// @desc    Facebook OAuth login
// @access  Public
router.get('/facebook', (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.query;
  req.session = req.session || {};
  (req.session as any).authRole = role || 'client';
  
  passport.authenticate('facebook', { 
    scope: ['email'],
    state: role as string
  })(req, res, next);
});

// @route   GET /api/v1/auth/facebook/callback
// @desc    Facebook OAuth callback
// @access  Public
router.get('/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as any;
    
    const requestedRole = req.query.state as string;
    if (requestedRole && Object.values(UserRole).includes(requestedRole as UserRole)) {
      user.role = requestedRole;
      await user.save();
    }

    const tokens = generateTokens(user._id);
    setTokenCookies(res, tokens);

    const redirectUrl = user.role === UserRole.LAWYER 
      ? `${process.env.LAWYER_PORTAL_URL}?auth=success`
      : `${process.env.CLIENT_URL}?auth=success`;

    res.redirect(redirectUrl);
  })
);

// @route   GET /api/v1/auth/apple
// @desc    Apple Sign In
// @access  Public
router.get('/apple', (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.query;
  req.session = req.session || {};
  (req.session as any).authRole = role || 'client';
  
  passport.authenticate('apple', {
    state: role as string
  })(req, res, next);
});

// @route   POST /api/v1/auth/apple/callback
// @desc    Apple Sign In callback
// @access  Public
router.post('/apple/callback',
  passport.authenticate('apple', { session: false }),
  asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as any;
    
    const requestedRole = req.body.state as string;
    if (requestedRole && Object.values(UserRole).includes(requestedRole as UserRole)) {
      user.role = requestedRole;
      await user.save();
    }

    const tokens = generateTokens(user._id);
    setTokenCookies(res, tokens);

    const redirectUrl = user.role === UserRole.LAWYER 
      ? `${process.env.LAWYER_PORTAL_URL}?auth=success`
      : `${process.env.CLIENT_URL}?auth=success`;

    res.redirect(redirectUrl);
  })
);

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  securityLogger.info('User logged out', {
    userId: (req.user as any)?._id,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// @route   POST /api/v1/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: 'Refresh token not provided'
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
    
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    const user = await User.findById(decoded.sub);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    const tokens = generateTokens(user._id);
    setTokenCookies(res, tokens);

    res.json({
      success: true,
      tokens
    });
  } catch (error) {
    securityLogger.warn('Invalid refresh token used', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    });

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
}));

export default router;