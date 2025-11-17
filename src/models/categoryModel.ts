import { InferSchemaType, Model, Schema, model, models } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const categorySchema = new Schema(
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

export type CategoryFromSchema = InferSchemaType<typeof categorySchema>;

// TODO: Add indexes, virtuals, hooks and methods
categorySchema.index(
  { name: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } },
);

categorySchema.plugin(aggregatePaginate);

const Category = (models.Category ||
  model<CategoryFromSchema>(
    'Category',
    categorySchema,
  )) as Model<CategoryFromSchema>;

export default Category;
