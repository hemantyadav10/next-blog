import { Model, model, models, Schema, InferSchemaType } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import bcrypt from 'bcrypt';

const userSchema = new Schema(
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
    timezone: {
      type: String,
      default: 'UTC',
    },
    language: {
      type: String,
      default: 'en',
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

type UserType = InferSchemaType<typeof userSchema>;

// TODO: Add indexes, virtuals, hooks and methods

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.plugin(aggregatePaginate);

const User = (models.User ||
  model<UserType>('User', userSchema)) as Model<UserType>;

export default User;
