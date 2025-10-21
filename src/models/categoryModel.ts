import { Schema, Types, model, models } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface ICategory {
  name: string;
  description: string;
  slug: string;
  createdBy: Types.ObjectId;
  blogsCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blogsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

// TODO: Add indexes, virtuals, hooks and methods

categorySchema.plugin(aggregatePaginate);

const Category =
  models.Category || model<ICategory>('Category', categorySchema);

export default Category;
