import { Types, Schema, models, model } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface IBlog {
  authorId: Types.ObjectId;
  banner?: string;
  status?: 'published' | 'draft';
  publishedAt?: Date;
  title: string;
  description: string;
  metaDescription?: string;
  content: string;
  tags: Types.ObjectId[];
  isFeatured?: boolean;
  categoryId: Types.ObjectId;
  slug: string;
  views?: number;
  isEdited?: boolean;
  editedAt?: Date;
  readTime: number;
  commentsCount?: number;
  isCommentsEnabled?: boolean;
  likesCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    banner: {
      type: String,
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
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: 'Tag',
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
      ref: 'Category',
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
      default: 0,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// TODO: Add indexes, virtuals, hooks and methods

blogSchema.plugin(aggregatePaginate);

const Blog = models.Blog || model<IBlog>('Blog', blogSchema);
export default Blog;
