import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import bcrypt from 'bcryptjs';
import { User } from '@/models/User';
import { logger, securityLogger } from '@/utils/logger';

// User serialization for session management
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local Strategy (Email/Password)
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      securityLogger.warn('Login attempt with non-existent email', {
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      return done(null, false, { message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      securityLogger.warn('Login attempt with inactive account', {
        userId: user._id,
        email,
        ip: req.ip,
        timestamp: new Date().toISOString()
      });
      return done(null, false, { message: 'Account is deactivated' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      securityLogger.warn('Failed login attempt - incorrect password', {
        userId: user._id,
        email,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      
      // Increment failed login attempts
      await User.findByIdAndUpdate(user._id, {
        $inc: { failedLoginAttempts: 1 },
        lastFailedLogin: new Date()
      });
      
      return done(null, false, { message: 'Invalid email or password' });
    }

    // Check if account is locked due to too many failed attempts
    if (user.failedLoginAttempts >= 5) {
      const lockoutTime = 15 * 60 * 1000; // 15 minutes
      const timeSinceLastFailed = Date.now() - user.lastFailedLogin?.getTime();
      
      if (timeSinceLastFailed < lockoutTime) {
        securityLogger.error('Login attempt on locked account', {
          userId: user._id,
          email,
          ip: req.ip,
          timestamp: new Date().toISOString()
        });
        return done(null, false, { message: 'Account temporarily locked. Try again later.' });
      }
    }

    // Reset failed login attempts on successful login
    await User.findByIdAndUpdate(user._id, {
      $unset: { failedLoginAttempts: 1, lastFailedLogin: 1 },
      lastLogin: new Date(),
      lastLoginIP: req.ip
    });

    securityLogger.info('Successful login', {
      userId: user._id,
      email,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });

    return done(null, user);
  } catch (error) {
    logger.error('Local strategy error:', error);
    return done(error, null);
  }
}));

// Google OAuth2 Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/v1/auth/google/callback',
    scope: ['profile', 'email']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ 'oauth.google.id': profile.id });
      
      if (user) {
        // Update user's Google profile info
        user.oauth.google.profile = profile._json;
        user.oauth.google.accessToken = accessToken;
        user.lastLogin = new Date();
        await user.save();
        
        securityLogger.info('Google OAuth login', {
          userId: user._id,
          email: user.email,
          provider: 'google',
          timestamp: new Date().toISOString()
        });
        
        return done(null, user);
      }

      // Check if user exists with same email
      user = await User.findOne({ email: profile.emails?.[0]?.value });
      
      if (user) {
        // Link Google account to existing user
        user.oauth.google = {
          id: profile.id,
          profile: profile._json,
          accessToken,
          refreshToken
        };
        user.isEmailVerified = true; // Google emails are pre-verified
        user.lastLogin = new Date();
        await user.save();
        
        securityLogger.info('Google account linked to existing user', {
          userId: user._id,
          email: user.email,
          provider: 'google',
          timestamp: new Date().toISOString()
        });
        
        return done(null, user);
      }

      // Create new user
      const newUser = new User({
        email: profile.emails?.[0]?.value,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        profilePicture: profile.photos?.[0]?.value,
        isEmailVerified: true,
        role: 'client', // Default role
        oauth: {
          google: {
            id: profile.id,
            profile: profile._json,
            accessToken,
            refreshToken
          }
        },
        registrationDate: new Date(),
        lastLogin: new Date()
      });

      await newUser.save();
      
      securityLogger.info('New user created via Google OAuth', {
        userId: newUser._id,
        email: newUser.email,
        provider: 'google',
        timestamp: new Date().toISOString()
      });
      
      return done(null, newUser);
    } catch (error) {
      logger.error('Google OAuth strategy error:', error);
      return done(error, null);
    }
  }));
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || '/api/v1/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'picture.large']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Similar logic to Google strategy
      let user = await User.findOne({ 'oauth.facebook.id': profile.id });
      
      if (user) {
        user.oauth.facebook.profile = profile._json;
        user.oauth.facebook.accessToken = accessToken;
        user.lastLogin = new Date();
        await user.save();
        
        securityLogger.info('Facebook OAuth login', {
          userId: user._id,
          email: user.email,
          provider: 'facebook',
          timestamp: new Date().toISOString()
        });
        
        return done(null, user);
      }

      user = await User.findOne({ email: profile.emails?.[0]?.value });
      
      if (user) {
        user.oauth.facebook = {
          id: profile.id,
          profile: profile._json,
          accessToken,
          refreshToken
        };
        user.isEmailVerified = true;
        user.lastLogin = new Date();
        await user.save();
        
        return done(null, user);
      }

      const newUser = new User({
        email: profile.emails?.[0]?.value,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        profilePicture: profile.photos?.[0]?.value,
        isEmailVerified: true,
        role: 'client',
        oauth: {
          facebook: {
            id: profile.id,
            profile: profile._json,
            accessToken,
            refreshToken
          }
        },
        registrationDate: new Date(),
        lastLogin: new Date()
      });

      await newUser.save();
      
      securityLogger.info('New user created via Facebook OAuth', {
        userId: newUser._id,
        email: newUser.email,
        provider: 'facebook',
        timestamp: new Date().toISOString()
      });
      
      return done(null, newUser);
    } catch (error) {
      logger.error('Facebook OAuth strategy error:', error);
      return done(error, null);
    }
  }));
}

// Apple Sign In Strategy
if (process.env.APPLE_TEAM_ID && process.env.APPLE_CLIENT_ID && process.env.APPLE_KEY_ID) {
  passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH,
    callbackURL: process.env.APPLE_CALLBACK_URL || '/api/v1/auth/apple/callback',
    scope: ['name', 'email']
  }, async (accessToken, refreshToken, idToken, profile, done) => {
    try {
      // Apple strategy logic similar to Google/Facebook
      let user = await User.findOne({ 'oauth.apple.id': profile.id });
      
      if (user) {
        user.oauth.apple.profile = profile;
        user.oauth.apple.accessToken = accessToken;
        user.lastLogin = new Date();
        await user.save();
        
        securityLogger.info('Apple Sign In login', {
          userId: user._id,
          email: user.email,
          provider: 'apple',
          timestamp: new Date().toISOString()
        });
        
        return done(null, user);
      }

      user = await User.findOne({ email: profile.email });
      
      if (user) {
        user.oauth.apple = {
          id: profile.id,
          profile,
          accessToken,
          refreshToken
        };
        user.isEmailVerified = true;
        user.lastLogin = new Date();
        await user.save();
        
        return done(null, user);
      }

      const newUser = new User({
        email: profile.email,
        firstName: profile.name?.firstName,
        lastName: profile.name?.lastName,
        isEmailVerified: true,
        role: 'client',
        oauth: {
          apple: {
            id: profile.id,
            profile,
            accessToken,
            refreshToken
          }
        },
        registrationDate: new Date(),
        lastLogin: new Date()
      });

      await newUser.save();
      
      securityLogger.info('New user created via Apple Sign In', {
        userId: newUser._id,
        email: newUser.email,
        provider: 'apple',
        timestamp: new Date().toISOString()
      });
      
      return done(null, newUser);
    } catch (error) {
      logger.error('Apple Sign In strategy error:', error);
      return done(error, null);
    }
  }));
}

// JWT Strategy for API authentication
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET!,
  issuer: 'arshu-legal',
  audience: 'arshu-users'
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub).select('-password');
    
    if (user && user.isActive) {
      return done(null, user);
    }
    
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;