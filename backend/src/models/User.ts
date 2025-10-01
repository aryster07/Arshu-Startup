import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// User roles enum
export enum UserRole {
  CLIENT = 'client',
  LAWYER = 'lawyer',
  ADMIN = 'admin'
}

// OAuth provider interface
interface OAuthProvider {
  id: string;
  profile: any;
  accessToken?: string;
  refreshToken?: string;
}

// User interface extending mongoose Document
export interface IUser extends Document {
  _id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profilePicture?: string;
  role: UserRole;
  
  // Account status
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  
  // OAuth providers
  oauth: {
    google?: OAuthProvider;
    facebook?: OAuthProvider;
    apple?: OAuthProvider;
  };
  
  // Security fields
  failedLoginAttempts?: number;
  lastFailedLogin?: Date;
  lastLogin?: Date;
  lastLoginIP?: string;
  twoFactorAuth?: {
    enabled: boolean;
    secret?: string;
    backupCodes?: string[];
  };
  
  // Legal professional specific fields (for lawyers)
  lawyerProfile?: {
    barNumber: string;
    jurisdiction: string[];
    specializations: string[];
    yearsOfExperience: number;
    lawFirm?: string;
    isVerified: boolean;
    verificationDate?: Date;
    licenseExpiryDate?: Date;
  };
  
  // Client specific fields
  clientProfile?: {
    dateOfBirth?: Date;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    emergencyContact?: {
      name: string;
      relationship: string;
      phoneNumber: string;
    };
  };
  
  // Timestamps
  registrationDate: Date;
  lastUpdated: Date;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateTwoFactorSecret(): string;
  verifyTwoFactorToken(token: string): boolean;
}

// User schema definition
const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  phoneNumber: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number']
  },
  profilePicture: {
    type: String,
    default: null
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.CLIENT,
    required: true
  },
  
  // Account status
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  
  // OAuth providers
  oauth: {
    google: {
      id: String,
      profile: Schema.Types.Mixed,
      accessToken: String,
      refreshToken: String
    },
    facebook: {
      id: String,
      profile: Schema.Types.Mixed,
      accessToken: String,
      refreshToken: String
    },
    apple: {
      id: String,
      profile: Schema.Types.Mixed,
      accessToken: String,
      refreshToken: String
    }
  },
  
  // Security fields
  failedLoginAttempts: {
    type: Number,
    default: 0
  },
  lastFailedLogin: Date,
  lastLogin: Date,
  lastLoginIP: String,
  twoFactorAuth: {
    enabled: {
      type: Boolean,
      default: false
    },
    secret: String,
    backupCodes: [String]
  },
  
  // Lawyer specific fields
  lawyerProfile: {
    barNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    jurisdiction: [{
      type: String,
      trim: true
    }],
    specializations: [{
      type: String,
      trim: true
    }],
    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 70
    },
    lawFirm: {
      type: String,
      trim: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    verificationDate: Date,
    licenseExpiryDate: Date
  },
  
  // Client specific fields
  clientProfile: {
    dateOfBirth: Date,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    emergencyContact: {
      name: String,
      relationship: String,
      phoneNumber: String
    }
  },
  
  // Timestamps
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'users'
});

// Indexes for performance and security
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ 'oauth.google.id': 1 }, { sparse: true });
UserSchema.index({ 'oauth.facebook.id': 1 }, { sparse: true });
UserSchema.index({ 'oauth.apple.id': 1 }, { sparse: true });
UserSchema.index({ 'lawyerProfile.barNumber': 1 }, { sparse: true });
UserSchema.index({ isActive: 1, isEmailVerified: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function(next) {
  // Only hash password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    // Hash password with cost of 12
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Pre-save middleware to update lastUpdated
UserSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Instance method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate 2FA secret
UserSchema.methods.generateTwoFactorSecret = function(): string {
  const speakeasy = require('speakeasy');
  const secret = speakeasy.generateSecret({
    name: `${process.env.TOTP_SERVICE_NAME} (${this.email})`,
    issuer: process.env.TOTP_ISSUER || 'Arshu Legal',
    length: 32
  });
  
  this.twoFactorAuth.secret = secret.base32;
  return secret.otpauth_url;
};

// Instance method to verify 2FA token
UserSchema.methods.verifyTwoFactorToken = function(token: string): boolean {
  if (!this.twoFactorAuth.secret) return false;
  
  const speakeasy = require('speakeasy');
  return speakeasy.totp.verify({
    secret: this.twoFactorAuth.secret,
    encoding: 'base32',
    token,
    window: 2 // Allow for time drift
  });
};

// Static method to find by OAuth provider
UserSchema.statics.findByOAuth = function(provider: string, id: string) {
  return this.findOne({ [`oauth.${provider}.id`]: id });
};

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name (includes role)
UserSchema.virtual('displayName').get(function() {
  const roleSuffix = this.role === UserRole.LAWYER ? ', Esq.' : '';
  return `${this.firstName} ${this.lastName}${roleSuffix}`;
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    // Remove sensitive fields from JSON output
    delete ret.password;
    delete ret.twoFactorAuth.secret;
    delete ret.twoFactorAuth.backupCodes;
    delete ret.oauth.google?.accessToken;
    delete ret.oauth.google?.refreshToken;
    delete ret.oauth.facebook?.accessToken;
    delete ret.oauth.facebook?.refreshToken;
    delete ret.oauth.apple?.accessToken;
    delete ret.oauth.apple?.refreshToken;
    return ret;
  }
});

// Export the User model
export const User = mongoose.model<IUser>('User', UserSchema);