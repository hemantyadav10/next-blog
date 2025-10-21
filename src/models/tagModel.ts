import { Schema, model, models } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export interface ITag {
  name: string;
  slug: string;
  blogsCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const tagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      minlength: 2,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
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

tagSchema.plugin(aggregatePaginate);

const Tag = models.Tag || model<ITag>('Tag', tagSchema);
export default Tag;
