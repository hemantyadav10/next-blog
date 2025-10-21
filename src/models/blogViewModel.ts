import { model, models, Schema, Types } from 'mongoose';

export interface IBlogView {
  blogId: Types.ObjectId;
  userId: Types.ObjectId;
  ipAddress: string;
  userAgent: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const blogViewSchema = new Schema<IBlogView>({
  blogId: {
    type: Schema.Types.ObjectId,
    ref: 'Blog',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
});

// TODO: Add indexes, virtuals, hooks and methods

const BlogView =
  models.BlogView || model<IBlogView>('BlogView', blogViewSchema);
export default BlogView;
