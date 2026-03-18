import { MODEL_NAMES } from '@/lib/constants';
import { InferSchemaType, model, Model, models, Schema, Types } from 'mongoose';

const passwordResetTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
    },
    // hashed token
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

passwordResetTokenSchema.index({ token: 1 }, { unique: true });
passwordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type PasswordResetTokenDocument = InferSchemaType<
  typeof passwordResetTokenSchema
> & {
  _id: Types.ObjectId;
};

const PasswordResetToken =
  (models.PasswordResetToken as Model<PasswordResetTokenDocument>) ||
  model<PasswordResetTokenDocument, Model<PasswordResetTokenDocument>>(
    MODEL_NAMES.PASSWORD_RESET_TOKEN,
    passwordResetTokenSchema,
  );

export default PasswordResetToken;
