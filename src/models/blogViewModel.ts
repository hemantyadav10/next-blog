import { MODEL_NAMES } from '@/lib/constants';
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
    ref: MODEL_NAMES.BLOG,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: MODEL_NAMES.USER,
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
  models.BlogView || model<IBlogView>(MODEL_NAMES.BLOG_VIEW, blogViewSchema);
export default BlogView;
