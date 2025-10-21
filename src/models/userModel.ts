import { model, models, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type socialLinks = Partial<
  Record<'website' | 'twitter' | 'github' | 'linkedin', string>
>;

export interface IUser {
  // Required at registration
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
  timezone: string;
  language: string;
  role: 'user' | 'admin';

  // Optional profile fields
  phoneNumber?: string;
  profilePicture?: string;
  bio?: string;
  socialLinks?: socialLinks;

  // Email verification
  isEmailVerified?: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;

  // Password reset
  passwordResetToken?: string;
  passwordResetExpires?: Date;

  // Security & tracking
  loginAttempts?: number;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  lockUntil?: Date;
  isActive?: boolean;
  refreshToken?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    timezone: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
    },

    phoneNumber: String,
    profilePicture: String,
    bio: String,
    socialLinks: {
      website: String,
      twitter: String,
      github: String,
      linkedin: String,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,

    loginAttempts: {
      type: Number,
      default: 0,
    },
    lastLoginAt: Date,
    lastLoginIp: String,
    lockUntil: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: String,
  },
  { timestamps: true },
);

// TODO: Add indexes, virtuals, hooks and methods

userSchema.plugin(aggregatePaginate);

const User = models.User || model<IUser>('User', userSchema);
export default User;
