import { Schema, Types, model, models } from 'mongoose';

export interface ILike {
  userId: Types.ObjectId;
  blogId?: Types.ObjectId;
  commentId?: Types.ObjectId;
  likeType: 'blog' | 'comment';
  createdAt?: Date;
  updatedAt?: Date;
}

const likeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: function (this: ILike) {
        if (this.likeType === 'blog') {
          return true;
        }
        return false;
      },
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      required: function (this: ILike) {
        if (this.likeType === 'comment') {
          return true;
        }
        return false;
      },
    },
    likeType: {
      type: String,
      enum: ['blog', 'comment'],
      required: true,
    },
  },
  { timestamps: true },
);

// TODO: Add indexes, virtuals, hooks and methods

// Prevent duplicate blog likes
likeSchema.index({ blogId: 1, userId: 1 }, { unique: true, sparse: true });

// Prevent duplicate comment likes
likeSchema.index({ userId: 1, commentId: 1 }, { unique: true, sparse: true });

const Like = models.Like || model<ILike>('Like', likeSchema);
export default Like;
