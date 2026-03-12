import { MODEL_NAMES } from '@/lib/constants';
import { InferSchemaType, Model, Schema, Types, model, models } from 'mongoose';

const likeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.BLOG,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.COMMENT,
    },
  },
  { timestamps: true },
);

// TODO: Add indexes, virtuals, hooks and methods
likeSchema.pre('validate', function (next) {
  if (!this.blogId && !this.commentId) {
    next(new Error('Either blogId or commentId must be provided'));
  } else if (this.blogId && this.commentId) {
    next(new Error('Only one of blogId or commentId can be provided'));
  } else {
    next();
  }
});

// Unique blog likes
likeSchema.index(
  { blogId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { blogId: { $exists: true } } },
);

// Unique comment likes
likeSchema.index(
  { commentId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { commentId: { $exists: true } } },
);

export type LikeDocument = InferSchemaType<typeof likeSchema> & {
  _id: Types.ObjectId;
};

const Like =
  (models.Like as Model<LikeDocument>) ||
  model<LikeDocument, Model<LikeDocument>>(MODEL_NAMES.LIKE, likeSchema);

export default Like;
