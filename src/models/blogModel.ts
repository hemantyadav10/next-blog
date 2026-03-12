import { MODEL_NAMES } from '@/lib/constants';
import {
  AggregatePaginateModel,
  InferSchemaType,
  Schema,
  Types,
  model,
  models,
} from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const blogSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.USER,
      required: true,
      index: true,
    },
    banner: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['published', 'draft'],
      default: 'draft',
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    content: [
      {
        type: Schema.Types.Mixed,
        required: true,
      },
    ],
    tags: {
      type: [Schema.Types.ObjectId],
      ref: MODEL_NAMES.TAG,
      default: [],
      validate: [
        (val: Types.ObjectId[]) => val.length > 0,
        'At least one tag is required',
      ],
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: MODEL_NAMES.CATEGORY,
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
    },
    readTime: {
      type: Number,
      default: 0, // stored in minutes
      min: 0,
      required: true,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isCommentsEnabled: {
      type: Boolean,
      default: true,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    bannerPublicId: {
      type: String,
    },
    blurDataUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export type BlogDocument = InferSchemaType<typeof blogSchema> & {
  _id: Types.ObjectId;
};

// TODO: Add indexes, virtuals, hooks and methods
blogSchema.index({ title: 'text', description: 'text' });

blogSchema.plugin(aggregatePaginate);

const Blog =
  (models.Blog as AggregatePaginateModel<BlogDocument>) ||
  model<BlogDocument, AggregatePaginateModel<BlogDocument>>(
    MODEL_NAMES.BLOG,
    blogSchema,
  );

export default Blog;
