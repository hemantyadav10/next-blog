import { MODEL_NAMES } from '@/lib/constants';
import { InferSchemaType, Model, model, models, Schema, Types } from 'mongoose';

const blogViewSchema = new Schema(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.BLOG,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      default: null,
    },
    anonymousToken: String,
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true },
);

// TODO: Add indexes, virtuals, hooks and methods
blogViewSchema.index({ blogId: 1, userId: 1, createdAt: -1 });
blogViewSchema.index({ blogId: 1, anonymousToken: 1, createdAt: -1 });

export type BlogViewDocument = InferSchemaType<typeof blogViewSchema> & {
  _id: Types.ObjectId;
};

const BlogView =
  (models.BlogView as Model<BlogViewDocument>) ||
  model<BlogViewDocument, Model<BlogViewDocument>>(
    MODEL_NAMES.BLOG_VIEW,
    blogViewSchema,
  );

export default BlogView;
