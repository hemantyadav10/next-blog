import { InferSchemaType, Model, Schema, Types, model, models } from 'mongoose';

const likeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
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

const Like = (models.Like ||
  model<LikeDocument, Model<LikeDocument>>(
    'Like',
    likeSchema,
  )) as Model<LikeDocument>;

export default Like;
